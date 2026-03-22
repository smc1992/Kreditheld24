'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  BarChart3,
  Clock,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Activity,
  Percent,
  ChevronRight,
  CalendarClock,
  AlertCircle
} from 'lucide-react';

interface DashboardStats {
  customers: number;
  cases: number;
  activities: number;
  customersTrend: number;
  casesTrend: number;
  customersLast30: number;
  casesLast30: number;
  followUpsToday: number;
  followUpsWeek: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    customers: 0,
    cases: 0,
    activities: 0,
    customersTrend: 0,
    casesTrend: 0,
    customersLast30: 0,
    casesLast30: 0,
    followUpsToday: 0,
    followUpsWeek: 0,
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    Promise.all([
      fetch('/api/admin/stats', { cache: 'no-store' }).then(res => res.json()),
      fetch('/api/admin/activities?limit=5', { cache: 'no-store' }).then(res => res.json())
    ])
      .then(([statsRes, activitiesRes]) => {
        if (statsRes.success) setStats(statsRes.data);
        if (activitiesRes.success) setActivities(activitiesRes.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      });
  }, [status]);

  if (!session) {
    return null;
  }

  const formatTrend = (value: number) => {
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value}%`;
  };

  const statCards = [
    {
      name: 'Gesamtkunden',
      value: stats.customers,
      change: formatTrend(stats.customersTrend),
      subtitle: `${stats.customersLast30} neue (30 Tage)`,
      trend: stats.customersTrend >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      href: '/admin/customers',
    },
    {
      name: 'Aktive Vorgänge',
      value: stats.cases,
      change: formatTrend(stats.casesTrend),
      subtitle: `${stats.casesLast30} neue (30 Tage)`,
      trend: stats.casesTrend >= 0 ? 'up' : 'down',
      icon: Briefcase,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      href: '/admin/cases',
    },
    {
      name: 'Zinssätze',
      value: 'Live',
      change: 'Aktuell',
      subtitle: 'Tagesaktuelle Konditionen',
      trend: 'neutral',
      icon: Percent,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      href: '/admin/rates',
    },
    {
      name: 'Wiedervorlagen',
      value: stats.followUpsToday,
      change: stats.followUpsToday > 0 ? 'Fällig' : 'Keine',
      subtitle: `${stats.followUpsWeek} diese Woche`,
      trend: stats.followUpsToday > 0 ? 'urgent' : 'neutral',
      icon: stats.followUpsToday > 0 ? AlertCircle : CalendarClock,
      color: stats.followUpsToday > 0 ? 'text-red-600' : 'text-purple-600',
      bg: stats.followUpsToday > 0 ? 'bg-red-50' : 'bg-purple-50',
      border: stats.followUpsToday > 0 ? 'border-red-100' : 'border-purple-100',
      href: '/admin/cases',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Willkommen zurück, <span className="font-bold text-emerald-600">{session.user?.name || 'Admin'}</span>. Hier ist Ihre Übersicht.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/customers/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 transition-all"
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              Neuer Kunde
            </Link>
            <Link
              href="/admin/cases/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <PlusCircle className="h-4 w-4" />
              Neuer Vorgang
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl ${stat.bg} ${stat.border} border p-3 transition-colors group-hover:scale-110 duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                {stat.trend === 'up' && (
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                )}
                {stat.trend === 'down' && (
                  <div className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-100">
                    <TrendingDown className="h-3 w-3" />
                    {stat.change}
                  </div>
                )}
                {stat.trend === 'urgent' && (
                  <div className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-100 animate-pulse">
                    <AlertCircle className="h-3 w-3" />
                    {stat.change}
                  </div>
                )}
                {stat.trend === 'neutral' && (
                  <div className="flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 border border-slate-100">
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="mt-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stat.name}
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {stat.subtitle}
                </p>
              </div>
              <div className="absolute bottom-0 right-0 p-3 opacity-0 transition-all group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity / Content Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main List */}
          <div className="lg:col-span-2 rounded-3xl bg-white shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <Activity className="h-5 w-5 text-emerald-600" />
                Letzte Aktivitäten
              </h3>
              <Link href="/admin/activities" className="text-sm font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1">
                Alle sehen
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group">
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{activity.subject}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">{activity.description}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">
                          {new Date(activity.date).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Link
                        href={activity.caseId ? `/admin/cases/${activity.caseId}` : `/admin/customers/${activity.customerId}`}
                        className="p-2 text-slate-300 hover:text-emerald-600 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-2xl bg-slate-50 p-6 mb-6 shadow-inner">
                    <BarChart3 className="h-12 w-12 text-slate-200" />
                  </div>
                  <h4 className="text-slate-900 text-lg font-bold">Keine aktuellen Aktivitäten</h4>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs leading-relaxed">
                    Sobald Kunden oder Vorgänge bearbeitet werden, erscheinen sie hier in der Übersicht.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            {/* Follow-ups Warning */}
            {stats.followUpsWeek > 0 && (
              <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-sm border border-amber-200 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
                    <CalendarClock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-900">Wiedervorlagen</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">Heute fällig:</span>
                      <span className={`text-lg font-black ${stats.followUpsToday > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {stats.followUpsToday}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-amber-700">Diese Woche:</span>
                      <span className="text-lg font-black text-amber-900">{stats.followUpsWeek}</span>
                    </div>
                  </div>
                  <Link
                    href="/admin/cases"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-700 transition-all shadow-md"
                  >
                    Vorgänge anzeigen
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-slate-900 p-8 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold leading-tight">Effizienz-Tipp</h3>
                <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                  Nutzen Sie die Suchfunktion im Header, um Kunden oder Vorgangsnummern blitzschnell zu finden.
                </p>
                <Link href="/admin/knowledge" className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-white/10 px-4 py-3 text-sm font-bold hover:bg-white/20 transition-all border border-white/10">
                  Knowledge Base öffnen
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Schnellstart
              </h3>
              <div className="space-y-4">
                <Link
                  href="/admin/customers/new"
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 hover:border-emerald-200 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Kunden-Onboarding</span>
                </Link>
                <Link
                  href="/admin/cases/new"
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 hover:border-emerald-200 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 group-hover:scale-110 transition-transform">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Kredit-Vorgang</span>
                </Link>
                <Link
                  href="/admin/rates"
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 hover:border-emerald-200 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 group-hover:scale-110 transition-transform">
                    <Percent className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Zinsen anpassen</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
