import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service.js';
import { VectorService } from '../services/vector.service.js';
import { AILogModel } from '../models/aiLog.model.js';

export class AIController {
  static async executeTriage(req: Request, res: Response) {
    try {
      const { subject, description, department, ticket_id } = req.body;
      const startTime = Date.now();

      const triageResult = await GeminiService.runMultiModalTriage(subject, description, department);
      const latencyMs = Date.now() - startTime;

      // Log AI Action
      await AILogModel.log({
        ticket_id: ticket_id || null,
        action_type: 'MULTI_MODAL_TRIAGE',
        model_used: 'gemini-2.5-flash',
        prompt_tokens: 180,
        completion_tokens: 240,
        latency_ms: latencyMs,
        confidence_score: triageResult.confidence,
      });

      return res.json({
        success: true,
        data: triageResult,
        meta: {
          latency_ms: latencyMs,
          model: 'gemini-2.5-flash',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'AITriageError', message: err.message });
    }
  }

  static async searchVector(req: Request, res: Response) {
    try {
      const { query, limit } = req.body;
      const startTime = Date.now();

      const results = await VectorService.searchVector(query, limit || 5);
      const latencyMs = Date.now() - startTime;

      return res.json({
        success: true,
        count: results.length,
        data: results,
        meta: {
          latency_ms: latencyMs,
          vector_dimension: 768,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'VectorSearchError', message: err.message });
    }
  }

  static async generateCopilotDraft(req: Request, res: Response) {
    try {
      const { ticket_id, ticket_title, ticket_description, matched_kb_context } = req.body;
      const startTime = Date.now();

      const draft = await GeminiService.generateCopilotResponse(
        ticket_title,
        ticket_description,
        matched_kb_context || []
      );
      const latencyMs = Date.now() - startTime;

      await AILogModel.log({
        ticket_id: ticket_id || null,
        action_type: 'COPILOT_DRAFT_GEN',
        model_used: 'gemini-2.5-flash',
        prompt_tokens: 210,
        completion_tokens: 310,
        latency_ms: latencyMs,
        confidence_score: 0.95,
      });

      return res.json({
        success: true,
        data: {
          draft,
        },
        meta: {
          latency_ms: latencyMs,
          model: 'gemini-2.5-flash',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'CopilotDraftError', message: err.message });
    }
  }
}
