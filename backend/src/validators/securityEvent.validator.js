const { z } = require('zod');

const createSecurityEventSchema = z.object({
  event_type: z.string().trim().min(2, 'Event type is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('LOW'),
  status: z.enum(['OPEN', 'RESOLVED']).default('OPEN'),
  description: z.string().trim().min(5, 'Description must be at least 5 characters'),
  source_ip: z.string().trim().optional().nullable(),
});

const updateSecurityEventSchema = z.object({
  status: z.enum(['OPEN', 'RESOLVED']).optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  description: z.string().trim().min(5).optional(),
});

const securityEventQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional().transform((v) => (v === '' ? undefined : v)),
  severity: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  status: z
    .enum(['OPEN', 'RESOLVED'])
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  sortBy: z.enum(['event_type', 'severity', 'status', 'created_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

module.exports = {
  createSecurityEventSchema,
  updateSecurityEventSchema,
  securityEventQuerySchema,
};
