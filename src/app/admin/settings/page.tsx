'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { useAdminTheme } from '@/providers/AdminThemeProvider';
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Mail, 
  Save, 
  Loader2,
  Database,
  Globe,
  Palette,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { colorTheme, darkMode, compactMode, setColorTheme, setDarkMode, setCompactMode, refreshSettings } = useAdminTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<any>({
    appearance: {
      theme: 'emerald',
      compactMode: false,
      darkMode: false
    },
    notifications: {
      newCustomer: true,
      caseUpdate: true,
      systemWarnings: true,
      documentUpload: true
    },
    smtp: {
      server: '',
      fromName: 'Kreditheld24',
      fromEmail: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || ''
      });
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.data) {
        // Merge loaded settings with defaults to prevent null references
        setSettings({
          appearance: {
            theme: data.data.appearance?.theme || 'emerald',
            compactMode: data.data.appearance?.compactMode || false,
            darkMode: data.data.appearance?.darkMode || false
          },
          notifications: {
            newCustomer: data.data.notifications?.newCustomer ?? true,
            caseUpdate: data.data.notifications?.caseUpdate ?? true,
            systemWarnings: data.data.notifications?.systemWarnings ?? true,
            documentUpload: data.data.notifications?.documentUpload ?? true
          },
          smtp: {
            server: data.data.smtp?.server || '',
            fromName: data.data.smtp?.fromName || 'Kreditheld24',
            fromEmail: data.data.smtp?.fromEmail || ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      const result = await res.json();
      if (result.success) {
        alert('Profil erfolgreich aktualisiert!');
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

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwörter stimmen nicht überein!');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/profile/password', {
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
      console.error('Error updating password:', error);
      alert('Fehler beim Ändern des Passworts');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const result = await res.json();
      if (result.success) {
        alert('Einstellungen erfolgreich gespeichert!');
      } else {
        alert('Fehler: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Fehler beim Speichern der Einstellungen');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-3">
            <Settings className="h-8 w-8 text-emerald-600" />
            Einstellungen
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Verwalten Sie Ihr Konto und die Systemeinstellungen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'profile', label: 'Profil', icon: User },
              { id: 'security', label: 'Sicherheit', icon: Shield },
              { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
              { id: 'system', label: 'System', icon: Database },
              { id: 'appearance', label: 'Erscheinungsbild', icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {activeTab === 'profile' && 'Profil-Einstellungen'}
                  {activeTab === 'security' && 'Sicherheit & Passwort'}
                  {activeTab === 'notifications' && 'Benachrichtigungs-Präferenzen'}
                  {activeTab === 'system' && 'System-Konfiguration'}
                  {activeTab === 'appearance' && 'Design & Interface'}
                </h2>
              </div>

              <div className="p-8">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                      <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl border border-emerald-200 shadow-sm">
                        {profileData.name?.[0] || 'A'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">Profilbild</h3>
                        <p className="text-sm text-slate-500 mb-3">Laden Sie ein neues Bild hoch.</p>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-50 transition-all">Hochladen</button>
                          <button className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 transition-all">Entfernen</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Anzeigename</label>
                        <input 
                          type="text" 
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">E-Mail Adresse</label>
                        <input 
                          type="email" 
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400" />
                          Aktuelles Passwort
                        </label>
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-slate-400" />
                          Neues Passwort
                        </label>
                        <input 
                          type="password" 
                          placeholder="Mindestens 8 Zeichen" 
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Passwort bestätigen</label>
                        <input 
                          type="password" 
                          placeholder="Passwort wiederholen" 
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Das Passwort muss mindestens 8 Zeichen lang sein und sollte Sonderzeichen sowie Zahlen enthalten, um die Sicherheit zu gewährleisten.
                      </p>
                    </div>
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Palette className="h-4 w-4 text-emerald-600" />
                        Farbschema & Design
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div 
                          onClick={() => {
                            setSettings({...settings, appearance: {...settings.appearance, theme: 'emerald'}});
                            setColorTheme('emerald');
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${colorTheme === 'emerald' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-emerald-700">Emerald (Standard)</span>
                            {colorTheme === 'emerald' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                          </div>
                          <div className="flex gap-1">
                            <div className="h-4 w-full bg-emerald-600 rounded-sm" />
                            <div className="h-4 w-full bg-emerald-400 rounded-sm" />
                            <div className="h-4 w-full bg-slate-900 rounded-sm" />
                          </div>
                        </div>
                        <div 
                          onClick={() => {
                            setSettings({...settings, appearance: {...settings.appearance, theme: 'ocean'}});
                            setColorTheme('ocean');
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${colorTheme === 'ocean' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-blue-700">Ocean Blue</span>
                            {colorTheme === 'ocean' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                          </div>
                          <div className="flex gap-1">
                            <div className="h-4 w-full bg-blue-600 rounded-sm" />
                            <div className="h-4 w-full bg-blue-400 rounded-sm" />
                            <div className="h-4 w-full bg-slate-900 rounded-sm" />
                          </div>
                        </div>
                        <div 
                          onClick={() => {
                            setSettings({...settings, appearance: {...settings.appearance, theme: 'purple'}});
                            setColorTheme('purple');
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${colorTheme === 'purple' ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-purple-700">Deep Purple</span>
                            {colorTheme === 'purple' && <CheckCircle2 className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div className="flex gap-1">
                            <div className="h-4 w-full bg-purple-600 rounded-sm" />
                            <div className="h-4 w-full bg-purple-400 rounded-sm" />
                            <div className="h-4 w-full bg-slate-900 rounded-sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 mb-4">Interface Optionen</h3>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                          <p className="text-sm font-bold text-slate-700">Kompakter Modus</p>
                          <p className="text-xs text-slate-500">Weniger Abstände in Tabellen und Listen</p>
                        </div>
                        <button 
                          onClick={() => {
                            const newCompact = !compactMode;
                            setSettings({...settings, appearance: {...settings.appearance, compactMode: newCompact}});
                            setCompactMode(newCompact);
                          }}
                          className={`h-6 w-11 rounded-full relative transition-colors ${compactMode ? 'bg-emerald-600' : 'bg-slate-200'}`}
                        >
                          <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${compactMode ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div>
                          <p className="text-sm font-bold text-slate-700">Dark Mode (Beta)</p>
                          <p className="text-xs text-slate-500">Dunkles Design für die gesamte Admin-Oberfläche</p>
                        </div>
                        <button 
                          onClick={() => {
                            const newDark = !darkMode;
                            setSettings({...settings, appearance: {...settings.appearance, darkMode: newDark}});
                            setDarkMode(newDark);
                          }}
                          className={`h-6 w-11 rounded-full relative transition-colors ${darkMode ? 'bg-emerald-600' : 'bg-slate-200'}`}
                        >
                          <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${darkMode ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-emerald-600" />
                        E-Mail Benachrichtigungen
                      </h3>
                      {[
                        { key: 'newCustomer', title: 'Neuer Kunde', desc: 'Benachrichtigung bei Neuregistrierung über das Frontend' },
                        { key: 'caseUpdate', title: 'Vorgangs-Update', desc: 'Statusänderungen an aktiven Kreditvorgängen' },
                        { key: 'systemWarnings', title: 'System-Warnungen', desc: 'Sicherheitsrelevante Ereignisse und Server-Status' },
                        { key: 'documentUpload', title: 'Dokumenten-Upload', desc: 'Wenn ein Kunde neue Unterlagen hochlädt' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <p className="text-sm font-bold text-slate-700">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                          <button 
                            onClick={() => setSettings({...settings, notifications: {...settings.notifications, [item.key]: !settings.notifications[item.key]}})}
                            className={`h-6 w-11 rounded-full relative transition-colors ${settings.notifications[item.key] ? 'bg-emerald-600' : 'bg-slate-200'}`}
                          >
                            <div className={`h-4 w-4 bg-white rounded-full absolute top-1 transition-all ${settings.notifications[item.key] ? 'right-1' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-emerald-600" />
                          SMTP & E-Mail Versand
                        </h3>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">SMTP Server</label>
                          <input 
                            type="text" 
                            value={settings.smtp.server} 
                            onChange={(e) => setSettings({...settings, smtp: {...settings.smtp, server: e.target.value}})}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absender Name</label>
                          <input 
                            type="text" 
                            value={settings.smtp.fromName} 
                            onChange={(e) => setSettings({...settings, smtp: {...settings.smtp, fromName: e.target.value}})}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absender E-Mail</label>
                          <input 
                            type="email" 
                            value={settings.smtp.fromEmail} 
                            onChange={(e) => setSettings({...settings, smtp: {...settings.smtp, fromEmail: e.target.value}})}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-emerald-600" />
                          API Keys & Dienste
                        </h3>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resend API Key</label>
                          <input type="password" value="••••••••••••••••" readOnly className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drizzle Database URL</label>
                          <input type="password" value="••••••••••••••••" readOnly className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-not-allowed" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-900 rounded-3xl text-white">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="font-bold text-lg leading-tight">System Status</h4>
                          <p className="text-slate-400 text-xs mt-1">Alle Systeme laufen normal</p>
                        </div>
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Uptime</p>
                          <p className="text-sm font-bold mt-1">99.9%</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Latency</p>
                          <p className="text-sm font-bold mt-1">24ms</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Storage</p>
                          <p className="text-sm font-bold mt-1">2.4 / 10GB</p>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Version</p>
                          <p className="text-sm font-bold mt-1">v1.2.0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => {
                      if (activeTab === 'profile') handleSaveProfile();
                      else if (activeTab === 'security') handleUpdatePassword();
                      else handleSaveSettings();
                    }}
                    disabled={saving}
                    className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-8 py-2.5 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
