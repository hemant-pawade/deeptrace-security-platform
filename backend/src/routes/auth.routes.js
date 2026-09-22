const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requireTenantAccess } = require('../middleware/tenant.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const { loginSchema } = require('../validators/auth.validator');

// POST /api/auth/login
router.post(
  '/login',
  validateRequest({ body: loginSchema }),
  authController.login
);

// GET /api/auth/me
router.get(
  '/me',
  authenticateToken,
  requireTenantAccess,
  authController.getMe
);

module.exports = router;
