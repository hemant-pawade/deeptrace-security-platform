import React from 'react';

export function Badge({ children, variant, className = '' }) {
  const getBadgeStyle = (type) => {
    const key = String(type || '').toUpperCase();
    switch (key) {
      // Severity badges
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
      case 'LOW':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';

      // Security Event Status badges
      case 'OPEN':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'RESOLVED':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

      // Campaign Status badges
      case 'ACTIVE':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'DRAFT':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      case 'COMPLETED':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'CANCELLED':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';

      // Role badges
      case 'ADMIN':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'MANAGER':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'USER':
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';

      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide border uppercase font-mono ${getBadgeStyle(
        variant || children
      )} ${className}`}
    >
      {children}
    </span>
  );
}
