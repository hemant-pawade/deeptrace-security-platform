import React from 'react';
import { LogOut, Building2, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#0B0F17]/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Active Organization context */}
      <div className="flex items-center gap-2.5">
        <Building2 className="w-4 h-4 text-sky-400" />
        <span className="text-xs text-slate-400">Tenant:</span>
        <span className="text-sm font-semibold text-slate-200">
          {user?.tenant?.name || 'Isolated Organization'}
        </span>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
          {user?.tenant?.slug}
        </span>
      </div>

      {/* User profile & controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <UserCircle2 className="w-5 h-5" />
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-slate-200">{user?.full_name}</div>
            <div className="text-[11px] text-slate-400 font-mono">{user?.email}</div>
          </div>
          <Badge variant={user?.role}>{user?.role}</Badge>
        </div>

        <button
          onClick={logout}
          title="Sign out of current tenant session"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
