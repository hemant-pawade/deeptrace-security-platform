const dashboardRepository = require('../repositories/dashboard.repository');

class DashboardService {
  async getMetrics(tenantId, userContext) {
    return await dashboardRepository.getMetrics(tenantId, userContext);
  }

  async getRecentActivity(tenantId, userContext) {
    return await dashboardRepository.getRecentActivity(tenantId, userContext);
  }
}

module.exports = new DashboardService();
