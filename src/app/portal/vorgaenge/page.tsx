'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';
import { Briefcase, Clock, CheckCircle2, XCircle, Loader2, FileText, Calendar } from 'lucide-react';

interface Case {
  id: string;
  caseNumber: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function VorgaengePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/portal/login');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin');
    } else if (status === 'authenticated') {
      fetchCases();
    }
  }, [status, session, router]);

  const fetchCases = async () => {
    try {
      const res = await fetch('/api/portal/cases');
      const data = await res.json();
      if (data.success) {
        setCases(data.data);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-slate-100 text-slate-700',
      open: 'bg-blue-100 text-blue-700',
      active: 'bg-emerald-100 text-emerald-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      won: 'bg-purple-100 text-purple-700',
      lost: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Entwurf',
      open: 'Offen',
      active: 'In Bearbeitung',
      approved: 'Genehmigt',
      rejected: 'Abgelehnt',
      won: 'Gewonnen',
      lost: 'Verloren',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'approved':
      case 'won':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
      case 'lost':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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
            <h1 className="text-2xl font-bold text-white">Meine Vorgänge</h1>
            <p className="text-slate-400 mt-1">Übersicht Ihrer Kreditanfragen</p>
          </div>
        </div>

        {cases.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-12 text-center">
            <Briefcase className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Keine Vorgänge gefunden</h3>
            <p className="text-slate-400 mb-6">
              Sie haben noch keine Kreditanfragen gestellt.
            </p>
            <button className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all">
              Jetzt anfragen
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer"
                onClick={() => router.push(`/portal/cases/${caseItem.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-600/10 rounded-xl">
                      <Briefcase className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{caseItem.caseNumber}</h3>
                      <p className="text-sm text-slate-400">{caseItem.type}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusColor(caseItem.status)}`}>
                    {getStatusIcon(caseItem.status)}
                    {getStatusLabel(caseItem.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Betrag</p>
                    <p className="text-sm font-bold text-white">
                      {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(caseItem.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Erstellt am</p>
                    <p className="text-sm font-bold text-white flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(caseItem.createdAt).toLocaleDateString('de-DE')}
                    </p>
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
