import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  FolderKanban,
  Edit2,
  Trash2,
  UserPlus,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { campaignsApi, usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Pagination } from '../components/common/Pagination';
import { SkeletonTable } from '../components/common/SkeletonTable';

export function CampaignsPage() {
  const { canManageCampaigns, isAdmin } = useAuth();
  const toast = useToast();

  const [campaigns, setCampaigns] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters and Sorting
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [activeCampaign, setActiveCampaign] = useState(null);
  const [tenantUsers, setTenantUsers] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'DRAFT',
    start_date: '',
    end_date: '',
  });

  const [assignUserId, setAssignUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await campaignsApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
      });
      setCampaigns(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // Load tenant users for assignments if manager/admin
  useEffect(() => {
    if (canManageCampaigns) {
      usersApi.list({ limit: 100 }).then((res) => {
        setTenantUsers(res.data || []);
      }).catch(() => {});
    }
  }, [canManageCampaigns]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      status: 'DRAFT',
      start_date: '',
      end_date: '',
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await campaignsApi.create(formData);
      toast.success(`Campaign "${formData.name}" created successfully`);
      setIsCreateOpen(false);
      loadCampaigns();
    } catch (err) {
      toast.error(err.message || 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (camp) => {
    setActiveCampaign(camp);
    setFormData({
      name: camp.name,
      description: camp.description || '',
      status: camp.status,
      start_date: camp.start_date ? camp.start_date.split('T')[0] : '',
      end_date: camp.end_date ? camp.end_date.split('T')[0] : '',
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await campaignsApi.update(activeCampaign.id, formData);
      toast.success('Campaign updated successfully');
      setIsEditOpen(false);
      loadCampaigns();
    } catch (err) {
      toast.error(err.message || 'Failed to update campaign');
    } finally {
      setSubmitting(false);
    }
  };

  const openAssignModal = (camp) => {
    setActiveCampaign(camp);
    setAssignUserId('');
    setIsAssignOpen(true);
  };

  const handleAssignUser = async (e) => {
    e.preventDefault();
    if (!assignUserId) return;
    setSubmitting(true);
    try {
      await campaignsApi.assignUser(activeCampaign.id, assignUserId);
      toast.success('User assigned to campaign');
      setIsAssignOpen(false);
      loadCampaigns();
    } catch (err) {
      toast.error(err.message || 'Failed to assign user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveUser = async (campaignId, userId) => {
    try {
      await campaignsApi.removeUser(campaignId, userId);
      toast.success('User removed from campaign');
      loadCampaigns();
    } catch (err) {
      toast.error(err.message || 'Failed to remove user');
    }
  };

  const openDeleteModal = (camp) => {
    setActiveCampaign(camp);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    setSubmitting(true);
    try {
      await campaignsApi.delete(activeCampaign.id);
      toast.success(`Campaign "${activeCampaign.name}" deleted successfully`);
      setIsDeleteOpen(false);
      loadCampaigns();
    } catch (err) {
      toast.error(err.message || 'Failed to delete campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-sky-400" />
            Campaign Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Initiate, track, and coordinate security campaigns with strict tenant scope
          </p>
        </div>

        {canManageCampaigns && (
          <Button onClick={openCreateModal} className="shrink-0">
            <Plus className="w-4 h-4 mr-1.5" /> New Campaign
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111726] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search campaigns by name or description..."
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((p) => ({ ...p, page: 1 }));
            }}
            className="bg-[#090D16] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0E1422] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Campaign Name <ArrowUpDown className="w-3 h-3" />
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
                <th className="px-6 py-3.5">Assigned Team</th>
                <th
                  onClick={() => handleSort('start_date')}
                  className="px-6 py-3.5 cursor-pointer hover:text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    Timeline <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <SkeletonTable rows={4} cols={5} />
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderKanban className="w-8 h-8 text-slate-600 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-slate-300">No campaigns found</p>
                      <p className="text-xs text-slate-500 max-w-sm">No campaigns match your active search filters or tenant roster.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/campaigns/${camp.id}`}
                        className="font-semibold text-slate-200 hover:text-sky-400 transition-colors block"
                      >
                        {camp.name}
                      </Link>
                      {camp.description && (
                        <p className="text-slate-400 line-clamp-1 text-[11px] mt-0.5">
                          {camp.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={camp.status}>{camp.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 items-center">
                        {camp.assigned_users?.length ? (
                          camp.assigned_users.map((cu) => (
                            <span
                              key={cu.user_id}
                              className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60"
                            >
                              {cu.user?.full_name?.split(' ')[0] || cu.user?.email}
                              {canManageCampaigns && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveUser(camp.id, cu.user_id)}
                                  className="text-slate-500 hover:text-rose-400 ml-0.5"
                                >
                                  ×
                                </button>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Unassigned</span>
                        )}
                        {canManageCampaigns && (
                          <button
                            onClick={() => openAssignModal(camp)}
                            title="Assign team member"
                            className="p-1 rounded hover:bg-slate-800 text-sky-400"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                      {camp.start_date
                        ? new Date(camp.start_date).toLocaleDateString()
                        : 'Immediate'}{' '}
                      —{' '}
                      {camp.end_date
                        ? new Date(camp.end_date).toLocaleDateString()
                        : 'Indefinite'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Link
                          to={`/campaigns/${camp.id}`}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                          title="View Campaign Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {canManageCampaigns && (
                          <button
                            onClick={() => openEditModal(camp)}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-sky-400"
                            title="Edit Campaign"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}

                        {isAdmin && (
                          <button
                            onClick={() => openDeleteModal(camp)}
                            className="p-1.5 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400"
                            title="Delete Campaign (Admin only)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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

      {/* CREATE CAMPAIGN MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Security Campaign"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Campaign Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Identity Controller Security Hardening"
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Description & Scope
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide technical scope and operational objectives..."
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
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
              Create Campaign
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT CAMPAIGN MODAL (Enforces State Machine) */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Update Campaign & Status Lifecycle"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Lifecycle Status (State Machine Enforced)
            </label>
            <select
              value={formData.status}
              disabled={['COMPLETED', 'CANCELLED'].includes(activeCampaign?.status)}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {activeCampaign?.status === 'DRAFT' && (
                <>
                  <option value="DRAFT">DRAFT (Current)</option>
                  <option value="ACTIVE">ACTIVE (Launch)</option>
                  <option value="CANCELLED">CANCELLED (Abort)</option>
                </>
              )}
              {activeCampaign?.status === 'ACTIVE' && (
                <>
                  <option value="ACTIVE">ACTIVE (Current)</option>
                  <option value="COMPLETED">COMPLETED (Conclude)</option>
                  <option value="CANCELLED">CANCELLED (Abort)</option>
                </>
              )}
              {['COMPLETED', 'CANCELLED'].includes(activeCampaign?.status) && (
                <option value={activeCampaign.status}>{activeCampaign.status} (Terminal / Immutable)</option>
              )}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              State transitions: DRAFT &rarr; ACTIVE, CANCELLED | ACTIVE &rarr; COMPLETED, CANCELLED.
              {['COMPLETED', 'CANCELLED'].includes(activeCampaign?.status) && (
                <span className="text-amber-400 block mt-0.5">Terminal status: this campaign cannot be transitioned.</span>
              )}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={submitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* ASSIGN USER MODAL */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Assign Tenant Team Member"
      >
        <form onSubmit={handleAssignUser} className="space-y-4">
          <p className="text-xs text-slate-400">
            Assign an authorized operative to campaign{' '}
            <span className="text-slate-200 font-semibold">{activeCampaign?.name}</span>
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Select User
            </label>
            <select
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              required
              className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="">-- Choose Operative --</option>
              {tenantUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name} ({u.email}) — [{u.role}]
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAssignOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={submitting}>
              Assign Operative
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Permanent Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently delete campaign{' '}
            <span className="font-semibold text-rose-400">{activeCampaign?.name}</span>?
            This will cascade remove all team assignments and cannot be undone.
          </p>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteSubmit}
              loading={submitting}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
