import { db, chatSessions, chatMessages } from '@/db';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import ChatDetailClient from './ChatDetailClient';

export default async function ChatDetailPage({ params }: { params: { id: string } }) {
    const session = await db.query.chatSessions.findFirst({
        where: eq(chatSessions.id, params.id),
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Chat-Protokoll
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Session ID: {session.id} • {format(new Date(session.createdAt), 'dd. MMMM yyyy', { locale: de })}
                    </p>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl border border-slate-200/60 p-6">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                        {session.customer?.firstName?.[0] || 'G'}
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            {session.customer ? `${session.customer.firstName} ${session.customer.lastName}` : 'Gast'}
                        </h2>
                        <p className="text-sm text-slate-500">{session.customer?.email || 'Keine E-Mail'}</p>
                    </div>
                </div>

                <ChatDetailClient session={session} />
            </div>
        </div>
    );
}
