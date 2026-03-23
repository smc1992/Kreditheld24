import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, whatsappConversations, whatsappMessages } from '@/db';
import { desc, eq, asc } from 'drizzle-orm';
import { sendTextMessage } from '@/lib/evolution';

export const dynamic = 'force-dynamic';

// GET /api/admin/whatsapp/conversations/[id]/messages - Fetch messages for a conversation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    // Fetch conversation info
    const conversation = await db
      .select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.id, id))
      .limit(1);

    if (!conversation.length) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Fetch messages
    const messages = await db
      .select()
      .from(whatsappMessages)
      .where(eq(whatsappMessages.conversationId, id))
      .orderBy(asc(whatsappMessages.timestamp))
      .limit(limit);

    // Mark unread messages as read
    await db.update(whatsappMessages)
      .set({ isRead: true })
      .where(eq(whatsappMessages.conversationId, id));

    // Reset unread count
    await db.update(whatsappConversations)
      .set({ unreadCount: 0 })
      .where(eq(whatsappConversations.id, id));

    return NextResponse.json({
      success: true,
      conversation: conversation[0],
      messages,
    });
  } catch (error) {
    console.error('[WhatsApp API] Error fetching messages:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST /api/admin/whatsapp/conversations/[id]/messages - Send a message (text or media)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';

    // Get conversation
    const conversation = await db
      .select()
      .from(whatsappConversations)
      .where(eq(whatsappConversations.id, id))
      .limit(1);

    if (!conversation.length) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const conv = conversation[0];

    // Handle multipart form data (file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const caption = (formData.get('caption') as string) || '';

      if (!file) {
        return NextResponse.json({ error: 'File is required' }, { status: 400 });
      }

      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const mimeType = file.type || 'application/octet-stream';

      // Determine media type
      let mediaType: 'image' | 'video' | 'audio' | 'document' = 'document';
      if (mimeType.startsWith('image/')) mediaType = 'image';
      else if (mimeType.startsWith('video/')) mediaType = 'video';
      else if (mimeType.startsWith('audio/')) mediaType = 'audio';

      // Send via Evolution API
      const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'https://evolution.kreditheld24.de';
      const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || '';
      const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || 'kreditheld24';
      const phoneNumber = conv.remoteJid.replace('@s.whatsapp.net', '');

      const result = await fetch(`${EVOLUTION_API_URL}/message/sendMedia/${INSTANCE_NAME}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: phoneNumber,
          mediatype: mediaType,
          mimetype: mimeType,
          caption: caption,
          fileName: file.name,
          media: `data:${mimeType};base64,${base64}`,
        }),
      });

      const resultData = await result.json();
      const messageId = resultData?.key?.id || null;

      // Save to our DB
      const newMsg = await db.insert(whatsappMessages).values({
        conversationId: id,
        messageId,
        remoteJid: conv.remoteJid,
        sender: 'admin',
        content: caption || file.name,
        messageType: mediaType,
        mediaUrl: null,
        mediaMimeType: mimeType,
        mediaFileName: file.name,
        isFromMe: true,
        isRead: true,
        timestamp: new Date(),
      }).returning();

      // Update conversation
      await db.update(whatsappConversations)
        .set({
          lastMessageAt: new Date(),
          lastMessagePreview: caption || `[${mediaType}] ${file.name}`,
          updatedAt: new Date(),
        })
        .where(eq(whatsappConversations.id, id));

      return NextResponse.json({ success: true, data: newMsg[0] });
    }

    // Handle JSON text message
    const body = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    // Send via Evolution API
    const result = await sendTextMessage(conv.remoteJid, text);

    // Save to our DB
    const messageId = result?.key?.id || null;
    const newMsg = await db.insert(whatsappMessages).values({
      conversationId: id,
      messageId,
      remoteJid: conv.remoteJid,
      sender: 'admin',
      content: text,
      messageType: 'text',
      isFromMe: true,
      isRead: true,
      timestamp: new Date(),
    }).returning();

    // Update conversation
    await db.update(whatsappConversations)
      .set({
        lastMessageAt: new Date(),
        lastMessagePreview: text.substring(0, 200),
        updatedAt: new Date(),
      })
      .where(eq(whatsappConversations.id, id));

    return NextResponse.json({ success: true, data: newMsg[0] });
  } catch (error) {
    console.error('[WhatsApp API] Error sending message:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
