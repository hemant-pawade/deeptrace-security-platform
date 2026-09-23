const express = require('express');
const router = express.Router();

const { getGatewayRoot } = require('../controllers/gateway.controller');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const campaignRoutes = require('./campaign.routes');
const securityEventRoutes = require('./securityEvent.routes');
const auditLogRoutes = require('./auditLog.routes');
const dashboardRoutes = require('./dashboard.routes');

router.get('/', getGatewayRoot);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/security-events', securityEventRoutes);
router.use('/audit-logs', auditLogRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
