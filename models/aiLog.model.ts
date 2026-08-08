import { prisma, checkDbConnection } from '../config/db.js';
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
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const logEntry = await prisma.aIAgentLog.create({
        data: {
          ticket_id: data.ticket_id || undefined,
          action_type: data.action_type,
          model_used: data.model_used,
          prompt_tokens: data.prompt_tokens || 0,
          completion_tokens: data.completion_tokens || 0,
          latency_ms: data.latency_ms || 0,
          confidence_score: data.confidence_score || 0.0,
        },
      });
      return {
        ...logEntry,
        confidence_score: Number(logEntry.confidence_score),
      } as any;
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
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const logs = await prisma.aIAgentLog.findMany({
        orderBy: { created_at: 'desc' },
        take: 100,
      });
      return logs.map((l) => ({
        ...l,
        confidence_score: Number(l.confidence_score),
      })) as any;
    }
    return fallbackLogs;
  }
}
