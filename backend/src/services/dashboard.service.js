const dashboardRepository = require('../repositories/dashboard.repository');

class DashboardService {
  async getMetrics(tenantId, userContext) {
    return await dashboardRepository.getMetrics(tenantId, userContext);
  }

  async getRecentActivity(tenantId) {
    return await dashboardRepository.getRecentActivity(tenantId);
  }
}

module.exports = new DashboardService();
