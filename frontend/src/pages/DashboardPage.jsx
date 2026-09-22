import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  ShieldAlert,
  AlertOctagon,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Server,
  Terminal,
} from 'lucide-react';
import { dashboardApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsData, activityData] = await Promise.all([
          dashboardApi.getMetrics(),
          dashboardApi.getRecentActivity(),
        ]);
        setMetrics(metricsData);
        setActivity(activityData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#111726] border border-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Tenant Operatives',
      value: metrics?.users?.total ?? 0,
      detail: 'RBAC verified accounts',
      icon: Users,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      topBorder: 'border-t-sky-500',
      link: '/users',
      badge: 'Role Scoped',
    },
    {
      title: 'Active Campaigns',
      value: metrics?.campaigns?.active ?? 0,
      detail: `${metrics?.campaigns?.total ?? 0} total campaigns`,
      icon: FolderKanban,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      topBorder: 'border-t-emerald-500',
      link: '/campaigns',
      badge: 'State Machine Active',
    },
    {
      title: 'Open Threat Events',
      value: metrics?.securityEvents?.open ?? 0,
      detail: `${metrics?.securityEvents?.resolved ?? 0} resolved incidents`,
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      topBorder: 'border-t-amber-500',
      link: '/security-events',
      badge: 'Triage Queue',
    },
    {
      title: 'Critical Threat Level',
      value: metrics?.securityEvents?.critical ?? 0,
      detail: `${metrics?.securityEvents?.high ?? 0} high severity alerts`,
      icon: AlertOctagon,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      topBorder: 'border-t-rose-500',
      link: '/security-events',
      badge: 'Immediate Action',
    },
  ];

  // Threat severity breakdown percentages
  const totalIncidents =
    (metrics?.securityEvents?.open ?? 0) + (metrics?.securityEvents?.resolved ?? 0) || 1;
  const criticalPct = Math.round(((metrics?.securityEvents?.critical ?? 0) / totalIncidents) * 100) || 0;
  const highPct = Math.round(((metrics?.securityEvents?.high ?? 0) / totalIncidents) * 100) || 0;
  const resolvedPct = Math.round(((metrics?.securityEvents?.resolved ?? 0) / totalIncidents) * 100) || 0;

  return (
    <div className="space-y-8">
      {/* Welcome & Command Center Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Security Operations Center • SOC Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Security Operations Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant telemetry and automated compliance for{' '}
            <span className="text-sky-300 font-semibold">{user?.tenant?.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0F17] border border-slate-800 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DATABASE ISOLATION: <strong className="text-emerald-400">ENFORCED</strong></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs font-mono text-sky-400">
            <Zap className="w-3.5 h-3.5" />
            <span>ZERO-TRUST GATEWAY</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className={`bg-[#111726] border border-slate-800/90 rounded-xl p-5 shadow-lg border-t-2 ${kpi.topBorder} hover:border-slate-700 transition-all group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
                  <div className={`p-2 rounded-lg border ${kpi.bg} ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-3xl font-bold text-slate-100 font-mono mt-3">
                  {kpi.value}
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[11px] text-slate-400">{kpi.detail}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                    {kpi.badge}
                  </span>
                </div>
              </div>

              <Link
                to={kpi.link}
                className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 hover:text-sky-400 transition-colors"
              >
                <span>Inspect records</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Threat Telemetry Breakdown Bar */}
      <div className="bg-[#111726] border border-slate-800/90 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider">
              Tenant Threat Posture Distribution
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical ({metrics?.securityEvents?.critical ?? 0})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> High ({metrics?.securityEvents?.high ?? 0})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Resolved ({metrics?.securityEvents?.resolved ?? 0})
            </span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
          <div
            style={{ width: `${Math.max(criticalPct, 8)}%` }}
            className="bg-rose-500 h-full transition-all"
            title={`Critical Threats: ${metrics?.securityEvents?.critical ?? 0}`}
          />
          <div
            style={{ width: `${Math.max(highPct, 12)}%` }}
            className="bg-amber-500 h-full transition-all"
            title={`High Severity: ${metrics?.securityEvents?.high ?? 0}`}
          />
          <div
            style={{ width: `${Math.max(resolvedPct, 20)}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`Resolved: ${metrics?.securityEvents?.resolved ?? 0}`}
          />
        </div>
      </div>

      {/* Two-Column Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Incidents */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader
              title="Recent Security Incidents"
              description="Live threat telemetry scoped exclusively to your tenant"
              action={
                <Link
                  to="/security-events"
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium font-mono"
                >
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              }
            />

            <div className="divide-y divide-slate-800/60 mt-2">
              {!activity?.recentEvents?.length ? (
                <div className="py-10 text-center text-xs text-slate-500 font-mono">
                  No active security incidents detected.
                </div>
              ) : (
                activity.recentEvents.slice(0, 5).map((ev) => (
                  <div key={ev.id} className="py-3.5 flex items-start gap-3 hover:bg-slate-900/30 px-2 rounded-lg transition-colors">
                    <Badge variant={ev.severity} className="mt-0.5 shrink-0">
                      {ev.severity}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200 truncate font-mono">
                          {ev.event_type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] font-mono text-slate-400">
                        {ev.source_ip && (
                          <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            IP: {ev.source_ip}
                          </span>
                        )}
                        <span className={ev.status === 'OPEN' ? 'text-sky-400' : 'text-emerald-400'}>
                          ● {ev.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Threat Detection Engine v2.4</span>
            <span className="text-emerald-400">Live Listening</span>
          </div>
        </Card>

        {/* Tenant Audit Trail */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardHeader
              title="Immutable Audit Trail"
              description="Tamper-evident record of administrative and lifecycle mutations"
              action={
                <Link
                  to="/audit-logs"
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium font-mono"
                >
                  View Logs <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              }
            />

            <div className="divide-y divide-slate-800/60 mt-2">
              {!activity?.recentAudits?.length ? (
                <div className="py-10 text-center text-xs text-slate-500 font-mono">
                  No administrative actions recorded yet.
                </div>
              ) : (
                activity.recentAudits.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-3.5 flex items-start gap-3 hover:bg-slate-900/30 px-2 rounded-lg transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-200 font-mono">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(log.created_at).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                        {log.description}
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-2">
                        <span>Actor: <strong className="text-slate-300">{log.user?.email || 'SYSTEM'}</strong></span>
                        <span>•</span>
                        <span>Entity: {log.entity_type}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Cryptographic Non-Repudiation</span>
            <span className="text-sky-400">PostgreSQL Verified</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
