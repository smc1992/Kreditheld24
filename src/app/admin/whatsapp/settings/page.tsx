'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import {
  Settings, Bot, BarChart3, MessageSquareText, Link2, Loader2,
  Save, RotateCcw, Plus, Trash2, Edit, CheckCircle, XCircle,
  TrendingUp, FileText, AlertCircle, Search, Tag,
} from 'lucide-react';

type TabType = 'settings' | 'stats' | 'templates' | 'matching';

interface Stats {
  ki_replies: { total: number; success: number; failed: number };
  credit_detections: { total: number; success: number; failed: number };
  doc_forwards: { total: number; success: number; failed: number };
  errors: { total: number; success: number; failed: number };
}

interface LogEntry {
  id: string;
  type: string;
  conversationId: string | null;
  remoteJid: string | null;
  success: boolean;
  details: string | null;
  metadata: any;
  createdAt: string;
}

interface Template {
  id: string;
  name: string;
  category: string | null;
  content: string;
  sortOrder: number;
}

interface MatchSuggestion {
  conversation: { id: string; pushName: string | null; phoneNumber: string | null; remoteJid: string };
  matches: Array<{ id: string; firstName: string; lastName: string; phone: string | null; email: string | null }>;
}

export default function WhatsAppSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('settings');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({});

  // Stats state
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [statsPeriod, setStatsPeriod] = useState('7d');

  // Templates state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', category: 'allgemein', content: '' });
  const [showNewForm, setShowNewForm] = useState(false);

  // Matching state
  const [matchSuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>([]);
  const [totalUnlinked, setTotalUnlinked] = useState(0);

  // Load settings
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/settings');
      const data = await res.json();
      if (data.success) setSettings(data.settings);
    } catch (err) { console.error('Error loading settings:', err); }
    finally { setLoading(false); }
  }, []);

  // Load stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/whatsapp/stats?period=${statsPeriod}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setLogs(data.logs);
      }
    } catch (err) { console.error('Error loading stats:', err); }
  }, [statsPeriod]);

  // Load templates
  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/templates');
      const data = await res.json();
      if (data.success) setTemplates(data.templates);
    } catch (err) { console.error('Error loading templates:', err); }
  }, []);

  // Load matching
  const fetchMatching = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/whatsapp/matching');
      const data = await res.json();
      if (data.success) {
        setMatchSuggestions(data.suggestions);
        setTotalUnlinked(data.totalUnlinked);
      }
    } catch (err) { console.error('Error loading matching:', err); }
  }, []);

  useEffect(() => {
    if (!session) return;
    fetchSettings();
  }, [session, fetchSettings]);

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'templates') fetchTemplates();
    if (activeTab === 'matching') fetchMatching();
  }, [activeTab, fetchStats, fetchTemplates, fetchMatching]);

  // Save settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/whatsapp/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (data.success) alert('Einstellungen gespeichert!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Fehler beim Speichern');
    }
    setSaving(false);
  };

  // Template CRUD
  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) return;
    try {
      const res = await fetch('/api/admin/whatsapp/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate),
      });
      const data = await res.json();
      if (data.success) {
        setTemplates(prev => [...prev, data.template]);
        setNewTemplate({ name: '', category: 'allgemein', content: '' });
        setShowNewForm(false);
      }
    } catch (err) { console.error('Error creating template:', err); }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Vorlage löschen?')) return;
    try {
      await fetch(`/api/admin/whatsapp/templates?id=${id}`, { method: 'DELETE' });
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) { console.error('Error deleting template:', err); }
  };

  // Link conversation to customer
  const handleLinkCustomer = async (conversationId: string, customerId: string) => {
    try {
      await fetch(`/api/admin/whatsapp/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      });
      setMatchSuggestions(prev => prev.filter(s => s.conversation.id !== conversationId));
      setTotalUnlinked(prev => prev - 1);
    } catch (err) { console.error('Error linking customer:', err); }
  };

  // Parse keywords
  const getKeywords = (): string[] => {
    try {
      return JSON.parse(settings.credit_keywords || '[]');
    } catch { return []; }
  };
  const setKeywords = (kws: string[]) => {
    setSettings(s => ({ ...s, credit_keywords: JSON.stringify(kws) }));
  };
  const [newKeyword, setNewKeyword] = useState('');

  if (!session) return null;

  const tabs = [
    { id: 'settings' as const, label: 'Einstellungen', icon: Settings },
    { id: 'stats' as const, label: 'Statistiken & Logs', icon: BarChart3 },
    { id: 'templates' as const, label: 'Antwort-Vorlagen', icon: MessageSquareText },
    { id: 'matching' as const, label: 'Kunden-Matching', icon: Link2 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-violet-50 rounded-xl">
            <Bot className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">WhatsApp Automation</h1>
            <p className="text-sm text-slate-500">KI-Einstellungen, Statistiken, Vorlagen & Matching</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'matching' && totalUnlinked > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{totalUnlinked}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /></div>
            ) : (
              <>
                {/* Global AI Toggle */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Bot className="h-5 w-5 text-violet-600" /> KI-Assistent Global
                  </h2>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      className={`relative w-12 h-6 rounded-full transition-all ${settings.global_ai_enabled === 'true' ? 'bg-violet-600' : 'bg-slate-300'}`}
                      onClick={() => setSettings(s => ({ ...s, global_ai_enabled: s.global_ai_enabled === 'true' ? 'false' : 'true' }))}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.global_ai_enabled === 'true' ? 'translate-x-6' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {settings.global_ai_enabled === 'true' ? 'KI-Antworten sind global aktiv' : 'KI-Antworten sind deaktiviert'}
                    </span>
                  </label>
                </div>

                {/* System Prompt */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MessageSquareText className="h-5 w-5 text-violet-600" /> System-Prompt
                  </h2>
                  <p className="text-sm text-slate-500 mb-3">Definiere den Charakter und die Regeln für den KI-Assistenten. Verwende <code className="bg-slate-100 px-1.5 py-0.5 rounded text-violet-600">{'{CONTEXT}'}</code> als Platzhalter für RAG-Inhalte.</p>
                  <textarea
                    value={settings.system_prompt || ''}
                    onChange={(e) => setSettings(s => ({ ...s, system_prompt: e.target.value }))}
                    rows={12}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y"
                  />
                </div>

                {/* Model & Temperature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">KI-Modell</h3>
                    <select
                      value={settings.model || 'gpt-4o-mini'}
                      onChange={(e) => setSettings(s => ({ ...s, model: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="gpt-4o-mini">GPT-4o Mini (schnell, günstig)</option>
                      <option value="gpt-4o">GPT-4o (präziser, teurer)</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (legacy)</option>
                    </select>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Temperatur: {settings.temperature || '0.7'}</h3>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.temperature || '0.7'}
                      onChange={(e) => setSettings(s => ({ ...s, temperature: e.target.value }))}
                      className="w-full accent-violet-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0 = Präzise</span>
                      <span>1 = Kreativ</span>
                    </div>
                  </div>
                </div>

                {/* Credit Keywords */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-violet-600" /> Kreditanfrage-Keywords
                  </h2>
                  <p className="text-sm text-slate-500 mb-3">Nachrichten mit diesen Keywords werden automatisch als Kreditanfrage erkannt und ein CRM-Case erstellt.</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getKeywords().map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-semibold">
                        {kw}
                        <button
                          onClick={() => setKeywords(getKeywords().filter((_, j) => j !== i))}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newKeyword.trim()) {
                          setKeywords([...getKeywords(), newKeyword.trim().toLowerCase()]);
                          setNewKeyword('');
                        }
                      }}
                      placeholder="Neues Keyword eingeben..."
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <button
                      onClick={() => {
                        if (newKeyword.trim()) {
                          setKeywords([...getKeywords(), newKeyword.trim().toLowerCase()]);
                          setNewKeyword('');
                        }
                      }}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-500 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-500 transition-all disabled:opacity-50 shadow-lg shadow-violet-600/20"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Einstellungen speichern
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Period selector */}
            <div className="flex gap-2">
              {(['24h', '7d', '30d'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setStatsPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    statsPeriod === p ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p === '24h' ? '24 Stunden' : p === '7d' ? '7 Tage' : '30 Tage'}
                </button>
              ))}
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={Bot} label="KI-Antworten" stats={stats.ki_replies} color="violet" />
                <StatCard icon={TrendingUp} label="Kreditanfragen" stats={stats.credit_detections} color="emerald" />
                <StatCard icon={FileText} label="Dokumente" stats={stats.doc_forwards} color="blue" />
                <StatCard icon={AlertCircle} label="Fehler" stats={stats.errors} color="red" />
              </div>
            )}

            {/* Logs Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Automations-Log</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600">Typ</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Details</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Kontakt</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Zeit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {logs.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">Noch keine Automations-Events</td></tr>
                    ) : (
                      logs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${
                              log.type === 'ki_reply' ? 'bg-violet-50 text-violet-600' :
                              log.type === 'credit_detection' ? 'bg-emerald-50 text-emerald-600' :
                              log.type === 'doc_forward' ? 'bg-blue-50 text-blue-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {log.type === 'ki_reply' ? '🤖 KI' :
                               log.type === 'credit_detection' ? '📋 Kredit' :
                               log.type === 'doc_forward' ? '📎 Dokument' : '⚠️ Fehler'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {log.success ? (
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                          <td className="px-4 py-3 text-slate-400 text-xs font-mono">{log.remoteJid?.replace('@s.whatsapp.net', '') || '-'}</td>
                          <td className="px-4 py-3 text-slate-400 text-xs">
                            {new Date(log.createdAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Schnellantworten</h2>
              <button
                onClick={() => setShowNewForm(!showNewForm)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-500 transition-all"
              >
                <Plus className="h-4 w-4" /> Neue Vorlage
              </button>
            </div>

            {/* New template form */}
            {showNewForm && (
              <div className="bg-white rounded-2xl border border-violet-200 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(t => ({ ...t, name: e.target.value }))}
                    placeholder="Name der Vorlage"
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(t => ({ ...t, category: e.target.value }))}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="begrüßung">Begrüßung</option>
                    <option value="unterlagen">Unterlagen</option>
                    <option value="termin">Termin</option>
                    <option value="allgemein">Allgemein</option>
                  </select>
                </div>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(t => ({ ...t, content: e.target.value }))}
                  placeholder="Nachrichtentext..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowNewForm(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm">Abbrechen</button>
                  <button
                    onClick={handleCreateTemplate}
                    disabled={!newTemplate.name || !newTemplate.content}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-500 transition-all disabled:opacity-50"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            )}

            {/* Templates list */}
            {templates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <MessageSquareText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-700 mb-1">Keine Vorlagen</h3>
                <p className="text-xs text-slate-400">Erstelle Schnellantworten für häufige Kundenanfragen</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {templates.map(tpl => (
                  <div key={tpl.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4 hover:border-violet-200 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{tpl.name}</span>
                        {tpl.category && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{tpl.category}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 whitespace-pre-wrap line-clamp-2">{tpl.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'matching' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-violet-600" />
                Kunden-Matching
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                {totalUnlinked} WhatsApp-Kontakte sind nicht mit CRM-Kunden verknüpft.
                {matchSuggestions.length > 0 && ` ${matchSuggestions.length} Vorschläge gefunden.`}
              </p>

              {matchSuggestions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-emerald-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Alle Kontakte sind verknüpft!</p>
                  <p className="text-xs text-slate-400 mt-1">Keine offenen Matching-Vorschläge</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matchSuggestions.map(suggestion => (
                    <div key={suggestion.conversation.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm font-bold text-slate-900">{suggestion.conversation.pushName || 'Unbekannt'}</span>
                          <span className="ml-2 text-xs text-slate-400">+{suggestion.conversation.phoneNumber}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {suggestion.matches.map(match => (
                          <div key={match.id} className="flex items-center justify-between bg-emerald-50/50 rounded-lg px-3 py-2">
                            <div>
                              <span className="text-sm font-semibold text-slate-700">{match.firstName} {match.lastName}</span>
                              <span className="ml-2 text-xs text-slate-400">{match.phone || match.email}</span>
                            </div>
                            <button
                              onClick={() => handleLinkCustomer(suggestion.conversation.id, match.id)}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-all"
                            >
                              Verknüpfen
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Stats card component
function StatCard({ icon: Icon, label, stats, color }: {
  icon: any;
  label: string;
  stats: { total: number; success: number; failed: number };
  color: string;
}) {
  const colors: Record<string, { bg: string; text: string; icon: string }> = {
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', icon: 'text-violet-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'text-emerald-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
    red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600' },
  };
  const c = colors[color] || colors.violet;

  return (
    <div className={`${c.bg} rounded-2xl p-5`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-5 w-5 ${c.icon}`} />
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${c.text}`}>{stats.total}</div>
      <div className="flex gap-3 mt-2 text-xs">
        <span className="text-emerald-600">✓ {stats.success}</span>
        {stats.failed > 0 && <span className="text-red-500">✗ {stats.failed}</span>}
      </div>
    </div>
  );
}
