'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import {
  Percent,
  Search,
  Filter,
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Plus,
  X,
  Save
} from 'lucide-react';

export default function RatesPage() {
  const { data: session, status } = useSession();
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRate, setNewRate] = useState({
    bank: '',
    kreditart: 'Ratenkredit',
    minZins: '',
    maxZins: '',
    repZins: '',
    laufzeitMin: 12,
    laufzeitMax: 84,
    minSumme: 1000,
    maxSumme: 50000,
    source: 'Manuell'
  });

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRate),
      });
      const result = await response.json();
      if (result.success) {
        setRates([result.data, ...rates]);
        setShowAddModal(false);
        setNewRate({
          bank: '',
          kreditart: 'Ratenkredit',
          minZins: '',
          maxZins: '',
          repZins: '',
          laufzeitMin: 12,
          laufzeitMax: 84,
          minSumme: 1000,
          maxSumme: 50000,
          source: 'Manuell'
        });
      }
    } catch (error) {
      console.error('Error creating rate:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      fetchRates();
    }
  }, [status]);

  const fetchRates: any = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rates');
      const data = await response.json();
      if (data.success) {
        setRates(data.data);
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  const filteredRates = rates.filter(rate =>
    rate.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rate.kreditart.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
              <Percent className="h-8 w-8 text-emerald-600" />
              Zinssätze
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Aktuelle Marktzinsen und Konditionen der Partnerbanken.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchRates}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              Manueller Eintrag
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Bank oder Kreditart suchen..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="h-4 w-4 text-slate-400" />
            Quelle
          </button>
        </div>

        {/* Rates Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank & Kreditart</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Zinspanne (eff.)</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Repräs. Zins</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Laufzeit & Summe</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quelle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="h-12 bg-slate-50 rounded-lg"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredRates.length > 0 ? (
                  filteredRates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{rate.bank}</div>
                            <div className="text-xs text-slate-500">{rate.kreditart}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{rate.minZins}% - {rate.maxZins}%</span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Effektiver Jahreszins</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold">
                          {rate.repZins}%
                          <TrendingUp className="h-3 w-3" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-900">{rate.laufzeitMin}-{rate.laufzeitMax}</span>
                            <span className="text-xs">Monate</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            bis {parseInt(rate.maxSumme).toLocaleString('de-DE')} €
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 uppercase tracking-tighter">
                            {rate.source}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-12 w-12 text-slate-200" />
                        <p>Keine Zinssätze gefunden.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Rate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <form onSubmit={handleAddRate}>
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">Manueller Zinssatz</h3>
                <button type="button" onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bank Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={newRate.bank}
                    onChange={(e) => setNewRate({ ...newRate, bank: e.target.value })}
                    placeholder="z.B. Sparkasse"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kreditart</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                    value={newRate.kreditart}
                    onChange={(e) => setNewRate({ ...newRate, kreditart: e.target.value })}
                  >
                    <option value="Ratenkredit">Ratenkredit</option>
                    <option value="Autokredit">Autokredit</option>
                    <option value="Baufinanzierung">Baufinanzierung</option>
                    <option value="Modernisierung">Modernisierung</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Min. Zins (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={newRate.minZins}
                    onChange={(e) => setNewRate({ ...newRate, minZins: e.target.value })}
                    placeholder="0.99"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max. Zins (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={newRate.maxZins}
                    onChange={(e) => setNewRate({ ...newRate, maxZins: e.target.value })}
                    placeholder="9.99"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repräs. Zins (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={newRate.repZins}
                    onChange={(e) => setNewRate({ ...newRate, repZins: e.target.value })}
                    placeholder="3.99"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max. Summe (€)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={newRate.maxSumme}
                    onChange={(e) => setNewRate({ ...newRate, maxSumme: parseInt(e.target.value) || 0 })}
                    placeholder="50000"
                  />
                </div>
              </div>
              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-white rounded-xl transition-all">Abbrechen</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
