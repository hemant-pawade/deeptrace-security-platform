const prisma = require('../config/db');

class AuditLogRepository {
  async listLogs(tenantId, { skip = 0, take = 20, search, action, sortBy = 'created_at', sortOrder = 'desc' }) {
    const where = {
      tenant_id: tenantId,
    };

    if (action) {
      where.action = action;
    }

    if (search) {
      where.OR = [
        { action: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { entity_type: { contains: search, mode: 'insensitive' } },
      ];
    }

    const allowedSortFields = ['action', 'entity_type', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { [safeSortBy]: safeSortOrder },
        include: {
          user: {
            select: { id: true, full_name: true, email: true, role: true },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }
}

module.exports = new AuditLogRepository();
