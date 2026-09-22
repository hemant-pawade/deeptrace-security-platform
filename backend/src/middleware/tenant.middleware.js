const { errorResponse } = require('../utils/response');

/**
 * Tenant Isolation Enforcer Middleware
 * Guarantees that the tenant context is derived strictly from the authenticated JWT token.
 * Strips and sanitizes any spoofed tenant_id or tenantId fields in the body/query.
 */
const requireTenantAccess = (req, res, next) => {
  if (!req.user || !req.user.tenantId) {
    return errorResponse(res, 'Unauthorized: Tenant context missing from authenticated session', {}, 401);
  }

  // Anchor the verified tenant ID on the request object
  req.tenantId = req.user.tenantId;

  // Sanitize any incoming body or query overrides to prevent parameter pollution or confusion
  if (req.body && typeof req.body === 'object') {
    delete req.body.tenant_id;
    delete req.body.tenantId;
  }

  if (req.query && typeof req.query === 'object') {
    delete req.query.tenant_id;
    delete req.query.tenantId;
  }

  next();
};

module.exports = {
  requireTenantAccess,
};
