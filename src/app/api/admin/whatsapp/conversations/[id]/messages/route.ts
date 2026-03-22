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

// POST /api/admin/whatsapp/conversations/[id]/messages - Send a message
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
    const body = await request.json();
    const { text } = body;

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

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
