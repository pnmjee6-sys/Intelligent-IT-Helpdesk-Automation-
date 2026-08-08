import { z } from 'zod';

export const studyPlannerSchema = z.object({
  body: z.object({
    topic: z.string().min(2, 'Topic must be at least 2 characters'),
    duration_days: z.number().int().min(1).max(90).optional().default(7),
    skill_level: z.enum(['beginner', 'intermediate', 'advanced']).optional().default('beginner'),
  }),
});

export const quizGeneratorSchema = z.object({
  body: z.object({
    topic: z.string().min(2, 'Topic must be at least 2 characters'),
    num_questions: z.number().int().min(1).max(20).optional().default(5),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  }),
});

export const notesSummarizerSchema = z.object({
  body: z.object({
    notes_text: z.string().min(10, 'Notes text must be at least 10 characters'),
    summary_length: z.enum(['concise', 'detailed', 'bullet_points']).optional().default('bullet_points'),
  }),
});

export const aiChatSchema = z.object({
  body: z.object({
    messages: z
      .array(
        z.object({
          role: z.enum(['user', 'model']),
          text: z.string().min(1),
        })
      )
      .optional()
      .default([]),
    new_message: z.string().min(1, 'Message text cannot be empty'),
  }),
});

export const flashcardsSchema = z.object({
  body: z.object({
    topic: z.string().min(2, 'Topic must be at least 2 characters'),
    card_count: z.number().int().min(1).max(20).optional().default(5),
  }),
});
