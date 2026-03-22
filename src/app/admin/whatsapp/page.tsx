'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef, useCallback } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Wifi,
  WifiOff,
  QrCode,
  Loader2,
  Bot,
  User,
  Clock,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  ArrowLeft,
  RefreshCw,
  MoreVertical,
  Image as ImageIcon,
  FileText,
  Mic,
  MapPin,
  Video,
  LogOut,
  Trash2,
  AlertTriangle,
  Megaphone,
  Bell,
  BellOff,
} from 'lucide-react';
import Link from 'next/link';

interface Conversation {
  id: string;
  remoteJid: string;
  pushName: string | null;
  phoneNumber: string | null;
  profilePicUrl: string | null;
  customerId: string | null;
  unreadCount: number;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  isArchived: boolean;
  aiEnabled: boolean;
  customerFirstName: string | null;
  customerLastName: string | null;
  customerEmail: string | null;
}

interface Message {
  id: string;
  conversationId: string;
  messageId: string | null;
  remoteJid: string;
  sender: string;
  content: string | null;
  messageType: string;
  mediaUrl: string | null;
  isFromMe: boolean;
  isRead: boolean;
  timestamp: string;
}

export default function WhatsAppPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('unknown');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [instanceInfo, setInstanceInfo] = useState<any>(null);
  const [showStatus, setShowStatus] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const prevTotalUnread = useRef<number>(0);
  const [templates, setTemplates] = useState<Array<{id: string; name: string; content: string; category: string | null}>>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Load templates
  useEffect(() => {
    fetch('/api/admin/whatsapp/templates').then(r => r.json()).then(d => {
      if (d.success) setTemplates(d.templates);
    }).catch(() => {});
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestNotifPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    }
  };

  // Fetch connection status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/status');
      const data = await res.json();
      if (data.success) {
        setConnectionStatus(data.connectionStatus);
        setQrCode(data.qrCode);
        setInstanceInfo(data.instanceInfo);
      }
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/whatsapp/conversations?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.success) {
        // Check for new unread messages and send notification
        const newTotal = data.totalUnread || 0;
        if (newTotal > prevTotalUnread.current && prevTotalUnread.current >= 0 && notifPermission === 'granted') {
          const diff = newTotal - prevTotalUnread.current;
          // Find the conversation with new messages
          const updatedConvs = data.data as Conversation[];
          const newMsgConv = updatedConvs.find((c: Conversation) => c.unreadCount > 0);
          if (newMsgConv && document.hidden) {
            new Notification('Neue WhatsApp-Nachricht', {
              body: `${newMsgConv.pushName || 'Unbekannt'}: ${newMsgConv.lastMessagePreview || 'Neue Nachricht'}`,
              icon: '/icon-192x192.png',
              tag: 'whatsapp-' + newMsgConv.id,
            });
          }
        }
        prevTotalUnread.current = newTotal;
        setConversations(data.data);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/admin/whatsapp/conversations/${convId}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchStatus();
    fetchConversations();

    // Poll for new messages every 5 seconds
    pollRef.current = setInterval(() => {
      fetchConversations();
      if (selectedConv) {
        fetchMessages(selectedConv.id);
      }
    }, 5000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [session, fetchConversations, fetchMessages, fetchStatus, selectedConv]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConv(conv);
    fetchMessages(conv.id);
    // Update unread count locally
    setConversations(prev =>
      prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c)
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return;

    const msgText = newMessage;
    setNewMessage('');
    setSending(true);

    // Optimistic push
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConv.id,
      messageId: null,
      remoteJid: selectedConv.remoteJid,
      sender: 'admin',
      content: msgText,
      messageType: 'text',
      mediaUrl: null,
      isFromMe: true,
      isRead: true,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch(`/api/admin/whatsapp/conversations/${selectedConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msgText }),
      });
      const data = await res.json();
      if (data.success) {
        // Replace optimistic message with real one
        setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? data.data : m));
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleToggleAI = async () => {
    if (!selectedConv) return;
    const newValue = !selectedConv.aiEnabled;

    // Optimistic update
    setSelectedConv({ ...selectedConv, aiEnabled: newValue });
    setConversations(prev =>
      prev.map(c => c.id === selectedConv.id ? { ...c, aiEnabled: newValue } : c)
    );

    try {
      await fetch(`/api/admin/whatsapp/conversations/${selectedConv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiEnabled: newValue }),
      });
    } catch (err) {
      console.error('Error toggling AI:', err);
      // Revert on error
      setSelectedConv({ ...selectedConv, aiEnabled: !newValue });
    }
  };

  const getDisplayName = (conv: Conversation) => {
    if (conv.customerFirstName && conv.customerLastName) {
      return `${conv.customerFirstName} ${conv.customerLastName}`;
    }
    return conv.pushName || conv.phoneNumber || 'Unbekannt';
  };

  const getInitials = (conv: Conversation) => {
    const name = getDisplayName(conv);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    }
    if (isYesterday) {
      return 'Gestern';
    }
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-3 w-3" />;
      case 'video': return <Video className="h-3 w-3" />;
      case 'audio': return <Mic className="h-3 w-3" />;
      case 'document': return <FileText className="h-3 w-3" />;
      case 'location': return <MapPin className="h-3 w-3" />;
      default: return null;
    }
  };

  if (!session) return null;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl">
              <MessageCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">WhatsApp</h1>
              <p className="text-sm text-slate-500">Kundenkommunikation über WhatsApp</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notification Toggle */}
            <button
              onClick={requestNotifPermission}
              title={notifPermission === 'granted' ? 'Benachrichtigungen aktiv' : 'Benachrichtigungen aktivieren'}
              className={`p-2 rounded-lg transition-all ${
                notifPermission === 'granted'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
            >
              {notifPermission === 'granted' ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </button>
            {/* Broadcast Link */}
            <Link
              href="/admin/whatsapp/broadcast"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-lg text-xs font-semibold hover:bg-violet-100 transition-all"
            >
              <Megaphone className="h-3 w-3" />
              Broadcast
            </Link>
            {/* Connection Status */}
            <button
              onClick={() => { setShowStatus(!showStatus); fetchStatus(); }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                connectionStatus === 'open'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {connectionStatus === 'open' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {connectionStatus === 'open' ? 'Verbunden' : 'Nicht verbunden'}
            </button>
            <button
              onClick={() => { fetchConversations(); fetchStatus(); }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showStatus && connectionStatus !== 'open' && (
          <div className="mb-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-emerald-600" />
                  WhatsApp verbinden
                </h2>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  Öffne WhatsApp auf deinem Smartphone → Einstellungen → Verknüpfte Geräte → Gerät hinzufügen → QR-Code scannen
                </p>
                <button
                  onClick={fetchStatus}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500 transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  QR-Code aktualisieren
                </button>
              </div>
              {qrCode && (
                <div className="bg-white p-3 rounded-xl border-2 border-emerald-200 shadow-lg">
                  {qrCode.startsWith('data:') || qrCode.startsWith('iVBOR') ? (
                    <img
                      src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                      alt="WhatsApp QR Code"
                      className="w-48 h-48"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-lg">
                      <div className="text-center">
                        <QrCode className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">QR-Code wird geladen...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connected Status Panel (shows when status is open and clicked) */}
        {showStatus && connectionStatus === 'open' && (
          <div className="mb-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-emerald-600" />
                  WhatsApp verbunden
                </h2>
                {instanceInfo && (
                  <p className="text-sm text-slate-500 mt-1">
                    {instanceInfo.profileName || instanceInfo.name}
                    {instanceInfo.number && <span className="ml-2 text-slate-400">+{instanceInfo.number}</span>}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowStatus(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Disconnect Button */}
              <button
                onClick={async () => {
                  if (!confirm('WhatsApp-Verbindung wirklich trennen? Du musst den QR-Code erneut scannen, um wieder zu verbinden.')) return;
                  setDisconnecting(true);
                  try {
                    const res = await fetch('/api/admin/whatsapp/status', { method: 'POST' });
                    const data = await res.json();
                    if (data.success) {
                      setConnectionStatus('close');
                      setShowStatus(false);
                      alert('WhatsApp wurde getrennt.');
                      fetchStatus();
                    } else {
                      alert('Fehler: ' + (data.error || 'Unbekannt'));
                    }
                  } catch (err) { alert('Verbindungsfehler'); }
                  setDisconnecting(false);
                }}
                disabled={disconnecting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-semibold hover:bg-amber-100 transition-all disabled:opacity-50"
              >
                {disconnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                Verbindung trennen
              </button>

              {/* Clear All Data Button */}
              <button
                onClick={async () => {
                  const confirmed = confirm(
                    '⚠️ ACHTUNG: Alle WhatsApp-Daten löschen?\n\n'
                    + 'Das umfasst:\n'
                    + '• Alle Unterhaltungen\n'
                    + '• Alle Nachrichten\n'
                    + '• Alle Automations-Logs\n\n'
                    + 'Diese Aktion kann nicht rückgängig gemacht werden!'
                  );
                  if (!confirmed) return;

                  const doubleConfirm = confirm('Bist du wirklich sicher? Alle WhatsApp-Daten werden unwiderruflich gelöscht.');
                  if (!doubleConfirm) return;

                  setClearing(true);
                  try {
                    const res = await fetch('/api/admin/whatsapp/status?clearLogs=true', { method: 'DELETE' });
                    const data = await res.json();
                    if (data.success) {
                      setConversations([]);
                      setMessages([]);
                      setSelectedConv(null);
                      alert(`Gelöscht: ${data.deleted.messages} Nachrichten, ${data.deleted.conversations} Unterhaltungen, ${data.deleted.logs} Logs`);
                      fetchConversations();
                    } else {
                      alert('Fehler: ' + (data.error || 'Unbekannt'));
                    }
                  } catch (err) { alert('Verbindungsfehler'); }
                  setClearing(false);
                }}
                disabled={clearing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
              >
                {clearing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Alle Daten löschen
              </button>
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className="flex-1 flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-0">
          {/* Sidebar - Conversation List */}
          <div className={`w-96 border-r border-slate-200 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Chat suchen..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="p-4 bg-emerald-50 rounded-full mb-4">
                    <MessageCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Keine Chats</h3>
                  <p className="text-xs text-slate-500">
                    Sobald Kunden dir auf WhatsApp schreiben, erscheinen die Chats hier.
                  </p>
                </div>
              ) : (
                conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full flex items-start gap-3 p-3 hover:bg-slate-50 transition-all text-left border-b border-slate-50 ${
                      selectedConv?.id === conv.id ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {conv.profilePicUrl ? (
                        <img src={conv.profilePicUrl} className="w-12 h-12 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                          {getInitials(conv)}
                        </div>
                      )}
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {getDisplayName(conv)}
                        </span>
                        {conv.lastMessageAt && (
                          <span className={`text-[11px] flex-shrink-0 ${conv.unreadCount > 0 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {conv.aiEnabled && (
                          <Bot className="h-3 w-3 text-violet-400 flex-shrink-0" />
                        )}
                        <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                          {conv.lastMessagePreview || 'Noch keine Nachrichten'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 bg-white">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="md:hidden p-1 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <ArrowLeft className="h-5 w-5 text-slate-500" />
                  </button>
                  {selectedConv.profilePicUrl ? (
                    <img src={selectedConv.profilePicUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(selectedConv)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{getDisplayName(selectedConv)}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedConv.phoneNumber ? `+${selectedConv.phoneNumber}` : selectedConv.remoteJid}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleToggleAI}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        selectedConv.aiEnabled
                          ? 'bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200 border border-slate-200'
                      }`}
                      title={selectedConv.aiEnabled ? 'KI-Assistent deaktivieren' : 'KI-Assistent aktivieren'}
                    >
                      <Bot className="h-3.5 w-3.5" />
                      {selectedConv.aiEnabled ? 'KI An' : 'KI Aus'}
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-[#efeae2]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'p\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1\' fill=\'%23d5cfb8\' opacity=\'0.3\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23p)\'/%3E%3C/svg%3E")' }}>
                  {loadingMessages ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <p className="text-sm text-slate-500 bg-white/80 px-4 py-2 rounded-lg shadow-sm">Noch keine Nachrichten</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-xl px-3 py-2 shadow-sm ${
                            msg.isFromMe
                              ? msg.sender === 'ai'
                                ? 'bg-violet-100 text-violet-900'
                                : 'bg-[#d9fdd3] text-slate-800'
                              : 'bg-white text-slate-800'
                          }`}
                        >
                          {/* Sender label for AI */}
                          {msg.sender === 'ai' && (
                            <div className="flex items-center gap-1 mb-1">
                              <Bot className="h-3 w-3 text-violet-500" />
                              <span className="text-[10px] font-bold text-violet-500">KI-Assistent</span>
                            </div>
                          )}

                          {/* Message type icon */}
                          {msg.messageType !== 'text' && (
                            <div className="flex items-center gap-1 text-slate-400 mb-1">
                              {getMessageTypeIcon(msg.messageType)}
                              <span className="text-[10px] uppercase">{msg.messageType}</span>
                            </div>
                          )}

                          {/* Content */}
                          {msg.content && (
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          )}

                          {/* Timestamp */}
                          <div className={`flex items-center justify-end gap-1 mt-1 ${msg.isFromMe ? 'text-slate-400' : 'text-slate-300'}`}>
                            <span className="text-[10px]">
                              {new Date(msg.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.isFromMe && (
                              msg.isRead
                                ? <CheckCheck className="h-3 w-3 text-blue-500" />
                                : <Check className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="px-4 py-3 border-t border-slate-100 bg-white relative">
                  {/* Template Picker Dropdown */}
                  {showTemplates && templates.length > 0 && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl border border-slate-200 shadow-xl max-h-60 overflow-y-auto z-10">
                      <div className="p-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-500 px-2">Schnellantworten</span>
                      </div>
                      {templates.map(tpl => (
                        <button
                          key={tpl.id}
                          onClick={() => {
                            setNewMessage(tpl.content);
                            setShowTemplates(false);
                            inputRef.current?.focus();
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-all"
                        >
                          <span className="text-sm font-semibold text-slate-700">{tpl.name}</span>
                          {tpl.category && <span className="ml-2 text-[10px] text-slate-400">{tpl.category}</span>}
                          <p className="text-xs text-slate-400 truncate mt-0.5">{tpl.content.substring(0, 80)}...</p>
                        </button>
                      ))}
                    </div>
                  )}
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                    className="flex items-center gap-2"
                  >
                    <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                      <Smile className="h-5 w-5" />
                    </button>
                    {templates.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowTemplates(!showTemplates)}
                        className={`p-2 rounded-lg transition-all ${showTemplates ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                        title="Schnellantworten"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                    )}
                    <input
                      ref={inputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Nachricht schreiben..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      disabled={connectionStatus !== 'open'}
                      onFocus={() => setShowTemplates(false)}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending || connectionStatus !== 'open'}
                      className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
                    >
                      {sending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              /* Empty state - no conversation selected */
              <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 px-8">
                <div className="p-6 bg-emerald-50 rounded-full mb-6">
                  <MessageCircle className="h-16 w-16 text-emerald-300" />
                </div>
                <h2 className="text-xl font-bold text-slate-700 mb-2">WhatsApp für Kreditheld24</h2>
                <p className="text-sm text-slate-400 text-center max-w-sm">
                  Wähle einen Chat aus der Liste, um die Konversation zu öffnen und mit deinen Kunden zu kommunizieren.
                </p>
                {connectionStatus !== 'open' && (
                  <button
                    onClick={() => setShowStatus(true)}
                    className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500 transition-all"
                  >
                    <QrCode className="h-4 w-4" />
                    WhatsApp verbinden
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
