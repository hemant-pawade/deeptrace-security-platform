const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLog.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const { requireTenantAccess } = require('../middleware/tenant.middleware');

const { validateRequest } = require('../middleware/validate.middleware');
const { auditLogQuerySchema } = require('../validators/auditLog.validator');

// GET /api/audit-logs - List audit logs (ADMIN and MANAGER only)
router.get(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  validateRequest({ query: auditLogQuerySchema }),
  auditLogController.listLogs
);

module.exports = router;
