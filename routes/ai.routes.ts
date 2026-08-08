import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { AIFeaturesController } from '../controllers/aiFeatures.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { triageSchema, vectorSearchSchema, copilotDraftSchema } from '../validators/ai.schema.js';
import {
  studyPlannerSchema,
  quizGeneratorSchema,
  notesSummarizerSchema,
  aiChatSchema,
  flashcardsSchema,
} from '../validators/aiFeatures.schema.js';

const router = Router();

router.use(authMiddleware);

// 1. Triage, Vector Search & Co-Pilot Draft Endpoints
router.post(
  '/triage',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(triageSchema),
  AIController.executeTriage
);

router.post(
  '/vector-search',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(vectorSearchSchema),
  AIController.searchVector
);

router.post(
  '/copilot-draft',
  rbacMiddleware(['L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(copilotDraftSchema),
  AIController.generateCopilotDraft
);

// 2. Study Planner Endpoint
router.post(
  '/study-planner',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(studyPlannerSchema),
  AIFeaturesController.generateStudyPlan
);

// 3. Quiz Generator Endpoint
router.post(
  '/quiz-generator',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(quizGeneratorSchema),
  AIFeaturesController.generateQuiz
);

// 4. Notes Summarizer Endpoint
router.post(
  '/notes-summarizer',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(notesSummarizerSchema),
  AIFeaturesController.summarizeNotes
);

// 5. AI Chat Assistant Endpoint
router.post(
  '/chat',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(aiChatSchema),
  AIFeaturesController.runAIChat
);

// 6. Flashcards Generator Endpoint
router.post(
  '/flashcards',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(flashcardsSchema),
  AIFeaturesController.generateFlashcards
);

export default router;
