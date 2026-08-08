import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';

const router = Router();

router.use(authMiddleware);

// GET /api/v1/analytics/metrics - Real-time SLA metrics & MTTR analytics
router.get(
  '/metrics',
  rbacMiddleware(['HELPDESK_MANAGER', 'SYS_ADMIN', 'L2_AGENT']),
  AnalyticsController.getMetrics
);

// GET /api/v1/analytics - Fallback shortcut endpoint
router.get(
  '/',
  rbacMiddleware(['HELPDESK_MANAGER', 'SYS_ADMIN', 'L2_AGENT']),
  AnalyticsController.getMetrics
);

export default router;
