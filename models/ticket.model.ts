import { prisma, checkDbConnection } from '../config/db.js';
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
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const ticket = await prisma.ticket.create({
        data: {
          title: data.title,
          description: data.description,
          category_id: data.category_id || 'General IT Support',
          priority: (data.priority as any) || 'MEDIUM',
          creator_id: data.creator_id || undefined,
          assigned_agent_id: data.assigned_agent_id || undefined,
          ai_urgency_score: data.ai_urgency_score || 0,
          is_auto_resolved: data.is_auto_resolved || false,
        },
      });
      return ticket as any;
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
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const where: any = {};
      if (filters.status) where.status = filters.status;
      if (filters.priority) where.priority = filters.priority;
      if (filters.category_id) where.category_id = filters.category_id;

      const tickets = await prisma.ticket.findMany({
        where,
        orderBy: { created_at: 'desc' },
      });
      return tickets as any;
    }

    return fallbackTickets.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      return true;
    });
  }

  static async findById(id: string): Promise<TicketRecord | null> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });
      return ticket as any;
    }
    return fallbackTickets.find((t) => t.id === id) || null;
  }

  static async update(id: string, updates: Partial<TicketRecord>): Promise<TicketRecord | null> {
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const ticket = await prisma.ticket.update({
        where: { id },
        data: updates as any,
      });
      return ticket as any;
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
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const comment = await prisma.ticketComment.create({
        data: {
          ticket_id: data.ticket_id,
          author_id: data.author_id || undefined,
          content: data.content,
          is_internal_note: data.is_internal_note || false,
          is_ai_generated: data.is_ai_generated || false,
        },
      });
      return comment as any;
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
    const isConnected = await checkDbConnection();
    if (isConnected) {
      const comments = await prisma.ticketComment.findMany({
        where: { ticket_id },
        orderBy: { created_at: 'asc' },
      });
      return comments as any;
    }
    return fallbackComments.filter((c) => c.ticket_id === ticket_id);
  }
}
