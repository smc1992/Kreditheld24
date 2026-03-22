'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import Link from 'next/link';
import { 
  ArrowLeft, 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe, 
  Heart, 
  Baby,
  Loader2,
  Save,
  X
} from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
    birthDate: '',
    birthPlace: '',
    maritalStatus: '',
    childrenCount: 0,
    nationality: '',
    occupation: '',
    employer: '',
    employedSince: '',
    monthlyIncome: '',
  });

  if (!session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Customer created successfully');
        router.push('/admin/customers');
        router.refresh();
      } else {
        const errorData = await response.json();
        console.error('Failed to create customer:', errorData);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
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
            href="/admin/customers"
            className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-emerald-600" />
              Neuer Kunde
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Erfassen Sie alle relevanten Stammdaten für den neuen Kunden.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5 text-emerald-600" />
                Persönliche Daten
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-semibold text-slate-700">Vorname *</label>
                <input
                  id="firstName"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="z.B. Max"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-semibold text-slate-700">Nachname *</label>
                <input
                  id="lastName"
                  type="text"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="z.B. Mustermann"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="birthDate" className="text-sm font-semibold text-slate-700">Geburtsdatum</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="birthDate"
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="birthPlace" className="text-sm font-semibold text-slate-700">Geburtsort</label>
                <input
                  id="birthPlace"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder="z.B. Berlin"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="maritalStatus" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Heart className="h-3 w-3 text-slate-400" />
                  Familienstand
                </label>
                <select
                  id="maritalStatus"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                >
                  <option value="">Wählen...</option>
                  <option value="ledig">Ledig</option>
                  <option value="verheiratet">Verheiratet</option>
                  <option value="geschieden">Geschieden</option>
                  <option value="verwitwet">Verwitwet</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="childrenCount" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Baby className="h-3 w-3 text-slate-400" />
                  Anzahl Kinder
                </label>
                <input
                  id="childrenCount"
                  type="number"
                  min="0"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.childrenCount}
                  onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="nationality" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Globe className="h-3 w-3 text-slate-400" />
                  Staatsangehörigkeit
                </label>
                <input
                  id="nationality"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="z.B. Deutsch"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="occupation" className="text-sm font-semibold text-slate-700">Beruf / Beschäftigung</label>
                <input
                  id="occupation"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="z.B. Angestellter"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="employer" className="text-sm font-semibold text-slate-700">Arbeitgeber</label>
                <input
                  id="employer"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.employer}
                  onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                  placeholder="z.B. Muster GmbH"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="employedSince" className="text-sm font-semibold text-slate-700">Beschäftigt seit</label>
                <input
                  id="employedSince"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.employedSince}
                  onChange={(e) => setFormData({ ...formData, employedSince: e.target.value })}
                  placeholder="z.B. 01/2020 oder 2020-01"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="monthlyIncome" className="text-sm font-semibold text-slate-700">Monatl. Nettoeinkommen (€)</label>
                <input
                  id="monthlyIncome"
                  type="number"
                  min="0"
                  step="1"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  placeholder="z.B. 2500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                Kontaktdaten
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  Adresse
                </label>
                <input
                  id="address"
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Straße, Hausnummer, PLZ, Ort"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Phone className="h-3 w-3 text-slate-400" />
                    Telefonnummer
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 123 456789"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Mail className="h-3 w-3 text-slate-400" />
                    E-Mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="max@mustermann.de"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/customers"
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
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Kunde anlegen
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
