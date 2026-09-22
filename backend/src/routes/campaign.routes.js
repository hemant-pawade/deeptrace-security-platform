const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const { requireTenantAccess } = require('../middleware/tenant.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const {
  createCampaignSchema,
  updateCampaignSchema,
  campaignQuerySchema,
  assignUserSchema,
} = require('../validators/campaign.validator');

// GET /api/campaigns - List campaigns (ADMIN, MANAGER, USER)
router.get(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER', 'USER']),
  requireTenantAccess,
  validateRequest({ query: campaignQuerySchema }),
  campaignController.listCampaigns
);

// GET /api/campaigns/:id - View single campaign
router.get(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER', 'USER']),
  requireTenantAccess,
  campaignController.getCampaignById
);

// POST /api/campaigns - Create campaign (ADMIN, MANAGER)
router.post(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  validateRequest({ body: createCampaignSchema }),
  campaignController.createCampaign
);

// PATCH /api/campaigns/:id - Update campaign (ADMIN, MANAGER)
router.patch(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  validateRequest({ body: updateCampaignSchema }),
  campaignController.updateCampaign
);

// DELETE /api/campaigns/:id - Delete campaign (ADMIN, MANAGER)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  campaignController.deleteCampaign
);

// GET /api/campaigns/:id/users - Get assigned users
router.get(
  '/:id/users',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER', 'USER']),
  requireTenantAccess,
  campaignController.getCampaignUsers
);

// POST /api/campaigns/:id/users - Assign user to campaign (ADMIN, MANAGER)
router.post(
  '/:id/users',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  validateRequest({ body: assignUserSchema }),
  campaignController.assignUser
);

// DELETE /api/campaigns/:id/users/:userId - Remove user from campaign (ADMIN, MANAGER)
router.delete(
  '/:id/users/:userId',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  campaignController.removeUser
);

module.exports = router;
