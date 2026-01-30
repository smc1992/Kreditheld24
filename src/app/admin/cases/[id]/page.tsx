'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import CaseMessaging from '@/components/admin/CaseMessaging';
import Link from 'next/link';
import {
  ArrowLeft,
  Briefcase,
  User,
  Building2,
  Euro,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Activity as ActivityIcon,
  Paperclip,
  MoreVertical,
  Plus,
  ChevronRight,
  Mail,
  Phone,
  Loader2,
  Save,
  Download,
  X,
  Eye,
  Trash2
} from 'lucide-react';

export default function CaseDetailsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'activities' | 'documents' | 'messages'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'note',
    subject: '',
    description: ''
  });

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

  const handleCreateActivity = async () => {
    try {
      const res = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newActivity,
          caseId: params.id,
          customerId: caseData.customerId,
          date: new Date()
        })
      });
      const result = await res.json();
      if (result.success) {
        setActivities(prev => [result.data, ...prev]);
        setShowActivityModal(false);
        setNewActivity({ type: 'note', subject: '', description: '' });
      }
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  const handleUpdateCase = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/cases/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const result = await response.json();
      if (result.success) {
        setCaseData(result.data);
        setIsEditing(false);
        const actRes = await fetch(`/api/admin/activities?caseId=${params.id}`).then(res => res.json());
        if (actRes.success) setActivities(actRes.data);
      }
    } catch (error) {
      console.error('Error updating case:', error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === 'loading' || !params.id) {
      return;
    }

    if (sessionStatus === 'authenticated') {
      Promise.all([
        fetch(`/api/admin/cases/${params.id}`).then(res => res.json()),
        fetch(`/api/admin/activities?caseId=${params.id}`).then(res => res.json()),
        fetch(`/api/admin/documents?caseId=${params.id}`).then(res => res.json()),
      ])
        .then(([caseRes, activitiesRes, documentsRes]) => {
          if (caseRes.success) {
            setCaseData(caseRes.data);
            setEditData(caseRes.data);
          }
          if (activitiesRes.success) {
            setActivities(activitiesRes.data);
          }
          if (documentsRes.success) {
            setDocuments(documentsRes.data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching case details:', err);
          setLoading(false);
        });
    }
  }, [sessionStatus, params.id]);

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

  if (!caseData) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Vorgang nicht gefunden</h2>
          <Link href="/admin/cases" className="mt-4 text-emerald-600 hover:underline font-medium inline-block">
            Zurück zur Übersicht
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { label: 'Offen', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock };
      case 'in_progress': return { label: 'In Bearbeitung', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', icon: ActivityIcon };
      case 'approved': return { label: 'Genehmigt', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2 };
      case 'rejected': return { label: 'Abgelehnt', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100', icon: XCircle };
      case 'closed': return { label: 'Geschlossen', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100', icon: AlertCircle };
      default: return { label: status, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100', icon: AlertCircle };
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'call': return Phone;
      case 'meeting': return User;
      case 'note': return FileText;
      default: return ActivityIcon;
    }
  };

  const status = getStatusConfig(caseData.status);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/cases"
              className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {caseData.caseNumber}
                </h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${status.bg} ${status.color} ${status.border}`}>
                  <status.icon className="h-3.5 w-3.5" />
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                {caseData.customer?.firstName} {caseData.customer?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleUpdateCase}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Änderungen speichern
                </button>
              </>
            ) : (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
                  >
                    <MoreVertical className="h-4 w-4" />
                    Aktionen
                  </button>
                  {showActionsMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowActionsMenu(false)} />
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div className="py-1">
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                            <Download className="h-4 w-4 text-emerald-600" />
                            Vorgangs-Exposé (PDF)
                          </button>
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium transition-colors">
                            <Mail className="h-4 w-4 text-blue-600" />
                            An Bank senden
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                            <XCircle className="h-4 w-4" />
                            Vorgang archivieren
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
                >
                  Status & Details bearbeiten
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {[
            { id: 'details', label: 'Übersicht', icon: FileText },
            { id: 'activities', label: 'Aktivitäten', icon: ActivityIcon },
            { id: 'documents', label: 'Dokumente', icon: Paperclip },
            { id: 'messages', label: 'Nachrichten', icon: Mail },
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

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Financial Overview */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Euro className="h-5 w-5 text-emerald-600" />
                      Finanzierungsdetails
                    </h2>
                  </div>
                  <div className="p-6">
                    {isEditing ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vorgangsnummer</label>
                          <input
                            type="text"
                            value={editData.caseNumber}
                            onChange={(e) => setEditData({ ...editData, caseNumber: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                          <select
                            value={editData.status}
                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                          >
                            <option value="open">Offen</option>
                            <option value="in_progress">In Bearbeitung</option>
                            <option value="approved">Genehmigt</option>
                            <option value="rejected">Abgelehnt</option>
                            <option value="closed">Geschlossen</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Beantragte Summe (€)</label>
                          <input
                            type="number"
                            value={editData.requestedAmount}
                            onChange={(e) => setEditData({ ...editData, requestedAmount: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Genehmigte Summe (€)</label>
                          <input
                            type="number"
                            value={editData.approvedAmount || ''}
                            onChange={(e) => setEditData({ ...editData, approvedAmount: e.target.value })}
                            placeholder="Noch offen"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Laufzeit (Monate)</label>
                          <input
                            type="number"
                            value={editData.duration || ''}
                            onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bank / Partner</label>
                          <input
                            type="text"
                            value={editData.bank || ''}
                            onChange={(e) => setEditData({ ...editData, bank: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Beantragte Summe</span>
                          <p className="text-2xl font-bold text-slate-900">
                            {caseData.requestedAmount ? `${parseFloat(caseData.requestedAmount).toLocaleString('de-DE')} €` : '-'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Genehmigte Summe</span>
                          <p className="text-2xl font-bold text-emerald-600">
                            {caseData.approvedAmount ? `${parseFloat(caseData.approvedAmount).toLocaleString('de-DE')} €` : 'Noch offen'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Laufzeit</span>
                          <p className="text-lg font-medium text-slate-900 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-slate-400" />
                            {caseData.duration ? `${caseData.duration} Monate` : '-'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bank / Partner</span>
                          <p className="text-lg font-medium text-slate-900 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-slate-400" />
                            {caseData.bank || '-'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-emerald-600" />
                      Weitere Informationen
                    </h2>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Wiedervorlage</span>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.followUpDate ? new Date(editData.followUpDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => setEditData({ ...editData, followUpDate: e.target.value })}
                          className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium text-amber-600 bg-amber-50 inline-flex px-2 py-1 rounded-lg border border-amber-100">
                          {caseData.followUpDate ? new Date(caseData.followUpDate).toLocaleDateString('de-DE') : 'Keine'}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Erstellt am</span>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {new Date(caseData.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kreditanfrage-Details aus formData */}
                {caseData.formData && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-slate-50 px-6 py-4">
                      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-emerald-600" />
                        Kreditanfrage-Details
                        <span className="ml-2 text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {caseData.formData.produktKategorie === 'baufinanzierung' ? 'Baufinanzierung' : 'Privatkredit'}
                        </span>
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Kreditkonditionen */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <Euro className="h-4 w-4 text-emerald-500" />
                          Kreditkonditionen
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {caseData.formData.produktKategorie === 'baufinanzierung' ? (
                            <>
                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Finanzierungsart</span>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.baufinanzierungArt || '-'}</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Kaufpreis/Baukosten</span>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.kaufpreisBaukosten ? `${parseFloat(caseData.formData.kaufpreisBaukosten).toLocaleString('de-DE')} €` : '-'}</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Eigenkapital</span>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.eigenkapital ? `${parseFloat(caseData.formData.eigenkapital).toLocaleString('de-DE')} €` : '-'}</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Kreditart</span>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                  {{
                                    'ratenkredit': 'Ratenkredit',
                                    'autokredit': 'Autokredit',
                                    'umschuldung': 'Umschuldungskredit',
                                    'sofortkredit': 'Sofortkredit',
                                    'selbststaendige': 'Kredit für Selbstständige',
                                    'freie_verwendung': 'Freie Verwendung'
                                  }[caseData.formData.kreditart as string] || caseData.formData.kreditart || '-'}
                                </p>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Kreditsumme</span>
                                <p className="text-sm font-semibold text-emerald-600 mt-0.5">{caseData.formData.kreditsumme ? `${parseFloat(caseData.formData.kreditsumme).toLocaleString('de-DE')} €` : '-'}</p>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Laufzeit</span>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.laufzeit ? `${caseData.formData.laufzeit} Monate` : '-'}</p>
                              </div>
                            </>
                          )}
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Verwendungszweck</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">
                              {{
                                'auto': 'Autokauf',
                                'umschuldung': 'Umschuldung',
                                'renovierung': 'Renovierung/Modernisierung',
                                'freie_verwendung': 'Freie Verwendung'
                              }[caseData.formData.verwendungszweck as string] || caseData.formData.verwendungszweck || '-'}
                            </p>
                          </div>
                          {caseData.formData.gewuenschteRate && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Gewünschte Rate</span>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">{parseFloat(caseData.formData.gewuenschteRate).toLocaleString('de-DE')} €/Monat</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Persönliche Daten */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <User className="h-4 w-4 text-emerald-500" />
                          Persönliche Daten
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Anrede</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.anrede || '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 col-span-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Name</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.vorname} {caseData.formData.nachname}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Geburtsdatum</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.geburtsdatum ? new Date(caseData.formData.geburtsdatum).toLocaleDateString('de-DE') : '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Geburtsort</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.geburtsort || '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Familienstand</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.familienstand || '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Staatsangehörigkeit</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.staatsangehoerigkeit || '-'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Kontaktdaten */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-emerald-500" />
                          Kontakt & Adresse
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">E-Mail</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{caseData.formData.email || '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Telefon</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.telefon || '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 col-span-2 sm:col-span-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Adresse</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">
                              {caseData.formData.strasse} {caseData.formData.hausnummer}, {caseData.formData.plz} {caseData.formData.ort}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Beschäftigung & Einkommen */}
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-emerald-500" />
                          Beschäftigung & Finanzen
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Beschäftigung</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.beschaeftigungsverhaeltnis || '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Netto-Einkommen</span>
                            <p className="text-sm font-semibold text-emerald-600 mt-0.5">{caseData.formData.nettoEinkommen ? `${parseFloat(caseData.formData.nettoEinkommen).toLocaleString('de-DE')} €` : '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Beschäftigt seit</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.beschaeftigtSeit || '-'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Miete/Wohnkosten</span>
                            <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.miete ? `${parseFloat(caseData.formData.miete).toLocaleString('de-DE')} €` : '-'}</p>
                          </div>
                          {caseData.formData.sonstigeAusgaben && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Sonstige Ausgaben</span>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">{parseFloat(caseData.formData.sonstigeAusgaben).toLocaleString('de-DE')} €</p>
                            </div>
                          )}
                          {caseData.formData.bestehendeDarlehen && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Bestehende Darlehen</span>
                              <p className="text-sm font-semibold text-amber-600 mt-0.5">{parseFloat(caseData.formData.bestehendeDarlehen).toLocaleString('de-DE')} €</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Baufinanzierung: Objektdaten */}
                      {caseData.formData.produktKategorie === 'baufinanzierung' && (caseData.formData.objektart || caseData.formData.baujahr) && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-emerald-500" />
                            Objektdaten
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Objektart</span>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.objektart || '-'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Baujahr</span>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.baujahr || '-'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Grundstücksgröße</span>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.grundstuecksgroesse ? `${caseData.formData.grundstuecksgroesse} m²` : '-'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Wohnfläche</span>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.wohnflaeche ? `${caseData.formData.wohnflaeche} m²` : '-'}</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Kaufpreis</span>
                              <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.kaufpreis ? `${parseFloat(caseData.formData.kaufpreis).toLocaleString('de-DE')} €` : '-'}</p>
                            </div>
                            {caseData.formData.modernisierungen && (
                              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Modernisierungen</span>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">{caseData.formData.modernisierungen}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bemerkungen */}
                      {caseData.formData.bemerkungen && (
                        <div>
                          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-emerald-500" />
                            Bemerkungen des Kunden
                          </h3>
                          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{caseData.formData.bemerkungen}</p>
                          </div>
                        </div>
                      )}

                      {/* Formular-Fortschritt */}
                      {caseData.currentStep && (
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Formular-Fortschritt</span>
                            <span className="text-emerald-600 font-bold">Schritt {caseData.currentStep} von 4</span>
                          </div>
                          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                              style={{ width: `${(caseData.currentStep / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Customer Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Kunde</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg border border-emerald-200">
                        {caseData.customer?.firstName?.[0]}{caseData.customer?.lastName?.[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{caseData.customer?.firstName} {caseData.customer?.lastName}</div>
                        <div className="text-xs text-slate-500">ID: {caseData.customerId.substring(0, 8)}...</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="truncate">{caseData.customer?.email || 'Keine E-Mail'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{caseData.customer?.phone || 'Keine Nummer'}</span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/customers/${caseData.customerId}`}
                      className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition-all"
                    >
                      Zum Kundenprofil
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Advisor Info */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-900/20">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Verantwortlicher Berater</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-bold">{caseData.advisorName || 'Nicht zugewiesen'}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Berater-Nr: {caseData.advisorNumber || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5 text-emerald-600" />
                  Aktivitätsverlauf
                </h2>
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-all shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Aktivität erfassen
                </button>
              </div>
              <div className="p-6">
                {activities.length > 0 ? (
                  <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
                    {activities.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="relative flex items-start gap-6 group">
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white border-2 border-emerald-500 shadow-sm transition-transform group-hover:scale-110">
                            <Icon className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 rounded-2xl bg-slate-50 p-4 border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50/30 transition-all">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-slate-900">{activity.subject}</h4>
                                <button
                                  onClick={() => handleDeleteActivity(activity.id)}
                                  className="p-1 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Aktivität löschen"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="text-xs font-medium text-slate-400">
                                {new Date(activity.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{activity.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ActivityIcon className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Noch keine Aktivitäten für diesen Vorgang.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Capture Modal */}
          {showActivityModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-900">Aktivität erfassen</h3>
                  <button onClick={() => setShowActivityModal(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aktivitäts-Typ</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'note', label: 'Notiz', icon: FileText },
                        { id: 'call', label: 'Anruf', icon: Phone },
                        { id: 'meeting', label: 'Termin', icon: User }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setNewActivity({ ...newActivity, type: type.id })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${newActivity.type === type.id
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-100 hover:border-slate-200 text-slate-500'
                            }`}
                        >
                          <type.icon className="h-5 w-5" />
                          <span className="text-[10px] font-bold uppercase">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Betreff</label>
                    <input
                      type="text"
                      placeholder="z.B. Telefonat mit Kunde bezüglich Unterlagen"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      value={newActivity.subject}
                      onChange={(e) => setNewActivity({ ...newActivity, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Beschreibung / Protokoll</label>
                    <textarea
                      placeholder="Was wurde besprochen? Was sind die nächsten Schritte?"
                      className="w-full h-32 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                  <button onClick={() => setShowActivityModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-xl transition-all">Abbrechen</button>
                  <button
                    onClick={handleCreateActivity}
                    disabled={!newActivity.subject}
                    className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-emerald-600" />
                  Unterlagen & Dokumente
                </h2>
                <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-all">
                  <Plus className="h-4 w-4" />
                  Upload
                </button>
              </div>
              <div className="p-6">
                {documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="group flex flex-col p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => window.open(doc.fileUrl, '_blank')}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                              title="Vorschau öffnen"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <a
                              href={doc.fileUrl}
                              download
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                              title="Herunterladen"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              title="Dokument löschen"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="font-bold text-slate-900 text-sm truncate" title={doc.name}>
                          {doc.name}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-slate-500">
                            {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(0)} KB` : 'Unbekannt'}
                          </div>
                          {doc.customerId && !doc.uploadedBy && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                              <User className="h-3 w-3" />
                              Kunde
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {new Date(doc.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Paperclip className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Keine Dokumente hochgeladen.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto">
              <CaseMessaging caseId={params.id as string} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
