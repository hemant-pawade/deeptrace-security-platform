const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/response');

class DashboardController {
  async getMetrics(req, res, next) {
    try {
      const metrics = await dashboardService.getMetrics(req.tenantId, req.user);
      return successResponse(res, metrics, 200);
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req, res, next) {
    try {
      const activity = await dashboardService.getRecentActivity(req.tenantId, req.user);
      return successResponse(res, activity, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
