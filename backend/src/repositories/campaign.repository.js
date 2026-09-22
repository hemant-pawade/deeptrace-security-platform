const prisma = require('../config/db');

class CampaignRepository {
  async listCampaigns(tenantId, userContext, { skip = 0, take = 20, search, status, sortBy = 'created_at', sortOrder = 'desc' }) {
    const where = {
      tenant_id: tenantId,
    };

    // If USER role, only view campaigns they are assigned to
    if (userContext.role === 'USER') {
      where.assigned_users = {
        some: {
          user_id: userContext.userId,
        },
      };
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const allowedSortFields = ['name', 'status', 'start_date', 'end_date', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take,
        orderBy: { [safeSortBy]: safeSortOrder },
        include: {
          creator: {
            select: { id: true, full_name: true, email: true },
          },
          assigned_users: {
            include: {
              user: {
                select: { id: true, full_name: true, email: true, role: true },
              },
            },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    return { campaigns, total };
  }

  async findByIdAndTenant(id, tenantId) {
    return await prisma.campaign.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
      include: {
        creator: {
          select: { id: true, full_name: true, email: true },
        },
        assigned_users: {
          include: {
            user: {
              select: { id: true, full_name: true, email: true, role: true },
            },
          },
        },
      },
    });
  }

  async createCampaign(tenantId, data) {
    return await prisma.campaign.create({
      data: {
        tenant_id: tenantId,
        name: data.name,
        description: data.description,
        status: data.status || 'DRAFT',
        start_date: data.start_date ? new Date(data.start_date) : null,
        end_date: data.end_date ? new Date(data.end_date) : null,
        created_by: data.created_by,
      },
      include: {
        creator: {
          select: { id: true, full_name: true, email: true },
        },
      },
    });
  }

  async updateCampaign(id, tenantId, data) {
    // Only update if matching both id AND tenant_id
    const campaign = await this.findByIdAndTenant(id, tenantId);
    if (!campaign) {
      return null;
    }

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.start_date !== undefined) updateData.start_date = data.start_date ? new Date(data.start_date) : null;
    if (data.end_date !== undefined) updateData.end_date = data.end_date ? new Date(data.end_date) : null;

    return await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: { id: true, full_name: true, email: true },
        },
        assigned_users: {
          include: {
            user: {
              select: { id: true, full_name: true, email: true, role: true },
            },
          },
        },
      },
    });
  }

  async deleteCampaign(id, tenantId) {
    // Return count of deleted items
    const result = await prisma.campaign.deleteMany({
      where: {
        id,
        tenant_id: tenantId,
      },
    });
    return result.count;
  }

  async getCampaignUsers(campaignId, tenantId) {
    // Ensure campaign belongs to tenant first
    const campaign = await this.findByIdAndTenant(campaignId, tenantId);
    if (!campaign) {
      return null;
    }

    return await prisma.campaignUser.findMany({
      where: {
        campaign_id: campaignId,
        tenant_id: tenantId,
      },
      include: {
        user: {
          select: { id: true, full_name: true, email: true, role: true },
        },
      },
      orderBy: { assigned_at: 'desc' },
    });
  }

  async assignUser(tenantId, campaignId, userId) {
    return await prisma.campaignUser.create({
      data: {
        tenant_id: tenantId,
        campaign_id: campaignId,
        user_id: userId,
      },
      include: {
        user: {
          select: { id: true, full_name: true, email: true, role: true },
        },
      },
    });
  }

  async removeUser(tenantId, campaignId, userId) {
    const result = await prisma.campaignUser.deleteMany({
      where: {
        tenant_id: tenantId,
        campaign_id: campaignId,
        user_id: userId,
      },
    });
    return result.count;
  }
}

module.exports = new CampaignRepository();
