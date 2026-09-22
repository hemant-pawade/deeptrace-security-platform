const { z } = require('zod');

const createCampaignSchema = z.object({
  name: z.string().trim().min(2, 'Campaign name must be at least 2 characters'),
  description: z.string().trim().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('DRAFT'),
  start_date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional().nullable(),
  end_date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional().nullable(),
});

const updateCampaignSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']).optional(),
  start_date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional().nullable(),
  end_date: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional().nullable(),
});

const campaignQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional().transform((v) => (v === '' ? undefined : v)),
  status: z
    .enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  sortBy: z.enum(['name', 'status', 'start_date', 'end_date', 'created_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const assignUserSchema = z.object({
  user_id: z.string().uuid('Invalid user ID format'),
});

module.exports = {
  createCampaignSchema,
  updateCampaignSchema,
  campaignQuerySchema,
  assignUserSchema,
};
