import { z } from 'zod';

export const triageSchema = z.object({
  body: z.object({
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().min(1, 'Description is required'),
    department: z.string().optional().default('General'),
    ticket_id: z.string().uuid().optional(),
  }),
});

export const vectorSearchSchema = z.object({
  body: z.object({
    query: z.string().min(1, 'Query string is required'),
    limit: z.number().int().min(1).max(20).optional().default(5),
  }),
});

export const copilotDraftSchema = z.object({
  body: z.object({
    ticket_id: z.string().uuid('Valid ticket UUID required').optional(),
    ticket_title: z.string().min(1, 'Ticket title required'),
    ticket_description: z.string().min(1, 'Ticket description required'),
    matched_kb_context: z.array(z.string()).optional(),
  }),
});
