'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Clock, User, Loader2, Bot } from 'lucide-react';

interface ChatSession {
  id: string;
  customerId: string | null;
  status: string;
  aiEnabled: boolean;
  lastMessageAt: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  customerEmail: string | null;
  lastMessage: {
    content: string;
    sender: 'user' | 'admin' | 'ai';
    createdAt: string;
  } | null;
  unreadCount?: number;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSessions(sessions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = sessions.filter(
        (s) =>
          (s.customerFirstName?.toLowerCase() || '').includes(query) ||
          (s.customerLastName?.toLowerCase() || '').includes(query) ||
          (s.customerEmail?.toLowerCase() || '').includes(query) ||
          (s.lastMessage?.content.toLowerCase() || '').includes(query)
      );
      setFilteredSessions(filtered);
    }
  }, [searchQuery, sessions]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/admin/chat/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
        setFilteredSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      open: { label: 'Offen', variant: 'default' },
      closed: { label: 'Geschlossen', variant: 'secondary' },
      archived: { label: 'Archiviert', variant: 'outline' },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Nie';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nachrichten</h1>
          <p className="text-gray-600 mt-1">Chatbot & Kunden-Konversationen</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Suche nach Name, E-Mail oder Inhalt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Chats
            </CardTitle>
            <CardDescription>
              {filteredSessions.length} {filteredSessions.length === 1 ? 'Konversation' : 'Konversationen'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              </div>
            ) : filteredSessions.length > 0 ? (
              <div className="space-y-2">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => router.push(`/admin/messages/${session.id}`)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${session.status === 'open'
                      ? 'bg-white border-emerald-100 hover:bg-emerald-50'
                      : 'bg-gray-50 border-gray-200 opacity-75'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              {session.customerFirstName
                                ? `${session.customerFirstName} ${session.customerLastName}`
                                : 'Gast / Unbekannt'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">•</span>
                          {getStatusBadge(session.status)}
                          {session.aiEnabled && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 gap-1">
                              <Bot className="w-3 h-3" /> AI Aktiv
                            </Badge>
                          )}
                        </div>

                        {session.lastMessage && (
                          <p className="text-sm text-gray-600 truncate mb-2">
                            <span className="font-medium mr-1">
                              {session.lastMessage.sender === 'user' ? 'Kunde:' :
                                session.lastMessage.sender === 'ai' ? 'Bot:' : 'Sie:'}
                            </span>
                            {session.lastMessage.content}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(session.lastMessageAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchQuery ? 'Keine Chats gefunden.' : 'Noch keine Chats vorhanden.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

