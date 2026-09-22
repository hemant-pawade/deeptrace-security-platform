const { z } = require('zod');

const auditLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional().transform((v) => (v === '' ? undefined : v)),
  action: z.string().trim().optional().transform((v) => (v === '' ? undefined : v)),
  sortBy: z.enum(['action', 'entity_type', 'created_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

module.exports = {
  auditLogQuerySchema,
};
