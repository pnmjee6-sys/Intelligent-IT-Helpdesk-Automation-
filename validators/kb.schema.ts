import { z } from 'zod';

export const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    content_markdown: z.string().min(10, 'Content markdown must be at least 10 characters'),
    category_id: z.string().optional().default('General'),
    is_published: z.boolean().optional().default(true),
  }),
});

export const getArticleByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid article UUID'),
  }),
});

export const updateArticleSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid article UUID'),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    content_markdown: z.string().min(10).optional(),
    category_id: z.string().optional(),
    is_published: z.boolean().optional(),
  }),
});
