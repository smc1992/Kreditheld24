'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import DashboardLayout from '@/components/admin/DashboardLayout';
import EmojiPicker from '@/components/chat/EmojiPicker';
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
    Clock,
    Search,
    X,
    Zap,
    UserPlus,
    Paperclip,
    Image as ImageIcon,
    FileText,
    BarChart3,
    Bell,
    ChevronDown,
    ChevronUp,
    MessageSquare
} from 'lucide-react';

interface Message {
    id: string;
    sessionId: string;
    sender: 'user' | 'ai' | 'admin';
    content: string;
    isRead: boolean;
    createdAt: string;
    metadata?: any;
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

interface QuickReply {
    text: string;
}

const defaultQuickReplies: QuickReply[] = [
    { text: 'Vielen Dank für Ihre Nachricht! Ein Berater meldet sich in Kürze bei Ihnen.' },
    { text: 'Haben Sie Ihre Unterlagen bereits hochgeladen? Sie können dies im Portal unter "Dokumente" tun.' },
    { text: 'Für eine individuelle Beratung empfehle ich Ihnen, einen Termin mit unserem Team zu vereinbaren.' },
    { text: 'Ihre Anfrage wird bearbeitet. Bei dringenden Fragen erreichen Sie uns telefonisch.' },
    { text: 'Vielen Dank für Ihr Interesse! Ich leite Sie an einen Berater weiter.' },
];

export default function ChatDetailClient({ session: initialSession }: { session: ChatSession }) {
    const [messages, setMessages] = useState<Message[]>(initialSession.messages || []);
    const [aiEnabled, setAiEnabled] = useState(initialSession.aiEnabled);
    const [sessionStatus, setSessionStatus] = useState(initialSession.status);
    const [sessionCustomer, setSessionCustomer] = useState(initialSession.customer);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [ingesting, setIngesting] = useState<string | null>(null);
    const [toggling, setToggling] = useState(false);

    // Quick replies
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const [quickReplies, setQuickReplies] = useState<QuickReply[]>(defaultQuickReplies);

    // Search
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Customer assign
    const [showAssign, setShowAssign] = useState(false);
    const [customerSearch, setCustomerSearch] = useState('');
    const [customerResults, setCustomerResults] = useState<any[]>([]);
    const [assigningCustomer, setAssigningCustomer] = useState(false);

    // File upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Notification
    const [notificationEnabled, setNotificationEnabled] = useState(false);
    const prevMessageCount = useRef(messages.length);

    // Escalation
    const [escalationWarning, setEscalationWarning] = useState(false);
    const escalationMinutes = 10;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load quick replies from config
    useEffect(() => {
        fetch('/api/admin/settings/chatbot')
            .then(r => r.json())
            .then(data => {
                if (data.success && data.config?.quickReplies) {
                    setQuickReplies(data.config.quickReplies.map((t: string) => ({ text: t })));
                }
            })
            .catch(() => {});
    }, []);

    // Request notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        setNotificationEnabled('Notification' in window && Notification.permission === 'granted');
    }, []);

    // Play notification sound
    const playSound = useCallback(() => {
        try {
            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            oscillator.connect(gain);
            gain.connect(ctx.destination);
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            gain.gain.value = 0.1;
            oscillator.start();
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            oscillator.stop(ctx.currentTime + 0.3);
        } catch (e) {
            // Audio not available
        }
    }, []);

    // Poll for new messages every 5 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/admin/chat/${initialSession.id}`, { cache: 'no-store' });
                const data = await res.json();
                if (data.success && data.messages) {
                    // Check for new user messages
                    const newMsgs = data.messages.filter(
                        (m: Message) => m.sender === 'user' && !messages.find(existing => existing.id === m.id)
                    );

                    if (newMsgs.length > 0) {
                        // Sound notification
                        playSound();

                        // Desktop notification
                        if (notificationEnabled) {
                            new Notification('Neue Kundennachricht', {
                                body: newMsgs[0].content.substring(0, 100),
                                icon: '/images/Kreditheld24 Logo .png',
                            });
                        }
                    }

                    setMessages(data.messages);
                    if (data.session) {
                        setAiEnabled(data.session.aiEnabled);
                        setSessionStatus(data.session.status);
                    }
                }
            } catch (err) {
                // silently fail
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [initialSession.id, messages, notificationEnabled, playSound]);

    // Check escalation (customer waiting > X minutes)
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.sender === 'user') {
            const waitTime = Date.now() - new Date(lastMsg.createdAt).getTime();
            setEscalationWarning(waitTime > escalationMinutes * 60 * 1000);
        } else {
            setEscalationWarning(false);
        }
    }, [messages]);

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
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
            }
        } catch (err) {
            alert('Netzwerkfehler beim Senden');
        } finally {
            setSending(false);
        }
    };

    // Toggle AI
    const toggleAI = async () => {
        setToggling(true);
        try {
            const res = await fetch(`/api/admin/chat/${initialSession.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aiEnabled: !aiEnabled }),
            });
            const data = await res.json();
            if (data.success) setAiEnabled(data.session.aiEnabled);
        } catch (err) {
            alert('Fehler beim Umschalten');
        } finally {
            setToggling(false);
        }
    };

    // Toggle status
    const toggleStatus = async () => {
        const newStatus = sessionStatus === 'closed' ? 'open' : 'closed';
        try {
            const res = await fetch(`/api/admin/chat/${initialSession.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (data.success) setSessionStatus(data.session.status);
        } catch (err) {
            alert('Fehler');
        }
    };

    // KB ingest
    const ingestToKB = async (content: string, messageId: string) => {
        setIngesting(messageId);
        try {
            const res = await fetch('/api/admin/knowledge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, source: `Chat Session ${initialSession.id}` }),
            });
            const data = await res.json();
            alert(data.success ? 'Erfolgreich in Knowledge Base übernommen!' : 'Fehler: ' + data.error);
        } catch (err) {
            alert('Netzwerkfehler');
        } finally {
            setIngesting(null);
        }
    };

    // Quick reply insert
    const insertQuickReply = (text: string) => {
        setNewMessage(text);
        setShowQuickReplies(false);
        textareaRef.current?.focus();
    };

    // Customer search for assignment
    useEffect(() => {
        if (customerSearch.length < 2) {
            setCustomerResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/admin/chat/${initialSession.id}/assign?q=${encodeURIComponent(customerSearch)}`);
                const data = await res.json();
                if (data.success) setCustomerResults(data.customers);
            } catch {}
        }, 300);
        return () => clearTimeout(timer);
    }, [customerSearch, initialSession.id]);

    // Assign customer
    const assignCustomer = async (customerId: string) => {
        setAssigningCustomer(true);
        try {
            const res = await fetch(`/api/admin/chat/${initialSession.id}/assign`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerId }),
            });
            const data = await res.json();
            if (data.success) {
                setSessionCustomer(data.customer);
                setShowAssign(false);
                setCustomerSearch('');
            }
        } catch {
            alert('Fehler');
        } finally {
            setAssigningCustomer(false);
        }
    };

    // File upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/admin/documents', {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadRes.json();

            if (uploadData.success || uploadData.url) {
                const fileUrl = uploadData.url || uploadData.fileUrl;
                const isImage = file.type.startsWith('image/');
                const msgContent = isImage
                    ? `📷 Bild: ${file.name}\n${fileUrl}`
                    : `📎 Datei: ${file.name}\n${fileUrl}`;

                const res = await fetch(`/api/admin/chat/${initialSession.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: msgContent }),
                });
                const data = await res.json();
                if (data.success) {
                    setMessages(prev => [...prev, data.message]);
                }
            } else {
                alert('Upload fehlgeschlagen');
            }
        } catch (err) {
            alert('Fehler beim Hochladen');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Textarea handlers
    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Filter messages by search
    const filteredMessages = searchQuery.trim()
        ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
        : messages;

    const getSenderConfig = (sender: string) => {
        switch (sender) {
            case 'user':
                return { label: 'Kunde', icon: User, align: 'items-start', bubble: 'bg-slate-100 text-slate-800 rounded-tl-sm', time: 'text-slate-400', iconBg: 'bg-slate-200 text-slate-600' };
            case 'admin':
                return { label: 'Admin', icon: Shield, align: 'items-end', bubble: 'bg-emerald-600 text-white rounded-tr-sm shadow-md', time: 'text-emerald-100', iconBg: 'bg-emerald-100 text-emerald-700' };
            default:
                return { label: 'KI-Assistent', icon: Bot, align: 'items-end', bubble: 'bg-blue-600 text-white rounded-tr-sm shadow-md', time: 'text-blue-100', iconBg: 'bg-blue-100 text-blue-700' };
        }
    };

    // Check if content has a file link
    const renderContent = (content: string) => {
        const urlRegex = /(\/uploads\/[^\s]+)/g;
        const parts = content.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(part);
                return isImage
                    ? <img key={i} src={part} alt="Attachment" className="mt-2 max-w-[250px] rounded-lg border border-white/20" />
                    : <a key={i} href={part} target="_blank" rel="noopener" className="underline font-bold hover:opacity-80">{part}</a>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-7rem)]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-3 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/messages" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="h-5 w-5 text-slate-500" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
                                {sessionCustomer?.firstName?.[0] || 'G'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg font-bold text-slate-900">
                                        {sessionCustomer
                                            ? `${sessionCustomer.firstName} ${sessionCustomer.lastName}`
                                            : 'Gast / Unbekannt'}
                                    </h1>
                                    {!sessionCustomer && (
                                        <button
                                            onClick={() => setShowAssign(!showAssign)}
                                            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all"
                                        >
                                            <UserPlus className="h-3 w-3" />
                                            Zuordnen
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {format(new Date(initialSession.createdAt), 'dd. MMM yyyy, HH:mm', { locale: de })}
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        sessionStatus === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                                    }`}>
                                        {sessionStatus === 'open' ? 'Offen' : 'Geschlossen'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {messages.length} Nachrichten
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => setSearchOpen(!searchOpen)} className={`p-2 rounded-lg transition-colors ${searchOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-500'}`}>
                            <Search className="h-4 w-4" />
                        </button>
                        <button
                            onClick={toggleAI}
                            disabled={toggling}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                                aiEnabled ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                        >
                            {toggling ? <Loader2 className="h-4 w-4 animate-spin" /> : aiEnabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                            {aiEnabled ? 'KI Aktiv' : 'Handover'}
                        </button>
                        <button
                            onClick={toggleStatus}
                            className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                                sessionStatus === 'open' ? 'bg-white text-slate-600 border-slate-200 hover:border-red-200 hover:text-red-600' : 'bg-white text-emerald-600 border-emerald-200'
                            }`}
                        >
                            {sessionStatus === 'open' ? <><CheckCircle2 className="h-3.5 w-3.5" />Schließen</> : <><RefreshCw className="h-3.5 w-3.5" />Öffnen</>}
                        </button>
                    </div>
                </div>

                {/* Customer Assign Dropdown */}
                {showAssign && (
                    <div className="bg-white border border-amber-200 rounded-xl p-4 mb-3 shadow-sm shrink-0">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <UserPlus className="h-4 w-4 text-amber-600" />
                                Kunde zuordnen
                            </h3>
                            <button onClick={() => setShowAssign(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                        </div>
                        <input
                            type="text"
                            placeholder="Name oder E-Mail suchen..."
                            value={customerSearch}
                            onChange={e => setCustomerSearch(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 outline-none mb-2"
                        />
                        {customerResults.length > 0 && (
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                                {customerResults.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => assignCustomer(c.id)}
                                        disabled={assigningCustomer}
                                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 text-left transition-all"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{c.firstName?.[0]}</div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{c.firstName} {c.lastName}</p>
                                            <p className="text-[10px] text-slate-500">{c.email}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Search Bar */}
                {searchOpen && (
                    <div className="flex items-center gap-2 mb-3 shrink-0">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Nachrichten durchsuchen..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                autoFocus
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{filteredMessages.length}/{messages.length}</span>
                        <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                    </div>
                )}

                {/* Human Handover Banner */}
                {!aiEnabled && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-3 shrink-0">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-700"><span className="font-bold">Human Handover aktiv</span> – KI ist deaktiviert. Antworten Sie selbst über das Textfeld.</p>
                    </div>
                )}

                {/* Escalation Warning */}
                {escalationWarning && sessionStatus === 'open' && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-3 shrink-0 animate-pulse">
                        <Bell className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-xs text-red-700"><span className="font-bold">Achtung:</span> Kunde wartet seit über {escalationMinutes} Minuten auf eine Antwort!</p>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="p-6 space-y-4">
                        {filteredMessages.map((msg) => {
                            const config = getSenderConfig(msg.sender);
                            const Icon = config.icon;
                            const isHighlighted = searchQuery && msg.content.toLowerCase().includes(searchQuery.toLowerCase());

                            return (
                                <div key={msg.id} className={`group relative flex flex-col ${config.align} ${isHighlighted ? 'ring-2 ring-yellow-400 rounded-2xl' : ''}`}>
                                    <div className={`flex items-center gap-1.5 mb-1 ${msg.sender === 'user' ? '' : 'flex-row-reverse'}`}>
                                        <div className={`h-5 w-5 rounded-full ${config.iconBg} flex items-center justify-center`}>
                                            <Icon className="h-3 w-3" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{config.label}</span>
                                    </div>
                                    <div className={`max-w-[75%] p-4 rounded-2xl ${config.bubble}`}>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{renderContent(msg.content)}</div>
                                        <div className={`mt-2 text-[10px] font-medium ${config.time} ${msg.sender !== 'user' ? 'text-right' : ''}`}>
                                            {format(new Date(msg.createdAt), 'HH:mm', { locale: de })}
                                        </div>
                                    </div>
                                    {msg.sender !== 'user' && (
                                        <button
                                            onClick={() => ingestToKB(msg.content, msg.id)}
                                            disabled={ingesting === msg.id}
                                            className="mt-1 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-semibold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <BookOpen className="h-3 w-3" />
                                            {ingesting === msg.id ? 'Lernt...' : 'In KB'}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Admin Input Area */}
                {sessionStatus === 'open' && (
                    <div className="mt-3 shrink-0 space-y-2">
                        {/* Quick Replies */}
                        <div>
                            <button
                                onClick={() => setShowQuickReplies(!showQuickReplies)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-1"
                            >
                                <Zap className="h-3.5 w-3.5" />
                                Schnellantworten
                                {showQuickReplies ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                            {showQuickReplies && (
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {quickReplies.map((reply, i) => (
                                        <button
                                            key={i}
                                            onClick={() => insertQuickReply(reply.text)}
                                            className="text-[11px] px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full hover:bg-emerald-100 transition-all font-medium truncate max-w-[300px]"
                                        >
                                            {reply.text}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage}>
                            <div className="flex items-end gap-2 bg-white rounded-xl border border-slate-200 shadow-sm p-3">
                                {/* File Upload */}
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all shrink-0"
                                    title="Datei anhängen"
                                >
                                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                                </button>

                                {/* Emoji Picker */}
                                <EmojiPicker
                                    onEmojiSelect={(emoji) => {
                                        setNewMessage(prev => prev + emoji);
                                        textareaRef.current?.focus();
                                    }}
                                    position="top"
                                />

                                <div className="flex-1">
                                    <textarea
                                        ref={textareaRef}
                                        value={newMessage}
                                        onChange={handleTextareaInput}
                                        onKeyDown={handleKeyDown}
                                        placeholder={aiEnabled ? 'Als Admin antworten...' : 'Antwort an den Kunden...'}
                                        rows={1}
                                        className="w-full resize-none bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 transition-all shrink-0"
                                >
                                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    Senden
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 px-1">
                                Enter = Senden • Shift+Enter = Neue Zeile • 📎 = Datei anhängen
                            </p>
                        </form>
                    </div>
                )}

                {sessionStatus === 'closed' && (
                    <div className="mt-3 text-center py-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 shrink-0">
                        Chat geschlossen. Klicken Sie auf „Öffnen" um fortzufahren.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
