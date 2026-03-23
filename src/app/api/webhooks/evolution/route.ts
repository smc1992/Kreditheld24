import { NextRequest, NextResponse } from 'next/server';
import { db, whatsappConversations, whatsappMessages } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { cleanPhoneNumber, EVOLUTION_API_URL, EVOLUTION_API_KEY, INSTANCE_NAME } from '@/lib/evolution';
import {
  generateKIReply,
  detectCreditIntent,
  createCreditCaseFromWhatsApp,
  handleDocumentFromWhatsApp,
} from '@/lib/whatsapp-automation';

export const dynamic = 'force-dynamic';

// Evolution API sends events as POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body.event;

    console.log(`[Evolution Webhook] Event received: ${event}`);

    switch (event) {
      case 'messages.upsert':
        await handleMessageUpsert(body);
        break;
      case 'messages.update':
        await handleMessageUpdate(body);
        break;
      case 'messages.set':
        await handleMessagesSync(body);
        break;
      case 'contacts.set':
      case 'contacts.upsert':
      case 'contacts.update':
        await handleContactsSync(body);
        break;
      case 'chats.set':
      case 'chats.upsert':
      case 'chats.update':
        await handleChatsSync(body);
        break;
      case 'connection.update':
        console.log('[Evolution Webhook] Connection update:', JSON.stringify(body.data));
        break;
      case 'qrcode.updated':
        console.log('[Evolution Webhook] QR Code updated');
        break;
      case 'send.message':
        await handleSentMessage(body);
        break;
      default:
        console.log(`[Evolution Webhook] Unhandled event: ${event}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[Evolution Webhook] Error:', error);
    return NextResponse.json({ status: 'error', message: 'Webhook processing failed' }, { status: 500 });
  }
}

// Also support GET for Evolution API health checks
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'evolution-webhook' });
}

// ============================================
// Event Handlers
// ============================================

async function handleMessageUpsert(payload: any) {
  const data = payload.data;

  // Can be single message or array
  const messages = Array.isArray(data) ? data : [data];

  for (const msg of messages) {
    try {
      const key = msg.key;
      const remoteJid = key?.remoteJid;

      // Skip group messages and status broadcasts
      if (!remoteJid || remoteJid.endsWith('@g.us') || remoteJid === 'status@broadcast') {
        continue;
      }

      const isFromMe = key?.fromMe === true;
      const messageId = key?.id;
      const pushName = msg.pushName || null;
      const phoneNumber = cleanPhoneNumber(remoteJid);

      // Extract message content based on type
      const { content, messageType, mediaUrl, mediaMimeType, mediaFileName } = extractMessageContent(msg.message);

      if (!content && !mediaUrl) {
        console.log('[Evolution Webhook] Skipping empty message');
        continue;
      }

      // Find or create the conversation
      const conversation = await findOrCreateConversation(remoteJid, pushName, phoneNumber);

      // Check for duplicate message
      if (messageId) {
        const existing = await db.select({ id: whatsappMessages.id })
          .from(whatsappMessages)
          .where(eq(whatsappMessages.messageId, messageId))
          .limit(1);

        if (existing.length > 0) {
          console.log(`[Evolution Webhook] Skipping duplicate message: ${messageId}`);
          continue;
        }
      }

      // Insert the message
      await db.insert(whatsappMessages).values({
        conversationId: conversation.id,
        messageId,
        remoteJid,
        sender: isFromMe ? 'admin' : 'customer',
        content: content || null,
        messageType,
        mediaUrl: mediaUrl || null,
        mediaMimeType: mediaMimeType || null,
        mediaFileName: mediaFileName || null,
        isFromMe,
        isRead: isFromMe,
        timestamp: msg.messageTimestamp
          ? new Date(typeof msg.messageTimestamp === 'number' ? msg.messageTimestamp * 1000 : msg.messageTimestamp)
          : new Date(),
      });

      // Update conversation
      await db.update(whatsappConversations)
        .set({
          lastMessageAt: new Date(),
          lastMessagePreview: content ? content.substring(0, 200) : `[${messageType}]`,
          unreadCount: isFromMe ? 0 : sql`${whatsappConversations.unreadCount} + 1`,
          pushName: pushName || undefined,
          updatedAt: new Date(),
        })
        .where(eq(whatsappConversations.id, conversation.id));

      console.log(`[Evolution Webhook] Message saved: ${messageType} from ${isFromMe ? 'me' : phoneNumber}`);

      // Eagerly download media before WhatsApp URLs expire
      if (messageType !== 'text' && messageId) {
        eagerDownloadMedia(messageId).catch(err => 
          console.error(`[Evolution Webhook] Media download failed for ${messageId}:`, err)
        );
      }

      // ============================================
      // AUTOMATION TRIGGERS (only for incoming customer messages)
      // ============================================
      if (!isFromMe) {
        // 1. Handle incoming documents → forward to CRM
        if (['image', 'document', 'video'].includes(messageType) && messageId) {
          handleDocumentFromWhatsApp(
            conversation.id,
            remoteJid,
            messageId,
            mediaUrl || null,
            mediaMimeType || null,
            mediaFileName || null,
            messageType,
          ).catch(err => console.error('[Evolution Webhook] Doc forwarding error:', err));
        }

        // 2. Check for credit application intent
        if (content && await detectCreditIntent(content)) {
          console.log(`[Evolution Webhook] Credit intent detected from ${phoneNumber}`);
          createCreditCaseFromWhatsApp(
            conversation.id,
            remoteJid,
            phoneNumber,
            pushName,
          ).catch(err => console.error('[Evolution Webhook] Credit automation error:', err));
        }
        // 3. KI Auto-Reply (if AI enabled and it's a text message, and no credit intent already handled)
        else if (content && conversation.aiEnabled) {
          generateKIReply(
            conversation.id,
            content,
            remoteJid,
          ).catch(err => console.error('[Evolution Webhook] KI reply error:', err));
        }
      }

    } catch (err) {
      console.error('[Evolution Webhook] Error processing message:', err);
    }
  }
}

async function handleMessageUpdate(payload: any) {
  const data = payload.data;
  const updates = Array.isArray(data) ? data : [data];

  for (const update of updates) {
    try {
      const msgId = update.key?.id;
      if (!msgId) continue;

      // Handle read receipts
      if (update.update?.status === 3 || update.update?.status === 4) {
        await db.update(whatsappMessages)
          .set({ isRead: true })
          .where(eq(whatsappMessages.messageId, msgId));
      }
    } catch (err) {
      console.error('[Evolution Webhook] Error updating message:', err);
    }
  }
}

async function handleSentMessage(payload: any) {
  // Messages we sent from CRM are handled here
  const data = payload.data;
  const key = data?.key;
  if (!key) return;

  const remoteJid = key.remoteJid;
  if (!remoteJid || remoteJid.endsWith('@g.us') || remoteJid === 'status@broadcast') return;

  const messageId = key.id;
  const phoneNumber = cleanPhoneNumber(remoteJid);
  const { content, messageType } = extractMessageContent(data.message);

  const conversation = await findOrCreateConversation(remoteJid, null, phoneNumber);

  // Check for duplicates (might already be saved from our sendMessage call)
  if (messageId) {
    const existing = await db.select({ id: whatsappMessages.id })
      .from(whatsappMessages)
      .where(eq(whatsappMessages.messageId, messageId))
      .limit(1);

    if (existing.length > 0) return;
  }

  await db.insert(whatsappMessages).values({
    conversationId: conversation.id,
    messageId,
    remoteJid,
    sender: 'admin',
    content: content || null,
    messageType,
    isFromMe: true,
    isRead: true,
    timestamp: new Date(),
  });

  await db.update(whatsappConversations)
    .set({
      lastMessageAt: new Date(),
      lastMessagePreview: content ? content.substring(0, 200) : `[${messageType}]`,
      updatedAt: new Date(),
    })
    .where(eq(whatsappConversations.id, conversation.id));
}

// ============================================
// Eager Media Download
// ============================================

/**
 * Immediately download media from Evolution API and store as base64 data URI.
 * WhatsApp media URLs expire within hours, so we must cache them right away.
 */
async function eagerDownloadMedia(messageId: string) {
  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/chat/getBase64FromMediaMessage/${INSTANCE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          message: { key: { id: messageId } },
          convertToMp4: false,
        }),
      }
    );

    if (!response.ok) {
      console.log(`[Media Download] Evolution API returned ${response.status} for ${messageId}`);
      return;
    }

    const data = await response.json();
    const base64 = data?.base64;
    const mimetype = data?.mimetype || 'application/octet-stream';

    if (!base64) {
      console.log(`[Media Download] No base64 data returned for ${messageId}`);
      return;
    }

    // Store as data URI in mediaUrl column
    const dataUri = base64.startsWith('data:') ? base64 : `data:${mimetype};base64,${base64}`;

    await db.update(whatsappMessages)
      .set({ mediaUrl: dataUri })
      .where(eq(whatsappMessages.messageId, messageId));

    console.log(`[Media Download] Cached media for message ${messageId} (${mimetype})`);
  } catch (err: any) {
    console.error(`[Media Download] Error for ${messageId}:`, err?.message || err);
  }
}

// ============================================
// Helpers
// ============================================

async function findOrCreateConversation(remoteJid: string, pushName: string | null, phoneNumber: string) {
  const existing = await db.select()
    .from(whatsappConversations)
    .where(eq(whatsappConversations.remoteJid, remoteJid))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const newConv = await db.insert(whatsappConversations)
    .values({
      remoteJid,
      pushName,
      phoneNumber,
    })
    .returning();

  return newConv[0];
}

function extractMessageContent(message: any): {
  content: string | null;
  messageType: string;
  mediaUrl: string | null;
  mediaMimeType: string | null;
  mediaFileName: string | null;
} {
  if (!message) {
    return { content: null, messageType: 'text', mediaUrl: null, mediaMimeType: null, mediaFileName: null };
  }

  // Text message
  if (message.conversation) {
    return { content: message.conversation, messageType: 'text', mediaUrl: null, mediaMimeType: null, mediaFileName: null };
  }
  if (message.extendedTextMessage?.text) {
    return { content: message.extendedTextMessage.text, messageType: 'text', mediaUrl: null, mediaMimeType: null, mediaFileName: null };
  }

  // Image
  if (message.imageMessage) {
    return {
      content: message.imageMessage.caption || null,
      messageType: 'image',
      mediaUrl: message.imageMessage.url || null,
      mediaMimeType: message.imageMessage.mimetype || 'image/jpeg',
      mediaFileName: null,
    };
  }

  // Audio / Voice
  if (message.audioMessage) {
    return {
      content: null,
      messageType: 'audio',
      mediaUrl: message.audioMessage.url || null,
      mediaMimeType: message.audioMessage.mimetype || 'audio/ogg',
      mediaFileName: null,
    };
  }

  // Video
  if (message.videoMessage) {
    return {
      content: message.videoMessage.caption || null,
      messageType: 'video',
      mediaUrl: message.videoMessage.url || null,
      mediaMimeType: message.videoMessage.mimetype || 'video/mp4',
      mediaFileName: null,
    };
  }

  // Document
  if (message.documentMessage) {
    return {
      content: message.documentMessage.caption || message.documentMessage.fileName || null,
      messageType: 'document',
      mediaUrl: message.documentMessage.url || null,
      mediaMimeType: message.documentMessage.mimetype || 'application/octet-stream',
      mediaFileName: message.documentMessage.fileName || null,
    };
  }

  // Sticker
  if (message.stickerMessage) {
    return {
      content: null,
      messageType: 'sticker',
      mediaUrl: message.stickerMessage.url || null,
      mediaMimeType: 'image/webp',
      mediaFileName: null,
    };
  }

  // Contact Card
  if (message.contactMessage) {
    return {
      content: message.contactMessage.displayName || 'Kontakt',
      messageType: 'contact',
      mediaUrl: null,
      mediaMimeType: null,
      mediaFileName: null,
    };
  }

  // Location
  if (message.locationMessage) {
    return {
      content: `📍 ${message.locationMessage.degreesLatitude}, ${message.locationMessage.degreesLongitude}`,
      messageType: 'location',
      mediaUrl: null,
      mediaMimeType: null,
      mediaFileName: null,
    };
  }

  return { content: '[Nicht unterstützter Nachrichtentyp]', messageType: 'unknown', mediaUrl: null, mediaMimeType: null, mediaFileName: null };
}

// ============================================
// Contact & Chat Sync Handlers
// ============================================

async function handleContactsSync(payload: any) {
  const data = payload.data;
  const contacts = Array.isArray(data) ? data : [];
  
  console.log(`[Evolution Webhook] Contacts sync: ${contacts.length} contacts`);

  for (const contact of contacts) {
    try {
      const remoteJid = contact.id || contact.remoteJid || contact.jid;
      if (!remoteJid || remoteJid.endsWith('@g.us') || remoteJid === 'status@broadcast') continue;

      const pushName = contact.pushName || contact.name || contact.verifiedName || contact.notify || null;
      const phoneNumber = cleanPhoneNumber(remoteJid);

      // Upsert conversation
      const existing = await db.select({ id: whatsappConversations.id })
        .from(whatsappConversations)
        .where(eq(whatsappConversations.remoteJid, remoteJid))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(whatsappConversations).values({
          remoteJid,
          pushName,
          phoneNumber,
          profilePicUrl: contact.profilePictureUrl || null,
          unreadCount: 0,
          isArchived: false,
          aiEnabled: false,
        });
        console.log(`[Evolution Webhook] Created conversation for ${pushName || phoneNumber}`);
      } else if (pushName) {
        await db.update(whatsappConversations)
          .set({ pushName, updatedAt: new Date() })
          .where(eq(whatsappConversations.id, existing[0].id));
      }
    } catch (err) {
      console.error('[Evolution Webhook] Error processing contact:', err);
    }
  }
}

async function handleChatsSync(payload: any) {
  const data = payload.data;
  const chats = Array.isArray(data) ? data : [];

  console.log(`[Evolution Webhook] Chats sync: ${chats.length} chats`);

  for (const chat of chats) {
    try {
      const remoteJid = chat.id || chat.remoteJid || chat.jid || chat.chatId;
      if (!remoteJid || remoteJid.endsWith('@g.us') || remoteJid === 'status@broadcast') continue;

      const phoneNumber = cleanPhoneNumber(remoteJid);
      const pushName = chat.name || chat.pushName || null;

      const existing = await db.select({ id: whatsappConversations.id })
        .from(whatsappConversations)
        .where(eq(whatsappConversations.remoteJid, remoteJid))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(whatsappConversations).values({
          remoteJid,
          pushName,
          phoneNumber,
          unreadCount: chat.unreadCount || 0,
          isArchived: false,
          aiEnabled: false,
        });
        console.log(`[Evolution Webhook] Created conversation from chat: ${pushName || phoneNumber}`);
      }
    } catch (err) {
      console.error('[Evolution Webhook] Error processing chat:', err);
    }
  }
}

async function handleMessagesSync(payload: any) {
  const data = payload.data;
  // Handle various formats: direct array, {messages: [...]}, {messages: {records: [...]}}
  let messages: any[] = [];
  if (Array.isArray(data)) {
    messages = data;
  } else if (data?.messages) {
    if (Array.isArray(data.messages)) {
      messages = data.messages;
    } else if (data.messages?.records && Array.isArray(data.messages.records)) {
      messages = data.messages.records;
    }
  }

  console.log(`[Evolution Webhook] Messages sync: ${messages.length} messages`);

  let count = 0;
  for (const msg of messages) {
    try {
      const remoteJid = msg.key?.remoteJid;
      if (!remoteJid || remoteJid.endsWith('@g.us') || remoteJid === 'status@broadcast') continue;

      const messageId = msg.key?.id;
      if (!messageId) continue;

      // Upsert conversation to get ID
      let conversationId: string;
      const existingConv = await db.select({ id: whatsappConversations.id })
        .from(whatsappConversations)
        .where(eq(whatsappConversations.remoteJid, remoteJid))
        .limit(1);

      if (existingConv.length > 0) {
        conversationId = existingConv[0].id;
      } else {
        const [newConv] = await db.insert(whatsappConversations).values({
          remoteJid,
          phoneNumber: cleanPhoneNumber(remoteJid),
          unreadCount: 0,
          isArchived: false,
          aiEnabled: false,
        }).returning({ id: whatsappConversations.id });
        conversationId = newConv.id;
      }

      // Check if message exists
      const existingMsg = await db.select({ id: whatsappMessages.id })
        .from(whatsappMessages)
        .where(eq(whatsappMessages.messageId, messageId))
        .limit(1);

      if (existingMsg.length === 0) {
        const extracted = extractMessageContent(msg);
        
        const timestamp = msg.messageTimestamp 
          ? new Date(typeof msg.messageTimestamp === 'number' ? msg.messageTimestamp * 1000 : parseInt(msg.messageTimestamp) * 1000)
          : new Date();

        await db.insert(whatsappMessages).values({
          conversationId,
          messageId,
          remoteJid,
          sender: msg.key?.fromMe ? 'admin' : 'customer',
          content: extracted.content,
          messageType: extracted.messageType,
          mediaUrl: extracted.mediaUrl,
          mediaMimeType: extracted.mediaMimeType,
          mediaFileName: extracted.mediaFileName,
          isFromMe: msg.key?.fromMe || false,
          isRead: true, // Mark old messages as read
          timestamp,
        });
        count++;

        // Update conversation lastMessageAt if newer
        await db.update(whatsappConversations)
          .set({
            lastMessageAt: timestamp,
            lastMessagePreview: extracted.content ? extracted.content.substring(0, 200) : '',
            updatedAt: new Date(),
          })
          .where(sql`${whatsappConversations.id} = ${conversationId} AND (${whatsappConversations.lastMessageAt} IS NULL OR ${whatsappConversations.lastMessageAt} < ${timestamp})`);
      }
    } catch (err) {
      // Ignore individual errors during bulk sync
    }
  }
  console.log(`[Evolution Webhook] Successfully imported ${count} historical messages`);
}
