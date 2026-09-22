const { errorResponse } = require('../utils/response');

/**
 * Zod request validation middleware
 * @param {object} schemas { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 */
const validateRequest = (schemas = {}) => {
  return async (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        const formattedErrors = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.') || 'root';
          formattedErrors[field] = err.message;
        });
        return errorResponse(res, 'Validation error: Invalid input data', formattedErrors, 400);
      }

      return errorResponse(res, 'Validation error: ' + error.message, {}, 400);
    }
  };
};

module.exports = {
  validateRequest,
};
