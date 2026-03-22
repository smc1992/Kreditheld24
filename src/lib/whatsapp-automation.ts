/**
 * WhatsApp Automation Library
 * Handles KI auto-replies, credit application detection, and document forwarding
 */

import OpenAI from 'openai';
import { db, crmCustomers, crmCases, crmDocuments, crmActivities, whatsappConversations, whatsappMessages, whatsappAutomationLogs, whatsappSettings } from '@/db';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { findRelevantContent } from '@/lib/rag';
import { sendTextMessage, cleanPhoneNumber, INSTANCE_NAME, EVOLUTION_API_URL, EVOLUTION_API_KEY } from '@/lib/evolution';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// ============================================
// Automation Logging Helper
// ============================================

async function logAutomation(
  type: 'ki_reply' | 'credit_detection' | 'doc_forward' | 'error',
  conversationId: string | null,
  remoteJid: string | null,
  success: boolean,
  details: string,
  metadata?: Record<string, any>,
) {
  try {
    await db.insert(whatsappAutomationLogs).values({
      type,
      conversationId,
      remoteJid,
      success,
      details,
      metadata: metadata || null,
    });
  } catch (e) {
    console.error('[WhatsApp Log] Failed to log automation:', e);
  }
}

// ============================================
// Dynamic Settings Loader
// ============================================

async function loadSetting(key: string, defaultValue: string): Promise<string> {
  try {
    const rows = await db.select().from(whatsappSettings).where(eq(whatsappSettings.key, key)).limit(1);
    return rows.length > 0 ? rows[0].value : defaultValue;
  } catch {
    return defaultValue;
  }
}

const DEFAULT_SYSTEM_PROMPT = `Du bist der KI-Assistent von Kreditheld24, einem führenden Kreditvermittler in Deutschland.
Du antwortest professionell, freundlich und auf Deutsch über WhatsApp.

Deine Aufgaben:
- Beantworte allgemeine Fragen zu Krediten, Finanzierungen und Darlehen
- Erkläre Prozesse und Abläufe der Kreditvermittlung
- Hilf Kunden bei der Vorbereitung ihrer Unterlagen
- Leite bei spezifischen Anfragen an einen menschlichen Berater weiter

Wichtige Regeln:
- Halte Antworten kurz und WhatsApp-gerecht (max. 3-4 Absätze)
- Verwende passende Emojis sparsam
- Gib KEINE konkreten Zinssätze oder Konditionen, da diese individuell berechnet werden
- Bei Kreditanfragen: Frage nach Betrag, Laufzeit und Verwendungszweck
- Weise bei komplexen Fragen darauf hin, dass ein Berater sich melden wird

Hintergrundwissen aus unserer Wissensdatenbank:
{CONTEXT}

Wenn keine relevanten Informationen verfügbar sind, antworte anhand deines allgemeinen Wissens über den deutschen Kreditmarkt.`;

// ============================================
// KI Auto-Reply
// ============================================

