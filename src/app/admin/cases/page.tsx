'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  User,
  Building2,
  Euro,
  ChevronRight,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Activity,
  Trash2,
  Download,
  Mail
} from 'lucide-react';

export default function CasesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCases, setTotalCases] = useState(0);
  const itemsPerPage = 20;
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  const handleBulkDelete = async () => {
    if (!selectedCases.length) return;
    if (confirm(`${selectedCases.length} Vorgänge wirklich unwiderruflich löschen?`)) {
      try {
        await fetch('/api/admin/cases/bulk', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedCases })
        });
        setCases(cases.filter(c => !selectedCases.includes(c.id)));
        setSelectedCases([]);
        setTotalCases(prev => prev - selectedCases.length);
      } catch (err) {
        console.error('Error in bulk delete:', err);
      }
    }
  };

  const fetchCases = async (page: number, search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: search
      });

      const res = await fetch(`/api/admin/cases?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        const formattedCases = data.data.map((item: any) => ({
          ...item.case,
          customer: item.customer
        }));
        setCases(formattedCases);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalCases(data.pagination.total);
        }
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    fetchCases(currentPage, debouncedSearch);
  }, [status, currentPage, debouncedSearch]);

  if (!session) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft': return { label: 'Entwurf', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', icon: Briefcase };
      case 'open': return { label: 'Offen', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock };
      case 'in_progress': return { label: 'In Bearbeitung', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', icon: Activity };
      case 'approved': return { label: 'Genehmigt', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2 };
      case 'rejected': return { label: 'Abgelehnt', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100', icon: XCircle };
      case 'closed': return { label: 'Geschlossen', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100', icon: AlertCircle };
      default: return { label: status, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-100', icon: AlertCircle };
    }
  };

  // Server-side filtered
  const filteredCases = cases;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-emerald-600" />
              Vorgänge
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Verwalten und verfolgen Sie den Status aller Kreditvorgänge.
            </p>
          </div>
          <Link
            href="/admin/cases/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            Neuer Vorgang
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Vorgang suchen (Nummer, Kunde, Bank...)"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="h-4 w-4 text-slate-400" />
            Status
          </button>
          {selectedCases.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              {selectedCases.length} Löschen
            </button>
          )}
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 w-12 text-center border-r border-slate-200/50">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                      checked={filteredCases.length > 0 && selectedCases.length === filteredCases.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCases(filteredCases.map(c => c.id));
                        } else {
                          setSelectedCases([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vorgang & Datum</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kunde</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Finanzierung</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="h-12 bg-slate-50 rounded-lg"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredCases.length > 0 ? (
                  filteredCases.map((caseItem) => {
                    const status = getStatusConfig(caseItem.status);
                    return (
                      <tr key={caseItem.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 w-12 text-center border-r border-slate-200/50">
                          <input
                            type="checkbox"
                            checked={selectedCases.includes(caseItem.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCases([...selectedCases, caseItem.id]);
                              } else {
                                setSelectedCases(selectedCases.filter(id => id !== caseItem.id));
                              }
                            }}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                              <Briefcase className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-bold">{caseItem.caseNumber}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" />
                                {new Date(caseItem.createdAt).toLocaleDateString('de-DE')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-medium text-slate-700">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            {caseItem.customer?.firstName} {caseItem.customer?.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <Euro className="h-3.5 w-3.5 text-slate-400" />
                              {caseItem.requestedAmount ? `${parseFloat(caseItem.requestedAmount).toLocaleString('de-DE')} €` : '-'}
                            </div>
                            {caseItem.approvedAmount && (
                              <div className="text-xs text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {parseFloat(caseItem.approvedAmount).toLocaleString('de-DE')} € genehmigt
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            {caseItem.bank || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${status.bg} ${status.color} ${status.border}`}>
                            <status.icon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/cases/${caseItem.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              Details
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeMenu === caseItem.id) {
                                    setActiveMenu(null);
                                  } else {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setMenuPos({ top: rect.bottom + 5, right: window.innerWidth - rect.right });
                                    setActiveMenu(caseItem.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {activeMenu === caseItem.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setActiveMenu(null)}
                                  />
                                  <div
                                    className="fixed z-50 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                                    style={{ top: `${menuPos.top}px`, right: `${menuPos.right}px` }}
                                  >
                                    <div className="py-1">
                                      <button
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                                      >
                                        <Download className="h-4 w-4 text-emerald-600" />
                                        Exposé (PDF)
                                      </button>
                                      <button
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                                      >
                                        <Mail className="h-4 w-4 text-blue-600" />
                                        An Bank senden
                                      </button>
                                      <div className="h-px bg-slate-100 my-1" />
                                      <button
                                        onClick={async () => {
                                          if (confirm('Vorgang wirklich archivieren?')) {
                                            await fetch(`/api/admin/cases/${caseItem.id}`, {
                                              method: 'PATCH',
                                              headers: { 'Content-Type': 'application/json' },
                                              body: JSON.stringify({ status: 'closed' })
                                            });
                                            router.refresh();
                                          }
                                          setActiveMenu(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 font-medium"
                                      >
                                        <XCircle className="h-4 w-4" />
                                        Archivieren
                                      </button>
                                      <button
                                        onClick={async () => {
                                          if (confirm('Vorgang wirklich unwiderruflich löschen?')) {
                                            await fetch(`/api/admin/cases/${caseItem.id}`, {
                                              method: 'DELETE'
                                            });
                                            setCases(cases.filter(c => c.id !== caseItem.id));
                                          }
                                          setActiveMenu(null);
                                        }}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Löschen
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      Keine Vorgänge gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-sm">
          <p className="text-xs text-slate-500">
            Zeige <span className="font-semibold">{Math.min(totalCases, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(totalCases, currentPage * itemsPerPage)}</span> von <span className="font-semibold">{totalCases}</span> Vorgängen
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Zurück
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || loading}
              className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Weiter
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
