const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const { requireTenantAccess } = require('../middleware/tenant.middleware');

// GET /api/dashboard/metrics
router.get(
  '/metrics',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER', 'USER']),
  requireTenantAccess,
  dashboardController.getMetrics
);

// GET /api/dashboard/recent-activity
router.get(
  '/recent-activity',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER', 'USER']),
  requireTenantAccess,
  dashboardController.getRecentActivity
);

module.exports = router;