export async function generateKIReply(
  conversationId: string,
  customerMessage: string,
  remoteJid: string
): Promise<string | null> {
  try {
    // Load dynamic settings
    const systemPromptTemplate = await loadSetting('system_prompt', DEFAULT_SYSTEM_PROMPT);
    const model = await loadSetting('model', 'gpt-4o-mini');
    const temperature = parseFloat(await loadSetting('temperature', '0.7'));

    // 1. Get conversation history (last 10 messages for context)
    const recentMessages = await db
      .select({ sender: whatsappMessages.sender, content: whatsappMessages.content })
      .from(whatsappMessages)
      .where(eq(whatsappMessages.conversationId, conversationId))
      .orderBy(sql`${whatsappMessages.timestamp} DESC`)
      .limit(10);

    // 2. RAG: Find relevant knowledge base content
    const contextDocs = await findRelevantContent(customerMessage);
    const contextText = contextDocs.length > 0
      ? contextDocs.map(doc => doc.content).join('\n\n')
      : 'Keine spezifischen Informationen in der Wissensdatenbank gefunden.';

    // 3. Build messages array
    const systemPrompt = systemPromptTemplate.replace('{CONTEXT}', contextText);

    const chatHistory = recentMessages.reverse().map(msg => ({
      role: (msg.sender === 'customer' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.content || '',
    }));

    // Ensure last message is the current user message
    if (chatHistory.length === 0 || chatHistory[chatHistory.length - 1].content !== customerMessage) {
      chatHistory.push({ role: 'user', content: customerMessage });
    }

    // 4. Generate AI response
    const completion = await openai.chat.completions.create({
      model: model as any,
      temperature,
      max_tokens: 500,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory,
      ],
    });

    const aiReply = completion.choices[0]?.message?.content;
    if (!aiReply) return null;

    // 5. Send reply via WhatsApp
    const sendResult = await sendTextMessage(remoteJid, aiReply);

    // 6. Save AI message to database
    await db.insert(whatsappMessages).values({
      conversationId,
      messageId: sendResult?.key?.id || null,
      remoteJid,
      sender: 'ai',
      content: aiReply,
      messageType: 'text',
      isFromMe: true,
      isRead: true,
      timestamp: new Date(),
    });

    // Update conversation
    await db.update(whatsappConversations)
      .set({
        lastMessageAt: new Date(),
        lastMessagePreview: `🤖 ${aiReply.substring(0, 150)}`,
        updatedAt: new Date(),
      })
      .where(eq(whatsappConversations.id, conversationId));

    console.log(`[WhatsApp KI] AI reply sent to ${remoteJid}`);
    await logAutomation('ki_reply', conversationId, remoteJid, true, `KI-Antwort gesendet (${aiReply.length} Zeichen)`, { model, messagePreview: aiReply.substring(0, 100) });
    return aiReply;

  } catch (error) {
    console.error('[WhatsApp KI] Error generating reply:', error);
    await logAutomation('ki_reply', conversationId, remoteJid, false, `Fehler: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

// ============================================
// Credit Application Detection & Automation
// ============================================

const DEFAULT_CREDIT_KEYWORDS = [
  'kredit', 'darlehen', 'finanzierung', 'baufinanzierung', 'umschuldung',
  'ratenkredit', 'autokredit', 'immobilienkredit', 'hypothek',
  'kreditanfrage', 'kredit beantragen', 'kredit aufnehmen',
  'wieviel kredit', 'wie viel kredit', 'kreditbetrag',
  'monatliche rate', 'zinsen', 'tilgung',
  'ich brauche geld', 'geld leihen', 'brauche einen kredit',
  'finanzieren', 'kreditberatung', 'beratungstermin',
];

export async function detectCreditIntent(message: string): Promise<boolean> {
  const lowerMsg = message.toLowerCase();
  // Load dynamic keywords
  let keywords = DEFAULT_CREDIT_KEYWORDS;
  try {
    const saved = await loadSetting('credit_keywords', '');
    if (saved) keywords = JSON.parse(saved);
  } catch {}
  return keywords.some(kw => lowerMsg.includes(kw));
}

interface ExtractedCreditData {
  kreditart: string | null;
  betrag: number | null;
  laufzeit: number | null;
  verwendungszweck: string | null;
  einkommen: number | null;
}

export async function extractCreditData(conversationMessages: string[]): Promise<ExtractedCreditData> {
  try {
    const allMessages = conversationMessages.join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Du bist ein Daten-Extraktor. Extrahiere aus der WhatsApp-Konversation folgende Kreditdaten als JSON:
{
  "kreditart": "baufinanzierung" | "ratenkredit" | "autokredit" | "umschuldung" | "privatkredit" | null,
  "betrag": Kreditbetrag als Zahl oder null,
  "laufzeit": Laufzeit in Monaten als Zahl oder null,
  "verwendungszweck": Kurze Beschreibung oder null,
  "einkommen": Monatliches Nettoeinkommen als Zahl oder null
}
Gib NUR das JSON zurück. Wenn eine Information nicht vorhanden ist, setze null.`
        },
        { role: 'user', content: allMessages },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      kreditart: parsed.kreditart || null,
      betrag: parsed.betrag || null,
      laufzeit: parsed.laufzeit || null,
      verwendungszweck: parsed.verwendungszweck || null,
      einkommen: parsed.einkommen || null,
    };
  } catch (error) {
    console.error('[WhatsApp Automation] Error extracting credit data:', error);
    return { kreditart: null, betrag: null, laufzeit: null, verwendungszweck: null, einkommen: null };
  }
}

