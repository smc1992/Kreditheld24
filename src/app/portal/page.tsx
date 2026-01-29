'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';
import Link from 'next/link';
import { FileText, Clock, CheckCircle, AlertCircle, Briefcase, ChevronRight } from 'lucide-react';

export default function PortalDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/portal/login');
      return;
    }

    // Mock data for now - will be replaced with API call
    setCases([]);
    setLoading(false);
  }, [session, router]);

  if (!session) {
    return null;
  }

  const statCards = [
    {
      name: 'Meine Vorgänge',
      value: cases.length,
      icon: Briefcase,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      name: 'Aktive Anfragen',
      value: cases.filter(c => c.status === 'open' || c.status === 'active').length,
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      name: 'Genehmigt',
      value: cases.filter(c => c.status === 'approved' || c.status === 'won').length,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
  ];

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'open':
      case 'active':
        return <span className="bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium"><Clock className="w-3 h-3" /> In Bearbeitung</span>;
      case 'approved':
      case 'won':
        return <span className="bg-green-500/20 text-green-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium"><CheckCircle className="w-3 h-3" /> Genehmigt</span>;
      case 'rejected':
      case 'lost':
        return <span className="bg-red-500/20 text-red-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium"><AlertCircle className="w-3 h-3" /> Abgelehnt</span>;
      default:
        return <span className="bg-slate-500/20 text-slate-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium"><Clock className="w-3 h-3" /> Entwurf</span>;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Willkommen zurück, {session.user.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-400 mt-2">Hier finden Sie eine Übersicht Ihrer Kreditanfragen und Dokumente.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className={`relative overflow-hidden rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm p-6 transition-all hover:scale-[1.02] hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                  <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
                    {loading ? '...' : stat.value}
                  </p>
                </div>
                <div className={`rounded-xl ${stat.bg} p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cases List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Ihre Kreditanfragen</h2>
            <Link
              href="/portal/cases"
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              Alle anzeigen
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500"></div>
                <p className="text-slate-400 font-medium">Lade Vorgänge...</p>
              </div>
            ) : cases.length > 0 ? (
              cases.slice(0, 5).map((c) => (
                <div key={c.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {c.formData && typeof c.formData === 'object' && 'kreditart' in c.formData 
                              ? (c.formData as any).kreditart 
                              : 'Kreditanfrage'}
                          </h3>
                          {getStatusBadge(c.status)}
                        </div>
                        <p className="text-sm text-slate-400">
                          Vorgangsnummer: <span className="font-mono text-slate-300">{c.caseNumber}</span> • {new Date(c.createdAt).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-400">
                          {c.requestedAmount ? Number(c.requestedAmount).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}
                        </p>
                        <p className="text-xs text-slate-500">Gewünschte Summe</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <FileText className="w-4 h-4" />
                        <span>{c.documents?.length || 0} Dokumente</span>
                      </div>
                      <Link
                        href={`/portal/cases/${c.id}`}
                        className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                      >
                        Details anzeigen
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700 border-dashed">
                <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Keine Kreditanfragen gefunden</h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Starten Sie jetzt Ihre erste unverbindliche Kreditanfrage und profitieren Sie von unseren günstigen Konditionen.
                </p>
                <Link
                  href="/kreditanfrage"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-emerald-500/25 transition-all"
                >
                  Jetzt anfragen
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
