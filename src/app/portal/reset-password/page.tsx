'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEmail('');
      } else {
        setError(data.error || 'Ein Fehler ist aufgetreten.');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConfirm) {
      setError('Passwörter stimmen nicht überein.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/portal/login'), 2000);
      } else {
        setError(data.error || 'Ein Fehler ist aufgetreten.');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const currentYearDisplay = (
    <div className="text-center mt-8 space-y-3">
      <Link href="/" className="text-slate-400 hover:text-slate-300 text-sm transition-colors inline-block">
        ← Zurück zur Startseite
      </Link>
      <p className="text-slate-500 text-xs">
        © {currentYear} Kreditheld24. Alle Rechte vorbehalten.
      </p>
    </div>
  );

  const background = (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
    </div>
  );

  const logo = (
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
      <p className="text-slate-400 mt-2 text-sm font-medium uppercase tracking-wider">Passwort Reset</p>
    </div>
  );


  if (token) {
    // Reset password form
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
        {background}
        <div className="w-full max-w-md relative z-10">
          {logo}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Neues Passwort</h2>
              <p className="text-slate-400 text-sm mt-1">Bitte legen Sie ein neues Passwort fest.</p>
            </div>
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Passwort zurückgesetzt!</h3>
                <p className="text-slate-400">Sie werden zum Login weitergeleitet...</p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Neues Passwort</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-10"
                      placeholder="Mindestens 8 Zeichen"
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
                  <label htmlFor="passwordConfirm" className="block text-sm font-medium text-slate-300 mb-1.5">Komfirmation</label>
                  <div className="relative">
                    <input
                      id="passwordConfirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all pr-10"
                      placeholder="Passwort wiederholen"
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
                      <Loader2 className="w-5 h-5 animate-spin" /> Wird gespeichert...
                    </>
                  ) : 'Passwort zurücksetzen'}
                </button>

                <div className="text-center pt-4 border-t border-white/5">
                  <Link href="/portal/login" className="flex items-center justify-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Zurück zum Login
                  </Link>
                </div>
              </form>
            )}
          </div>
          {currentYearDisplay}
        </div>
      </div>
    );
  }

  // Request reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      {background}
      <div className="w-full max-w-md relative z-10">
        {logo}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Passwort zurücksetzen</h2>
            <p className="text-slate-400 text-sm mt-1">Geben Sie Ihre E-Mail ein, um einen Reset-Link zu erhalten.</p>
          </div>
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">E-Mail-Adresse</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="ihre@email.de"
              />
            </div>

            {message && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

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
                  <Loader2 className="w-5 h-5 animate-spin" /> Wird gesendet...
                </>
              ) : 'Link senden'}
            </button>

            <div className="text-center pt-4 border-t border-white/5">
              <Link href="/portal/login" className="flex items-center justify-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Zurück zum Login
              </Link>
            </div>
          </form>
        </div>
        {currentYearDisplay}
      </div>
    </div>
  );
}
