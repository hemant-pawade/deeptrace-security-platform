const { errorResponse } = require('../utils/response');

/**
 * RBAC route authorization middleware
 * @param {string[]} allowedRoles Array of roles permitted to access route, e.g. ['ADMIN', 'MANAGER']
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'Unauthorized: Identity not verified', {}, 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Forbidden: Role '${req.user.role}' lacks permission for this action`,
        {},
        403
      );
    }

    next();
  };
};

module.exports = {
  requireRole,
};
