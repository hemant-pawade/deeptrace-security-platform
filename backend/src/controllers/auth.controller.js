const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const result = await authService.login(email, password, clientIp);
      return successResponse(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const result = await authService.getMe(req.user.userId, req.user.tenantId);
      return successResponse(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
