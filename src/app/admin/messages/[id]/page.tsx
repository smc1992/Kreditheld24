import { db, chatSessions, chatMessages } from '@/db';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ChatDetailClient from './ChatDetailClient';

export default async function ChatDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const session = await db.query.chatSessions.findFirst({
        where: eq(chatSessions.id, id),
        with: {
            customer: true,
            messages: {
                orderBy: [asc(chatMessages.createdAt)],
            },
        },
    });

    if (!session) {
        return notFound();
    }

    // Serialize dates for client component
    const serializedSession = JSON.parse(JSON.stringify(session));

    return <ChatDetailClient session={serializedSession} />;
}
