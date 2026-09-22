import React, { useState, useEffect } from 'react';
import { LogOut, Building2, UserCircle2, ShieldCheck, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC').split(' ').slice(4, 6).join(' '));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Active Organization context & Telemetry */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <Building2 className="w-4 h-4 text-sky-400" />
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Tenant:</span>
          <span className="text-xs font-semibold text-slate-100">
            {user?.tenant?.name || 'Isolated Organization'}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
            {user?.tenant?.slug || 'CORP'}
          </span>
        </div>

        {/* Real-time telemetry indicators */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ISOLATION: ENFORCED
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            AES-256 JWT
          </span>
          {utcTime && (
            <span className="text-slate-400 font-mono text-[11px] border-l border-slate-800 pl-3">
              {utcTime}
            </span>
          )}
        </div>
      </div>

      {/* User profile & controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 pr-3 border-r border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <UserCircle2 className="w-5 h-5" />
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">{user?.full_name}</div>
            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{user?.email}</div>
          </div>
          <Badge variant={user?.role}>{user?.role}</Badge>
        </div>

        <button
          onClick={logout}
          title="Sign out of current tenant session"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-slate-800/60 hover:border-rose-500/30 transition-all cursor-pointer font-medium"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