export async function createCreditCaseFromWhatsApp(
  conversationId: string,
  remoteJid: string,
  phoneNumber: string,
  pushName: string | null,
): Promise<string | null> {
  try {
    // 1. Find or create CRM customer by phone
    let customer = await findCustomerByPhone(phoneNumber);

    if (!customer) {
      // Create a new customer from WhatsApp data
      const nameParts = (pushName || 'WhatsApp').split(' ');
      const [newCustomer] = await db.insert(crmCustomers).values({
        firstName: nameParts[0] || 'WhatsApp',
        lastName: nameParts.slice(1).join(' ') || 'Kunde',
        phone: phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`,
        notes: 'Erstellt über WhatsApp',
      }).returning();
      customer = newCustomer;

      // Link conversation to customer
      await db.update(whatsappConversations)
        .set({ customerId: customer.id })
        .where(eq(whatsappConversations.id, conversationId));
    }

    // 2. Get recent messages for data extraction
    const recentMessages = await db
      .select({ content: whatsappMessages.content, sender: whatsappMessages.sender })
      .from(whatsappMessages)
      .where(eq(whatsappMessages.conversationId, conversationId))
      .orderBy(sql`${whatsappMessages.timestamp} DESC`)
      .limit(20);

    const customerMessages = recentMessages
      .filter(m => m.sender === 'customer' && m.content)
      .map(m => m.content as string);

    // 3. Extract credit data
    const creditData = await extractCreditData(customerMessages);

    // 4. Create CRM case
    // Generate unique case number
    const caseNumber = `WA-${Date.now().toString(36).toUpperCase()}`;

    const notesText = `Automatisch erstellt aus WhatsApp-Konversation.\n\nExtrahierte Daten:\n- Kreditart: ${creditData.kreditart || 'Nicht angegeben'}\n- Betrag: ${creditData.betrag ? `${creditData.betrag.toLocaleString('de-DE')} €` : 'Nicht angegeben'}\n- Laufzeit: ${creditData.laufzeit ? `${creditData.laufzeit} Monate` : 'Nicht angegeben'}\n- Verwendungszweck: ${creditData.verwendungszweck || 'Nicht angegeben'}\n- Einkommen: ${creditData.einkommen ? `${creditData.einkommen.toLocaleString('de-DE')} €` : 'Nicht angegeben'}`;

    const [newCase] = await db.insert(crmCases).values({
      customerId: customer.id,
      caseNumber,
      status: 'open',
      requestedAmount: creditData.betrag ? String(creditData.betrag) : null,
      duration: creditData.laufzeit || null,
      formData: {
        source: 'whatsapp',
        kreditart: creditData.kreditart,
        verwendungszweck: creditData.verwendungszweck,
        einkommen: creditData.einkommen,
        notes: notesText,
      },
    }).returning();

    // 5. Log activity
    await db.insert(crmActivities).values({
      caseId: newCase.id,
      customerId: customer.id,
      type: 'system',
      subject: 'Kreditanfrage via WhatsApp erstellt',
      description: `Automatisch erkannte Kreditanfrage aus WhatsApp-Chat. Vorgang ${newCase.id} wurde angelegt.`,
      date: new Date(),
    });

    // 6. Send confirmation to customer via WhatsApp
    const confirmationMsg = `✅ Vielen Dank für Ihre Anfrage!\n\nWir haben Ihre Kreditanfrage erfolgreich aufgenommen. Ein Berater wird sich in Kürze bei Ihnen melden.\n\n📋 Vorgangsnummer: ${newCase.id.substring(0, 8).toUpperCase()}\n\nFalls Sie bereits Unterlagen haben (Gehaltsnachweise, Ausweiskopie), können Sie diese gerne direkt hier per WhatsApp senden. 📎`;

    await sendTextMessage(remoteJid, confirmationMsg);

    // Save confirmation message
    await db.insert(whatsappMessages).values({
      conversationId,
      remoteJid,
      sender: 'ai',
      content: confirmationMsg,
      messageType: 'text',
      isFromMe: true,
      isRead: true,
      timestamp: new Date(),
    });

    console.log(`[WhatsApp Automation] Created case ${newCase.id} for customer ${customer.id}`);
    await logAutomation('credit_detection', conversationId, remoteJid, true, `Kreditanfrage erkannt. Case ${caseNumber} erstellt.`, { caseId: newCase.id, caseNumber, creditData });
    return newCase.id;

  } catch (error) {
    console.error('[WhatsApp Automation] Error creating credit case:', error);
    await logAutomation('credit_detection', conversationId, remoteJid, false, `Fehler: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

// ============================================
// Document Forwarding
// ============================================

export async function handleDocumentFromWhatsApp(
  conversationId: string,
  remoteJid: string,
  messageId: string,
  mediaUrl: string | null,
  mediaMimeType: string | null,
  mediaFileName: string | null,
  messageType: string,
): Promise<boolean> {
  try {
    // 1. Download media from Evolution API
    const base64Data = await downloadMediaFromEvolution(messageId);
    if (!base64Data) {
      console.error('[WhatsApp Doc] Failed to download media');
      return false;
    }

    // 2. Determine file extension
    const extension = getExtensionFromMime(mediaMimeType || 'application/octet-stream');
    const fileName = mediaFileName || `whatsapp_${messageType}_${Date.now()}${extension}`;
    const uniqueFileName = `${crypto.randomUUID()}_${fileName}`;

    // 3. Save to server
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'whatsapp');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueFileName);
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(filePath, new Uint8Array(buffer));

    const fileUrl = `/uploads/whatsapp/${uniqueFileName}`;
    console.log(`[WhatsApp Doc] File saved: ${fileUrl} (${buffer.length} bytes)`);

    // 4. Find the customer linked to this conversation
    const conversation = await db.select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.id, conversationId))
      .limit(1);

    const conv = conversation[0];
    if (!conv) return false;

    // Try to link to customer
    let customerId = conv.customerId;
    if (!customerId && conv.phoneNumber) {
      const customer = await findCustomerByPhone(conv.phoneNumber);
      if (customer) {
        customerId = customer.id;
        await db.update(whatsappConversations)
          .set({ customerId: customer.id })
          .where(eq(whatsappConversations.id, conversationId));
      }
    }

    if (!customerId) {
      console.log('[WhatsApp Doc] No customer linked, skipping CRM document creation');
      return true; // File saved but no CRM link
    }

    // 5. Find open case for this customer
    const openCase = await db.select()
      .from(crmCases)
      .where(eq(crmCases.customerId, customerId))
      .orderBy(sql`${crmCases.createdAt} DESC`)
      .limit(1);

    const caseId = openCase.length > 0 ? openCase[0].id : null;

    // 6. Create CRM Document
    await db.insert(crmDocuments).values({
      customerId,
      caseId,
      name: fileName,
      type: mediaMimeType || 'application/octet-stream',
      fileUrl,
      fileSize: buffer.length,
      createdAt: new Date(),
    });

    // 7. Log activity
    await db.insert(crmActivities).values({
      customerId,
      caseId,
      type: 'document',
      subject: 'Dokument via WhatsApp erhalten',
      description: `Datei "${fileName}" über WhatsApp empfangen und im CRM gespeichert.`,
      date: new Date(),
    });

    // 8. Send confirmation
    await sendTextMessage(remoteJid, `✅ Dokument "${fileName}" empfangen und in Ihrem Kundenkonto gespeichert. Vielen Dank!`);

    // Save confirmation message
    await db.insert(whatsappMessages).values({
      conversationId,
      remoteJid,
      sender: 'ai',
      content: `✅ Dokument "${fileName}" empfangen und in Ihrem Kundenkonto gespeichert. Vielen Dank!`,
      messageType: 'text',
      isFromMe: true,
      isRead: true,
      timestamp: new Date(),
    });

    console.log(`[WhatsApp Doc] Document ${fileName} linked to customer ${customerId}${caseId ? ` / case ${caseId}` : ''}`);
    await logAutomation('doc_forward', conversationId, remoteJid, true, `Dokument "${fileName}" gespeichert und mit Kunde verknüpft.`, { fileName, fileSize: buffer.length, customerId, caseId });
    return true;

  } catch (error) {
    console.error('[WhatsApp Doc] Error handling document:', error);
    await logAutomation('doc_forward', conversationId, remoteJid, false, `Fehler: ${error instanceof Error ? error.message : String(error)}`, { mediaFileName });
    return false;
  }
}

// ============================================
// Helpers
// ============================================

async function findCustomerByPhone(phoneNumber: string) {
  // Try various phone formats
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const withPlus = `+${cleanPhone}`;
  const withCountry = cleanPhone.startsWith('49') ? cleanPhone : `49${cleanPhone}`;
  const withPlusCountry = `+${withCountry}`;
  const withZero = cleanPhone.startsWith('49') ? `0${cleanPhone.substring(2)}` : cleanPhone;

  const customers = await db.select()
    .from(crmCustomers)
    .where(or(
      ilike(crmCustomers.phone, `%${cleanPhone.slice(-8)}%`),
      eq(crmCustomers.phone, withPlus),
      eq(crmCustomers.phone, withPlusCountry),
      eq(crmCustomers.phone, withZero),
    ))
    .limit(1);

  return customers.length > 0 ? customers[0] : null;
}

async function downloadMediaFromEvolution(messageId: string): Promise<string | null> {
  try {
    const response = await fetch(`${EVOLUTION_API_URL}/chat/getBase64FromMediaMessage/${INSTANCE_NAME}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': EVOLUTION_API_KEY,
      },
      body: JSON.stringify({
        message: { key: { id: messageId } },
        convertToMp4: false,
      }),
    });

    if (!response.ok) {
      console.error(`[WhatsApp Doc] Download failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data?.base64 || null;
  } catch (error) {
    console.error('[WhatsApp Doc] Download error:', error);
    return null;
  }
}

function getExtensionFromMime(mime: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
    'audio/ogg': '.ogg',
    'audio/mpeg': '.mp3',
    'audio/opus': '.opus',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  };
  return mimeMap[mime] || '.bin';
}
