const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().trim().email('Invalid email address format'),
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER'], {
    errorMap: () => ({ message: "Role must be 'ADMIN', 'MANAGER', or 'USER'" }),
  }).default('USER'),
});

const updateUserSchema = z.object({
  full_name: z.string().trim().min(2).optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']).optional(),
  password: z
    .string()
    .min(8)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
});

const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional().transform((v) => (v === '' ? undefined : v)),
  role: z
    .enum(['ADMIN', 'MANAGER', 'USER'])
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  sortBy: z.enum(['full_name', 'email', 'role', 'created_at']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
};
