'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import {
  Megaphone, Send, Loader2, CheckCircle, XCircle,
  Users, Search, Check, ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';

interface Contact {
  id: string;
  pushName: string | null;
  phoneNumber: string | null;
  remoteJid: string;
  profilePicUrl: string | null;
  lastMessageAt: string | null;
}

interface SendResult {
  contactId: string;
  name: string;
  success: boolean;
  error?: string;
}

export default function BroadcastPage() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<SendResult[] | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch('/api/admin/whatsapp/broadcast')
      .then(r => r.json())
      .then(data => {
        if (data.success) setContacts(data.contacts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  const filteredContacts = contacts.filter(c => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (c.pushName?.toLowerCase().includes(s)) || (c.phoneNumber?.includes(s));
  });

  const toggleContact = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filteredContacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const handleSend = async () => {
    if (!message.trim() || selected.size === 0) return;
    if (!confirm(`Nachricht an ${selected.size} Kontakt(e) senden?`)) return;

    setSending(true);
    setResults(null);
    try {
      const res = await fetch('/api/admin/whatsapp/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, contactIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
      } else {
        alert('Fehler: ' + (data.error || 'Unbekannt'));
      }
    } catch (err) {
      alert('Verbindungsfehler');
    }
    setSending(false);
  };

  if (!session) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/whatsapp" className="p-2 hover:bg-slate-100 rounded-lg transition-all">
            <ChevronLeft className="h-5 w-5 text-slate-400" />
          </Link>
          <div className="p-2 bg-emerald-50 rounded-xl">
            <Megaphone className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Broadcast</h1>
            <p className="text-sm text-slate-500">Nachricht an mehrere Kontakte senden</p>
          </div>
        </div>

        {/* Results Panel */}
        {results && (
          <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Ergebnis: {results.filter(r => r.success).length}/{results.length} gesendet
            </h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.map(r => (
                <div key={r.contactId} className="flex items-center gap-3 py-2">
                  {r.success ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <span className="text-sm text-slate-700">{r.name}</span>
                  {r.error && <span className="text-xs text-red-400 ml-auto">{r.error}</span>}
                </div>
              ))}
            </div>
            <button
              onClick={() => { setResults(null); setSelected(new Set()); setMessage(''); }}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-all"
            >
              Neuer Broadcast
            </button>
          </div>
        )}

        {!results && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Contact Selection - 3 cols */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-600" />
                    Empfänger ({selected.size}/{contacts.length})
                  </span>
                  <button
                    onClick={toggleAll}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-500"
                  >
                    {selected.size === filteredContacts.length ? 'Keine auswählen' : 'Alle auswählen'}
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Kontakte suchen..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-50">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="py-12 text-center text-sm text-slate-400">Keine Kontakte gefunden</div>
                ) : (
                  filteredContacts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => toggleContact(c.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-all ${
                        selected.has(c.id) ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        selected.has(c.id)
                          ? 'bg-emerald-600 border-emerald-600'
                          : 'border-slate-300'
                      }`}>
                        {selected.has(c.id) && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(c.pushName || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900 truncate">{c.pushName || 'Unbekannt'}</div>
                        <div className="text-xs text-slate-400">+{c.phoneNumber || c.remoteJid}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Message + Send - 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Nachricht</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Broadcast-Nachricht eingeben...

Tipp: Verwende Emojis und halte die Nachricht kurz."
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                />
                <div className="mt-2 text-xs text-slate-400 text-right">
                  {message.length} Zeichen
                </div>
              </div>

              {/* Preview */}
              {message.trim() && (
                <div className="bg-[#efeae2] rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-slate-500 mb-2">VORSCHAU</p>
                  <div className="bg-[#d9fdd3] rounded-xl px-3 py-2 shadow-sm max-w-xs ml-auto">
                    <p className="text-sm whitespace-pre-wrap text-slate-800">{message}</p>
                    <span className="text-[10px] text-slate-400 float-right mt-1">jetzt ✓✓</span>
                  </div>
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!message.trim() || selected.size === 0 || sending}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Wird gesendet ({selected.size} Kontakte)...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    An {selected.size} Kontakt{selected.size !== 1 ? 'e' : ''} senden
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
