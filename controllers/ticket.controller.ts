import { Request, Response } from 'express';
import { TicketModel } from '../models/ticket.model.js';
import { GeminiService } from '../services/gemini.service.js';
import { AILogModel } from '../models/aiLog.model.js';

export class TicketController {
  static async createTicket(req: Request, res: Response) {
    try {
      const { title, description, category_id, priority, assigned_agent_id } = req.body;
      const creator_id = req.user?.id || null;

      // 1. Persist new ticket
      const ticket = await TicketModel.create({
        title,
        description,
        category_id,
        priority,
        creator_id,
        assigned_agent_id,
      });

      // 2. Trigger async triage pipeline in background
      const startTime = Date.now();
      GeminiService.runMultiModalTriage(title, description, req.user?.department || 'General')
        .then(async (triageResult) => {
          const latencyMs = Date.now() - startTime;
          // Update ticket with AI triage results
          await TicketModel.update(ticket.id, {
            status: triageResult.autoResolutionEligible ? 'RESOLVED' : 'TRIAGED',
            priority: triageResult.priority,
            category_id: triageResult.category,
            ai_urgency_score: triageResult.urgencyScore,
            is_auto_resolved: triageResult.autoResolutionEligible,
          });

          // Add AI resolution comment if auto-resolution eligible
          if (triageResult.draftResolution) {
            await TicketModel.addComment({
              ticket_id: ticket.id,
              author_id: null,
              content: `[AI Co-Pilot Draft]: ${triageResult.draftResolution}`,
              is_internal_note: !triageResult.autoResolutionEligible,
              is_ai_generated: true,
            });
          }

          // Audit Log
          await AILogModel.log({
            ticket_id: ticket.id,
            action_type: 'ASYNC_TIAGE_PIPELINE',
            model_used: 'gemini-2.5-flash',
            prompt_tokens: 150,
            completion_tokens: 220,
            latency_ms: latencyMs,
            confidence_score: triageResult.confidence,
          });
        })
        .catch((err) => console.error('[TicketController] Async triage pipeline error:', err));

      return res.status(201).json({
        success: true,
        message: 'Ticket created successfully. Async triage pipeline triggered.',
        data: ticket,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'CreateTicketError', message: err.message });
    }
  }

  static async getTickets(req: Request, res: Response) {
    try {
      const { status, priority, category_id } = req.query;
      const tickets = await TicketModel.findAll({
        status: status as string,
        priority: priority as string,
        category_id: category_id as string,
      });
      return res.json({
        success: true,
        count: tickets.length,
        data: tickets,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'GetTicketsError', message: err.message });
    }
  }

  static async getTicketById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        return res.status(404).json({ success: false, error: 'NotFound', message: 'Ticket not found' });
      }
      const comments = await TicketModel.getComments(id);
      return res.json({
        success: true,
        data: {
          ...ticket,
          comments,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'GetTicketByIdError', message: err.message });
    }
  }

  static async updateTicket(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedTicket = await TicketModel.update(id, updates);
      if (!updatedTicket) {
        return res.status(404).json({ success: false, error: 'NotFound', message: 'Ticket not found' });
      }

      return res.json({
        success: true,
        message: 'Ticket updated successfully',
        data: updatedTicket,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'UpdateTicketError', message: err.message });
    }
  }

  static async addComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { content, is_internal_note, is_ai_generated } = req.body;

      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        return res.status(404).json({ success: false, error: 'NotFound', message: 'Ticket not found' });
      }

      const comment = await TicketModel.addComment({
        ticket_id: id,
        author_id: req.user?.id || null,
        content,
        is_internal_note,
        is_ai_generated,
      });

      return res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: comment,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'AddCommentError', message: err.message });
    }
  }
}
