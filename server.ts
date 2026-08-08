import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { env } from './config/env.js';
import { app } from './app.js';

async function startServer() {
  const PORT = env.PORT || 3000;

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
