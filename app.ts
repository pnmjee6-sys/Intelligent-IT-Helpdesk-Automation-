import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { piiRedactor } from './middlewares/piiRedactor.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiV1Router from './routes/index.js';
import { GeminiService } from './services/gemini.service.js';

export function createApp() {
  const app = express();

  // 1. Helmet Security Headers Setup
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc: ["'self'", 'https:', 'wss:'],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // 2. Explicit CORS Restriction Policy
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];

  if (env.APP_URL) {
    allowedOrigins.push(env.APP_URL.replace(/\/$/, ''));
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman) in non-production
        if (!origin) return callback(null, true);
        if (env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS origin '${origin}' not permitted by security policy`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body Parsing Middlewares
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Security & Data scrubbing Middlewares
  app.use(piiRedactor);
  app.use(rateLimiter);

  // Mount Versioned Express API Routes (/api/v1/)
  app.use('/api/v1', apiV1Router);

  // Backwards-compatible /api/triage endpoint
  app.post('/api/triage', async (req, res, next) => {
    try {
      const { subject, description, department } = req.body;
      if (!subject || !description) {
        return res.status(400).json({ error: 'Missing subject or description' });
      }
      const triageResult = await GeminiService.runMultiModalTriage(subject, description, department);
      return res.json(triageResult);
    } catch (err) {
      next(err);
    }
  });

  // Health Check Endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
