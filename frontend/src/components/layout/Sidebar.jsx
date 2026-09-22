import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  FolderKanban,
  Users,
  ScrollText,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
  const { user, canViewAuditLogs, canManageUsers, isManager, isAdmin } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Campaigns',
      path: '/campaigns',
      icon: FolderKanban,
      show: true,
    },
    {
      name: 'Security Events',
      path: '/security-events',
      icon: ShieldAlert,
      show: true,
    },
    {
      name: 'User Directory',
      path: '/users',
      icon: Users,
      show: isAdmin || isManager, // ADMIN and MANAGER can view
    },
    {
      name: 'Audit Logs',
      path: '/audit-logs',
      icon: ScrollText,
      show: canViewAuditLogs, // ADMIN and MANAGER only
    },
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="font-bold text-sm tracking-wider text-slate-100 uppercase">
            Deep Trace
          </div>
          <div className="text-[10px] tracking-widest text-sky-400/90 uppercase font-mono">
            Cybernetics
          </div>
        </div>
      </div>

      {/* Tenant Indicator in Sidebar */}
      <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/30">
        <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
          Workspace Isolation
        </div>
        <div className="text-xs font-semibold text-sky-300 truncate mt-0.5">
          {user?.tenant?.name || 'Isolated Organization'}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
      </nav>

      {/* Role Context Pill */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">RBAC Clearance:</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
            {user?.role}
          </span>
        </div>
      </div>
    </aside>
  );
}
