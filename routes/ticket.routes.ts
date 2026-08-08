import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { ticketIngestionLimiter } from '../middlewares/rateLimiter.js';
import {
  createTicketSchema,
  updateTicketSchema,
  addCommentSchema,
  getTicketByIdSchema,
} from '../validators/ticket.schema.js';

const router = Router();

// Apply auth middleware to all ticket routes
router.use(authMiddleware);

// GET /api/v1/tickets - List all tickets (All authenticated roles)
router.get(
  '/',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  TicketController.getTickets
);

// POST /api/v1/tickets - Create new ticket (Rate-limited & validated)
router.post(
  '/',
  ticketIngestionLimiter,
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(createTicketSchema),
  TicketController.createTicket
);

// GET /api/v1/tickets/:id - Get ticket details
router.get(
  '/:id',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(getTicketByIdSchema),
  TicketController.getTicketById
);

// PATCH /api/v1/tickets/:id - Update status / assigned agent / priority
router.patch(
  '/:id',
  rbacMiddleware(['L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(updateTicketSchema),
  TicketController.updateTicket
);

// POST /api/v1/tickets/:id/comments - Add ticket comment
router.post(
  '/:id/comments',
  rbacMiddleware(['END_USER', 'L1_AGENT', 'L2_AGENT', 'HELPDESK_MANAGER', 'SYS_ADMIN']),
  validate(addCommentSchema),
  TicketController.addComment
);

export default router;
