const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLog.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const { requireTenantAccess } = require('../middleware/tenant.middleware');

// GET /api/audit-logs - List audit logs (ADMIN and MANAGER only)
router.get(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  auditLogController.listLogs
);

module.exports = router;
