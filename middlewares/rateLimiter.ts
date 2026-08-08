import rateLimit from 'express-rate-limit';

// Global API rate limiter (100 requests per 15 minutes)
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please wait before submitting additional requests.',
  },
});

// Dedicated Ticket Ingestion Rate Limiter (30 requests per 15 minutes) to prevent DoS ingestion spikes
export const ticketIngestionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too Many Ticket Submissions',
    message: 'Ticket ingestion limit reached. Please wait before submitting more tickets.',
  },
});

// Dedicated Workflow & Automation Rate Limiter (30 requests per 15 minutes)
export const workflowLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too Many Workflow Executions',
    message: 'Workflow execution rate limit reached. Please wait before triggering additional automated workflows.',
  },
});
