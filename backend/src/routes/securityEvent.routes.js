const express = require('express');
const router = express.Router();
const securityEventController = require('../controllers/securityEvent.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const { requireTenantAccess } = require('../middleware/tenant.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const {
  createSecurityEventSchema,
  updateSecurityEventSchema,
  securityEventQuerySchema,
} = require('../validators/securityEvent.validator');

// GET /api/security-events - List security events (ADMIN, MANAGER, USER)
router.get(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER', 'USER']),
  requireTenantAccess,
  validateRequest({ query: securityEventQuerySchema }),
  securityEventController.listEvents
);

// GET /api/security-events/:id - Get event details
router.get(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER', 'USER']),
  requireTenantAccess,
  securityEventController.getEventById
);

// POST /api/security-events - Create security event (ADMIN, MANAGER)
router.post(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  validateRequest({ body: createSecurityEventSchema }),
  securityEventController.createEvent
);

// PATCH /api/security-events/:id - Update security event status (ADMIN, MANAGER)
router.patch(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  validateRequest({ body: updateSecurityEventSchema }),
  securityEventController.updateEvent
);

module.exports = router;
