import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { env } from './config/env.js';
import { piiRedactor } from './middlewares/piiRedactor.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import apiV1Router from './routes/index.js';
import { GeminiService } from './services/gemini.service.js';

async function startServer() {
  const app = express();
  const PORT = env.PORT || 3000;

  // Body Parsing Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security & Data scrubbing Middlewares
  app.use(piiRedactor);
  app.use(rateLimiter);

  // Mount Versioned Express API Routes (/api/v1/)
  app.use('/api/v1', apiV1Router);

  // Backwards-compatible /api/triage endpoint for existing frontend clients
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

  // Global Error Handler
  app.use(errorHandler);

  // Vite Development / Production SPA Handler
  if (env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express Backend] Intelligent IT HelpDesk Platform active on http://localhost:${PORT}`);
    console.log(`[Express Backend] Modular API v1 Routes available at http://localhost:${PORT}/api/v1`);
  });
}

startServer();
