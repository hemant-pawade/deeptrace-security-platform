const securityEventService = require('../services/securityEvent.service');
const { successResponse, paginatedResponse } = require('../utils/response');

class SecurityEventController {
  async listEvents(req, res, next) {
    try {
      const { events, pagination } = await securityEventService.listEvents(
        req.tenantId,
        req.query
      );
      return paginatedResponse(res, events, pagination, 200);
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req, res, next) {
    try {
      const event = await securityEventService.getEventById(
        req.params.id,
        req.tenantId
      );
      return successResponse(res, event, 200);
    } catch (error) {
      next(error);
    }
  }

  async createEvent(req, res, next) {
    try {
      const event = await securityEventService.createEvent(
        req.tenantId,
        req.user,
        req.body
      );
      return successResponse(res, event, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const event = await securityEventService.updateEvent(
        req.params.id,
        req.tenantId,
        req.user,
        req.body
      );
      return successResponse(res, event, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SecurityEventController();
