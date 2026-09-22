/**
 * Standard API Response utilities
 */

const successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json(data);
};

const paginatedResponse = (res, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit) || 1,
    },
  });
};

const errorResponse = (res, message = 'Internal server error', errors = {}, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse,
};
