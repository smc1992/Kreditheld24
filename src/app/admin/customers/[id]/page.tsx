'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import EmailEditor from '@/components/admin/EmailEditor';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Calendar,
  Plus,
  ChevronRight,
  Globe,
  Heart,
  Baby,
  Send,
  Loader2,
  AlertCircle,
  FileText,
  Download,
  Paperclip,
  Clock,
  X,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';

export default function CustomerDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [notes, setNotes] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [emailType, setEmailType] = useState<'welcome' | 'case_update' | 'custom'>('custom');
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'activities'>('overview');

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Möchten Sie diese Aktivität wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/admin/activities/${activityId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setActivities(prev => prev.filter(a => a.id !== activityId));
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Möchten Sie dieses Dokument wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/admin/documents/${docId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  useEffect(() => {
    if (!session || !params?.id) {
      return;
    }

    Promise.all([
      fetch(`/api/admin/customers/${params.id}`).then(res => res.json()),
      fetch(`/api/admin/cases?customerId=${params.id}`).then(res => res.json()),
      fetch(`/api/admin/customers/${params.id}/documents`).then(res => res.json()),
      fetch(`/api/admin/activities?customerId=${params.id}`).then(res => res.json()),
    ])
      .then(([customerRes, casesRes, docsRes, activitiesRes]) => {
        if (customerRes.success) {
          setCustomer(customerRes.data);
          setNotes(customerRes.data.notes || '');
        }
        if (casesRes.success) {
          setCases(casesRes.data.map((item: any) => ({
            ...item.case,
            customer: item.customer
          })));
        }
        if (docsRes.success) {
          setDocuments(docsRes.data);
        }
        if (activitiesRes.success) {
          setActivities(activitiesRes.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customer details:', err);
        setLoading(false);
      });
  }, [session, params?.id]);

  const handleSaveNotes = async () => {
    if (!params?.id) return;
    setSavingNotes(true);
    try {
      const response = await fetch(`/api/admin/customers/${params.id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const result = await response.json();
      if (result.success) {
        // Optional: Show success toast
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !params?.id) return;

    setUploadingDoc(true);
    try {
      const mockFileUrl = `/uploads/${file.name}`;

      const response = await fetch(`/api/admin/customers/${params.id}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          fileUrl: mockFileUrl,
          fileSize: file.size,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setDocuments(prev => [result.data, ...prev]);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploadingDoc(false);
    }
  };

  const sendEmail = async (emailData: any) => {
    if (!customer.email) {
      alert('Kunde hat keine E-Mail-Adresse hinterlegt');
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailData.to,
          type: 'custom',
          data: {
            customerId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            advisorName: session?.user?.name || 'Ihr Kreditheld24 Team',
            message: emailData.content,
            subject: emailData.subject,
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('E-Mail erfolgreich versendet!');
        setShowEmailEditor(false);
        // Refresh activities
        if (params?.id) {
          const actRes = await fetch(`/api/admin/activities?customerId=${params.id}`).then(res => res.json());
          if (actRes.success) setActivities(actRes.data);
        }
      } else {
        alert('Fehler beim Versenden: ' + (result.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('Fehler beim Versenden der E-Mail');
    } finally {
      setSendingEmail(false);
    }
  };

  const [creatingCase, setCreatingCase] = useState(false);

  const handleCreateEuropaceCase = async () => {
    const isLive = confirm(`ACHTUNG: Möchten Sie für ${customer.firstName} ${customer.lastName} einen ECHTEN Privatkredit-Vorgang bei Starpool/Europace anlegen? (Klicken Sie Abbrechen für Test-Modus)`);

    // If they clicked OK, isLive is true -> Live/Echtgeschäft
    // If they clicked Cancel, we ask if they want a Test case
    let confirmed = isLive;
    let liveMode = true;

    if (!isLive) {
      if (confirm(`Soll stattdessen ein TEST-Vorgang angelegt werden?`)) {
        confirmed = true;
        liveMode = false;
      }
    }

    if (!confirmed) return;

    setCreatingCase(true);
    try {
      const response = await fetch('/api/admin/europace/create-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          live: liveMode
        }),
      });
      const result = await response.json();

      if (result.success) {
        alert(`Vorgang erfolgreich angelegt (${liveMode ? 'ECHT' : 'TEST'})! Vorgangsnummer: ${result.vorgangsNummer}`);
        // Refresh cases/customer data
        // For now, we reload the page or fetch details again
        window.location.reload();
      } else {
        alert('Fehler beim Anlegen: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Ein Fehler ist aufgetreten.');
    } finally {
      setCreatingCase(false);
    }
  };

  if (!session) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Kunde nicht gefunden</h2>
          <Link href="/admin/customers" className="mt-4 text-emerald-600 hover:underline font-medium inline-block">
            Zurück zur Übersicht
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/customers"
              className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {customer.firstName} {customer.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  ID: {customer.id.substring(0, 8)}...
                </span>
                <span className="text-sm text-slate-400">•</span>
                <span className="text-sm text-slate-500">Erstellt am {new Date(customer.createdAt).toLocaleDateString('de-DE')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/customers/${params?.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 transition-all"
            >
              <Edit className="h-4 w-4" />
              Bearbeiten
            </Link>
            <button
              onClick={() => {
                setEmailType('custom');
                setShowEmailEditor(true);
              }}
              disabled={!customer.email || sendingEmail}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              E-Mail schreiben
            </button>
            <button
              onClick={handleCreateEuropaceCase}
              disabled={creatingCase}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creatingCase ? <Loader2 className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
              Privatkredit anlegen
            </button>
            <Link
              href={`/admin/cases/new?customerId=${params?.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              Neuer Vorgang
            </Link>
          </div>
        </div>

        {/* E-Mail Editor Overlay */}
        {showEmailEditor && (
          <EmailEditor
            onSend={sendEmail}
            onClose={() => setShowEmailEditor(false)}
            customerEmail={customer.email}
            customerName={`${customer.firstName} ${customer.lastName}`}
            initialTemplate={emailType}
          />
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: 'overview', label: 'Übersicht', icon: User },
            { id: 'notes', label: 'Notizen & Dokumente', icon: FileText },
            { id: 'activities', label: 'Aktivitäten', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 -mb-px ${activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Notes Summary Card */}
                <div
                  onClick={() => setActiveTab('notes')}
                  className="bg-emerald-600 rounded-3xl p-8 shadow-2xl shadow-emerald-600/20 text-white relative overflow-hidden group cursor-pointer hover:bg-emerald-500 transition-all"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Beratungs-Notiz (Vorschau)
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                        Bearbeiten
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="text-sm text-emerald-50 leading-relaxed italic line-clamp-3">
                      {notes || 'Keine Notizen vorhanden. Klicken Sie hier zum Bearbeiten.'}
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700" />
                </div>

                {/* Personal Data Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-emerald-600" />
                      Persönliche Daten
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vorname</span>
                        <span className="text-sm font-medium text-slate-900">{customer.firstName}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nachname</span>
                        <span className="text-sm font-medium text-slate-900">{customer.lastName}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Geburtsdatum</span>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {customer.birthDate ? new Date(customer.birthDate).toLocaleDateString('de-DE') : '-'}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Staatsangehörigkeit</span>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                          <Globe className="h-4 w-4 text-slate-400" />
                          {customer.nationality || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cases List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-emerald-600" />
                      Vorgänge ({cases.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {cases.length > 0 ? (
                      cases.map((caseItem: any) => (
                        <Link
                          key={caseItem.id}
                          href={`/admin/cases/${caseItem.id}`}
                          className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">
                                {caseItem.caseNumber}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                {caseItem.bank || 'Keine Bank'} • {caseItem.requestedAmount ? `${parseFloat(caseItem.requestedAmount).toLocaleString('de-DE')} €` : '-'}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))
                    ) : (
                      <div className="p-12 text-center text-slate-500 italic text-sm">Keine Vorgänge vorhanden.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Kontaktinformationen</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">E-Mail</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{customer.email || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Telefon</p>
                        <p className="text-sm font-bold text-slate-900">{customer.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Adresse</p>
                        <p className="text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-wrap">{customer.address || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 overflow-hidden relative group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      Beratungs-Notiz
                    </h3>
                    <div className="flex items-center gap-3">
                      {savingNotes && (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-pulse">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Speichert...
                        </div>
                      )}
                      <button
                        onClick={handleSaveNotes}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                      >
                        Speichern
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Hier wichtige Notizen zum Beratungsgespräch festhalten..."
                    className="w-full h-[400px] bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Unterlagen</h3>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all">
                      <Plus className="h-3.5 w-3.5" />
                      Upload
                      <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploadingDoc} />
                    </label>
                  </div>

                  <div className="space-y-3">
                    {documents.length > 0 ? (
                      documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-emerald-100 hover:bg-slate-50/50 transition-all group">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-700 truncate">{doc.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => window.open(doc.fileUrl, '_blank')}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Vorschau öffnen"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <a href={doc.fileUrl} download className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Herunterladen">
                              <Download className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Löschen"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 italic text-xs">Noch keine Unterlagen.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 overflow-hidden max-w-3xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Aktivitäten & Verlauf</h3>
              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={activity.id} className="relative flex gap-4 group">
                      {index !== activities.length - 1 && <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-100" />}
                      <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:text-emerald-600 transition-all shrink-0 z-10">
                        {activity.type === 'email' ? <Mail className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 pb-6 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-bold text-slate-800 truncate">{activity.subject}</p>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Löschen"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activity.description}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-2">
                          {new Date(activity.date).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 italic text-xs">Keine Aktivitäten verzeichnet.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
