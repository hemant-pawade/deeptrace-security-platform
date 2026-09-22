const prisma = require('../config/db');

/**
 * Asynchronously write an audit log row.
 * Non-blocking, fails gracefully with error logging.
 */
const logAudit = async ({
  tenantId,
  userId = null,
  action,
  entityType,
  entityId = null,
  description,
  metadata = null,
}) => {
  try {
    if (!tenantId || !action || !entityType || !description) {
      console.warn('AuditLog warning: Missing required audit fields', {
        tenantId,
        action,
        entityType,
      });
      return;
    }

    await prisma.auditLog.create({
      data: {
        tenant_id: tenantId,
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId ? String(entityId) : null,
        description,
        metadata: metadata ? metadata : undefined,
      },
    });
  } catch (error) {
    console.error('AuditLog Error: Failed to write audit record:', error.message);
  }
};

module.exports = {
  logAudit,
};
