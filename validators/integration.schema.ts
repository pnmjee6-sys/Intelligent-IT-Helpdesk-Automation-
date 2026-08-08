import { z } from 'zod';

export const oktaResetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Valid user email required'),
    okta_id: z.string().optional(),
    send_email: z.boolean().optional().default(true),
  }),
});

export const webhookSchema = z.object({
  body: z.object({
    event: z.string().min(1, 'Event type required'),
    payload: z.record(z.string(), z.any()),
  }),
});
