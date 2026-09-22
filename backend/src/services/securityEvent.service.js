const securityEventRepository = require('../repositories/securityEvent.repository');
const { logAudit } = require('../utils/auditLogger');

class SecurityEventService {
  async listEvents(tenantId, query) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const { events, total } = await securityEventRepository.listEvents(tenantId, {
      skip,
      take: limit,
      search: query.search,
      severity: query.severity,
      status: query.status,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return {
      events,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  async getEventById(id, tenantId) {
    const event = await securityEventRepository.findByIdAndTenant(id, tenantId);
    if (!event) {
      const error = new Error('Security event not found');
      error.statusCode = 404;
      throw error;
    }
    return event;
  }

  async createEvent(tenantId, actorUser, data) {
    const event = await securityEventRepository.createEvent(tenantId, data);

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'SECURITY_EVENT_CREATED',
      entityType: 'SECURITY_EVENT',
      entityId: event.id,
      description: `Security event [${event.severity}] "${event.event_type}" created by ${actorUser.email}.`,
    });

    return event;
  }

  async updateEvent(id, tenantId, actorUser, data) {
    const existing = await securityEventRepository.findByIdAndTenant(id, tenantId);
    if (!existing) {
      const error = new Error('Security event not found');
      error.statusCode = 404;
      throw error;
    }

    const updated = await securityEventRepository.updateEvent(id, tenantId, data);

    await logAudit({
      tenantId,
      userId: actorUser.userId,
      action: 'SECURITY_EVENT_UPDATED',
      entityType: 'SECURITY_EVENT',
      entityId: id,
      description: `Security event "${existing.event_type}" updated by ${actorUser.email}. Status: ${updated.status}.`,
    });

    return updated;
  }
}

module.exports = new SecurityEventService();
