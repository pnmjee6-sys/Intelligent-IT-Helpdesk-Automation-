import { Router } from 'express';
import { KBController } from '../controllers/kb.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { createArticleSchema, getArticleByIdSchema } from '../validators/kb.schema.js';

const router = Router();

// GET /api/v1/kb - List all KB articles (Public / All users)
router.get('/', KBController.getArticles);

// GET /api/v1/kb/:id - Article details
router.get('/:id', validate(getArticleByIdSchema), KBController.getArticleById);

// POST /api/v1/kb - Create article + automatic vector chunking (Agents & Admins)
router.post(
  '/',
  authMiddleware,
  rbacMiddleware(['L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(createArticleSchema),
  KBController.createArticle
);

export default router;
