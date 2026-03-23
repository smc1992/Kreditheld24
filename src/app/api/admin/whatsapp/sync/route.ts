import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations, whatsappMessages } from '@/db';
import { eq } from 'drizzle-orm';
import { fetchAllContacts, fetchAllChats, fetchMessages, cleanPhoneNumber, isGroupJid, getProfilePicture } from '@/lib/evolution';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Allow up to 2 minutes

// Helper: extract array from any response format
function extractArray(result: any): any[] {
  if (Array.isArray(result)) return result;
  if (result && typeof result === 'object') {
    // Try common wrapper keys
    for (const key of ['data', 'contacts', 'chats', 'messages', 'result', 'results']) {
      if (Array.isArray(result[key])) return result[key];
    }
    // If the object has numeric keys or is iterable, try Object.values
    const values = Object.values(result);
    if (values.length > 0 && values.every(v => typeof v === 'object' && v !== null)) {
      return values as any[];
    }
  }
  return [];
}

// POST /api/admin/whatsapp/sync - Import all WhatsApp contacts & message history
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[WhatsApp Sync] Starting full sync...');

    let contactsImported = 0;
    let messagesImported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Step 1: Fetch all chats from Evolution API
    let chats: any[] = [];
    try {
      const chatsResult = await fetchAllChats();
      console.log('[WhatsApp Sync] Raw chats response type:', typeof chatsResult, 'isArray:', Array.isArray(chatsResult));
      if (chatsResult && typeof chatsResult === 'object') {
        console.log('[WhatsApp Sync] Chats response keys:', Object.keys(chatsResult).slice(0, 10));
      }
      chats = extractArray(chatsResult);
      console.log(`[WhatsApp Sync] Extracted ${chats.length} chats`);
      if (chats.length > 0) {
        console.log('[WhatsApp Sync] Sample chat:', JSON.stringify(chats[0]).substring(0, 300));
      }
    } catch (err) {
      console.error('[WhatsApp Sync] Error fetching chats:', err);
      errors.push(`Chats fetch error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }

    // Step 2: Fetch all contacts
    let contacts: any[] = [];
    try {
      const contactsResult = await fetchAllContacts();
      console.log('[WhatsApp Sync] Raw contacts response type:', typeof contactsResult, 'isArray:', Array.isArray(contactsResult));
      if (contactsResult && typeof contactsResult === 'object') {
        console.log('[WhatsApp Sync] Contacts response keys:', Object.keys(contactsResult).slice(0, 10));
      }
      contacts = extractArray(contactsResult);
      console.log(`[WhatsApp Sync] Extracted ${contacts.length} contacts`);
      if (contacts.length > 0) {
        console.log('[WhatsApp Sync] Sample contact:', JSON.stringify(contacts[0]).substring(0, 300));
      }
    } catch (err) {
      console.error('[WhatsApp Sync] Error fetching contacts:', err);
      errors.push(`Contacts fetch error: ${err instanceof Error ? err.message : 'Unknown'}`);
    }

    // Build a contact map for name lookups
    const contactMap = new Map<string, string>();
    for (const contact of contacts) {
      const jid = contact.id || contact.remoteJid || contact.jid || contact.wid;
      const name = contact.pushName || contact.name || contact.verifiedName || contact.notify || contact.short || null;
      if (jid && name) contactMap.set(jid, name);
    }

    // Step 3: Collect all JIDs from chats and contacts
    const allJids = new Set<string>();

    for (const chat of chats) {
      const jid = chat.id || chat.remoteJid || chat.jid || chat.chatId || chat.wid;
      if (jid) allJids.add(jid);
    }

    for (const contact of contacts) {
      const jid = contact.id || contact.remoteJid || contact.jid || contact.wid;
      if (jid) allJids.add(jid);
    }

    console.log(`[WhatsApp Sync] Total unique JIDs to process: ${allJids.size}`);

    // Step 4: Process each JID
    for (const remoteJid of allJids) {
      // Skip group chats and status broadcasts
      if (isGroupJid(remoteJid) || remoteJid === 'status@broadcast' || remoteJid.includes('newsletter')) {
        skipped++;
        continue;
      }

      try {
        const phoneNumber = cleanPhoneNumber(remoteJid);
        const pushName = contactMap.get(remoteJid) || null;

        // Check if conversation already exists
        const existing = await db.select({ id: whatsappConversations.id })
          .from(whatsappConversations)
          .where(eq(whatsappConversations.remoteJid, remoteJid))
          .limit(1);

        let conversationId: string;

        if (existing.length > 0) {
          conversationId = existing[0].id;
          if (pushName) {
            await db.update(whatsappConversations)
              .set({ pushName, updatedAt: new Date() })
              .where(eq(whatsappConversations.id, conversationId));
          }
        } else {
          // Create new conversation
          let profilePicUrl: string | null = null;
          try {
            profilePicUrl = await getProfilePicture(remoteJid);
          } catch { /* ignore */ }

          const [newConv] = await db.insert(whatsappConversations).values({
            remoteJid,
            pushName,
            phoneNumber,
            profilePicUrl,
            unreadCount: 0,
            isArchived: false,
            aiEnabled: false,
          }).returning({ id: whatsappConversations.id });

          conversationId = newConv.id;
          contactsImported++;
        }

        // Step 5: Import recent messages
        try {
          const messagesResult = await fetchMessages(remoteJid, 100);
          const msgs = extractArray(messagesResult);

          for (const msg of msgs) {
            const messageId = msg.key?.id || msg.id;
            if (!messageId) continue;

            // Check for duplicate
            const existingMsg = await db.select({ id: whatsappMessages.id })
              .from(whatsappMessages)
              .where(eq(whatsappMessages.messageId, messageId))
              .limit(1);

            if (existingMsg.length > 0) continue;

            const content = msg.message?.conversation
              || msg.message?.extendedTextMessage?.text
              || msg.message?.imageMessage?.caption
              || msg.message?.videoMessage?.caption
              || msg.message?.documentMessage?.fileName
              || msg.body // Some API versions use this
              || null;

            const messageType = msg.message?.imageMessage ? 'image'
              : msg.message?.videoMessage ? 'video'
              : msg.message?.audioMessage ? 'audio'
              : msg.message?.documentMessage ? 'document'
              : msg.message?.stickerMessage ? 'sticker'
              : msg.messageType || 'text';

            const tsRaw = msg.messageTimestamp || msg.timestamp || msg.t;
            const timestamp = tsRaw
              ? new Date(typeof tsRaw === 'number'
                  ? (tsRaw > 1e12 ? tsRaw : tsRaw * 1000)
                  : parseInt(tsRaw) * 1000)
              : new Date();

            const isFromMe = msg.key?.fromMe ?? msg.fromMe ?? false;

            await db.insert(whatsappMessages).values({
              conversationId,
              messageId,
              remoteJid,
              sender: isFromMe ? 'admin' : 'customer',
              content: content || (messageType !== 'text' ? `[${messageType}]` : null),
              messageType,
              isFromMe,
              isRead: true,
              timestamp,
            });

            messagesImported++;
          }

          // Update conversation with last message info
          if (msgs.length > 0) {
            const lastMsg = msgs[msgs.length - 1];
            const lastContent = lastMsg.message?.conversation
              || lastMsg.message?.extendedTextMessage?.text
              || lastMsg.body
              || '';
            const lastTsRaw = lastMsg.messageTimestamp || lastMsg.timestamp || lastMsg.t;
            const lastTs = lastTsRaw
              ? new Date(typeof lastTsRaw === 'number'
                  ? (lastTsRaw > 1e12 ? lastTsRaw : lastTsRaw * 1000)
                  : parseInt(lastTsRaw) * 1000)
              : new Date();

            await db.update(whatsappConversations)
              .set({
                lastMessageAt: lastTs,
                lastMessagePreview: typeof lastContent === 'string' ? lastContent.substring(0, 200) : '',
                updatedAt: new Date(),
              })
              .where(eq(whatsappConversations.id, conversationId));
          }
        } catch (msgErr) {
          console.error(`[WhatsApp Sync] Error importing messages for ${remoteJid}:`, msgErr);
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`${remoteJid}: ${errMsg}`);
        console.error(`[WhatsApp Sync] Error processing ${remoteJid}:`, err);
      }
    }

    console.log(`[WhatsApp Sync] Done: ${contactsImported} contacts, ${messagesImported} messages, ${skipped} skipped, ${errors.length} errors`);

    return NextResponse.json({
      success: true,
      imported: {
        contacts: contactsImported,
        messages: messagesImported,
        total: allJids.size,
        skipped,
      },
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined,
      debug: {
        chatsFromApi: chats.length,
        contactsFromApi: contacts.length,
        uniqueJids: allJids.size,
      },
    });
  } catch (error) {
    console.error('[WhatsApp Sync] Fatal error:', error);
    return NextResponse.json({ error: 'Sync fehlgeschlagen', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}
