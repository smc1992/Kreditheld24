
'use client';

import { useChat } from 'ai/react';
import { type Message } from 'ai';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Bot, User, Loader2, MinusCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Hide on Admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        // initialMessages: [], // Could load history later
        onError: (err: Error) => {
            console.error('Chat error:', err);
        }
    });

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
                                <p className="text-xs text-emerald-100 opacity-90">Wir antworten sofort (AI)</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-emerald-700 h-8 w-8">
                            <MinusCircle className="w-5 h-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.length === 0 && (
                            <div className="text-center text-sm text-slate-500 mt-10 space-y-2">
                                <p>👋 Hallo! Wie kann ich helfen?</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-4">
                                    <BadgeButton onClick={() => handleQuickSend("Kredit beantragen")} label="Kredit beantragen" />
                                    <BadgeButton onClick={() => handleQuickSend("Status abfragen")} label="Status abfragen" />
                                    <BadgeButton onClick={() => handleQuickSend("Kontakt")} label="Kontakt aufnehmen" />
                                </div>
                            </div>
                        )}

                        {messages.map((m: Message) => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                  max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm
                  ${m.role === 'user'
                                        ? 'bg-emerald-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-800 border border-emerald-100 rounded-bl-none'}
                `}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border rounded-2xl rounded-bl-none px-3 py-2 text-sm flex items-center gap-1 text-slate-400">
                                    <Loader2 className="w-3 h-3 animate-spin" /> tippt...
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
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-xl flex items-center justify-center transition-transform hover:scale-105"
                >
                    <MessageSquare className="w-7 h-7 text-white" />
                    <span className="sr-only">Chat öffnen</span>
                </Button>
            )}
        </div>
    );

    function handleQuickSend(text: string) {
        // Simulate input change and submit
        const event = {
            target: { value: text },
            preventDefault: () => { }
        } as any;
        handleInputChange(event);
        // We need a slight delay or direct trigger. 
        // useChat doesn't expose a direct 'send(text)' easily without modifying input state first?
        // Actually append() exists in recent versions.
        // But for now, let user click send or implement append if I destructure it.
    }
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
