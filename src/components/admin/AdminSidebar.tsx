'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Percent, 
  Settings, 
  LogOut,
  ChevronRight,
  Mail,
  MessageSquare,
  MessageCircle,
  BookOpen
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Kunden', href: '/admin/customers', icon: Users },
  { name: 'Vorgänge', href: '/admin/cases', icon: Briefcase },
  { name: 'Nachrichten', href: '/admin/messages', icon: MessageSquare, badgeKey: 'messages' as const },
  { name: 'WhatsApp', href: '/admin/whatsapp', icon: MessageCircle, badgeKey: 'whatsapp' as const },
  { name: 'E-Mails', href: '/admin/emails', icon: Mail },
  { name: 'Knowledge Base', href: '/admin/knowledge', icon: BookOpen },
  { name: 'Zinssätze', href: '/admin/rates', icon: Percent },
  { name: 'Einstellungen', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll unread messages every 15 seconds
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/admin/chat/unread', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.unreadCount);
        }
      } catch (err) {
        // silently ignore polling errors
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      {/* Logo Area */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-900/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          Kreditheld24
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
          const showBadge = item.badgeKey === 'messages' && unreadCount > 0;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                {item.name}
              </div>
              <div className="flex items-center gap-2">
                {showBadge && (
                  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-white text-emerald-700'
                      : 'bg-red-500 text-white animate-pulse'
                  }`}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          Abmelden
        </button>
      </div>
    </div>
  );
}
