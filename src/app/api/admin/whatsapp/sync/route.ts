import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations, whatsappMessages } from '@/db';
import { eq } from 'drizzle-orm';
import { fetchAllContacts, fetchAllChats, fetchMessages, cleanPhoneNumber, isGroupJid, getProfilePicture } from '@/lib/evolution';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Allow up to 2 minutes

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
      chats = Array.isArray(chatsResult) ? chatsResult : [];
      console.log(`[WhatsApp Sync] Found ${chats.length} chats`);
    } catch (err) {
      console.error('[WhatsApp Sync] Error fetching chats:', err);
      // Fallback: try contacts
    }

    // Step 2: Fetch all contacts
    let contacts: any[] = [];
    try {
      const contactsResult = await fetchAllContacts();
      contacts = Array.isArray(contactsResult) ? contactsResult : [];
      console.log(`[WhatsApp Sync] Found ${contacts.length} contacts`);
    } catch (err) {
      console.error('[WhatsApp Sync] Error fetching contacts:', err);
    }

    // Build a contact map for name lookups
    const contactMap = new Map<string, string>();
    for (const contact of contacts) {
      const jid = contact.id || contact.remoteJid;
      const name = contact.pushName || contact.name || contact.verifiedName || null;
      if (jid && name) contactMap.set(jid, name);
    }

    // Step 3: Process each chat - create conversations and import messages
    const allJids = new Set<string>();

    // From chats
    for (const chat of chats) {
      const jid = chat.id || chat.remoteJid;
      if (jid) allJids.add(jid);
    }

    // From contacts (add any that aren't already in chats)
    for (const contact of contacts) {
      const jid = contact.id || contact.remoteJid;
      if (jid) allJids.add(jid);
    }

    for (const remoteJid of allJids) {
      // Skip group chats and status broadcasts
      if (isGroupJid(remoteJid) || remoteJid === 'status@broadcast') {
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
          // Update name if we have a better one
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

        // Step 4: Import recent messages for this conversation
        try {
          const messagesResult = await fetchMessages(remoteJid, 30); // Last 30 messages
          const msgs = Array.isArray(messagesResult) ? messagesResult : [];

          for (const msg of msgs) {
            const messageId = msg.key?.id;
            if (!messageId) continue;

            // Check if message already exists
            const existingMsg = await db.select({ id: whatsappMessages.id })
              .from(whatsappMessages)
              .where(eq(whatsappMessages.messageId, messageId))
              .limit(1);

            if (existingMsg.length > 0) continue; // Skip duplicates

            const content = msg.message?.conversation
              || msg.message?.extendedTextMessage?.text
              || msg.message?.imageMessage?.caption
              || msg.message?.videoMessage?.caption
              || msg.message?.documentMessage?.fileName
              || null;

            const messageType = msg.message?.imageMessage ? 'image'
              : msg.message?.videoMessage ? 'video'
              : msg.message?.audioMessage ? 'audio'
              : msg.message?.documentMessage ? 'document'
              : msg.message?.stickerMessage ? 'sticker'
              : 'text';

            const timestamp = msg.messageTimestamp
              ? new Date(typeof msg.messageTimestamp === 'number'
                  ? msg.messageTimestamp * 1000
                  : parseInt(msg.messageTimestamp) * 1000)
              : new Date();

            await db.insert(whatsappMessages).values({
              conversationId,
              messageId,
              remoteJid,
              sender: msg.key?.fromMe ? 'admin' : 'customer',
              content: content || (messageType !== 'text' ? `[${messageType}]` : null),
              messageType,
              isFromMe: msg.key?.fromMe || false,
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
              || `[${lastMsg.message?.imageMessage ? 'Bild' : 'Medien'}]`
              || '';
            const lastTs = lastMsg.messageTimestamp
              ? new Date(typeof lastMsg.messageTimestamp === 'number'
                  ? lastMsg.messageTimestamp * 1000
                  : parseInt(lastMsg.messageTimestamp) * 1000)
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
          // Don't fail the whole sync if message import fails for one contact
          console.error(`[WhatsApp Sync] Error importing messages for ${remoteJid}:`, msgErr);
        }

        // Small delay to avoid rate limiting
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
    });
  } catch (error) {
    console.error('[WhatsApp Sync] Fatal error:', error);
    return NextResponse.json({ error: 'Sync fehlgeschlagen' }, { status: 500 });
  }
}
