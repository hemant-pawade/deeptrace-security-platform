const campaignRepository = require('../repositories/campaign.repository');
const userRepository = require('../repositories/user.repository');
const { logAudit } = require('../utils/auditLogger');

// Valid campaign lifecycle transitions
const VALID_TRANSITIONS = {
  DRAFT: ['DRAFT', 'ACTIVE', 'CANCELLED'],
  ACTIVE: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
  COMPLETED: ['COMPLETED'], // Terminal
  CANCELLED: ['CANCELLED'], // Terminal
};

class CampaignService {
  async listCampaigns(tenantId, userContext, query) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const { campaigns, total } = await campaignRepository.listCampaigns(tenantId, userContext, {
      skip,
      take: limit,
      search: query.search,
      status: query.status,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return {
      campaigns,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async getCampaignById(id, tenantId, userContext) {
    const campaign = await campaignRepository.findByIdAndTenant(id, tenantId);
    if (!campaign) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }

    // If USER role, ensure user is assigned to this campaign
    if (userContext.role === 'USER') {
      const isAssigned = campaign.assigned_users.some((cu) => cu.user_id === userContext.userId);
      if (!isAssigned) {
        const error = new Error('Campaign not found');
        error.statusCode = 404; // Use 404 to avoid leaking existence
        throw error;
      }
    }

    return campaign;
  }

  async createCampaign(tenantId, actorUser, data) {
    const campaign = await campaignRepository.createCampaign(tenantId, {
      ...data,
      created_by: actorUser.userId,
    });

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'CAMPAIGN_CREATED',
      entityType: 'CAMPAIGN',
      entityId: campaign.id,
      description: `Campaign "${campaign.name}" created by ${actorUser.email}.`,
    });

    return campaign;
  }

  async updateCampaign(id, tenantId, actorUser, data) {
    const existing = await campaignRepository.findByIdAndTenant(id, tenantId);
    if (!existing) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }

    // Status transition enforcement
    if (data.status && data.status !== existing.status) {
      const allowedNextStatuses = VALID_TRANSITIONS[existing.status] || [];
      if (!allowedNextStatuses.includes(data.status)) {
        const error = new Error(
          `Invalid status transition: Cannot move campaign from ${existing.status} to ${data.status}. Status ${existing.status} is ${
            ['COMPLETED', 'CANCELLED'].includes(existing.status) ? 'terminal' : 'restricted'
          }.`
        );
        error.statusCode = 409;
        throw error;
      }
    }

    const updated = await campaignRepository.updateCampaign(id, tenantId, data);

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'CAMPAIGN_UPDATED',
      entityType: 'CAMPAIGN',
      entityId: id,
      description: `Campaign "${existing.name}" updated by ${actorUser.email}. Changes: ${Object.keys(data).join(', ')}.`,
      metadata: { previousStatus: existing.status, newStatus: data.status || existing.status },
    });

    return updated;
  }

  async deleteCampaign(id, tenantId, actorUser) {
    const existing = await campaignRepository.findByIdAndTenant(id, tenantId);
    if (!existing) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }

    await campaignRepository.deleteCampaign(id, tenantId);

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'CAMPAIGN_DELETED',
      entityType: 'CAMPAIGN',
      entityId: id,
      description: `Campaign "${existing.name}" deleted by ${actorUser.email}.`,
    });

    return { message: 'Campaign deleted successfully' };
  }

  async getCampaignUsers(campaignId, tenantId) {
    const users = await campaignRepository.getCampaignUsers(campaignId, tenantId);
    if (!users) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }
    return users;
  }

  async assignUser(campaignId, tenantId, actorUser, targetUserId) {
    const campaign = await campaignRepository.findByIdAndTenant(campaignId, tenantId);
    if (!campaign) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify target user belongs to the same tenant
    const targetUser = await userRepository.findByIdAndTenant(targetUserId, tenantId);
    if (!targetUser) {
      const error = new Error('Target user does not exist in this tenant organization');
      error.statusCode = 404;
      throw error;
    }

    // Check if already assigned
    const alreadyAssigned = campaign.assigned_users.some((cu) => cu.user_id === targetUserId);
    if (alreadyAssigned) {
      const error = new Error('User is already assigned to this campaign');
      error.statusCode = 409;
      throw error;
    }

    const assignment = await campaignRepository.assignUser(tenantId, campaignId, targetUserId);

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'CAMPAIGN_USER_ASSIGNED',
      entityType: 'CAMPAIGN',
      entityId: campaignId,
      description: `Assigned user ${targetUser.email} to campaign "${campaign.name}" by ${actorUser.email}.`,
    });

    return assignment;
  }

  async removeUser(campaignId, tenantId, actorUser, targetUserId) {
    const campaign = await campaignRepository.findByIdAndTenant(campaignId, tenantId);
    if (!campaign) {
      const error = new Error('Campaign not found');
      error.statusCode = 404;
      throw error;
    }

    const count = await campaignRepository.removeUser(tenantId, campaignId, targetUserId);
    if (count === 0) {
      const error = new Error('User is not assigned to this campaign');
      error.statusCode = 404;
      throw error;
    }

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'CAMPAIGN_USER_REMOVED',
      entityType: 'CAMPAIGN',
      entityId: campaignId,
      description: `Removed user ID ${targetUserId} from campaign "${campaign.name}" by ${actorUser.email}.`,
    });

    return { message: 'User removed from campaign successfully' };
  }
}

module.exports = new CampaignService();
