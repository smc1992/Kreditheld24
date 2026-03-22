import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, chatSessions, chatMessages } from '@/db';
import { eq, and, gte, sql, count } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total sessions
    const [totalSessions] = await db.select({ count: count() }).from(chatSessions);

    // Open sessions
    const [openSessions] = await db.select({ count: count() }).from(chatSessions)
      .where(eq(chatSessions.status, 'open'));

    // Sessions last 24h
    const [sessions24h] = await db.select({ count: count() }).from(chatSessions)
      .where(gte(chatSessions.createdAt, last24h));

    // Sessions last 7d
    const [sessions7d] = await db.select({ count: count() }).from(chatSessions)
      .where(gte(chatSessions.createdAt, last7d));

    // Total messages
    const [totalMessages] = await db.select({ count: count() }).from(chatMessages);

    // Messages by sender type
    const [userMessages] = await db.select({ count: count() }).from(chatMessages)
      .where(eq(chatMessages.sender, 'user'));
    const [aiMessages] = await db.select({ count: count() }).from(chatMessages)
      .where(eq(chatMessages.sender, 'ai'));
    const [adminMessages] = await db.select({ count: count() }).from(chatMessages)
      .where(eq(chatMessages.sender, 'admin'));

    // Human handover sessions (aiEnabled = false)
    const [handoverSessions] = await db.select({ count: count() }).from(chatSessions)
      .where(eq(chatSessions.aiEnabled, false));

    // Average messages per session
    const avgMsgsResult = await db.select({
      avg: sql<number>`round(avg(msg_count)::numeric, 1)`
    }).from(
      db.select({
        msg_count: sql<number>`count(*)`
      })
        .from(chatMessages)
        .groupBy(chatMessages.sessionId)
        .as('msg_counts')
    );

    // Sessions waiting for response (last user message with no admin/ai reply after)
    const [waitingSessions] = await db.select({ count: count() }).from(
      db.select({ id: chatSessions.id })
        .from(chatSessions)
        .where(
          and(
            eq(chatSessions.status, 'open'),
            sql`(SELECT sender FROM chat_messages WHERE session_id = ${chatSessions.id} ORDER BY created_at DESC LIMIT 1) = 'user'`
          )
        )
        .as('waiting')
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalSessions: totalSessions?.count || 0,
        openSessions: openSessions?.count || 0,
        sessions24h: sessions24h?.count || 0,
        sessions7d: sessions7d?.count || 0,
        totalMessages: totalMessages?.count || 0,
        userMessages: userMessages?.count || 0,
        aiMessages: aiMessages?.count || 0,
        adminMessages: adminMessages?.count || 0,
        handoverSessions: handoverSessions?.count || 0,
        avgMessagesPerSession: avgMsgsResult[0]?.avg || 0,
        waitingForResponse: waitingSessions?.count || 0,
      }
    });
  } catch (error) {
    console.error('Error computing chat stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compute chat stats' },
      { status: 500 }
    );
  }
}
