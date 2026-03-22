import { db, chatSessions, chatMessages, crmCustomers } from '@/db';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ChatDetailClient from './ChatDetailClient';

export default async function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch session
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id)).limit(1);

    if (!session) {
        return notFound();
    }

    // Fetch customer if linked
    let customer = null;
    if (session.customerId) {
        const [c] = await db.select().from(crmCustomers).where(eq(crmCustomers.id, session.customerId)).limit(1);
        customer = c || null;
    }

    // Fetch messages
    const messages = await db.select().from(chatMessages).where(eq(chatMessages.sessionId, id)).orderBy(asc(chatMessages.createdAt));

    // Build serializable session object for the client component
    const sessionData = JSON.parse(JSON.stringify({
        ...session,
        customer,
        messages,
    }));

    return <ChatDetailClient session={sessionData} />;
}
