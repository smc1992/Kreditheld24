'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import {
    ArrowLeft,
    Send,
    Bot,
    User,
    Shield,
    ToggleLeft,
    ToggleRight,
    BookOpen,
    Loader2,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Clock
} from 'lucide-react';

interface Message {
    id: string;
    sessionId: string;
    sender: 'user' | 'ai' | 'admin';
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface ChatSession {
    id: string;
    customerId: string | null;
    status: string;
    aiEnabled: boolean;
    lastMessageAt: string;
    createdAt: string;
    updatedAt: string;
    customer: any | null;
    messages: Message[];
}

export default function ChatDetailClient({ session: initialSession }: { session: ChatSession }) {
    const [messages, setMessages] = useState<Message[]>(initialSession.messages || []);
    const [aiEnabled, setAiEnabled] = useState(initialSession.aiEnabled);
    const [sessionStatus, setSessionStatus] = useState(initialSession.status);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [ingesting, setIngesting] = useState<string | null>(null);
    const [toggling, setToggling] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Scroll to bottom when new messages appear
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Poll for new messages every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/admin/chat/${initialSession.id}`, { cache: 'no-store' });
                const data = await res.json();
                if (data.success && data.messages) {
                    setMessages(data.messages);
                    if (data.session) {
                        setAiEnabled(data.session.aiEnabled);
                        setSessionStatus(data.session.status);
                    }
                }
            } catch (err) {
                // Silently fail polling
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [initialSession.id]);

    // Send admin message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch(`/api/admin/chat/${initialSession.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => [...prev, data.message]);
                setNewMessage('');
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
            } else {
                alert('Fehler beim Senden: ' + (data.error || 'Unbekannter Fehler'));
            }
        } catch (err) {
            alert('Netzwerkfehler beim Senden');
        } finally {
            setSending(false);
        }
    };

    // Toggle AI on/off (Human Handover)
    const toggleAI = async () => {
        setToggling(true);
        try {
            const res = await fetch(`/api/admin/chat/${initialSession.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aiEnabled: !aiEnabled }),
            });
            const data = await res.json();
            if (data.success) {
                setAiEnabled(data.session.aiEnabled);
            }
        } catch (err) {
            alert('Fehler beim Umschalten');
        } finally {
            setToggling(false);
        }
    };

    // Close/Reopen session
    const toggleStatus = async () => {
        const newStatus = sessionStatus === 'closed' ? 'open' : 'closed';
        try {
            const res = await fetch(`/api/admin/chat/${initialSession.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) {
                setSessionStatus(data.session.status);
            }
        } catch (err) {
            alert('Fehler beim Statuswechsel');
        }
    };

    // Ingest message to knowledge base
    const ingestToKB = async (content: string, messageId: string) => {
        setIngesting(messageId);
        try {
            const res = await fetch('/api/admin/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    source: `Chat Session ${initialSession.id}`,
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Erfolgreich in Knowledge Base übernommen!');
            } else {
                alert('Fehler: ' + data.error);
            }
        } catch (err) {
            alert('Netzwerkfehler');
        } finally {
            setIngesting(null);
        }
    };

    // Auto-resize textarea
    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    };

    // Handle Enter key (send on Enter, newline on Shift+Enter)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const getSenderConfig = (sender: string) => {
        switch (sender) {
            case 'user':
                return {
                    label: 'Kunde',
                    icon: User,
                    align: 'items-start',
                    bubble: 'bg-slate-100 text-slate-800 rounded-tl-sm',
                    time: 'text-slate-400',
                    iconBg: 'bg-slate-200 text-slate-600',
                };
            case 'admin':
                return {
                    label: 'Admin',
                    icon: Shield,
                    align: 'items-end',
                    bubble: 'bg-emerald-600 text-white rounded-tr-sm shadow-md',
                    time: 'text-emerald-100',
                    iconBg: 'bg-emerald-100 text-emerald-700',
                };
            case 'ai':
            default:
                return {
                    label: 'KI-Assistent',
                    icon: Bot,
                    align: 'items-end',
                    bubble: 'bg-blue-600 text-white rounded-tr-sm shadow-md',
                    time: 'text-blue-100',
                    iconBg: 'bg-blue-100 text-blue-700',
                };
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-7rem)]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/messages" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="h-5 w-5 text-slate-500" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
                                {initialSession.customer?.firstName?.[0] || 'G'}
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">
                                    {initialSession.customer
                                        ? `${initialSession.customer.firstName} ${initialSession.customer.lastName}`
                                        : 'Gast / Unbekannt'}
                                </h1>
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(initialSession.createdAt), 'dd. MMM yyyy, HH:mm', { locale: de })}
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        sessionStatus === 'open'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                                    }`}>
                                        {sessionStatus === 'open' ? 'Offen' : 'Geschlossen'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        {/* AI Toggle */}
                        <button
                            onClick={toggleAI}
                            disabled={toggling}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                                aiEnabled
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}
                        >
                            {toggling ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : aiEnabled ? (
                                <ToggleRight className="h-5 w-5" />
                            ) : (
                                <ToggleLeft className="h-5 w-5" />
                            )}
                            {aiEnabled ? 'KI Aktiv' : 'Human Handover'}
                        </button>

                        {/* Close/Reopen */}
                        <button
                            onClick={toggleStatus}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                                sessionStatus === 'open'
                                    ? 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                    : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                            }`}
                        >
                            {sessionStatus === 'open' ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Schließen
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="h-4 w-4" />
                                    Wieder öffnen
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Human Handover Banner */}
                {!aiEnabled && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-amber-800">Human Handover aktiv</p>
                            <p className="text-xs text-amber-600">
                                Der KI-Assistent ist deaktiviert. Neue Kundennachrichten werden nicht automatisch beantwortet – 
                                Sie können direkt über das Textfeld unten antworten.
                            </p>
                        </div>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="p-6 space-y-4">
                        {messages.map((msg) => {
                            const config = getSenderConfig(msg.sender);
                            const Icon = config.icon;

                            return (
                                <div key={msg.id} className={`group relative flex flex-col ${config.align}`}>
                                    {/* Sender Label */}
                                    <div className={`flex items-center gap-1.5 mb-1 ${msg.sender === 'user' ? '' : 'flex-row-reverse'}`}>
                                        <div className={`h-5 w-5 rounded-full ${config.iconBg} flex items-center justify-center`}>
                                            <Icon className="h-3 w-3" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            {config.label}
                                        </span>
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`max-w-[75%] p-4 rounded-2xl ${config.bubble}`}>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                                        <div className={`mt-2 text-[10px] font-medium ${config.time} ${msg.sender !== 'user' ? 'text-right' : ''}`}>
                                            {format(new Date(msg.createdAt), 'HH:mm', { locale: de })}
                                        </div>
                                    </div>

                                    {/* KB Ingest Button (only for AI/Admin messages) */}
                                    {msg.sender !== 'user' && (
                                        <button
                                            onClick={() => ingestToKB(msg.content, msg.id)}
                                            disabled={ingesting === msg.id}
                                            className="mt-1 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <BookOpen className="h-3 w-3" />
                                            {ingesting === msg.id ? 'Lernt...' : 'In Knowledge Base'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Admin Message Input */}
                {sessionStatus === 'open' && (
                    <form onSubmit={handleSendMessage} className="mt-4 shrink-0">
                        <div className="flex items-end gap-3 bg-white rounded-xl border border-slate-200 shadow-sm p-3">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={textareaRef}
                                    value={newMessage}
                                    onChange={handleTextareaInput}
                                    onKeyDown={handleKeyDown}
                                    placeholder={aiEnabled
                                        ? 'Als Admin antworten (KI ist noch aktiv – zum Deaktivieren „Human Handover" klicken)...'
                                        : 'Antwort an den Kunden schreiben...'
                                    }
                                    rows={1}
                                    className="w-full resize-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 transition-all shrink-0"
                            >
                                {sending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                Senden
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 px-1">
                            Enter = Senden • Shift+Enter = Neue Zeile • Nachrichten erscheinen sofort beim Kunden
                        </p>
                    </form>
                )}

                {sessionStatus === 'closed' && (
                    <div className="mt-4 text-center py-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 shrink-0">
                        Dieser Chat ist geschlossen. Klicken Sie auf „Wieder öffnen" um fortzufahren.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
