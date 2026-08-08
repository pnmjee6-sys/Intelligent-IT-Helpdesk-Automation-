import { Request, Response } from 'express';
import { GeminiFeaturesService } from '../services/geminiFeatures.service.js';

export class AIFeaturesController {
  static async generateStudyPlan(req: Request, res: Response) {
    try {
      const { topic, duration_days, skill_level } = req.body;
      const startTime = Date.now();

      const result = await GeminiFeaturesService.generateStudyPlan(topic, duration_days, skill_level);
      const latencyMs = Date.now() - startTime;

      return res.json({
        success: true,
        data: result,
        meta: {
          latency_ms: latencyMs,
          model: 'gemini-2.5-flash',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'StudyPlannerError', message: err.message });
    }
  }

  static async generateQuiz(req: Request, res: Response) {
    try {
      const { topic, num_questions, difficulty } = req.body;
      const startTime = Date.now();

      const result = await GeminiFeaturesService.generateQuiz(topic, num_questions, difficulty);
      const latencyMs = Date.now() - startTime;

      return res.json({
        success: true,
        data: result,
        meta: {
          latency_ms: latencyMs,
          model: 'gemini-2.5-flash',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'QuizGeneratorError', message: err.message });
    }
  }

  static async summarizeNotes(req: Request, res: Response) {
    try {
      const { notes_text, summary_length } = req.body;
      const startTime = Date.now();

      const result = await GeminiFeaturesService.summarizeNotes(notes_text, summary_length);
      const latencyMs = Date.now() - startTime;

      return res.json({
        success: true,
        data: result,
        meta: {
          latency_ms: latencyMs,
          model: 'gemini-2.5-flash',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'NotesSummarizerError', message: err.message });
    }
  }

  static async runAIChat(req: Request, res: Response) {
    try {
      const { messages, new_message } = req.body;
      const startTime = Date.now();

      const result = await GeminiFeaturesService.runAIChat(messages || [], new_message);
      const latencyMs = Date.now() - startTime;

      return res.json({
        success: true,
        data: result,
        meta: {
          latency_ms: latencyMs,
          model: 'gemini-2.5-flash',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'AIChatError', message: err.message });
    }
  }

  static async generateFlashcards(req: Request, res: Response) {
    try {
      const { topic, card_count } = req.body;
      const startTime = Date.now();

      const result = await GeminiFeaturesService.generateFlashcards(topic, card_count);
      const latencyMs = Date.now() - startTime;

      return res.json({
        success: true,
        data: result,
        meta: {
          latency_ms: latencyMs,
          model: 'gemini-2.5-flash',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: 'FlashcardsGeneratorError', message: err.message });
    }
  }
}
