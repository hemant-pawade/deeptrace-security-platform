const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication required: Missing or invalid token format', {}, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    // Strict requirement: derive authorization and identity exclusively from verified JWT
    req.user = {
      userId: decoded.userId,
      tenantId: decoded.tenantId,
      role: decoded.role,
      email: decoded.email,
      fullName: decoded.fullName,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Authentication expired: Token has expired', {}, 401);
    }
    return errorResponse(res, 'Authentication failed: Invalid token', {}, 401);
  }
};

module.exports = {
  authenticateToken,
};
