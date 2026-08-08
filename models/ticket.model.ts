import { dbPool, checkDbConnection } from '../config/db.js';
import crypto from 'crypto';

export interface TicketRecord {
  id: string;
  ticket_number: number;
  title: string;
  description: string;
  status: 'NEW' | 'TRIAGED' | 'IN_PROGRESS' | 'PENDING_USER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category_id: string;
  creator_id: string | null;
  assigned_agent_id: string | null;
  ai_urgency_score: number;
  is_auto_resolved: boolean;
  created_at: Date;
}

export interface TicketCommentRecord {
  id: string;
  ticket_id: string;
  author_id: string | null;
  content: string;
  is_internal_note: boolean;
  is_ai_generated: boolean;
  created_at: Date;
}

const fallbackTickets: TicketRecord[] = [];
const fallbackComments: TicketCommentRecord[] = [];
let ticketCounter = 1000;

export class TicketModel {
  static async create(data: {
    title: string;
    description: string;
    category_id?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    creator_id?: string | null;
    assigned_agent_id?: string | null;
    ai_urgency_score?: number;
    is_auto_resolved?: boolean;
  }): Promise<TicketRecord> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query(
        `INSERT INTO tickets (title, description, category_id, priority, creator_id, assigned_agent_id, ai_urgency_score, is_auto_resolved)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          data.title,
          data.description,
          data.category_id || 'General IT Support',
          data.priority || 'MEDIUM',
          data.creator_id || null,
          data.assigned_agent_id || null,
          data.ai_urgency_score || 0,
          data.is_auto_resolved || false,
        ]
      );
      return res.rows[0];
    }

    ticketCounter++;
    const newTicket: TicketRecord = {
      id: crypto.randomUUID(),
      ticket_number: ticketCounter,
      title: data.title,
      description: data.description,
      status: 'NEW',
      priority: data.priority || 'MEDIUM',
      category_id: data.category_id || 'General IT Support',
      creator_id: data.creator_id || null,
      assigned_agent_id: data.assigned_agent_id || null,
      ai_urgency_score: data.ai_urgency_score || 0,
      is_auto_resolved: data.is_auto_resolved || false,
      created_at: new Date(),
    };
    fallbackTickets.push(newTicket);
    return newTicket;
  }

  static async findAll(filters: { status?: string; priority?: string; category_id?: string } = {}): Promise<TicketRecord[]> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      let query = 'SELECT * FROM tickets WHERE 1=1';
      const params: any[] = [];
      if (filters.status) {
        params.push(filters.status);
        query += ` AND status = $${params.length}`;
      }
      if (filters.priority) {
        params.push(filters.priority);
        query += ` AND priority = $${params.length}`;
      }
      query += ' ORDER BY created_at DESC';
      const res = await dbPool.query(query, params);
      return res.rows;
    }

    return fallbackTickets.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      return true;
    });
  }

  static async findById(id: string): Promise<TicketRecord | null> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query('SELECT * FROM tickets WHERE id = $1 LIMIT 1', [id]);
      return res.rows[0] || null;
    }
    return fallbackTickets.find((t) => t.id === id) || null;
  }

  static async update(id: string, updates: Partial<TicketRecord>): Promise<TicketRecord | null> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const fields: string[] = [];
      const values: any[] = [id];
      Object.entries(updates).forEach(([key, val]) => {
        if (val !== undefined) {
          values.push(val);
          fields.push(`${key} = $${values.length}`);
        }
      });
      if (fields.length === 0) return this.findById(id);
      const query = `UPDATE tickets SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
      const res = await dbPool.query(query, values);
      return res.rows[0] || null;
    }

    const ticketIndex = fallbackTickets.findIndex((t) => t.id === id);
    if (ticketIndex === -1) return null;
    fallbackTickets[ticketIndex] = { ...fallbackTickets[ticketIndex], ...updates };
    return fallbackTickets[ticketIndex];
  }

  static async addComment(data: {
    ticket_id: string;
    author_id?: string | null;
    content: string;
    is_internal_note?: boolean;
    is_ai_generated?: boolean;
  }): Promise<TicketCommentRecord> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query(
        `INSERT INTO ticket_comments (ticket_id, author_id, content, is_internal_note, is_ai_generated)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          data.ticket_id,
          data.author_id || null,
          data.content,
          data.is_internal_note || false,
          data.is_ai_generated || false,
        ]
      );
      return res.rows[0];
    }

    const newComment: TicketCommentRecord = {
      id: crypto.randomUUID(),
      ticket_id: data.ticket_id,
      author_id: data.author_id || null,
      content: data.content,
      is_internal_note: data.is_internal_note || false,
      is_ai_generated: data.is_ai_generated || false,
      created_at: new Date(),
    };
    fallbackComments.push(newComment);
    return newComment;
  }

  static async getComments(ticket_id: string): Promise<TicketCommentRecord[]> {
    const isDbConnected = await checkDbConnection();
    if (isDbConnected) {
      const res = await dbPool.query(
        'SELECT * FROM ticket_comments WHERE ticket_id = $1 ORDER BY created_at ASC',
        [ticket_id]
      );
      return res.rows;
    }
    return fallbackComments.filter((c) => c.ticket_id === ticket_id);
  }
}
