import React, { useEffect, useState, useCallback } from 'react';
import { ScrollText, Search, ArrowUpDown, Filter } from 'lucide-react';
import { auditLogsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Pagination } from '../components/common/Pagination';
import { SkeletonTable } from '../components/common/SkeletonTable';
import { Badge } from '../components/common/Badge';

export function AuditLogsPage() {
  const { canViewAuditLogs } = useAuth();
  const toast = useToast();

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditLogsApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
        action: actionFilter,
        sortBy,
        sortOrder,
      });
      setLogs(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch audit trail');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, actionFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getActionColor = (action) => {
    if (action.includes('DELETE') || action.includes('REVOKE')) {
      return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }
    if (action.includes('CREATE') || action.includes('INITIALIZED')) {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
    if (action.includes('UPDATE') || action.includes('ASSIGN')) {
      return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
    }
    return 'text-slate-300 bg-slate-800 border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ScrollText className="w-6 h-6 text-sky-400" />
            Immutable Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident system activity and administrative mutation logs
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          CRYPTOGRAPHIC INTEGRITY ASSURED
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search audit trail by description, entity, or action..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="w-full bg-[#090D16] border border-slate-700/80 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="bg-[#090D16] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="">All Actions</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="USER_CREATED">USER_CREATED</option>
            <option value="USER_UPDATED">USER_UPDATED</option>
            <option value="USER_DELETED">USER_DELETED</option>
            <option value="CAMPAIGN_CREATED">CAMPAIGN_CREATED</option>
            <option value="CAMPAIGN_UPDATED">CAMPAIGN_UPDATED</option>
            <option value="CAMPAIGN_DELETED">CAMPAIGN_DELETED</option>
            <option value="CAMPAIGN_USER_ASSIGNED">CAMPAIGN_USER_ASSIGNED</option>
            <option value="CAMPAIGN_USER_REMOVED">CAMPAIGN_USER_REMOVED</option>
            <option value="SECURITY_EVENT_CREATED">SECURITY_EVENT_CREATED</option>
            <option value="SECURITY_EVENT_UPDATED">SECURITY_EVENT_UPDATED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0E1422] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th
                  onClick={() => handleSort('created_at')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Timestamp <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('action')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Action Type <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5">Actor Identity</th>
                <th
                  onClick={() => handleSort('entity_type')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Target Entity <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5">Audit Narrative</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <SkeletonTable rows={5} cols={5} />
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200">
                        {log.user?.full_name || 'Automated Engine'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {log.user?.email || 'SYSTEM'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-300">
                      {log.entity_type}
                      {log.entity_id && (
                        <span className="block text-[10px] text-slate-400 truncate max-w-[140px]">
                          ID: {log.entity_id}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300 max-w-lg leading-relaxed">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          pagination={pagination}
          onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        />
      </div>
    </div>
  );
}
