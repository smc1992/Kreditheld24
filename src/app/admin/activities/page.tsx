'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import {
  Activity,
  Search,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Mail,
  FileText,
  MessageSquare,
  UserPlus,
  Briefcase,
  Phone,
  Edit,
  ArrowUpRight,
  Filter,
  Calendar
} from 'lucide-react';

interface ActivityItem {
  id: string;
  caseId: string | null;
  customerId: string | null;
  type: string;
  subject: string;
  description: string | null;
  date: string;
  createdAt: string;
}

const typeConfig: Record<string, { label: string; icon: typeof Activity; color: string; bg: string }> = {
  email: { label: 'E-Mail', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
  document: { label: 'Dokument', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  message: { label: 'Nachricht', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  customer_created: { label: 'Neuer Kunde', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  case_created: { label: 'Neuer Vorgang', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  call: { label: 'Anruf', icon: Phone, color: 'text-teal-600', bg: 'bg-teal-50' },
  note: { label: 'Notiz', icon: Edit, color: 'text-slate-600', bg: 'bg-slate-100' },
  status_change: { label: 'Statusänderung', icon: ArrowUpRight, color: 'text-orange-600', bg: 'bg-orange-50' },
};

const defaultType = { label: 'Aktivität', icon: Activity, color: 'text-slate-600', bg: 'bg-slate-50' };

export default function ActivitiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchActivities();
    }
  }, [status]);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/admin/activities', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities
  const filtered = activities.filter((a) => {
    const matchesSearch = searchQuery.trim() === '' ||
      a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Unique types for filter
  const uniqueTypes = [...new Set(activities.map(a => a.type))];

  // Group by date
  const grouped = paginated.reduce<Record<string, ActivityItem[]>>((acc, activity) => {
    const dateKey = new Date(activity.date).toLocaleDateString('de-DE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(activity);
    return acc;
  }, {});

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight flex items-center gap-3">
              <Activity className="h-8 w-8 text-emerald-600" />
              Aktivitäten
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Vollständiger Verlauf aller Aktionen im System
            </p>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {filtered.length} {filtered.length === 1 ? 'Eintrag' : 'Einträge'}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Aktivitäten durchsuchen..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Alle Typen</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {typeConfig[type]?.label || type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {Object.keys(grouped).length > 0 ? (
            <div className="divide-y divide-slate-100">
              {Object.entries(grouped).map(([dateLabel, items]) => (
                <div key={dateLabel}>
                  {/* Date Header */}
                  <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <Calendar className="h-3.5 w-3.5" />
                      {dateLabel}
                    </div>
                  </div>

                  {/* Activities for this date */}
                  <div className="divide-y divide-slate-50">
                    {items.map((activity) => {
                      const config = typeConfig[activity.type] || defaultType;
                      const Icon = config.icon;

                      return (
                        <div key={activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/50 transition-all group">
                          <div className={`h-10 w-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-bold text-slate-900 truncate">{activity.subject}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${config.bg} ${config.color} border border-current/10`}>
                                {config.label}
                              </span>
                            </div>
                            {activity.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{activity.description}</p>
                            )}
                            <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">
                              {new Date(activity.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                            </p>
                          </div>
                          {(activity.caseId || activity.customerId) && (
                            <Link
                              href={activity.caseId ? `/admin/cases/${activity.caseId}` : `/admin/customers/${activity.customerId}`}
                              className="p-2 text-slate-300 hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-2xl bg-slate-50 p-6 mb-6">
                <Activity className="h-12 w-12 text-slate-200" />
              </div>
              <h4 className="text-slate-900 text-lg font-bold">Keine Aktivitäten gefunden</h4>
              <p className="text-slate-500 text-sm mt-2 max-w-xs">
                {searchQuery || typeFilter !== 'all'
                  ? 'Versuchen Sie eine andere Suche oder setzen Sie den Filter zurück.'
                  : 'Sobald Aktionen im System durchgeführt werden, erscheinen sie hier.'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Seite <span className="font-semibold">{currentPage}</span> von <span className="font-semibold">{totalPages}</span>
                {' '}({filtered.length} Einträge)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Zurück
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Weiter
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
