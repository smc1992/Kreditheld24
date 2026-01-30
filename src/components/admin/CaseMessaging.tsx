'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare, Send, Loader2, Mail, RefreshCw, User, Shield } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  senderType: 'customer' | 'admin';
  senderName: string;
  isRead: boolean;
  createdAt: string;
  subject?: string; // New field for emails
  direction?: 'inbound' | 'outbound'; // New field to help UI
}

interface CaseMessagingProps {
  caseId: string;
}

export default function CaseMessaging({ caseId }: CaseMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 120 seconds to prevent freezing
    const interval = setInterval(() => fetchMessages(true), 120000);
    return () => clearInterval(interval);
  }, [caseId]);

  useEffect(() => {
    // Only scroll to bottom on initial load or if user sends a message
    if (!refreshing && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch(`/api/admin/cases/${caseId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    setNotificationSent(false);

    try {
      const res = await fetch(`/api/admin/cases/${caseId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage }),
      });

      if (res.ok) {
        setNewMessage('');
        const data = await res.json();
        setNotificationSent(data.notificationSent || true);
        await fetchMessages(); // Refresh to show new message

        // Hide notification message after 3 seconds
        if (data.notificationSent) {
          setTimeout(() => setNotificationSent(false), 3000);
        }
        scrollToBottom();
      } else {
        alert('Fehler beim Senden der Nachricht.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Fehler beim Senden der Nachricht.');
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter(m => m.senderType === 'customer' && !m.isRead).length;

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-600" />
            E-Mail Kommunikation
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
                {unreadCount} neu
              </span>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => fetchMessages()} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Synchronisiert mit Kreditheld24 Postfach (Strato)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <>
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isOutbound = msg.senderType === 'admin' || msg.direction === 'outbound';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[85%] gap-3 ${isOutbound ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOutbound ? 'bg-slate-900 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isOutbound ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div
                          className={`rounded-2xl p-4 shadow-sm ${isOutbound
                              ? 'bg-white text-slate-800 border-2 border-slate-200 rounded-tr-none'
                              : 'bg-emerald-600 text-white rounded-tl-none shadow-emerald-200'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <span className={`text-xs font-bold ${isOutbound ? 'text-slate-500' : 'text-emerald-100'}`}>
                              {msg.senderName} ({msg.subject || 'Kein Betreff'})
                            </span>
                            <span className={`text-[10px] ${isOutbound ? 'text-slate-400' : 'text-emerald-100'}`}>
                              {new Date(msg.createdAt).toLocaleString('de-DE', {
                                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div
                            className="text-sm prose prose-sm max-w-none break-words"
                            style={{ color: isOutbound ? '#334155' : 'white' }}
                            dangerouslySetInnerHTML={{ __html: msg.message.replace(/\n/g, '<br />') }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Mail className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">Keine Nachrichten gefunden</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Notification Banner */}
            {notificationSent && (
              <div className="mx-4 mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-2 text-xs text-emerald-800 animate-in slide-in-from-bottom-2">
                <Mail className="w-3 h-3" />
                E-Mail erfolgreich versendet
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="E-Mail Antwort schreiben..."
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none text-sm bg-slate-50 min-h-[50px] max-h-[120px]"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  disabled={sending}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="h-auto px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/10"
                >
                  {sending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
              <div className="mt-2 text-[10px] text-slate-400 text-center">
                Antwort wird als E-Mail an den Kunden gesendet via Resend API
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
