'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  ChevronRight,
  MoreVertical,
  Download,
  CheckSquare,
  Square,
  Send,
  Trash2,
  RefreshCw
} from 'lucide-react';
import EmailEditor from '@/components/admin/EmailEditor';

export default function CustomersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const handleEuropaceSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    
    try {
      const response = await fetch('/api/admin/europace/sync-customers', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setSyncResult(result);
        // Refresh customer list
        const customersRes = await fetch('/api/admin/customers', { cache: 'no-store' });
        const customersData = await customersRes.json();
        if (customersData.success) {
          setCustomers(customersData.data);
        }
      } else {
        alert('Synchronisation fehlgeschlagen: ' + result.error);
      }
    } catch (error) {
      console.error('Error syncing with Europace:', error);
      alert('Fehler bei der Synchronisation mit Europace.');
    } finally {
      setSyncing(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm('Möchten Sie diesen Kunden wirklich unwiderruflich löschen? Alle zugehörigen Vorgänge und Dokumente werden ebenfalls entfernt.')) return;

    try {
      const response = await fetch(`/api/admin/customers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setCustomers(customers.filter(c => c.id !== id));
        setActiveMenu(null);
      } else {
        alert('Fehler beim Löschen: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Ein Fehler ist aufgetreten.');
    }
  };

  useEffect(() => {
    if (!session) {
      router.push('/admin/login');
      return;
    }

    fetch('/api/admin/customers', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched customers:', data);
        if (data.success) {
          setCustomers(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
        setLoading(false);
      });
  }, [session, router]);

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const toggleSelectCustomer = (id: string) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(item => item !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleBulkEmail = (emailData: any) => {
    const emails = customers
      .filter(c => selectedCustomers.includes(c.id))
      .map(c => c.email)
      .filter(Boolean);
    
    console.log('Bulk Sending to:', emails, emailData);
    alert(`${emails.length} E-Mails wurden in die Warteschlange gestellt.`);
    setShowEmailEditor(false);
    setSelectedCustomers([]);
  };

  if (!session) return null;

  const filteredCustomers = customers.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
              <Users className="h-8 w-8 text-emerald-600" />
              Kunden
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Verwalten und segmentieren Sie Ihre Kundendaten effizient.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedCustomers.length > 0 && (
              <button 
                onClick={() => setShowEmailEditor(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 shadow-sm ring-1 ring-inset ring-emerald-200 hover:bg-emerald-100 transition-all animate-in fade-in slide-in-from-right-2"
              >
                <Send className="h-4 w-4" />
                Bulk-Mail ({selectedCustomers.length})
              </button>
            )}
            <button 
              onClick={handleEuropaceSync}
              disabled={syncing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Synchronisiere...' : 'Europace Sync'}
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all">
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link
              href="/admin/customers/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              Neuer Kunde
            </Link>
          </div>
        </div>

        {/* Sync Result Notification */}
        {syncResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-900 mb-2">Europace Synchronisation abgeschlossen</h3>
                <p className="text-sm text-blue-700 mb-3">{syncResult.message}</p>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="text-blue-600 font-bold text-lg">{syncResult.results?.total || 0}</div>
                    <div className="text-slate-600">Gefunden</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <div className="text-green-600 font-bold text-lg">{syncResult.results?.created || 0}</div>
                    <div className="text-slate-600">Neu erstellt</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-yellow-100">
                    <div className="text-yellow-600 font-bold text-lg">{syncResult.results?.updated || 0}</div>
                    <div className="text-slate-600">Aktualisiert</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-100">
                    <div className="text-slate-600 font-bold text-lg">{syncResult.results?.skipped || 0}</div>
                    <div className="text-slate-600">Übersprungen</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSyncResult(null)}
                className="ml-4 text-blue-400 hover:text-blue-600 transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>
        )}

        {/* E-Mail Editor Overlay for Bulk */}
        {showEmailEditor && (
          <EmailEditor
            onSend={handleBulkEmail}
            onClose={() => setShowEmailEditor(false)}
            customerEmail={customers
              .filter(c => selectedCustomers.includes(c.id))
              .map(c => c.email)
              .filter(Boolean)
              .join(', ')}
          />
        )}

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Kunden suchen (Name, E-Mail...)"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="h-4 w-4 text-slate-400" />
            Filter
          </button>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 w-10">
                    <button 
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                        <CheckSquare className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name & Nationalität</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kontakt</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Erstellt am</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-10 bg-slate-50 rounded-lg"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className={`hover:bg-slate-50/50 transition-colors group ${selectedCustomers.includes(customer.id) ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleSelectCustomer(customer.id)}
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {selectedCustomers.includes(customer.id) ? (
                            <CheckSquare className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm border border-emerald-200 shadow-sm">
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 leading-tight">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {customer.nationality || 'Unbekannt'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {customer.email && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          Aktiv
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {new Date(customer.createdAt).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            Details
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activeMenu === customer.id) {
                                  setActiveMenu(null);
                                } else {
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setMenuPos({ top: rect.bottom + 5, right: window.innerWidth - rect.right });
                                  setActiveMenu(customer.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {activeMenu === customer.id && (
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
                                      onClick={() => {
                                        setSelectedCustomers([customer.id]);
                                        setShowEmailEditor(true);
                                        setActiveMenu(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                                    >
                                      <Mail className="h-4 w-4 text-emerald-600" />
                                      E-Mail schreiben
                                    </button>
                                    <Link
                                      href={`/admin/customers/${customer.id}`}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                                    >
                                      <Users className="h-4 w-4 text-blue-600" />
                                      Profil bearbeiten
                                    </Link>
                                    <div className="h-px bg-slate-100 my-1" />
                                    <button
                                      onClick={() => deleteCustomer(customer.id)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                          <Users className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-slate-500 text-sm">Keine Kunden gefunden.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination (Visual only for now) */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Zeige <span className="font-semibold">{filteredCustomers.length}</span> von <span className="font-semibold">{customers.length}</span> Kunden
            </p>
            <div className="flex gap-2">
              <button disabled className="px-3 py-1 border border-slate-200 rounded text-xs font-medium text-slate-400 disabled:opacity-50">
                Zurück
              </button>
              <button disabled className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                Weiter
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
