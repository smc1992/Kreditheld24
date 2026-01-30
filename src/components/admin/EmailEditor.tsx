'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Paperclip,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Type,
  ChevronDown,
  Trash2,
  Plus,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface EmailData {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  content: string;
  type: string;
  attachments?: File[];
}

interface EmailEditorProps {
  onSend: (data: EmailData) => void;
  onClose: () => void;
  customerEmail?: string;
  customerName?: string;
  initialTemplate?: 'welcome' | 'case_update' | 'custom';
  initialData?: { subject: string; content: string };
}

export default function EmailEditor({
  onSend,
  onClose,
  customerEmail = '',
  customerName = '',
  initialTemplate = 'custom',
  initialData
}: EmailEditorProps) {
  const [to, setTo] = useState(customerEmail);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [dbTemplates, setDbTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Sync initialData or Template content to editable div
  useEffect(() => {
    if (editorRef.current) {
      // If we have specific initial data, use it.
      // Otherwise check template logic. 
      // Note: We need to avoid overwriting user typing if re-renders happen.
      // But here we rely on 'initialData' or 'initialTemplate' changes.

      let newContent = '';
      if (initialData) {
        newContent = initialData.content;
        setSubject(initialData.subject);
      } else if (initialTemplate !== 'custom') {
        const tpl = templates[initialTemplate];
        newContent = tpl.content;
        setSubject(tpl.subject);
      }

      // Only set if editor is empty or we are explicitly switching?
      // Simple rule: if content state matches newContent, do nothing. 
      // But 'content' state updates on input. 
      // We set innerHTML only if it differs significantly or on mount.
      // For simplicity: We set it once on mount or when template changes.

      if (newContent && editorRef.current.innerHTML !== newContent) {
        editorRef.current.innerHTML = newContent;
        setContent(newContent);
      }
    }
  }, [initialData, initialTemplate, customerName]);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch('/api/admin/email-templates');
      const data = await res.json();
      if (data.success) setDbTemplates(data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const templates = {
    welcome: {
      subject: 'Willkommen bei Kreditheld24',
      content: `Sehr geehrte(r) ${customerName},<br><br>herzlich willkommen bei Kreditheld24! Wir freuen uns, Sie bei Ihrer Finanzierung unterstützen zu dürfen.<br><br>Beste Grüße,<br>Ihr Kreditheld24 Team`
    },
    case_update: {
      subject: 'Update zu Ihrem Kreditantrag',
      content: `Hallo ${customerName},<br><br>es gibt Neuigkeiten zu Ihrem Vorgang. Wir haben den Status aktualisiert.<br><br>Beste Grüße,<br>Ihr Kreditheld24 Team`
    },
    custom: {
      subject: '',
      content: ''
    }
  };

  const loadDbTemplate = (template: any) => {
    setSubject(template.subject);
    let processedContent = template.content;
    if (customerName) {
      processedContent = processedContent.replace(/\[Kundenname\]/g, customerName);
    }
    if (editorRef.current) {
      editorRef.current.innerHTML = processedContent;
    }
    setContent(processedContent);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) editorRef.current.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleInlineImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          execCmd('insertImage', ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const saveAsTemplate = async () => {
    const name = prompt('Bitte geben Sie einen Namen für das Template ein:');
    if (!name) return;
    try {
      const res = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, subject, content, category: 'custom' })
      });
      const result = await res.json();
      if (result.success) {
        alert('Template erfolgreich gespeichert!');
        fetchTemplates();
      } else {
        alert('Fehler beim Speichern: ' + (result.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Fehler beim Speichern des Templates');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className={`bg-white w-full rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 transition-all ${showPreview ? 'max-w-6xl' : 'max-w-3xl'}`}>

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Send className="h-5 w-5 text-emerald-600" />
              E-Mail verfassen
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Rich Text Editor</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showPreview ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
            >
              {showPreview ? 'Vorschau aus' : 'Vorschau an'}
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Editor Column */}
          <div className="flex-1 flex flex-col border-r border-slate-100">
            {/* Recipient Fields */}
            <div className="px-8 py-6 space-y-4 bg-white">
              <div className="flex items-center gap-4 group">
                <div className="flex flex-col w-16 shrink-0 gap-1">
                  <span className="text-sm font-bold text-slate-400 group-focus-within:text-emerald-600 transition-colors">An:</span>
                  <button onClick={() => setShowCcBcc(!showCcBcc)} className="text-[10px] text-slate-400 hover:text-emerald-600 text-left font-medium">CC/BCC</button>
                </div>
                <input type="text" value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 text-sm font-medium text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-300" placeholder="empfaenger@beispiel.de" />
              </div>

              {showCcBcc && (
                <>
                  <div className="h-px bg-slate-100 w-full" />
                  <div className="flex items-center gap-4 group">
                    <span className="text-sm font-bold text-slate-400 w-16 shrink-0 group-focus-within:text-emerald-600 transition-colors">CC:</span>
                    <input type="text" value={cc} onChange={(e) => setCc(e.target.value)} className="flex-1 text-sm font-medium text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-300" />
                  </div>
                  <div className="h-px bg-slate-100 w-full" />
                  <div className="flex items-center gap-4 group">
                    <span className="text-sm font-bold text-slate-400 w-16 shrink-0 group-focus-within:text-emerald-600 transition-colors">BCC:</span>
                    <input type="text" value={bcc} onChange={(e) => setBcc(e.target.value)} className="flex-1 text-sm font-medium text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-300" />
                  </div>
                </>
              )}
              <div className="h-px bg-slate-100 w-full" />
              <div className="flex items-center gap-4 group">
                <span className="text-sm font-bold text-slate-400 w-16 shrink-0 group-focus-within:text-emerald-600 transition-colors">Betreff:</span>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="flex-1 text-sm font-bold text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-300" placeholder="Betreff Ihrer Nachricht..." />
              </div>
            </div>

            {/* Toolbar */}
            <div className="px-8 py-3 bg-slate-50 border-y border-slate-100 flex items-center flex-wrap gap-2 sticky top-0 z-10">
              {/* Templates */}
              {dbTemplates.length > 0 && (
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
                  <div className="relative">
                    <select onChange={(e) => { const tpl = dbTemplates.find(t => t.id === e.target.value); if (tpl) loadDbTemplate(tpl); }} className="text-xs font-bold text-emerald-600 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer appearance-none pr-8">
                      <option value="">Vorlage...</option>
                      {dbTemplates.map(tpl => <option key={tpl.id} value={tpl.id}>{tpl.name}</option>)}
                    </select>
                    <Layout className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-emerald-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Fonts */}
              <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
                <select onChange={(e) => execCmd('fontName', e.target.value)} className="text-xs font-bold text-slate-600 bg-white px-2 py-1.5 rounded-lg border border-slate-200 outline-none cursor-pointer w-24">
                  <option value="sans-serif">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times</option>
                  <option value="Verdana">Verdana</option>
                </select>
                <select onChange={(e) => execCmd('fontSize', e.target.value)} className="text-xs font-bold text-slate-600 bg-white px-2 py-1.5 rounded-lg border border-slate-200 outline-none cursor-pointer w-16">
                  <option value="3">Size</option>
                  <option value="1">Small</option>
                  <option value="3">Normal</option>
                  <option value="5">Large</option>
                  <option value="7">Huge</option>
                </select>
              </div>

              {/* Formatting */}
              <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
                <button onClick={() => execCmd('bold')} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all" title="Fett"><Bold className="h-4 w-4" /></button>
                <button onClick={() => execCmd('italic')} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all" title="Kursiv"><Italic className="h-4 w-4" /></button>
                <button onClick={() => execCmd('underline')} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all" title="Unterstrichen"><Underline className="h-4 w-4" /></button>
              </div>

              {/* Alignment */}
              <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
                <button onClick={() => execCmd('justifyLeft')} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><AlignLeft className="h-4 w-4" /></button>
                <button onClick={() => execCmd('justifyCenter')} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><AlignCenter className="h-4 w-4" /></button>
                <button onClick={() => execCmd('justifyRight')} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><AlignRight className="h-4 w-4" /></button>
              </div>

              {/* Lists */}
              <div className="flex items-center gap-1 border-r border-slate-200 pr-2 mr-2">
                <button onClick={() => execCmd('insertUnorderedList')} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><List className="h-4 w-4" /></button>
                <button onClick={() => execCmd('insertOrderedList')} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><ListOrdered className="h-4 w-4" /></button>
              </div>

              {/* Media */}
              <div className="flex items-center gap-1">
                <label className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all cursor-pointer" title="Anhang hinzufügen">
                  <Paperclip className="h-4 w-4" />
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
                <label className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all cursor-pointer" title="Bild einfügen">
                  <ImageIcon className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleInlineImage} />
                </label>
              </div>
            </div>

            {/* Editable Content Area */}
            <div className="flex-1 overflow-y-auto bg-white min-h-[300px] cursor-text" onClick={() => editorRef.current?.focus()}>
              <div
                ref={editorRef}
                contentEditable
                className="w-full min-h-full p-8 outline-none text-slate-700 leading-relaxed font-sans"
                onInput={handleInput}
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          {/* Preview Column */}
          {showPreview && (
            <div className="w-[450px] bg-slate-50 p-8 flex flex-col animate-in slide-in-from-right-4 duration-300 overflow-hidden border-l border-slate-200">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Live-Vorschau</h3>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden scale-90 origin-top">
                  <div style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif', maxWidth: '600px', margin: '0 auto', background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ background: '#10b981', padding: '30px', textAlign: 'center', color: 'white' }}>
                      <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>Kreditheld24</h1>
                    </div>
                    <div style={{ padding: '40px', color: '#334155', lineHeight: 1.6, fontSize: '16px' }}>
                      {/* Render content directly as it is HTML now */}
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </div>
                    <div style={{ background: '#f8fafc', padding: '20px', textAlign: 'center', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#94a3b8' }}>
                      &copy; {new Date().getFullYear()} Kreditheld24. Alle Rechte vorbehalten.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attachments List */}
        {attachments.length > 0 && (
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Anhänge ({attachments.length})</h4>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm group">
                  <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                    <span className="text-[9px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                  </div>
                  <button onClick={() => removeAttachment(i)} className="ml-1 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={saveAsTemplate} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Als Template speichern
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
              Verwerfen
            </button>
            <button
              onClick={() => onSend({ to, cc, bcc, subject, content, type: 'custom', attachments })}
              disabled={!to || !subject || !content}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="h-4 w-4" />
              E-Mail senden
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
