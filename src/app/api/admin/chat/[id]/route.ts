
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, chatSessions, chatMessages, crmCustomers } from '@/db';
import { eq, asc } from 'drizzle-orm';

// GET /api/admin/chat/[id] - Get session details and messages
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

        // 1. Fetch Session
        const [chatSession] = await db.select().from(chatSessions).where(eq(chatSessions.id, id)).limit(1);

        if (!chatSession) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Fetch Customer
        let customer = null;
        if (chatSession.customerId) {
            const [c] = await db.select().from(crmCustomers).where(eq(crmCustomers.id, chatSession.customerId)).limit(1);
            customer = c || null;
        }

        // 3. Fetch Messages
        const messages = await db.select()
            .from(chatMessages)
            .where(eq(chatMessages.sessionId, id))
            .orderBy(asc(chatMessages.createdAt));

        return NextResponse.json({
            success: true,
            session: { ...chatSession, customer },
            messages
        });

    } catch (error) {
        console.error('Error fetching chat details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/chat/[id] - Send a message (as admin)
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
        const { content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Insert Admin Message
        const [newMessage] = await db.insert(chatMessages).values({
            sessionId: id,
            sender: 'admin',
            content: content,
            isRead: true,
        }).returning();

        // Update Session LastMessageAt
        await db.update(chatSessions)
            .set({
                lastMessageAt: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(chatSessions.id, id));

        return NextResponse.json({ success: true, message: newMessage });

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH /api/admin/chat/[id] - Update session (Toggle AI, Close, etc.)
export async function PATCH(
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
        const { aiEnabled, status } = body;

        const updateData: any = { updatedAt: new Date() };
        if (typeof aiEnabled === 'boolean') updateData.aiEnabled = aiEnabled;
        if (status) updateData.status = status;

        const [updatedSession] = await db.update(chatSessions)
            .set(updateData)
            .where(eq(chatSessions.id, id))
            .returning();

        return NextResponse.json({ success: true, session: updatedSession });

    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
