const userService = require('../services/user.service');
const { successResponse, paginatedResponse } = require('../utils/response');

class UserController {
  async listUsers(req, res, next) {
    try {
      const { users, pagination } = await userService.listUsers(req.tenantId, req.query);
      return paginatedResponse(res, users, pagination, 200);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id, req.tenantId);
      return successResponse(res, user, 200);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.tenantId, req.user, req.body);
      return successResponse(res, user, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.tenantId, req.user, req.body);
      return successResponse(res, user, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id, req.tenantId, req.user);
      return successResponse(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
