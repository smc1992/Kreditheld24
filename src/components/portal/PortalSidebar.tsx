'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/portal', icon: LayoutDashboard },
  { name: 'Meine Vorgänge', href: '/portal/cases', icon: Briefcase },
  { name: 'Dokumente', href: '/portal/documents', icon: FileText },
  { name: 'Profil', href: '/portal/profile', icon: User },
];

export default function PortalSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-800 text-white">
      {/* Logo Area */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-900/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Kreditheld24
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Kundenportal
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/portal' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/portal/login' })}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          Abmelden
        </button>
      </div>
    </div>
  );
}
