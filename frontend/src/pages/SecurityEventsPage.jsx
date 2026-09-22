import React, { useEffect, useState, useCallback } from 'react';
import {
  ShieldAlert,
  Search,
  Plus,
  CheckCircle2,
  RotateCcw,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { securityEventsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Pagination } from '../components/common/Pagination';
import { SkeletonTable } from '../components/common/SkeletonTable';

export function SecurityEventsPage() {
  const { canManageCampaigns } = useAuth(); // ADMIN and MANAGER can create & resolve events
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    event_type: '',
    severity: 'LOW',
    status: 'OPEN',
    description: '',
    source_ip: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await securityEventsApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
        severity: severityFilter,
        status: statusFilter,
        sortBy,
        sortOrder,
      });
      setEvents(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch security events');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, severityFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await securityEventsApi.create(formData);
      toast.success('Security event recorded');
      setIsCreateOpen(false);
      setFormData({
        event_type: '',
        severity: 'LOW',
        status: 'OPEN',
        description: '',
        source_ip: '',
      });
      loadEvents();
    } catch (err) {
      toast.error(err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (event) => {
    const nextStatus = event.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
    try {
      await securityEventsApi.update(event.id, { status: nextStatus });
      toast.success(`Event status updated to ${nextStatus}`);
      loadEvents();
    } catch (err) {
      toast.error(err.message || 'Failed to update event status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            Security Events & Threat Log
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-tenant threat detection telemetry and response tracking
          </p>
        </div>

        {canManageCampaigns && (
          <Button onClick={() => setIsCreateOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-1.5" /> Record Event
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events by type, description, or source IP..."
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
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="bg-[#090D16] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="bg-[#090D16] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0E1422] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th
                  onClick={() => handleSort('severity')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Severity <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Status <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('event_type')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Event Type <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5">Details & Description</th>
                <th className="px-6 py-3.5">Source IP</th>
                <th
                  onClick={() => handleSort('created_at')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Timestamp <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                {canManageCampaigns && <th className="px-6 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <SkeletonTable rows={4} cols={7} />
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldAlert className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-300">No security events found</p>
                      <p className="text-xs text-slate-500 max-w-sm">No security incidents match the selected severity and status filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <Badge variant={ev.severity}>{ev.severity}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={ev.status}>{ev.status}</Badge>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                      {ev.event_type}
                    </td>
                    <td className="px-6 py-4 text-slate-300 max-w-md">
                      <p className="line-clamp-2 leading-relaxed">{ev.description}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      {ev.source_ip || 'Internal'}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(ev.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    {canManageCampaigns && (
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(ev)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                            ev.status === 'OPEN'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {ev.status === 'OPEN' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" /> Reopen
                            </>
                          )}
                        </button>
                      </td>
                    )}
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

      {/* CREATE SECURITY EVENT MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Record New Security Event"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Event Type *
            </label>
            <input
              type="text"
              required
              value={formData.event_type}
              onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
              placeholder="e.g. EXFILTRATION_ATTEMPT, BRUTE_FORCE"
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 uppercase font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                Severity Level
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                Source IP Address
              </label>
              <input
                type="text"
                value={formData.source_ip}
                onChange={(e) => setFormData({ ...formData, source_ip: e.target.value })}
                placeholder="e.g. 192.168.1.100"
                className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Description & Indicators of Compromise *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail attack vector, affected endpoints, and defensive measures..."
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={submitting}>
              Record Incident
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
