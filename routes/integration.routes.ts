import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { oktaResetPasswordSchema, webhookSchema } from '../validators/integration.schema.js';

const router = Router();

// POST /api/v1/integrations/webhooks - External webhook ingestion
router.post('/webhooks', validate(webhookSchema), IntegrationController.handleWebhook);

// POST /api/v1/integrations/okta/reset-password - Okta password reset action
router.post(
  '/okta/reset-password',
  authMiddleware,
  rbacMiddleware(['L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(oktaResetPasswordSchema),
  IntegrationController.oktaPasswordReset
);

export default router;
