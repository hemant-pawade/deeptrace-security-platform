import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  FolderKanban,
  Users,
  ScrollText,
  Shield,
  Lock,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
  const { user, canViewAuditLogs, isManager, isAdmin } = useAuth();

  const navItems = [
    {
      name: 'SOC Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      show: true,
      tag: 'LIVE',
    },
    {
      name: 'Campaign Operations',
      path: '/campaigns',
      icon: FolderKanban,
      show: true,
    },
    {
      name: 'Security Incidents',
      path: '/security-events',
      icon: ShieldAlert,
      show: true,
    },
    {
      name: 'Operative Directory',
      path: '/users',
      icon: Users,
      show: isAdmin || isManager,
    },
    {
      name: 'Immutable Audit Trail',
      path: '/audit-logs',
      icon: ScrollText,
      show: canViewAuditLogs,
    },
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm shadow-sky-500/10">
            <Shield className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0B0F17] animate-pulse"></span>
          </div>
          <div>
            <div className="font-bold text-sm tracking-wider text-slate-100 uppercase">
              Deep Trace
            </div>
            <div className="text-[10px] tracking-widest text-sky-400 uppercase font-mono">
              Cybernetics
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Indicator in Sidebar */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <div className="flex items-center justify-between">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Tenant Boundary
          </div>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ISOLATED
          </span>
        </div>
        <div className="text-xs font-semibold text-sky-300 truncate mt-1">
          {user?.tenant?.name || 'Isolated Organization'}
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
          id: {user?.tenant_id ? `${user.tenant_id.slice(0, 8)}...` : 'env_default'}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        <div className="px-2 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Navigation Modules
        </div>
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-300 border-l-2 border-sky-400 border-t border-r border-b border-slate-800 shadow-[inset_0_0_12px_rgba(56,189,248,0.06)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.name}</span>
                </div>
                {item.tag && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {item.tag}
                  </span>
                )}
              </NavLink>
            );
          })}
      </nav>

      {/* Security Context Pill */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
            <Lock className="w-3 h-3 text-sky-400" />
            RBAC
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700/80 font-semibold">
            {user?.role}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/50">
          <span className="flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5 text-emerald-400" />
            SOC LINK
          </span>
          <span className="text-emerald-400 font-mono">ACTIVE (TLS)</span>
        </div>
      </div>
    </aside>
  );
}
