'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
    BookOpen,
    Plus,
    Search,
    Trash2,
    Edit2,
    Save,
    X,
    MessageSquare,
    Link as LinkIcon,
    RefreshCw,
    MoreVertical
} from 'lucide-react';

export default function KnowledgeBaseManager() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [newContent, setNewContent] = useState('');
    const [newSource, setNewSource] = useState('');
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [mounted, setMounted] = useState(false);
    const itemsPerPage = 20;

    // Add/Edit State
    const [isModifying, setIsModifying] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [source, setSource] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchItems = async (page: number, search: string) => {
        setFetching(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: itemsPerPage.toString(),
                search: search
            });
            const res = await fetch(`/api/admin/knowledge?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setItems(data.items);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages);
                    setTotalItems(data.pagination.total);
                }
            }
        } catch (err) {
            console.error('Failed to fetch KB items:', err);
        } finally {
            setFetching(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        } else if (status === 'authenticated') {
            fetchItems(currentPage, debouncedSearch);
        }
    }, [status, currentPage, debouncedSearch]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;

        setSubmitting(true);
        try {
            const method = editingId ? 'PATCH' : 'POST';
            const payload = editingId ? { id: editingId, content, source } : { content, source };

            const res = await fetch('/api/admin/knowledge', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (data.success) {
                resetForm();
                fetchItems(currentPage, debouncedSearch);
            } else {
                alert('Fehler: ' + data.error);
            }
        } catch (err) {
            alert('Netzwerkfehler beim Speichern');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Möchten Sie diesen Eintrag wirklich löschen? Dies beeinflusst die Antworten des KI-Assistenten.')) return;

        try {
            const res = await fetch(`/api/admin/knowledge?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchItems(currentPage, debouncedSearch);
            } else {
                alert('Fehler: ' + data.error);
            }
        } catch (err) {
            alert('Netzwerkfehler beim Löschen');
        }
    };

    const startEdit = (item: any) => {
        setEditingId(item.id);
        setContent(item.content);
        setSource(item.source);
        setIsModifying(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setContent('');
        setSource('');
        setIsModifying(false);
    };

    // No client-side filtering needed anymore
    const displayItems = items;

    if (status === 'loading' || loading) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            Knowledge Base (RAG)
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Verwalten Sie die Wissensbasis für den KI-Chatbot.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModifying(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Wissen hinzufügen
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Search & Stats */}
                    <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Wissen durchsuchen..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 px-2">
                            <RefreshCw className={`h-4 w-4 cursor-pointer hover:text-blue-600 transition-colors ${fetching ? 'animate-spin' : ''}`} onClick={() => fetchItems(currentPage, debouncedSearch)} />
                            <span>{totalItems} Einträge</span>
                        </div>
                    </div>

                    {/* Modification UI (Add/Edit) */}
                    {isModifying && (
                        <div className="bg-white rounded-2xl border-2 border-blue-500/20 shadow-lg overflow-hidden animate-in slide-in-from-top-4 duration-300">
                            <div className="p-6">
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            {editingId ? <Edit2 className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
                                            {editingId ? 'Eintrag bearbeiten' : 'Neues Wissen hinzufügen'}
                                        </h3>
                                        <button type="button" onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Inhalt (Wissenstext)</label>
                                        <textarea
                                            className="w-full text-sm p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all min-h-[150px]"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Beschreibe Details über Kredite, Voraussetzungen oder Prozesse..."
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Quelle / Kategorie</label>
                                            <input
                                                type="text"
                                                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                                value={source}
                                                onChange={(e) => setSource(e.target.value)}
                                                placeholder="z.B. FAQ, Partnerportal, Manual..."
                                            />
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md transition-all"
                                            >
                                                {submitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                                {editingId ? 'Änderungen speichern' : 'Wissen hinzufügen'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Data List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-2/3">Inhalt</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quelle & Datum</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aktionen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {fetching ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan={3} className="px-6 py-10">
                                                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-3"></div>
                                                    <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : displayItems.length > 0 ? (
                                        displayItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-slate-800 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                                        {item.content}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full w-fit border border-blue-100">
                                                            <LinkIcon className="h-3 w-3" />
                                                            {item.source}
                                                        </span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                                            {mounted && format(new Date(item.created_at), 'dd. MMM yyyy', { locale: de })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => startEdit(item)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Bearbeiten"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Löschen"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                                                        <MessageSquare className="h-6 w-6 text-slate-300" />
                                                    </div>
                                                    <p className="text-slate-500 text-sm">Kein Wissen zu dieser Suchanfrage gefunden.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            <p className="text-xs text-slate-500">
                                Zeige <span className="font-semibold">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(totalItems, currentPage * itemsPerPage)}</span> von <span className="font-semibold">{totalItems}</span> Einträgen
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1 || fetching}
                                    className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Zurück
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage >= totalPages || fetching}
                                    className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Weiter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
