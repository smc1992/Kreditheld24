'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Briefcase, 
  User, 
  Building2, 
  Euro, 
  Calendar, 
  Clock, 
  Plus, 
  Save, 
  X,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function NewCaseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customerId: searchParams.get('customerId') || '',
    caseNumber: '',
    advisorName: '',
    advisorNumber: '',
    requestedAmount: '',
    approvedAmount: '',
    bank: '',
    duration: '',
    followUpDate: '',
    status: 'open',
  });

  useEffect(() => {
    if (!session) return;

    // Fetch customers for dropdown
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCustomers(data.data);
        }
      })
      .catch(err => console.error('Error fetching customers:', err));

    // Generate case number if not already set
    if (!formData.caseNumber) {
      const caseNumber = `VG-${Date.now().toString().slice(-8)}`;
      setFormData(prev => ({ ...prev, caseNumber }));
    }
  }, [session]);

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          requestedAmount: formData.requestedAmount ? parseFloat(formData.requestedAmount) : null,
          approvedAmount: formData.approvedAmount ? parseFloat(formData.approvedAmount) : null,
          duration: formData.duration ? parseInt(formData.duration) : null,
        }),
      });

      if (response.ok) {
        router.push('/admin/cases');
        router.refresh();
      }
    } catch (error) {
      console.error('Error creating case:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/cases"
            className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
              <Plus className="h-8 w-8 text-emerald-600" />
              Neuer Vorgang
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Legen Sie einen neuen Kreditvorgang für einen Kunden an.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Base Info Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                Vorgangsbasis
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="customerId" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="h-3 w-3 text-slate-400" />
                  Kunde *
                </label>
                <div className="relative">
                  <select
                    id="customerId"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  >
                    <option value="">Kunde wählen...</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName} ({customer.email})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="caseNumber" className="text-sm font-semibold text-slate-700">Vorgangsnummer *</label>
                <input
                  id="caseNumber"
                  type="text"
                  required
                  readOnly
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 font-mono cursor-not-allowed"
                  value={formData.caseNumber}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="advisorName" className="text-sm font-semibold text-slate-700">Berater Name</label>
                <input
                  id="advisorName"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.advisorName}
                  onChange={(e) => setFormData({ ...formData, advisorName: e.target.value })}
                  placeholder="z.B. Andreas Schmidt"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="advisorNumber" className="text-sm font-semibold text-slate-700">Berater Nummer</label>
                <input
                  id="advisorNumber"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.advisorNumber}
                  onChange={(e) => setFormData({ ...formData, advisorNumber: e.target.value })}
                  placeholder="z.B. BER-12345"
                />
              </div>
            </div>
          </div>

          {/* Credit Details Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Euro className="h-5 w-5 text-emerald-600" />
                Finanzierungsdetails
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="requestedAmount" className="text-sm font-semibold text-slate-700">Beantragter Betrag (€)</label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="requestedAmount"
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-bold"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                    placeholder="50000.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="approvedAmount" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Genehmigter Betrag (€)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="approvedAmount"
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-bold text-emerald-600"
                    value={formData.approvedAmount}
                    onChange={(e) => setFormData({ ...formData, approvedAmount: e.target.value })}
                    placeholder="45000.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="bank" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Building2 className="h-3 w-3 text-slate-400" />
                  Bank / Partner
                </label>
                <input
                  id="bank"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  placeholder="z.B. Sparkasse"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Clock className="h-3 w-3 text-slate-400" />
                  Laufzeit (Monate)
                </label>
                <input
                  id="duration"
                  type="number"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="z.B. 60"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="followUpDate" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  Wiedervorlage
                </label>
                <input
                  id="followUpDate"
                  type="date"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-slate-400" />
                  Status
                </label>
                <select
                  id="status"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none font-bold"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="open">Offen</option>
                  <option value="in_progress">In Bearbeitung</option>
                  <option value="approved">Genehmigt</option>
                  <option value="rejected">Abgelehnt</option>
                  <option value="closed">Geschlossen</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/cases"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <X className="h-4 w-4" />
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird erstellt...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Vorgang anlegen
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default function NewCasePage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    }>
      <NewCaseForm />
    </Suspense>
  );
}
