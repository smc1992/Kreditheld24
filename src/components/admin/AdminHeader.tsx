'use client';

import { useSession } from 'next-auth/react';
import { Bell, Search, Menu, User, Briefcase, ChevronRight, Loader2, X, Mail, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminHeader({
  onMenuClick
}: {
  onMenuClick?: () => void
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ customers: any[], cases: any[] }>({ customers: [], cases: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState<{ emails: any[], system: any[], count: number }>({ emails: [], system: [], count: 0 });
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications();
      // Poll for new notifications every 60 seconds
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch();
      } else {
        setSearchResults({ customers: [], cases: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsSearching(true);
    setShowResults(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm transition-all">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md ml-4 relative" ref={searchRef}>
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Schnellsuche (Kunde, Vorgang...)"
              className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-all"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {isSearching ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mx-auto" />
                    <p className="text-xs text-slate-500 mt-2 font-bold uppercase">Suche läuft...</p>
                  </div>
                ) : (
                  <>
                    {/* Customers Section */}
                    <div className="p-2">
                      <h3 className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kunden</h3>
                      {searchResults.customers.length > 0 ? (
                        searchResults.customers.map((c) => (
                          <Link
                            key={c.id}
                            href={`/admin/customers/${c.id}`}
                            onClick={() => setShowResults(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-all group"
                          >
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-900 truncate">{c.firstName} {c.lastName}</p>
                              <p className="text-[10px] text-slate-500 truncate">{c.email}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))
                      ) : (
                        <p className="px-3 py-4 text-xs text-slate-400 italic">Keine Kunden gefunden</p>
                      )}
                    </div>

                    <div className="h-px bg-slate-100 mx-2" />

                    {/* Cases Section */}
                    <div className="p-2">
                      <h3 className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vorgänge</h3>
                      {searchResults.cases.length > 0 ? (
                        searchResults.cases.map((cs) => (
                          <Link
                            key={cs.id}
                            href={`/admin/cases/${cs.id}`}
                            onClick={() => setShowResults(false)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-all group"
                          >
                            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <Briefcase className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-900 truncate">{cs.caseNumber}</p>
                              <p className="text-[10px] text-slate-500 truncate">{cs.bank || 'Keine Bank hinterlegt'}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))
                      ) : (
                        <p className="px-3 py-4 text-xs text-slate-400 italic">Keine Vorgänge gefunden</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <Bell className="h-5 w-5" />
            {notifications.count > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Benachrichtigungen</h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {notifications.count} Neu
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.count > 0 ? (
                  <div className="divide-y divide-slate-50">
                    {notifications.emails.map((n) => (
                      <Link
                        key={n.id}
                        href={`/admin/emails?id=${n.id}`}
                        onClick={() => setShowNotifications(false)}
                        className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-all group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{n.subject}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{n.description}</p>
                          <p className="text-[9px] text-slate-400 mt-1 font-medium">{new Date(n.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</p>
                        </div>
                      </Link>
                    ))}
                    {notifications.system.map((n) => (
                      n.caseId ? (
                        <Link
                          key={n.id}
                          href={`/admin/cases/${n.caseId}`}
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-all group"
                        >
                          <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{n.subject}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{n.description}</p>
                            <p className="text-[9px] text-slate-400 mt-1 font-medium">{new Date(n.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</p>
                          </div>
                        </Link>
                      ) : (
                        <div
                          key={n.id}
                          className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-all group cursor-default"
                        >
                          <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{n.subject}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{n.description}</p>
                            <p className="text-[9px] text-slate-400 mt-1 font-medium">{new Date(n.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</p>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Bell className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-xs text-slate-400 font-medium italic">Keine neuen Nachrichten</p>
                  </div>
                )}
              </div>
              <Link
                href="/admin/activities"
                onClick={() => setShowNotifications(false)}
                className="block p-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 border-t border-slate-100 transition-colors"
              >
                Alle Aktivitäten ansehen
              </Link>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">
              {session?.user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1">
              Admin-Status
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 font-bold border border-emerald-200 shadow-sm">
            {session?.user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
}
