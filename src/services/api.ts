// Frontend Centralized API Client with JWT Bearer Token Injection & Error Handling
const API_BASE_URL = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const errorMsg = data.message || data.error || `HTTP ${response.status} Request Failed`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    login: (email: string, password: string) =>
      request<{ success: boolean; data: { user: any; token: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (payload: { email: string; password: string; full_name: string; role?: string; department?: string }) =>
      request<{ success: boolean; data: { user: any; token: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    logout: () => {
      localStorage.removeItem('token');
    },

    getStoredToken: () => localStorage.getItem('token'),
  },

  // Tickets
  tickets: {
    getAll: (filters?: { status?: string; priority?: string }) => {
      const query = new URLSearchParams(filters as any).toString();
      return request<{ success: boolean; count: number; data: any[] }>(`/tickets${query ? `?${query}` : ''}`);
    },

    getById: (id: string) => request<{ success: boolean; data: any }>(`/tickets/${id}`),

    create: (ticket: { title: string; description: string; category_id?: string; priority?: string }) =>
      request<{ success: boolean; message: string; data: any }>('/tickets', {
        method: 'POST',
        body: JSON.stringify(ticket),
      }),

    update: (id: string, updates: Partial<{ status: string; priority: string; assigned_agent_id: string }>) =>
      request<{ success: boolean; data: any }>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),

    addComment: (id: string, comment: { content: string; is_internal_note?: boolean }) =>
      request<{ success: boolean; data: any }>(`/tickets/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify(comment),
      }),
  },

  // Gemini AI Features
  ai: {
    triage: (payload: { subject: string; description: string; department?: string }) =>
      request<{ success: boolean; data: any }>('/ai/triage', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    vectorSearch: (query: string, limit: number = 5) =>
      request<{ success: boolean; data: any[] }>('/ai/vector-search', {
        method: 'POST',
        body: JSON.stringify({ query, limit }),
      }),

    copilotDraft: (payload: { ticket_title: string; ticket_description: string; matched_kb_context?: string[] }) =>
      request<{ success: boolean; data: { draft: string } }>('/ai/copilot-draft', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    studyPlanner: (payload: { topic: string; duration_days?: number; skill_level?: string }) =>
      request<{ success: boolean; data: any }>('/ai/study-planner', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    quizGenerator: (payload: { topic: string; num_questions?: number; difficulty?: string }) =>
      request<{ success: boolean; data: any }>('/ai/quiz-generator', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    notesSummarizer: (payload: { notes_text: string; summary_length?: string }) =>
      request<{ success: boolean; data: any }>('/ai/notes-summarizer', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    chat: (payload: { messages?: Array<{ role: string; text: string }>; new_message: string }) =>
      request<{ success: boolean; data: { reply: string } }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    flashcards: (payload: { topic: string; card_count?: number }) =>
      request<{ success: boolean; data: any }>('/ai/flashcards', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  // Analytics Metrics
  analytics: {
    getMetrics: () => request<{ success: boolean; data: any }>('/analytics/metrics'),
  },
};
