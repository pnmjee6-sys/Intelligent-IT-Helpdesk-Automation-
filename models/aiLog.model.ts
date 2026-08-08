import { dbPool, checkDbConnection } from '../config/db.js';
import crypto from 'crypto';

export interface AIAgentLogRecord {
  id: string;
  ticket_id: string | null;
  action_type: string;
  model_used: string;
  prompt_tokens: number;
  completion_tokens: number;
  latency_ms: number;
  confidence_score: number;
  created_at: Date;
}

const fallbackLogs: AIAgentLogRecord[] = [];

export class AILogModel {
  static async log(data: {
    ticket_id?: string | null;
    action_type: string;
    model_used: string;
    prompt_tokens?: number;
    completion_tokens?: number;
    latency_ms?: number;
    confidence_score?: number;
  }): Promise<AIAgentLogRecord> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query(
        `INSERT INTO ai_agent_logs (ticket_id, action_type, model_used, prompt_tokens, completion_tokens, latency_ms, confidence_score)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.ticket_id || null,
          data.action_type,
          data.model_used,
          data.prompt_tokens || 0,
          data.completion_tokens || 0,
          data.latency_ms || 0,
          data.confidence_score || 0.0,
        ]
      );
      return res.rows[0];
    }

    const newLog: AIAgentLogRecord = {
      id: crypto.randomUUID(),
      ticket_id: data.ticket_id || null,
      action_type: data.action_type,
      model_used: data.model_used,
      prompt_tokens: data.prompt_tokens || 0,
      completion_tokens: data.completion_tokens || 0,
      latency_ms: data.latency_ms || 0,
      confidence_score: data.confidence_score || 0.0,
      created_at: new Date(),
    };
    fallbackLogs.push(newLog);
    return newLog;
  }

  static async getLogs(): Promise<AIAgentLogRecord[]> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query('SELECT * FROM ai_agent_logs ORDER BY created_at DESC LIMIT 100');
      return res.rows;
    }
    return fallbackLogs;
  }
}
