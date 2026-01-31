
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    MessageSquare, User, Send, Bot, ArrowLeft, CheckCircle, Clock
} from 'lucide-react';

interface ChatMessage {
    id: string;
    sender: 'user' | 'admin' | 'ai';
    content: string;
    createdAt: string;
}

interface ChatSession {
    id: string;
    customerId: string | null;
    status: string;
    aiEnabled: boolean;
    customer?: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export default function ChatDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [session, setSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { id } = params;

    useEffect(() => {
        fetchChatDetails();
        // Poll for new messages every 5 seconds (Enhancement: Use WebSockets/SSE later)
        const interval = setInterval(fetchChatDetails, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChatDetails = async () => {
        try {
            const res = await fetch(`/api/admin/chat/${id}`);
            if (res.ok) {
                const data = await res.json();
                setSession(data.session);
                // Only update messages if count changes to avoid jitter, or just set always
                // Ideally we compare IDs but for MVP just set.
                // Check if length changed to decide if we should scroll?
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const res = await fetch(`/api/admin/chat/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage }),
            });

            if (res.ok) {
                setNewMessage('');
                fetchChatDetails();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleToggleAI = async (checked: boolean) => {
        if (!session) return;
        try {
            const res = await fetch(`/api/admin/chat/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aiEnabled: checked }),
            });
            if (res.ok) {
                setSession(prev => prev ? { ...prev, aiEnabled: checked } : null);
            }
        } catch (err) {
            console.error('Failed to toggle AI', err);
        }
    };

    const handleCloseSession = async () => {
        if (!confirm('Möchten Sie diesen Chat wirklich schließen?')) return;
        try {
            const res = await fetch(`/api/admin/chat/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'closed' }),
            });
            if (res.ok) {
                fetchChatDetails(); // Update UI
                router.push('/admin/messages');
            }
        } catch (err) {
            console.error('Failed to close session', err);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-screen items-center justify-center">
                    PuffLoader...
                </div>
            </DashboardLayout>
        );
    }

    if (!session) return <DashboardLayout>Session not found</DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-100px)]">

                {/* Header Bar */}
                <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                {session.customer ? `${session.customer.firstName} ${session.customer.lastName}` : 'Unbekannter Kunde'}
                                <Badge variant={session.status === 'open' ? 'default' : 'secondary'}>{session.status}</Badge>
                            </h2>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Started: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-md border">
                            <Bot className={`w-4 h-4 ${session.aiEnabled ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="text-sm font-medium">AI Autopilot</span>
                            <Switch
                                checked={session.aiEnabled}
                                onCheckedChange={handleToggleAI}
                            />
                        </div>
                        <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={handleCloseSession}>
                            Chat Schließen
                        </Button>
                    </div>
                </div>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col min-h-0">
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                        {messages.length === 0 && (
                            <div className="text-center text-slate-400 py-10">
                                Noch keine Nachrichten.
                            </div>
                        )}

                        {messages.map((msg) => {
                            const isMe = msg.sender === 'admin';
                            const isAi = msg.sender === 'ai';
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm
                                ${isMe
                                            ? 'bg-emerald-600 text-white rounded-br-none'
                                            : isAi
                                                ? 'bg-blue-50 text-slate-800 border border-blue-100 rounded-bl-none'
                                                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                        }
                            `}>
                                        <div className="flex justify-between items-center gap-4 mb-1 opacity-80 text-xs">
                                            <span className="font-semibold capitalize flex items-center gap-1">
                                                {isAi && <Bot className="w-3 h-3" />}
                                                {msg.sender}
                                            </span>
                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Schreiben Sie eine Nachricht..."
                                className="flex-1"
                                autoFocus
                            />
                            <Button type="submit" disabled={!newMessage.trim() || isSending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Send className="w-4 h-4 mr-2" />
                                Senden
                            </Button>
                        </form>
                    </div>
                </Card>

            </div>
        </DashboardLayout>
    );
}
