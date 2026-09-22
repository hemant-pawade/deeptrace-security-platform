const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');
const { requireTenantAccess } = require('../middleware/tenant.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} = require('../validators/user.validator');

// GET /api/users - List users (ADMIN and MANAGER)
router.get(
  '/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  validateRequest({ query: userQuerySchema }),
  userController.listUsers
);

// GET /api/users/:id - Get single user (ADMIN and MANAGER)
router.get(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  requireTenantAccess,
  userController.getUserById
);

// POST /api/users - Create user (ADMIN only)
router.post(
  '/',
  authenticateToken,
  requireRole(['ADMIN']),
  requireTenantAccess,
  validateRequest({ body: createUserSchema }),
  userController.createUser
);

// PATCH /api/users/:id - Update user (ADMIN only)
router.patch(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN']),
  requireTenantAccess,
  validateRequest({ body: updateUserSchema }),
  userController.updateUser
);

// DELETE /api/users/:id - Delete user (ADMIN only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['ADMIN']),
  requireTenantAccess,
  userController.deleteUser
);

module.exports = router;
