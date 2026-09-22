/**
 * Centralized error handling middleware
 * Safely sanitizes internal database and system errors to avoid credential or stack leaks.
 */
const errorHandler = (err, req, res, next) => {
  // Log error internally for developer/server diagnosis without exposing to client
  console.error('[Unhandled Error]', {
    message: err.message,
    name: err.name,
    code: err.code,
    path: req.path,
    method: req.method,
  });

  // Handle Prisma unique constraint violations (e.g., P2002)
  if (err.code === 'P2002') {
    const targets = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `Conflict: Unique constraint violated on ${targets}`,
      errors: { [targets]: 'Value already exists' },
    });
  }

  // Handle Prisma foreign key constraint violations (P2003)
  if (err.code === 'P2003') {
    return res.status(409).json({
      success: false,
      message: 'Operation conflict: Resource is referenced by other records (foreign key constraint).',
      errors: {},
    });
  }

  // Handle Prisma record not found (e.g. P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
      errors: {},
    });
  }

  // Handle custom status errors (like 400, 403, 404, 409)
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = statusCode === 500
    ? 'Internal server error occurred. Please contact security operations.'
    : err.message || 'Operation failed';

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || {},
  });
};

module.exports = {
  errorHandler,
};
