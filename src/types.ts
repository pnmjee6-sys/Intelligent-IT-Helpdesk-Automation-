export type Page = 'landing' | 'login' | 'register' | 'dashboard' | 'workflows' | 'profile' | 'settings';

export type UserRole = 'employee' | 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  department: string;
  title: string;
  employeeId: string;
  skills: string[];
  ticketsResolved: number;
  csatRating: number;
  avgResponseTime: string;
  joinedDate: string;
}

export interface KbArticle {
  id: string;
  title: string;
  category: string;
  snippet: string;
  content: string;
  similarity: number;
  views: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorAvatar?: string;
  action: string;
  note?: string;
  type: 'creation' | 'triage' | 'assignment' | 'comment' | 'resolution';
}

export interface Ticket {
  id: string;
  requesterName: string;
  requesterEmail: string;
  requesterAvatar?: string;
  requesterDept: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'triaged' | 'in_progress' | 'resolved' | 'closed';
  urgencyScore: number; // 0 - 100
  sentiment: 'calm' | 'neutral' | 'frustrated' | 'critical';
  assignedAgentId?: string;
  assignedAgentName?: string;
  assignedAgentAvatar?: string;
  createdAt: string;
  slaDeadlineMinutes: number;
  slaRemainingMinutes: number;
  isSlaBreached: boolean;
  resolutionDraft?: string;
  matchedKbArticles: KbArticle[];
  timeline: TimelineEvent[];
}

export interface AppSettings {
  autoDeflectionThreshold: number; // e.g. 85
  geminiModel: string; // e.g. "gemini-2.5-flash"
  sentimentAlerts: boolean;
  defaultSlaMinutes: number;
  enableSlackIntegration: boolean;
  enableTeamsIntegration: boolean;
  enableOktaSSO: boolean;
  enableJiraSync: boolean;
  enableEmailNotifications: boolean;
  enableDesktopPush: boolean;
  require2FA: boolean;
}
