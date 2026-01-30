'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';
import { FileText, Download, Upload, Loader2, File, Calendar, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  fileSize: number;
  fileUrl: string;
  createdAt: string;
  caseId?: string;
}

interface Case {
  id: string;
  caseNumber: string;
  type: string;
  status: string;
}

const DOCUMENT_CATEGORIES = [
  { id: 'id_document', label: 'Personalausweis/Reisepass', required: true },
  { id: 'income_proof', label: 'Einkommensnachweise (3 Monate)', required: true },
  { id: 'bank_statements', label: 'Kontoauszüge (3 Monate)', required: true },
  { id: 'employment_contract', label: 'Arbeitsvertrag', required: false },
  { id: 'tax_return', label: 'Steuerbescheid', required: false },
  { id: 'property_documents', label: 'Grundbuchauszug', required: false },
  { id: 'other', label: 'Sonstige Unterlagen', required: false },
];

export default function DokumentePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/portal/login');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin');
    } else if (status === 'authenticated') {
      fetchDocuments();
    }
  }, [status, session, router]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/portal/documents');
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/portal/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Fehler beim Hochladen der Dokumente');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf') || type === 'id_document') return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('income') || type === 'income_proof') return '💰';
    if (type.includes('bank') || type === 'bank_statements') return '🏦';
    if (type.includes('employment') || type === 'employment_contract') return '�';
    return '📎';
  };

  const getCategoryLabel = (type: string) => {
    const category = DOCUMENT_CATEGORIES.find(cat => cat.id === type);
    return category?.label || type;
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meine Dokumente</h1>
            <p className="text-slate-400 mt-1">Verwalten Sie Ihre hochgeladenen Dokumente</p>
          </div>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all cursor-pointer">
            <Upload className="h-5 w-5" />
            {uploading ? 'Wird hochgeladen...' : 'Dokument hochladen'}
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {documents.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-12 text-center">
            <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Keine Dokumente vorhanden</h3>
            <p className="text-slate-400 mb-6">
              Sie haben noch keine Dokumente hochgeladen.
            </p>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all cursor-pointer">
              <Upload className="h-5 w-5" />
              Erstes Dokument hochladen
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-4xl">{getFileIcon(doc.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{doc.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="px-2 py-1 bg-blue-600/10 text-blue-400 rounded-lg text-xs font-bold">
                          {getCategoryLabel(doc.type)}
                        </span>
                        <span className="flex items-center gap-1">
                          <File className="h-3 w-3" />
                          {formatFileSize(doc.fileSize)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(doc.createdAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-700 rounded-lg transition-all">
                      <Download className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-lg transition-all">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
