const auditLogRepository = require('../repositories/auditLog.repository');

class AuditLogService {
  async listLogs(tenantId, query) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const { logs, total } = await auditLogRepository.listLogs(tenantId, {
      skip,
      take: limit,
      search: query.search,
      action: query.action,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }
}

module.exports = new AuditLogService();
