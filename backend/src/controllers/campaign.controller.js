const campaignService = require('../services/campaign.service');
const { successResponse, paginatedResponse } = require('../utils/response');

class CampaignController {
  async listCampaigns(req, res, next) {
    try {
      const { campaigns, pagination } = await campaignService.listCampaigns(
        req.tenantId,
        req.user,
        req.query
      );
      return paginatedResponse(res, campaigns, pagination, 200);
    } catch (error) {
      next(error);
    }
  }

  async getCampaignById(req, res, next) {
    try {
      const campaign = await campaignService.getCampaignById(
        req.params.id,
        req.tenantId,
        req.user
      );
      return successResponse(res, campaign, 200);
    } catch (error) {
      next(error);
    }
  }

  async createCampaign(req, res, next) {
    try {
      const campaign = await campaignService.createCampaign(
        req.tenantId,
        req.user,
        req.body
      );
      return successResponse(res, campaign, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCampaign(req, res, next) {
    try {
      const campaign = await campaignService.updateCampaign(
        req.params.id,
        req.tenantId,
        req.user,
        req.body
      );
      return successResponse(res, campaign, 200);
    } catch (error) {
      next(error);
    }
  }

  async deleteCampaign(req, res, next) {
    try {
      const result = await campaignService.deleteCampaign(
        req.params.id,
        req.tenantId,
        req.user
      );
      return successResponse(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  async getCampaignUsers(req, res, next) {
    try {
      const users = await campaignService.getCampaignUsers(
        req.params.id,
        req.tenantId
      );
      return successResponse(res, users, 200);
    } catch (error) {
      next(error);
    }
  }

  async assignUser(req, res, next) {
    try {
      const assignment = await campaignService.assignUser(
        req.params.id,
        req.tenantId,
        req.user,
        req.body.user_id
      );
      return successResponse(res, assignment, 201);
    } catch (error) {
      next(error);
    }
  }

  async removeUser(req, res, next) {
    try {
      const result = await campaignService.removeUser(
        req.params.id,
        req.tenantId,
        req.user,
        req.params.userId
      );
      return successResponse(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CampaignController();
