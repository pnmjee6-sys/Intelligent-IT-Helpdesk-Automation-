import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { triageSchema, vectorSearchSchema, copilotDraftSchema } from '../validators/ai.schema.js';

const router = Router();

router.use(authMiddleware);

// POST /api/v1/ai/triage - Multi-modal triage execution
router.post(
  '/triage',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(triageSchema),
  AIController.executeTriage
);

// POST /api/v1/ai/vector-search - Hybrid RAG vector search query
router.post(
  '/vector-search',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(vectorSearchSchema),
  AIController.searchVector
);

// POST /api/v1/ai/copilot-draft - Co-pilot response draft generation
router.post(
  '/copilot-draft',
  rbacMiddleware(['L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(copilotDraftSchema),
  AIController.generateCopilotDraft
);

export default router;
