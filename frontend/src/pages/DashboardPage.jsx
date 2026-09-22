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
            <div key={i} className="h-28 bg-[#111726] border border-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Tenant Users',
      value: metrics?.users?.total ?? 0,
      detail: 'Registered identities',
      icon: Users,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      link: '/users',
    },
    {
      title: 'Active Campaigns',
      value: metrics?.campaigns?.active ?? 0,
      detail: `${metrics?.campaigns?.total ?? 0} total campaigns`,
      icon: FolderKanban,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      link: '/campaigns',
    },
    {
      title: 'Open Security Events',
      value: metrics?.securityEvents?.open ?? 0,
      detail: 'Requiring review',
      icon: ShieldAlert,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      link: '/security-events',
    },
    {
      title: 'Critical Threats',
      value: metrics?.securityEvents?.critical ?? 0,
      detail: `${metrics?.securityEvents?.high ?? 0} high severity`,
      icon: AlertOctagon,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      link: '/security-events',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Security Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and compliance status for{' '}
            <span className="text-sky-400 font-semibold">{user?.tenant?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ISOLATION ENGINE ACTIVE
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-400">{kpi.title}</div>
                  <div className="text-3xl font-bold text-slate-100 font-mono mt-2">
                    {kpi.value}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{kpi.detail}</div>
                </div>
                <div className={`p-2.5 rounded-xl border ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <Link
                to={kpi.link}
                className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 hover:text-sky-400 transition-colors"
              >
                <span>View records</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          );
        })}
      </div>

      {/* Two-Column Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Incidents */}
        <Card>
          <CardHeader
            title="Recent Security Incidents"
            description="Live threat detections scoped to your tenant"
            action={
              <Link
                to="/security-events"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          />

          <div className="divide-y divide-slate-800/60 mt-2">
            {!activity?.recentEvents?.length ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent security incidents logged.
              </div>
            ) : (
              activity.recentEvents.slice(0, 5).map((ev) => (
                <div key={ev.id} className="py-3.5 flex items-start gap-3">
                  <Badge variant={ev.severity} className="mt-0.5 shrink-0">
                    {ev.severity}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {ev.event_type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {ev.description}
                    </p>
                    {ev.source_ip && (
                      <span className="inline-block mt-1 text-[10px] font-mono text-slate-400">
                        Source IP: {ev.source_ip}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Audit Log Activity */}
        <Card>
          <CardHeader
            title="Tenant Audit Trail"
            description="Immutable record of administrative mutations"
            action={
              <Link
                to="/audit-logs"
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
              >
                View logs <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            }
          />

          <div className="divide-y divide-slate-800/60 mt-2">
            {!activity?.recentAudits?.length ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent audit actions recorded.
              </div>
            ) : (
              activity.recentAudits.slice(0, 5).map((log) => (
                <div key={log.id} className="py-3.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-300 font-mono">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(log.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {log.description}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Actor: {log.user?.email || 'SYSTEM'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
