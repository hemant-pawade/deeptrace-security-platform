const prisma = require('../config/db');

class SecurityEventRepository {
  async listEvents(tenantId, { skip = 0, take = 20, search, severity, status, sortBy = 'created_at', sortOrder = 'desc' }) {
    const where = {
      tenant_id: tenantId,
    };

    if (severity) {
      where.severity = severity;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { event_type: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { source_ip: { contains: search, mode: 'insensitive' } },
      ];
    }

    const allowedSortFields = ['event_type', 'severity', 'status', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    const [events, total] = await Promise.all([
      prisma.securityEvent.findMany({
        where,
        skip,
        take,
        orderBy: { [safeSortBy]: safeSortOrder },
      }),
      prisma.securityEvent.count({ where }),
    ]);

    return { events, total };
  }

  async findByIdAndTenant(id, tenantId) {
    return await prisma.securityEvent.findFirst({
      where: {
        id,
        tenant_id: tenantId,
      },
    });
  }

  async createEvent(tenantId, data) {
    return await prisma.securityEvent.create({
      data: {
        tenant_id: tenantId,
        event_type: data.event_type,
        severity: data.severity,
        status: data.status || 'OPEN',
        description: data.description,
        source_ip: data.source_ip,
      },
    });
  }

  async updateEvent(id, tenantId, data) {
    const existing = await this.findByIdAndTenant(id, tenantId);
    if (!existing) {
      return null;
    }

    return await prisma.securityEvent.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.severity && { severity: data.severity }),
        ...(data.description && { description: data.description }),
      },
    });
  }
}

module.exports = new SecurityEventRepository();
