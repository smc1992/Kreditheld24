import { NextRequest, NextResponse } from 'next/server';
import { db, whatsappConversations, whatsappMessages } from '@/db';
import { eq, sql } from 'drizzle-orm';
import { cleanPhoneNumber } from '@/lib/evolution';

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
