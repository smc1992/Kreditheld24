'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';
import { FileText, Download, Upload, Loader2, File, Calendar, X, CheckCircle, AlertCircle, Briefcase } from 'lucide-react';

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
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === 'loading') return;

    if (sessionStatus === 'unauthenticated') {
      router.push('/portal/login');
    } else if (sessionStatus === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin');
    } else if (sessionStatus === 'authenticated') {
      fetchData();
    }
  }, [sessionStatus, session, router]);

  const fetchData = async () => {
    try {
      const [docsRes, casesRes] = await Promise.all([
        fetch('/api/portal/documents'),
        fetch('/api/portal/cases'),
      ]);

      const docsData = await docsRes.json();
      const casesData = await casesRes.json();

      if (docsData.success) {
        setDocuments(docsData.data);
      }
      if (casesData.success) setCases(casesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    setShowUploadDialog(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Bitte wählen Sie mindestens eine Datei aus');
      return;
    }
    if (!selectedCategory) {
      alert('Bitte wählen Sie eine Kategorie aus');
      return;
    }

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    if (selectedCase) formData.append('caseId', selectedCase);
    formData.append('type', selectedCategory);

    try {
      const res = await fetch('/api/portal/documents', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert(`${data.data.length} Dokument(e) erfolgreich hochgeladen!`);
        setShowUploadDialog(false);
        setSelectedFiles(null);
        setSelectedCase('');
        setSelectedCategory('');
        await fetchData();
      } else {
        alert('Fehler: ' + data.error);
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Fehler beim Hochladen der Dokumente');
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = (doc: Document) => {
    setPreviewDocument(doc);
    setShowPreview(true);
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Möchten Sie dieses Dokument wirklich löschen?')) {
      return;
    }

    setDeleting(docId);
    try {
      const res = await fetch(`/api/portal/documents/${docId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Dokument erfolgreich gelöscht!');
        fetchData();
      } else {
        alert('Fehler: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Fehler beim Löschen des Dokuments');
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type === 'id_document') return '📄';
    if (type === 'income_proof') return '💰';
    if (type === 'bank_statements') return '🏦';
    if (type === 'employment_contract') return '📝';
    if (type === 'tax_return') return '📊';
    if (type === 'property_documents') return '🏠';
    return '📎';
  };

  const getCategoryLabel = (type: string) => {
    const category = DOCUMENT_CATEGORIES.find(cat => cat.id === type);
    return category?.label || type;
  };

  const getDocumentsForCase = (caseId: string) => {
    return documents.filter(doc => doc.caseId === caseId);
  };

  const getMissingDocuments = (caseId: string) => {
    const caseDocuments = getDocumentsForCase(caseId);
    const uploadedTypes = caseDocuments.map(doc => doc.type);
    return DOCUMENT_CATEGORIES.filter(cat => cat.required && !uploadedTypes.includes(cat.id));
  };

  const getUnassignedDocuments = () => {
    return documents.filter(doc => !doc.caseId);
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
            <p className="text-slate-400 mt-1">Verwalten Sie Ihre Unterlagen für Kreditanfragen</p>
          </div>
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all"
          >
            <Upload className="h-5 w-5" />
            Dokument hochladen
          </button>
        </div>

        {/* Upload Dialog */}
        {showUploadDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Dokument hochladen</h2>
                <button
                  onClick={() => setShowUploadDialog(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Kreditanfrage (optional)
                  </label>
                  <select
                    value={selectedCase}
                    onChange={(e) => setSelectedCase(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Keine Zuordnung</option>
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>{c.caseNumber} - {c.type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Kategorie <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option value="">Kategorie wählen...</option>
                    {DOCUMENT_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label} {cat.required && '(Pflicht)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    Datei(en) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:font-bold hover:file:bg-emerald-500 file:cursor-pointer"
                  />
                  {selectedFiles && selectedFiles.length > 0 && (
                    <p className="text-sm text-slate-400 mt-2">
                      {selectedFiles.length} Datei(en) ausgewählt
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUploadDialog(false)}
                    className="flex-1 px-6 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFiles || !selectedCategory}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Wird hochgeladen...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        Hochladen
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents by Case */}
        {cases.length > 0 || documents.length > 0 ? (
          <div className="space-y-6">
            {cases.map(caseItem => {
              const caseDocuments = getDocumentsForCase(caseItem.id);
              const missingDocs = getMissingDocuments(caseItem.id);

              return (
                <div key={caseItem.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-600/10 rounded-xl">
                        <Briefcase className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{caseItem.caseNumber}</h3>
                        <p className="text-sm text-slate-400">{caseItem.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">
                        {caseDocuments.length} Dokument(e)
                      </p>
                      {missingDocs.length > 0 && (
                        <p className="text-sm text-orange-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {missingDocs.length} fehlen
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Missing Documents */}
                  {missingDocs.length > 0 && (
                    <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                      <p className="text-sm font-bold text-orange-400 mb-2">Fehlende Pflichtdokumente:</p>
                      <ul className="text-sm text-orange-300 space-y-1">
                        {missingDocs.map(doc => (
                          <li key={doc.id}>• {doc.label}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Uploaded Documents */}
                  {caseDocuments.length > 0 ? (
                    <div className="space-y-3">
                      {caseDocuments.map(doc => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700 rounded-xl hover:border-emerald-500/50 transition-all"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-2xl">{getFileIcon(doc.type)}</div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                <span className="px-2 py-1 bg-blue-600/10 text-blue-400 rounded-lg font-bold">
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
                            {doc.name.toLowerCase().endsWith('.pdf') && (
                              <button
                                onClick={() => handlePreview(doc)}
                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-700 rounded-lg transition-all"
                                title="Vorschau"
                              >
                                <FileText className="h-5 w-5" />
                              </button>
                            )}
                            <a
                              href={doc.fileUrl}
                              download={doc.name}
                              className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-700 rounded-lg transition-all"
                              title="Herunterladen"
                            >
                              <Download className="h-5 w-5" />
                            </a>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              disabled={deleting === doc.id}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50"
                              title="Löschen"
                            >
                              {deleting === doc.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <X className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-4">Noch keine Dokumente hochgeladen</p>
                  )}
                </div>
              );
            })}

            {/* Unassigned Documents */}
            {getUnassignedDocuments().length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Nicht zugeordnete Dokumente</h3>
                <div className="space-y-3">
                  {getUnassignedDocuments().map(doc => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700 rounded-xl"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{getFileIcon(doc.type)}</div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="px-2 py-1 bg-blue-600/10 text-blue-400 rounded-lg font-bold">
                              {getCategoryLabel(doc.type)}
                            </span>
                            <span>{formatFileSize(doc.fileSize)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.name.toLowerCase().endsWith('.pdf') && (
                          <button
                            onClick={() => handlePreview(doc)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-700 rounded-lg transition-all"
                            title="Vorschau"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                        )}
                        <a
                          href={doc.fileUrl}
                          download={doc.name}
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-700 rounded-lg transition-all"
                          title="Herunterladen"
                        >
                          <Download className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          disabled={deleting === doc.id}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50"
                          title="Löschen"
                        >
                          {deleting === doc.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-12 text-center">
            <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Keine Kreditanfragen vorhanden</h3>
            <p className="text-slate-400 mb-6">
              Erstellen Sie zuerst eine Kreditanfrage, um Dokumente hochzuladen.
            </p>
          </div>
        )}

        {/* PDF Preview Modal */}
        {showPreview && previewDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-white">{previewDocument.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{getCategoryLabel(previewDocument.type)}</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={previewDocument.fileUrl}
                  className="w-full h-full"
                  title="PDF Vorschau"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
