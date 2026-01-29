import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, crmCases, crmDocuments } from '@/db';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { FileText, Clock, CheckCircle, AlertCircle, Upload, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function PortalDashboard() {
  const session = await auth();
  if (!session) {
    redirect('/portal/login');
  }

  // Fetch customer cases
  const cases = await db.query.crmCases.findMany({
    where: eq(crmCases.customerId, session.user.id),
    orderBy: [desc(crmCases.createdAt)],
    with: {
      documents: true
    }
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'open':
      case 'active':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> In Bearbeitung</span>;
      case 'approved':
      case 'won':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Genehmigt</span>;
      case 'rejected':
      case 'lost':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Abgelehnt</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Entwurf/Neu</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Willkommen zurück, {session.user.name?.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-1">Hier finden Sie eine Übersicht Ihrer Kreditanfragen und Dokumente.</p>
      </div>

      <div className="grid gap-6">
        {cases.length > 0 ? (
          cases.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {c.formData && typeof c.formData === 'object' && 'kreditart' in c.formData 
                          ? (c.formData as any).kreditart 
                          : 'Kreditanfrage'}
                      </h3>
                      {getStatusBadge(c.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      Vorgangsnummer: <span className="font-mono text-gray-700">{c.caseNumber}</span> • Erstellt am {new Date(c.createdAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      {c.requestedAmount ? Number(c.requestedAmount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                    </p>
                    <p className="text-xs text-gray-500">Gewünschte Summe</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Ihre Dokumente
                      </h4>
                      
                      {c.documents && c.documents.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {c.documents.map((doc: any) => (
                            <div key={doc.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md text-sm text-gray-600 border border-gray-200">
                              <FileText className="w-3 h-3 text-emerald-500" />
                              <span className="truncate max-w-[150px]">{doc.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-100 inline-block">
                          Noch keine Dokumente hochgeladen.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Link href={`/portal/cases/${c.id}`}>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          <Upload className="w-4 h-4 mr-2" />
                          Dokumente hochladen
                        </Button>
                      </Link>
                      <Link href={`/portal/cases/${c.id}`}>
                        <Button variant="outline">
                          Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Keine Kreditanfragen gefunden</h3>
            <p className="text-gray-500 mb-6">Starten Sie jetzt Ihre erste unverbindliche Anfrage.</p>
            <Link href="/kreditanfrage">
              <Button>Jetzt anfragen</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
