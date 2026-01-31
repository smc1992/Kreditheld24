'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function KnowledgeBaseManager() {
    const [items, setItems] = useState<any[]>([]);
    const [newContent, setNewContent] = useState('');
    const [newSource, setNewSource] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchItems = async () => {
        setFetching(true);
        try {
            const res = await fetch('/api/admin/knowledge');
            const data = await res.json();
            if (data.success) {
                setItems(data.items);
            }
        } catch (err) {
            console.error('Failed to fetch KB items:', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newContent) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent, source: newSource }),
            });
            const data = await res.json();
            if (data.success) {
                setNewContent('');
                setNewSource('');
                fetchItems();
            } else {
                alert('Fehler: ' + data.error);
            }
        } catch (err) {
            alert('Netzwerkfehler beim Hinzufügen');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Knowledge Base (RAG)
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl border border-slate-200/60 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-slate-800">Neuen Eintrag hinzufügen</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Inhalt</label>
                                <textarea
                                    className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    rows={6}
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="Beschreibe Details über Kredite, Konditionen oder Kreditheld24..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Quelle</label>
                                <input
                                    type="text"
                                    className="w-full text-sm p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    value={newSource}
                                    onChange={(e) => setNewSource(e.target.value)}
                                    placeholder="z.B. Website, FAQ, Handbuch..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
                            >
                                {loading ? 'Speichere...' : 'Eintrag hinzufügen'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl border border-slate-200/60 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-700">Existierende Einträge</h3>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {fetching ? (
                                <div className="p-8 text-center text-slate-500">Lade Knowledge Base...</div>
                            ) : items.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">Noch keine Einträge vorhanden.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                            <div className="text-sm text-slate-800 line-clamp-3 mb-2">{item.content}</div>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                                                    Quelle: {item.source}
                                                </span>
                                                <span>{format(new Date(item.created_at), 'dd.MM.yyyy HH:mm', { locale: de })}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
