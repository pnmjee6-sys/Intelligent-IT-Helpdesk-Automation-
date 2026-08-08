import { Router } from 'express';
import authRoutes from './auth.routes.js';
import ticketRoutes from './ticket.routes.js';
import aiRoutes from './ai.routes.js';
import kbRoutes from './kb.routes.js';
import analyticsRoutes from './analytics.routes.js';
import integrationRoutes from './integration.routes.js';

const apiV1Router = Router();

apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/tickets', ticketRoutes);
apiV1Router.use('/ai', aiRoutes);
apiV1Router.use('/kb', kbRoutes);
apiV1Router.use('/analytics', analyticsRoutes);
apiV1Router.use('/integrations', integrationRoutes);

export default apiV1Router;
