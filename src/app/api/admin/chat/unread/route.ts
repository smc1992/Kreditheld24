import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, chatMessages, chatSessions } from '@/db';
import { eq, and, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Count unread user messages across all open sessions
    const [result] = await db.select({
      count: sql<number>`count(*)::int`
    })
      .from(chatMessages)
      .innerJoin(chatSessions, eq(chatMessages.sessionId, chatSessions.id))
      .where(
        and(
          eq(chatMessages.sender, 'user'),
          eq(chatMessages.isRead, false),
          sql`${chatSessions.status} != 'closed'`
        )
      );

    return NextResponse.json({
      success: true,
      unreadCount: result?.count || 0
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ success: false, unreadCount: 0 });
  }
}
