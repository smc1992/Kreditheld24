'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function ChatDetailClient({ session }: { session: any }) {
    const [ingesting, setIngesting] = useState<string | null>(null);

    const ingestToKB = async (content: string, messageId: string) => {
        setIngesting(messageId);
        try {
            const res = await fetch('/api/admin/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    source: `Chat Session ${session.id}`,
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Erfolgreich gelernt!');
            } else {
                alert('Fehler: ' + data.error);
            }
        } catch (err) {
            alert('Netzwerkfehler beim Lernen');
        } finally {
            setIngesting(null);
        }
    };

    return (
        <div className="space-y-4">
            {session.messages.map((msg: any) => (
                <div key={msg.id} className={`group relative flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-slate-100 text-slate-800 rounded-tl-none'
                            : 'bg-blue-600 text-white rounded-tr-none shadow-md'
                        }`}>
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                        <div className={`mt-2 text-[10px] font-medium ${msg.sender === 'user' ? 'text-slate-400' : 'text-blue-100 text-right'}`}>
                            {format(new Date(msg.createdAt), 'HH:mm', { locale: de })}
                        </div>
                    </div>

                    <button
                        onClick={() => ingestToKB(msg.content, msg.id)}
                        disabled={ingesting === msg.id}
                        className="mt-1 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm disabled:opacity-50"
                    >
                        {ingesting === msg.id ? 'Lernt...' : 'In Knowledge Base übernehmen'}
                    </button>
                </div>
            ))}
        </div>
    );
}
