'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PortalLayout from '@/components/portal/PortalLayout';
import { User, Mail, Phone, MapPin, Save, Loader2, Lock, Calendar } from 'lucide-react';
import { signOut, signIn } from 'next-auth/react';

interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  createdAt: string;
}

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [addressFields, setAddressFields] = useState({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/portal/login');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, session, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/portal/profile');
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          firstName: data.data.firstName || '',
          lastName: data.data.lastName || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          address: data.data.address || '',
        });
        
        // Parse address into separate fields for better UX
        if (data.data.address) {
          const addressParts = data.data.address.split(',').map((part: string) => part.trim());
          const streetParts = addressParts[0]?.split(' ') || [];
          const houseNumber = streetParts.pop() || '';
          const street = streetParts.join(' ') || '';
          const postalAndCity = addressParts[1]?.split(' ') || [];
          const postalCode = postalAndCity[0] || '';
          const city = postalAndCity.slice(1).join(' ') || '';
          
          setAddressFields({
            street,
            houseNumber,
            postalCode,
            city,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Combine address fields into single string
      const combinedAddress = addressFields.street && addressFields.houseNumber
        ? `${addressFields.street} ${addressFields.houseNumber}, ${addressFields.postalCode} ${addressFields.city}`.trim()
        : '';
      
      const res = await fetch('/api/portal/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          address: combinedAddress,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Profil erfolgreich aktualisiert!');
        // Force immediate session refresh by reloading with cache bypass
        window.location.reload();
      } else {
        alert('Fehler: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwörter stimmen nicht überein!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Passwort muss mindestens 8 Zeichen lang sein!');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/portal/profile/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
      });
      const result = await res.json();
      if (result.success) {
        alert('Passwort erfolgreich geändert!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert('Fehler: ' + result.error);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Fehler beim Ändern des Passworts');
    } finally {
      setSaving(false);
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
        <div>
          <h1 className="text-2xl font-bold text-white">Mein Profil</h1>
          <p className="text-slate-400 mt-1">Verwalten Sie Ihre persönlichen Daten</p>
        </div>

        {/* Persönliche Informationen */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-500" />
            Persönliche Informationen
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Vorname</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Nachname</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-Mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresse
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-sm font-bold text-slate-300 mb-2">Straße</label>
                  <input
                    type="text"
                    value={addressFields.street}
                    onChange={(e) => setAddressFields({ ...addressFields, street: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Nr.</label>
                  <input
                    type="text"
                    value={addressFields.houseNumber}
                    onChange={(e) => setAddressFields({ ...addressFields, houseNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">PLZ</label>
                <input
                  type="text"
                  value={addressFields.postalCode}
                  onChange={(e) => setAddressFields({ ...addressFields, postalCode: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Stadt</label>
                <input
                  type="text"
                  value={addressFields.city}
                  onChange={(e) => setAddressFields({ ...addressFields, city: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Speichern
            </button>
          </div>
        </div>

        {/* Passwort ändern */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-500" />
            Passwort ändern
          </h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Aktuelles Passwort</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Neues Passwort</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Passwort bestätigen</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
              Passwort ändern
            </button>
          </div>
        </div>

        {profile && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              Kontoinformationen
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Mitglied seit</p>
                <p className="text-white font-bold">{new Date(profile.createdAt).toLocaleDateString('de-DE')}</p>
              </div>
              {profile.dateOfBirth && (
                <div>
                  <p className="text-slate-400">Geburtsdatum</p>
                  <p className="text-white font-bold">{new Date(profile.dateOfBirth).toLocaleDateString('de-DE')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
