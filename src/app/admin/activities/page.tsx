'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import {
  Activity,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Mail,
  FileText,
  User,
  Plus,
  ArrowLeft,
  Clock,
  Briefcase,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

export default function ActivitiesPage() {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      fetchActivities();
    }
  }, [status]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/activities');
      const data = await res.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Aktivität wirklich löschen?')) return;
    try {
      const res = await fetch(`/api/admin/activities/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setActivities(activities.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'document': return FileText;
      case 'system': return Activity;
      case 'note': return FileText;
      case 'call': return Clock;
      case 'meeting': return User;
      default: return Activity;
    }
  };

  if (!session) return null;

  const filteredActivities = activities.filter(a =>
    a.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
                <Activity className="h-8 w-8 text-emerald-600" />
                Aktivitätenverlauf
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Lückenlose Historie aller Ereignisse im System.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Aktivitäten durchsuchen..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="h-4 w-4 text-slate-400" />
            Filter
          </button>
        </div>

        {/* Timeline View */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-6 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
              {filteredActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="relative flex items-start gap-8 group">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border-2 border-emerald-500 shadow-sm group-hover:scale-110 transition-all duration-300 z-10">
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 rounded-2xl bg-slate-50 p-6 border border-slate-100 group-hover:border-emerald-200 group-hover:bg-emerald-50/30 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h4 className="font-bold text-slate-900 text-lg">{activity.subject}</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(activity.date).toLocaleString('de-DE', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg"
                            title="Löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{activity.description}</p>

                      <div className="mt-6 pt-4 border-t border-slate-200/50 flex flex-wrap items-center gap-4">
                        {activity.customerId && (
                          <Link
                            href={`/admin/customers/${activity.customerId}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                          >
                            <User className="h-3.5 w-3.5" />
                            Kundenprofil
                          </Link>
                        )}
                        {activity.caseId && (
                          <Link
                            href={`/admin/cases/${activity.caseId}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors"
                          >
                            <Briefcase className="h-3.5 w-3.5" />
                            Vorgangsdetails
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                <Activity className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Keine Aktivitäten</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                Sobald Aktionen im System durchgeführt werden, erscheinen sie hier chronologisch.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
