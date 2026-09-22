import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User,
  Shield,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { campaignsApi, usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManageCampaigns, isAdmin } = useAuth();
  const toast = useToast();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [tenantUsers, setTenantUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCampaign = useCallback(async () => {
    setLoading(true);
    try {
      const data = await campaignsApi.getById(id);
      setCampaign(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load campaign');
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  useEffect(() => {
    if (canManageCampaigns) {
      usersApi.list({ limit: 100 }).then((res) => {
        setTenantUsers(res.data || []);
      }).catch(() => {});
    }
  }, [canManageCampaigns]);

  const handleStatusTransition = async (newStatus) => {
    try {
      const updated = await campaignsApi.update(id, { status: newStatus });
      setCampaign(updated);
      toast.success(`Campaign moved to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Status transition rejected');
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setSubmitting(true);
    try {
      await campaignsApi.assignUser(id, selectedUserId);
      toast.success('User assigned to campaign');
      setIsAssignOpen(false);
      setSelectedUserId('');
      loadCampaign();
    } catch (err) {
      toast.error(err.message || 'Failed to assign user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await campaignsApi.removeUser(id, userId);
      toast.success('User removed from campaign');
      loadCampaign();
    } catch (err) {
      toast.error(err.message || 'Failed to remove user');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/4"></div>
        <div className="h-40 bg-[#111726] rounded-xl"></div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/campaigns"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Campaigns
      </Link>

      {/* Main Campaign Card */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {campaign.name}
              </h1>
              <Badge variant={campaign.status}>{campaign.status}</Badge>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              {campaign.description || 'No detailed scope provided.'}
            </p>
          </div>

          {/* Quick Status Action Controls */}
          {canManageCampaigns && (
            <div className="flex items-center gap-2 shrink-0">
              {campaign.status === 'DRAFT' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusTransition('ACTIVE')}
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Launch Campaign
                </Button>
              )}

              {campaign.status === 'ACTIVE' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleStatusTransition('COMPLETED')}
                    className="bg-sky-600 hover:bg-sky-500"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Mark Completed
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleStatusTransition('CANCELLED')}
                  >
                    <AlertCircle className="w-4 h-4 mr-1.5" /> Cancel Campaign
                  </Button>
                </>
              )}

              {['COMPLETED', 'CANCELLED'].includes(campaign.status) && (
                <div className="text-xs font-mono text-slate-400 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg">
                  Status is terminal (immutable)
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-xs">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-slate-400 font-mono uppercase text-[10px]">Start Date</div>
              <div className="font-semibold text-slate-200 mt-0.5">
                {campaign.start_date
                  ? new Date(campaign.start_date).toLocaleDateString()
                  : 'Immediate'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-slate-400 font-mono uppercase text-[10px]">End Date</div>
              <div className="font-semibold text-slate-200 mt-0.5">
                {campaign.end_date
                  ? new Date(campaign.end_date).toLocaleDateString()
                  : 'Indefinite'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-slate-400 font-mono uppercase text-[10px]">Lead Creator</div>
              <div className="font-semibold text-slate-200 mt-0.5">
                {campaign.creator?.full_name || 'System Operator'}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Assigned Team Members Card */}
      <Card>
        <CardHeader
          title="Assigned Operatives"
          description="Tenant users authorized to view or execute actions for this campaign"
          action={
            canManageCampaigns && !['COMPLETED', 'CANCELLED'].includes(campaign.status) && (
              <Button size="sm" onClick={() => setIsAssignOpen(true)}>
                <UserPlus className="w-4 h-4 mr-1.5" /> Assign Operative
              </Button>
            )
          }
        />

        <div className="divide-y divide-slate-800/80 mt-4">
          {!campaign.assigned_users?.length ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No team members are currently assigned to this campaign.
            </div>
          ) : (
            campaign.assigned_users.map((assignment) => (
              <div
                key={assignment.id}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-semibold text-slate-300">
                    {assignment.user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">
                      {assignment.user?.full_name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {assignment.user?.email}
                    </div>
                  </div>
                  <Badge variant={assignment.user?.role}>{assignment.user?.role}</Badge>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                  </span>

                  {canManageCampaigns && !['COMPLETED', 'CANCELLED'].includes(campaign.status) && (
                    <button
                      onClick={() => handleRemoveUser(assignment.user_id)}
                      className="p-1.5 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove from campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Assign User Modal */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Assign Operative to Campaign"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-1">
              Select User
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
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
    </div>
  );
}
