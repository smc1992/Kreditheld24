
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, chatSessions, chatMessages, crmCustomers } from '@/db';
import { eq, desc, sql, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch sessions with customer details and last message
        // Optimization: Depending on data volume, valid SQL joins are better.
        // Drizzle query builder:
        const sessions = await db.select({
            id: chatSessions.id,
            customerId: chatSessions.customerId,
            status: chatSessions.status,
            aiEnabled: chatSessions.aiEnabled,
            lastMessageAt: chatSessions.lastMessageAt,
            customerFirstName: crmCustomers.firstName,
            customerLastName: crmCustomers.lastName,
            customerEmail: crmCustomers.email,
        })
            .from(chatSessions)
            .leftJoin(crmCustomers, eq(chatSessions.customerId, crmCustomers.id))
            .orderBy(desc(chatSessions.lastMessageAt));

        // For each session, fetch last message and unread count
        const sessionsWithLastMsg = await Promise.all(sessions.map(async (s) => {
            const lastMsg = await db.select()
                .from(chatMessages)
                .where(eq(chatMessages.sessionId, s.id))
                .orderBy(desc(chatMessages.createdAt))
                .limit(1);

            // Count unread user messages
            const [unread] = await db.select({ count: sql<number>`count(*)::int` })
                .from(chatMessages)
                .where(
                    and(
                        eq(chatMessages.sessionId, s.id),
                        eq(chatMessages.sender, 'user'),
                        eq(chatMessages.isRead, false)
                    )
                );

            return {
                ...s,
                lastMessage: lastMsg[0] ? {
                    content: lastMsg[0].content,
                    sender: lastMsg[0].sender,
                    createdAt: lastMsg[0].createdAt
                } : null,
                unreadCount: unread?.count || 0
            };
        }));

        return NextResponse.json({ success: true, sessions: sessionsWithLastMsg });
    } catch (error) {
        console.error('Error fetching chat sessions:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch sessions' },
            { status: 500 }
        );
    }
}
