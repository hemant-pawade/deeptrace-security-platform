const auditLogService = require('../services/auditLog.service');
const { paginatedResponse } = require('../utils/response');

class AuditLogController {
  async listLogs(req, res, next) {
    try {
      const { logs, pagination } = await auditLogService.listLogs(
        req.tenantId,
        req.query
      );
      return paginatedResponse(res, logs, pagination, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuditLogController();
