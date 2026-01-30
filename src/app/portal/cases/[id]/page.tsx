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
  Download
} from 'lucide-react';

export default function PortalCaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCaseDetails();
  }, [params.id]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string = 'additional') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', params.id as string);
    formData.append('documentType', type);

    try {
      const res = await fetch('/api/kreditanfrage/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Refresh documents
        fetchCaseDetails();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!caseData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/portal">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {{
              'ratenkredit': 'Ratenkredit',
              'autokredit': 'Autokredit',
              'umschuldung': 'Umschuldungskredit',
              'sofortkredit': 'Sofortkredit',
              'selbststaendige': 'Kredit für Selbstständige',
              'freie_verwendung': 'Freie Verwendung'
            }[caseData.formData?.kreditart as string] || caseData.formData?.kreditart || 'Kreditanfrage'}
          </h1>
          <p className="text-gray-500 text-sm">
            Vorgangsnummer: {caseData.caseNumber}
          </p>
        </div>
        <div className="ml-auto">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${caseData.status === 'open' ? 'bg-blue-100 text-blue-800' :
              caseData.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
            }`}>
            {caseData.status === 'open' ? 'In Bearbeitung' : caseData.status}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dokumente</CardTitle>
              <CardDescription>
                Laden Sie hier die erforderlichen Unterlagen hoch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'additionalDocuments')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Datei auswählen oder hierher ziehen</p>
                    <p className="text-sm text-gray-500">PDF, JPG oder PNG (max. 10MB)</p>
                  </div>
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Hochgeladene Dokumente</h3>
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.createdAt).toLocaleDateString('de-DE')} • {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" /> Empfangen
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">Noch keine Dokumente hochgeladen.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages Section */}
          <CaseMessages caseId={params.id as string} />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Übersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Kreditsumme</p>
                <p className="text-lg font-bold text-gray-900">
                  {caseData.requestedAmount ? Number(caseData.requestedAmount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Laufzeit</p>
                <p className="font-medium text-gray-900">
                  {caseData.duration || '-'} Monate
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Ihr Berater</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Kreditheld24 Team</p>
                    <p className="text-xs text-gray-500">Wird zugewiesen</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
