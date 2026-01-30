'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function PortalRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen.');
      }

      setSuccess(true);

      // Auto-login after registration
      setTimeout(async () => {
        const loginRes = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (!loginRes?.error) {
          router.push('/portal');
        } else {
          router.push('/portal/login?registered=true');
        }
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mx-auto bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-emerald-500/50">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registrierung erfolgreich!</h2>
            <p className="text-slate-400 mb-6">
              Ihr Benutzerkonto wurde erstellt. Sie werden automatisch weitergeleitet...
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4 py-8">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-xl shadow-emerald-500/20 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Kreditheld24</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-wider">Kundenportal</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Konto erstellen</h2>
            <p className="text-slate-400 text-sm mt-1">Registrieren Sie sich, um Ihre Kreditanfragen zu sehen.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1.5">Vorname</label>
                <input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1.5">Nachname</label>
                <input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">E-Mail-Adresse</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="name@beispiel.de"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Passwort</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">Passwort bestätigen</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Konto erstellen...
                </>
              ) : (
                'Konto erstellen'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              Bereits ein Konto?{' '}
              <Link href="/portal/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Hier anmelden
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 space-y-3">
          <Link href="/" className="text-slate-400 hover:text-slate-300 text-sm transition-colors inline-block">
            ← Zurück zur Startseite
          </Link>
          <p className="text-slate-500 text-xs">
            © {currentYear} Kreditheld24. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  );
}
