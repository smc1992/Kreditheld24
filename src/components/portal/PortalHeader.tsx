'use client';

import { useSession } from 'next-auth/react';
import { Bell, Menu, User } from 'lucide-react';
import { useState } from 'react';

export default function PortalHeader({ 
  onMenuClick 
}: { 
  onMenuClick?: () => void 
}) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-700 bg-slate-800/80 px-6 backdrop-blur-sm transition-all">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white">Kundenportal</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button 
          className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-slate-700 pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">
              {session?.user?.name || 'Kunde'}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-1">
              Kundenportal
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-white font-bold shadow-lg shadow-emerald-900/20">
            {session?.user?.name?.[0]?.toUpperCase() || 'K'}
          </div>
        </div>
      </div>
    </header>
  );
}
