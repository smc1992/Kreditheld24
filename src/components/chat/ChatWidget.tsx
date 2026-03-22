
'use client';

import { useChat } from 'ai/react';
import { type Message } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Bot, User, Loader2, MinusCircle, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface PollMessage {
    id: string;
    sender: 'user' | 'ai' | 'admin';
    content: string;
    createdAt: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const pathname = usePathname();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Track all messages including admin ones
    const [allMessages, setAllMessages] = useState<PollMessage[]>([]);
    const [isHandover, setIsHandover] = useState(false);
    const prevMsgCount = useRef(0);

    // Hide on Admin pages and portal
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/portal')) {
        return null;
    }

    const { messages: aiMessages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
        api: '/api/chat',
        onError: (err: Error) => {
            console.error('Chat error:', err);
        }
    });

    // Poll for messages (including admin replies) every 4 seconds when chat is open
    useEffect(() => {
        if (!isOpen) return;

        const poll = async () => {
            try {
                const res = await fetch('/api/chat/messages', { cache: 'no-store' });
                const data = await res.json();
                if (data.success && data.messages) {
                    setAllMessages(data.messages);
                    setIsHandover(!data.session?.aiEnabled);

                    // Check for new admin messages
                    const adminMsgs = data.messages.filter((m: PollMessage) => m.sender === 'admin');
                    if (adminMsgs.length > prevMsgCount.current) {
                        // New admin message arrived
                        prevMsgCount.current = adminMsgs.length;
                    }
                }
            } catch (e) {
                // silently fail
            }
        };

        poll();
        const interval = setInterval(poll, 4000);
        return () => clearInterval(interval);
    }, [isOpen]);

    // Also poll when closed but check for unread
    useEffect(() => {
        if (isOpen) return;

        const checkUnread = async () => {
            try {
                const res = await fetch('/api/chat/messages', { cache: 'no-store' });
                const data = await res.json();
                if (data.success && data.messages) {
                    const adminMsgs = data.messages.filter((m: PollMessage) => m.sender === 'admin');
                    if (adminMsgs.length > prevMsgCount.current) {
                        setHasUnread(true);
                        prevMsgCount.current = adminMsgs.length;
                    }
                }
            } catch {}
        };

        const interval = setInterval(checkUnread, 10000);
        return () => clearInterval(interval);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setHasUnread(false);
            scrollToBottom();
        }
    }, [allMessages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Determine which messages to show
    // If we have polled messages, use those for full history (they include admin messages)
    // Otherwise fall back to AI SDK messages
    const displayMessages = allMessages.length > 0 ? allMessages : aiMessages.map(m => ({
        id: m.id,
        sender: m.role === 'user' ? 'user' as const : 'ai' as const,
        content: m.content,
        createdAt: new Date().toISOString(),
    }));

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <CardHeader className="bg-emerald-600 text-white p-4 rounded-t-lg flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <Bot className="w-6 h-6" />
                            <div>
                                <CardTitle className="text-base font-bold">Kreditheld Assistent</CardTitle>
                                <p className="text-xs text-emerald-100 opacity-90">
                                    {isHandover ? '👤 Berater verbunden' : '🤖 KI-Assistent'}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-emerald-700 h-8 w-8">
                            <MinusCircle className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {displayMessages.length === 0 && (
                            <div className="text-center text-sm text-slate-500 mt-10 space-y-2">
                                <p>👋 Hallo! Wie kann ich helfen?</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-4">
                                    <BadgeButton onClick={() => handleQuickSend("Kredit beantragen")} label="Kredit beantragen" />
                                    <BadgeButton onClick={() => handleQuickSend("Status abfragen")} label="Status abfragen" />
                                    <BadgeButton onClick={() => handleQuickSend("Kontakt")} label="Kontakt aufnehmen" />
                                </div>
                            </div>
                        )}

                        {displayMessages.map((m) => {
                            const isUser = m.sender === 'user';
                            const isAdmin = m.sender === 'admin';

                            return (
                                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className="flex flex-col gap-0.5">
                                        {/* Sender indicator for admin messages */}
                                        {isAdmin && (
                                            <div className="flex items-center gap-1 mb-0.5">
                                                <Shield className="h-3 w-3 text-emerald-600" />
                                                <span className="text-[10px] font-bold text-emerald-600">Berater</span>
                                            </div>
                                        )}
                                        <div className={`
                                            max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm
                                            ${isUser
                                                ? 'bg-emerald-600 text-white rounded-br-none'
                                                : isAdmin
                                                    ? 'bg-emerald-50 text-slate-800 border-2 border-emerald-200 rounded-bl-none'
                                                    : 'bg-white text-slate-800 border border-emerald-100 rounded-bl-none'
                                            }
                                        `}>
                                            {renderMessageContent(m.content)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border rounded-2xl rounded-bl-none px-3 py-2 text-sm flex items-center gap-1 text-slate-400">
                                    <Loader2 className="w-3 h-3 animate-spin" /> tippt...
                                </div>
                            </div>
                        )}

                        {/* Handover info for customer */}
                        {isHandover && displayMessages.length > 0 && (
                            <div className="text-center">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-bold text-emerald-700">
                                    <Shield className="h-3 w-3" />
                                    Ein Berater antwortet Ihnen persönlich
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </CardContent>

                    <CardFooter className="p-3 bg-white border-t">
                        <form onSubmit={handleSubmit} className="flex w-full gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Nachricht schreiben..."
                                className="flex-1 focus-visible:ring-emerald-500"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-emerald-600 hover:bg-emerald-700">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            {/* Trigger Button */}
            {!isOpen && (
                <div className="relative">
                    <Button
                        onClick={() => { setIsOpen(true); setHasUnread(false); }}
                        className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xl flex items-center justify-center transition-transform hover:scale-105"
                    >
                        <MessageSquare className="w-7 h-7 text-white" />
                        <span className="sr-only">Chat öffnen</span>
                    </Button>
                    {hasUnread && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold animate-bounce shadow-lg">
                            !
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    function handleQuickSend(text: string) {
        if (append) {
            append({ role: 'user', content: text });
        }
    }
}

function renderMessageContent(content: string) {
    // Render file links/images inline
    const urlRegex = /(\/uploads\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(part);
            return isImage
                ? <img key={i} src={part} alt="Bild" className="mt-1 max-w-[200px] rounded-lg" />
                : <a key={i} href={part} target="_blank" rel="noopener" className="underline text-emerald-700">{part.split('/').pop()}</a>;
        }
        return <span key={i}>{part}</span>;
    });
}

function BadgeButton({ onClick, label }: { onClick: () => void, label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-50 transition-colors"
        >
            {label}
        </button>
    )
}
