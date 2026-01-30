'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CaseMessages from '@/components/portal/CaseMessages';
import {
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Trash2,
  Download,
  User,
  Building,
  Wallet,
  MapPin,
  Euro
} from 'lucide-react';

import PortalLayout from '@/components/portal/PortalLayout';
import { DOCUMENT_CATEGORIES, getCategoryLabel } from '@/lib/documents';

export default function PortalCaseDetailPage() {
  const params = useParams<{ id: string }>(); // Fix: Properly typed params
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchCaseDetails();
    }
  }, [params?.id]);

  const getMissingDocuments = () => {
    if (!documents) return [];
    const uploadedTypes = documents.map(doc => doc.type);
    return DOCUMENT_CATEGORIES.filter(cat => cat.required && !uploadedTypes.includes(cat.id));
  };

  const fetchCaseDetails = async () => {
    try {
      const res = await fetch(`/api/portal/cases/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) router.push('/portal');
        return;
      }
      const data = await res.json();
      setCaseData(data.case);
      setDocuments(data.documents);
    } catch (error) {
      console.error('Error fetching case:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (!selectedCategory) {
      alert('Bitte wählen Sie eine Kategorie aus');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('files', selectedFile);
    if (params.id) {
      formData.append('caseId', params.id);
    }
    formData.append('type', selectedCategory);

    try {
      const res = await fetch('/api/portal/documents', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Reset form
          setSelectedFile(null);
          setSelectedCategory('');
          // Refresh documents
          fetchCaseDetails();
        } else {
          alert('Fehler: ' + data.error);
        }
      } else {
        alert('Fehler beim Upload. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Fehler beim Upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Möchten Sie dieses Dokument wirklich löschen?')) {
      return;
    }

    try {
      const res = await fetch(`/api/portal/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchCaseDetails();
      } else {
        alert('Fehler beim Löschen. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Fehler beim Löschen.');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-slate-700 text-slate-200',
      open: 'bg-blue-700 text-blue-200',
      active: 'bg-emerald-700 text-emerald-200',
      in_progress: 'bg-amber-700 text-amber-200', // Aligned with Admin
      approved: 'bg-green-700 text-green-200',
      rejected: 'bg-red-700 text-red-200',
      closed: 'bg-slate-700 text-slate-200', // Aligned with Admin
      won: 'bg-purple-700 text-purple-200',
      lost: 'bg-gray-700 text-gray-200',
    };
    return colors[status] || 'bg-slate-700 text-slate-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Entwurf',
      open: 'Offen',
      active: 'In Bearbeitung',
      in_progress: 'In Bearbeitung', // Aligned with Admin
      approved: 'Genehmigt',
      rejected: 'Abgelehnt',
      closed: 'Geschlossen', // Aligned with Admin
      won: 'Gewonnen',
      lost: 'Verloren',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </PortalLayout>
    );
  }

  if (!caseData) {
    return (
      <PortalLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Vorgang nicht gefunden</h2>
          <p className="text-gray-500">Der gesuchte Vorgang konnte nicht geladen werden.</p>
          <Link href="/portal">
            <Button variant="outline">Zurück zur Übersicht</Button>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const fd = caseData.formData || {};

  return (
    <PortalLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/portal/vorgaenge">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {{
                'ratenkredit': 'Ratenkredit',
                'autokredit': 'Autokredit',
                'umschuldung': 'Umschuldungskredit',
                'sofortkredit': 'Sofortkredit',
                'selbststaendige': 'Kredit für Selbstständige',
                'freie_verwendung': 'Freie Verwendung'
              }[fd.kreditart as string] || fd.kreditart || 'Kreditanfrage'}
            </h1>
            <p className="text-slate-400 text-sm">
              Vorgangsnummer: {caseData.caseNumber}
            </p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${getStatusColor(caseData.status)}`}>
              {getStatusLabel(caseData.status)}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Messages & Documents */}
          <div className="lg:col-span-2 space-y-8">

            {/* Application Data (Full Detail View) */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  Antragsdaten
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Details Ihrer Kreditanfrage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Personal Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4" /> Persönliche Daten
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Name</p>
                      <p className="font-medium text-white">{fd.vorname} {fd.nachname}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Geburtsdatum</p>
                      <p className="font-medium text-white">{fd.geburtsdatum || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Email</p>
                      <p className="font-medium text-white">{fd.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Telefon</p>
                      <p className="font-medium text-white">{fd.telefon || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Familienstand</p>
                      <p className="font-medium text-white">{fd.familienstand || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Nationalität</p>
                      <p className="font-medium text-white">{fd.staatsangehoerigkeit || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700" />

                {/* Address Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Anschrift & Wohnen
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2">
                      <p className="text-slate-500">Adresse</p>
                      <p className="font-medium text-white">
                        {fd.strasse} {fd.hausnummer}<br />
                        {fd.plz} {fd.ort}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Wohnsituation</p>
                      <p className="font-medium text-white">{fd.wohnart || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Warmmiete</p>
                      <p className="font-medium text-white">
                        {fd.warmmiete ? Number(fd.warmmiete).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700" />

                {/* Job Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Building className="w-4 h-4" /> Beschäftigung
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Berufsstatus</p>
                      <p className="font-medium text-white">{fd.beschaeftigungsart || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Arbeitgeber</p>
                      <p className="font-medium text-white">{fd.arbeitgeber || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Beschäftigt seit</p>
                      <p className="font-medium text-white">{fd.beschaeftigtSeit ? new Date(fd.beschaeftigtSeit).toLocaleDateString('de-DE') : '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Befristet bis</p>
                      <p className="font-medium text-white">{fd.befristetBis ? new Date(fd.befristetBis).toLocaleDateString('de-DE') : 'Unbefristet'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700" />

                {/* Financials Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Finanzen (Monatlich)
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Nettoeinkommen</p>
                      <p className="font-medium text-white">
                        {fd.nettoeinkommen ? Number(fd.nettoeinkommen).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Sonstige Einkünfte</p>
                      <p className="font-medium text-white">
                        {fd.sonstigesEinkommen ? Number(fd.sonstigesEinkommen).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Unterhaltszahlungen</p>
                      <p className="font-medium text-white">
                        {fd.unterhalt ? Number(fd.unterhalt).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Bestehende Raten</p>
                      <p className="font-medium text-white">
                        {fd.bestehendeRaten ? Number(fd.bestehendeRaten).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white">Dokumente</CardTitle>
                <CardDescription className="text-slate-400">
                  Laden Sie hier die erforderlichen Unterlagen hoch.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload Area */}
                {/* Missing Documents Alert */}
                {getMissingDocuments().length > 0 && (
                  <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <p className="text-sm font-bold text-orange-400 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Fehlende Pflichtdokumente:
                    </p>
                    <ul className="text-sm text-orange-300 space-y-1 ml-6 list-disc">
                      {getMissingDocuments().map(doc => (
                        <li key={doc.id}>{doc.label}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Upload Area */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Dokumentenart <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">Bitte wählen...</option>
                      {DOCUMENT_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label} {cat.required && '(Pflicht)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Datei <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full text-sm text-slate-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-emerald-600 file:text-white
                            hover:file:bg-emerald-500
                            cursor-pointer"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || !selectedCategory || uploading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Wird hochgeladen...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" /> Hochladen
                      </>
                    )}
                  </Button>
                </div>

                {/* Document List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white">Hochgeladene Dokumente</h3>
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{doc.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] uppercase font-bold">
                                {getCategoryLabel(doc.type)}
                              </span>
                              <span>• {new Date(doc.createdAt).toLocaleDateString('de-DE')}</span>
                              <span>• {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" /> Empfangen
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">Noch keine Dokumente hochgeladen.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Messages Section */}
            <CaseMessages caseId={params.id as string} />
          </div>

          {/* Right Column: Key Info (Sidebar) */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 text-slate-200">
              <CardHeader>
                <CardTitle className="text-white">Konditionen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-slate-500">Gewünschte Kreditsumme</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {caseData.requestedAmount ? Number(caseData.requestedAmount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Gewünschte Laufzeit</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    <p className="font-bold text-white text-lg">
                      {caseData.duration || '-'} Monate
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Monatliche Rate (ca.)</p>
                  {/* Simplified calculation or from fd if available */}
                  <p className="font-bold text-emerald-400 text-lg mt-1">
                    {fd.monatlicheRate ? Number(fd.monatlicheRate).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : 'Wird berechnet'}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-700">
                  <p className="text-sm text-slate-500 mb-3">Ihr Kreditheld</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Kreditheld24 Team</p>
                      <p className="text-xs text-emerald-500">Persönlicher Berater</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-600 border-none text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <CardHeader>
                <CardTitle className="text-white">Hilfe benötigt?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-emerald-50 text-sm mb-4">
                  Haben Sie Fragen zu Ihrem Antrag? Nutzen Sie die Nachrichten-Funktion oder rufen Sie uns an.
                </p>
                <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50">
                  Nachricht schreiben
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
