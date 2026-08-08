import { z } from 'zod';

export const createTicketSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().min(5, 'Description must be detailed'),
    category_id: z.string().optional().default('General IT Support'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
    assigned_agent_id: z.string().uuid().optional(),
  }),
});

export const updateTicketSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ticket UUID'),
  }),
  body: z.object({
    status: z.enum(['NEW', 'TRIAGED', 'IN_PROGRESS', 'PENDING_USER', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    assigned_agent_id: z.string().uuid().nullable().optional(),
    ai_urgency_score: z.number().min(0).max(100).optional(),
    is_auto_resolved: z.boolean().optional(),
  }),
});

export const addCommentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ticket UUID'),
  }),
  body: z.object({
    content: z.string().min(1, 'Comment content cannot be empty'),
    is_internal_note: z.boolean().optional().default(false),
    is_ai_generated: z.boolean().optional().default(false),
  }),
});

export const getTicketByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid ticket UUID'),
  }),
});
