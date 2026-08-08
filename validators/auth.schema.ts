import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    full_name: z.string().min(2, 'Full name is required'),
    role: z.enum(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']).default('END_USER'),
    department: z.string().optional().default('General'),
    okta_id: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});
