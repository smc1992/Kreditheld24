'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import EmailEditor from '@/components/admin/EmailEditor';
import { 
  Mail, 
  Inbox, 
  Send, 
  Trash2, 
  Search, 
  Plus, 
  ChevronRight,
  Clock,
  Filter,
  Users,
  Layout,
  Star,
  Archive,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

type MailFolder = 'inbox' | 'sent' | 'trash' | 'templates';

interface EmailItem {
  id: string;
  sender?: string;
  recipient: string;
  subject: string;
  preview: string;
  htmlContent?: string;
  textContent?: string;
  date: string;
  status: 'read' | 'unread' | 'sent' | 'received' | 'failed';
  hasAttachment: boolean;
  starred: boolean;
}

export default function EmailModule() {
  const { data: session } = useSession();
  const [activeFolder, setActiveFolder] = useState<MailFolder>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMail, setSelectedMail] = useState<EmailItem | null>(null);
  const [showEditor, setShowEmailEditor] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [initialData, setInitialData] = useState<{subject: string, content: string} | undefined>(undefined);

  // Fallback für initiale Anzeige oder falls API noch leer ist
  const mockEmails: EmailItem[] = [
    {
      id: '1',
      sender: 'Kreditheld24 Team',
      recipient: 'simon@mueller.de',
      subject: 'Willkommen bei Kreditheld24',
      preview: 'Sehr geehrter Herr Müller, herzlich willkommen bei Kreditheld24...',
      date: '2026-01-26T14:30:00Z',
      status: 'read',
      hasAttachment: false,
      starred: true
    }
  ];

  useEffect(() => {
    if (activeFolder === 'templates') {
      fetchTemplates();
    } else {
      fetchEmails();
    }
  }, [activeFolder]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/emails?folder=${activeFolder}`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setEmails(data.data);
      } else {
        // Falls keine echten Mails da sind, zeigen wir im Demo-Modus die Mock-Mails
        setEmails(mockEmails);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setEmails(mockEmails);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch('/api/admin/email-templates');
      const data = await res.json();
      if (data.success) setTemplates(data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSendEmail = async (emailData: any) => {
    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailData.to,
          type: 'custom',
          data: {
            subject: emailData.subject,
            message: emailData.content,
            advisorName: session?.user?.name || 'Kreditheld24 Team'
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('E-Mail erfolgreich versendet!');
        setShowEmailEditor(false);
        setActiveFolder('sent');
        fetchEmails();
      } else {
        alert('Fehler: ' + result.error);
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('Fehler beim Versenden der E-Mail');
    }
  };

  const openTemplateInEditor = (tpl: any) => {
    setInitialData({ subject: tpl.subject, content: tpl.content });
    setBulkMode(false);
    setShowEmailEditor(true);
  };

  const deleteTemplate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Möchten Sie dieses Template wirklich löschen?')) return;

    try {
      const res = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setTemplates(templates.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  if (!session) return null;

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMails = emails.filter((m: EmailItem) => 
    m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sender?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
              <Mail className="h-8 w-8 text-emerald-600" />
              E-Mail Center
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Verwalten Sie Ihre Kommunikation und nutzen Sie den Bulk-Versand.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setBulkMode(true);
                setInitialData(undefined);
                setShowEmailEditor(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all"
            >
              <Users className="h-4 w-4 text-emerald-600" />
              Bulk-Versand
            </button>
            <button
              onClick={() => {
                setBulkMode(false);
                setInitialData(undefined);
                setShowEmailEditor(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              E-Mail verfassen
            </button>
          </div>
        </div>

        {/* Email Interface */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex">
          
          {/* Sidebar Navigation */}
          <div className="w-64 border-r border-slate-100 flex flex-col bg-slate-50/30">
            <nav className="p-4 space-y-1">
              {[
                { id: 'inbox', name: 'Posteingang', icon: Inbox, count: 0 },
                { id: 'sent', name: 'Gesendet', icon: Send, count: mockEmails.length },
                { id: 'templates', name: 'Vorlagen', icon: Layout, count: templates.length },
                { id: 'trash', name: 'Papierkorb', icon: Trash2, count: 0 },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveFolder(item.id as MailFolder);
                    setSelectedMail(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeFolder === item.id 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                  {item.id === 'sent' && emails.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      activeFolder === item.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {emails.length}
                    </span>
                  )}
                  {item.id === 'templates' && templates.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      activeFolder === item.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {templates.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-auto p-6">
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Speicherplatz</p>
                <div className="h-1.5 w-full bg-emerald-200 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-emerald-600 rounded-full" />
                </div>
                <p className="text-[10px] text-emerald-600 font-bold mt-2">2.4 GB von 10 GB genutzt</p>
              </div>
            </div>
          </div>

          {/* Mail List */}
          <div className="w-96 border-r border-slate-100 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder={`${activeFolder === 'templates' ? 'Vorlagen' : 'E-Mails'} durchsuchen...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {activeFolder === 'templates' ? (
                filteredTemplates.length > 0 ? (
                  filteredTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => openTemplateInEditor(tpl)}
                      className="p-5 cursor-pointer transition-all hover:bg-emerald-50/30 border-l-4 border-transparent hover:border-emerald-500 group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {tpl.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => deleteTemplate(e, tpl.id)}
                            className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          <ChevronRight className="h-3 w-3 text-slate-300 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{tpl.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">{tpl.subject}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 italic">Keine Vorlagen gefunden</div>
                )
              ) : (
                filteredMails.length > 0 ? (
                  filteredMails.map((mail: EmailItem) => (
                    <div
                      key={mail.id}
                      onClick={() => setSelectedMail(mail)}
                      className={`p-5 cursor-pointer transition-all hover:bg-slate-50 relative group ${
                        selectedMail?.id === mail.id ? 'bg-emerald-50/50 border-l-4 border-emerald-500' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-black uppercase tracking-wider ${mail.status === 'unread' ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {mail.recipient.split('@')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {new Date(mail.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className={`text-sm truncate pr-4 ${mail.status === 'unread' ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                        {mail.subject}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">
                        {mail.preview}
                      </p>
                      
                      <div className="mt-3 flex items-center gap-3">
                        {mail.hasAttachment && <Paperclip className="h-3 w-3 text-slate-300" />}
                        {mail.starred && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 italic">Keine E-Mails gefunden</div>
                )
              )}
            </div>
          </div>

          {/* Mail Content Area */}
          <div className="flex-1 bg-white flex flex-col">
            {selectedMail ? (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Mail Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xl border border-slate-200 shadow-sm">
                      {(selectedMail.sender || selectedMail.recipient)[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedMail.subject}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400 font-bold">Von:</span>
                        <span className="text-xs text-emerald-600 font-black tracking-tight">{selectedMail.sender || 'Kreditheld24'}</span>
                        <span className="text-xs text-slate-400 font-bold ml-2">An:</span>
                        <span className="text-xs text-slate-600 font-bold">{selectedMail.recipient}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200">
                      <Star className={`h-5 w-5 ${selectedMail.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setInitialData({ subject: `Re: ${selectedMail.subject}`, content: '' });
                        setShowEmailEditor(true);
                      }}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/20"
                    >
                      Antworten
                    </button>
                  </div>
                </div>

                {/* Mail Body */}
                <div className="flex-1 overflow-y-auto p-12">
                  <div className="max-w-3xl bg-slate-50/50 rounded-3xl p-10 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200/50">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nachricht</span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {new Date(selectedMail.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-medium">
                      {selectedMail.htmlContent ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedMail.htmlContent }} />
                      ) : (
                        <p className="whitespace-pre-wrap">{selectedMail.textContent || selectedMail.preview}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 shadow-inner border border-slate-100">
                  <Mail className="h-10 w-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Postfach</h3>
                <p className="text-slate-400 text-sm mt-3 max-w-xs leading-relaxed font-medium italic">
                  Wählen Sie eine E-Mail oder Vorlage aus, um die Details anzuzeigen.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Editor Integration */}
      {showEditor && (
        <EmailEditor
          onSend={handleSendEmail}
          onClose={() => setShowEmailEditor(false)}
          customerEmail={bulkMode ? 'Alle ausgewählten Kunden' : undefined}
          initialData={initialData}
        />
      )}
    </DashboardLayout>
  );
}
