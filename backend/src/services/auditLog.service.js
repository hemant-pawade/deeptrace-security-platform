const auditLogRepository = require('../repositories/auditLog.repository');

class AuditLogService {
  async listLogs(tenantId, query) {
    const page = query.page || 1;
    const limit = query.limit || 20;
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
