'use client';

// Force dynamic rendering to prevent useContext errors during static generation
export const dynamic = 'force-dynamic'

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';

export default function PortalLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/portal';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Ungültige Anmeldedaten');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 px-4">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-xl shadow-emerald-500/20 mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Kreditheld24
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-wider">
            Kundenportal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Willkommen zurück</h2>
            <p className="text-slate-400 text-sm mt-1">Bitte melden Sie sich an, um fortzufahren.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="kunde@beispiel.de"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Passwort
                </label>
                <Link 
                  href="/portal/reset-password" 
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Passwort vergessen?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
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
                  Anmelden...
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              Noch kein Konto?{' '}
              <Link href="/portal/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                Jetzt registrieren
              </Link>
            </p>
          </div>

          {/* Demo Credentials Hint */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Demo Zugang:</span><br/>
              test@kreditheld24.de / test123
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
