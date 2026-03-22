import { NextRequest, NextResponse } from 'next/server';
import { db, chatMessages, chatSessions } from '@/db';
import { eq, asc, gt } from 'drizzle-orm';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// GET - Public endpoint for customer ChatWidget to poll for new messages (admin replies)
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('chat_session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ success: false, messages: [] });
    }

    // Verify session exists
    const [session] = await db.select({
      id: chatSessions.id,
      aiEnabled: chatSessions.aiEnabled,
      status: chatSessions.status,
    }).from(chatSessions).where(eq(chatSessions.id, sessionId)).limit(1);

    if (!session) {
      return NextResponse.json({ success: false, messages: [] });
    }

    // Optional: only fetch messages after a certain timestamp
    const { searchParams } = new URL(req.url);
    const after = searchParams.get('after');

    let query = db.select().from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt));

    const messages = await query;

    // Filter by timestamp if provided
    const filtered = after
      ? messages.filter(m => new Date(m.createdAt) > new Date(after))
      : messages;

    // Mark user messages as read
    await db.update(chatMessages)
      .set({ isRead: true })
      .where(eq(chatMessages.sessionId, sessionId));

    return NextResponse.json({
      success: true,
      messages: filtered,
      session: {
        aiEnabled: session.aiEnabled,
        status: session.status,
      }
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ success: false, messages: [] });
  }
}
