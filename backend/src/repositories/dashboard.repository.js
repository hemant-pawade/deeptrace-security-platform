const prisma = require('../config/db');

class DashboardRepository {
  async getMetrics(tenantId, userContext) {
    const isUser = userContext.role === 'USER';

    // Campaigns count query
    const campaignWhere = { tenant_id: tenantId };
    if (isUser) {
      campaignWhere.assigned_users = {
        some: { user_id: userContext.userId },
      };
    }

    const [
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      openEvents,
      criticalEvents,
      highEvents,
      resolvedEvents,
    ] = await Promise.all([
      prisma.user.count({ where: { tenant_id: tenantId } }),
      prisma.campaign.count({ where: campaignWhere }),
      prisma.campaign.count({ where: { ...campaignWhere, status: 'ACTIVE' } }),
      prisma.campaign.count({ where: { ...campaignWhere, status: 'COMPLETED' } }),
      prisma.securityEvent.count({ where: { tenant_id: tenantId, status: 'OPEN' } }),
      prisma.securityEvent.count({ where: { tenant_id: tenantId, severity: 'CRITICAL', status: 'OPEN' } }),
      prisma.securityEvent.count({ where: { tenant_id: tenantId, severity: 'HIGH', status: 'OPEN' } }),
      prisma.securityEvent.count({ where: { tenant_id: tenantId, status: 'RESOLVED' } }),
    ]);

    return {
      users: {
        total: totalUsers,
      },
      campaigns: {
        total: totalCampaigns,
        active: activeCampaigns,
        completed: completedCampaigns,
      },
      securityEvents: {
        open: openEvents,
        critical: criticalEvents,
        high: highEvents,
        resolved: resolvedEvents,
      },
    };
  }

  async getRecentActivity(tenantId, limit = 10) {
    const [recentEvents, recentAudits] = await Promise.all([
      prisma.securityEvent.findMany({
        where: { tenant_id: tenantId },
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.auditLog.findMany({
        where: { tenant_id: tenantId },
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: { id: true, full_name: true, email: true },
          },
        },
      }),
    ]);

    return {
      recentEvents,
      recentAudits,
    };
  }
}

module.exports = new DashboardRepository();
