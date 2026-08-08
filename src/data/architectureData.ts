export interface DatabaseTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints: string;
    description: string;
  }[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  summary: string;
  access: 'Public' | 'Employee' | 'Agent' | 'Admin' | 'System';
  requestBody?: string;
  responseBody?: string;
}

export interface RbacRole {
  role: string;
  badgeColor: string;
  description: string;
  permissions: {
    resource: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    special?: string;
  }[];
}

export interface PipelineStep {
  step: number;
  title: string;
  iconName: string;
  description: string;
  latencyMs: string;
  tech: string;
  input: string;
  output: string;
}

export const SYSTEM_METADATA = {
  version: "1.0.2",
  lastUpdated: "2026-08-07",
  status: "Verified Blueprint",
  targetSLA: "99.95% Availability",
  avgTriageLatency: "< 450ms"
};

export const TECH_STACK = [
  {
    category: "Frontend Layer",
    tech: "React 19 / Vite / Tailwind CSS v4",
    purpose: "High-performance SPA with server-side proxy & state caching",
    badge: "Client UI"
  },
  {
    category: "Backend Engine",
    tech: "Node.js (Express/Fastify) + TypeScript",
    purpose: "Asynchronous I/O routing, REST APIs, WebSocket live streams",
    badge: "API Server"
  },
  {
    category: "Database & Storage",
    tech: "PostgreSQL 16 + pgvector",
    purpose: "Relational ticket storage + vector embeddings for RAG search",
    badge: "Data Store"
  },
  {
    category: "In-Memory Cache & Queue",
    tech: "Redis + BullMQ",
    purpose: "Session state, API rate limiting, background LLM triage queue",
    badge: "Cache/Worker"
  },
  {
    category: "AI & Vector Search",
    tech: "Google Gemini 2.5 / @google/genai SDK",
    purpose: "Zero-shot classification, RAG retrieval, auto-draft resolution",
    badge: "AI Core"
  },
  {
    category: "Infrastructure & CI/CD",
    tech: "Google Cloud Run / Terraform / GitHub Actions",
    purpose: "Containerized scale-to-zero microservices & instant deployment",
    badge: "Cloud Infra"
  }
];

export const FOLDER_STRUCTURE = [
  { path: "root/", type: "dir" },
  { path: "├── .env.example", type: "file", desc: "Environment variable declarations (GEMINI_API_KEY, DB_URL)" },
  { path: "├── metadata.json", type: "file", desc: "Application metadata & frame permissions" },
  { path: "├── server.ts", type: "file", desc: "Express server entry point with Gemini proxy routes" },
  { path: "├── src/", type: "dir" },
  { path: "│   ├── api/", type: "dir", desc: "API Route Handlers" },
  { path: "│   │   ├── triage.ts", type: "file", desc: "POST /v1/ai/triage endpoint" },
  { path: "│   │   ├── tickets.ts", type: "file", desc: "CRUD ticket management routes" },
  { path: "│   │   ├── kb.ts", type: "file", desc: "RAG search & KB management" },
  { path: "│   │   └── rbac.ts", type: "file", desc: "Auth middleware & permission checks" },
  { path: "│   ├── services/", type: "dir", desc: "Core Business & AI Logic" },
  { path: "│   │   ├── triageEngine.ts", type: "file", desc: "Gemini classifier & sentiment parser" },
  { path: "│   │   ├── ragService.ts", type: "file", desc: "pgvector similarity search engine" },
  { path: "│   │   ├── routingService.ts", type: "file", desc: "Smart agent assignment rules" },
  { path: "│   │   └── slaTracker.ts", type: "file", desc: "Realtime SLA clock & escalation triggers" },
  { path: "│   ├── models/", type: "dir", desc: "Database Schemas & ORM" },
  { path: "│   │   ├── schema.ts", type: "file", desc: "Tickets, Users, KB, SLA definitions" },
  { path: "│   │   └── embeddings.ts", type: "file", desc: "Vector table mapping" },
  { path: "│   ├── components/", type: "dir", desc: "Modular UI Components" },
  { path: "│   │   ├── TriageSimulator.tsx", type: "file", desc: "Live AI Triage sandbox" },
  { path: "│   │   ├── SchemaViewer.tsx", type: "file", desc: "Interactive ERD table inspector" },
  { path: "│   │   └── ApiMatrix.tsx", type: "file", desc: "Interactive endpoint tester" },
  { path: "│   └── App.tsx", type: "file", desc: "Main architecture dashboard view" }
];

export const DATABASE_TABLES: DatabaseTable[] = [
  {
    name: "users",
    description: "Employee and IT Support personnel user accounts with RBAC roles",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY, DEFAULT gen_random_uuid()", description: "Unique identifier" },
      { name: "email", type: "VARCHAR(255)", constraints: "UNIQUE, NOT NULL", description: "Corporate email address" },
      { name: "full_name", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Display name" },
      { name: "role", type: "ENUM('employee','agent','admin')", constraints: "NOT NULL", description: "RBAC authorization role" },
      { name: "department", type: "VARCHAR(100)", constraints: "NULL", description: "Employee department (Finance, HR, Engineering)" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Record creation timestamp" }
    ]
  },
  {
    name: "tickets",
    description: "Core IT helpdesk ticket repository with AI classification metadata",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Ticket identifier (e.g. TCK-8492)" },
      { name: "requester_id", type: "UUID", constraints: "FOREIGN KEY -> users(id)", description: "Employee who submitted ticket" },
      { name: "assigned_agent_id", type: "UUID", constraints: "FOREIGN KEY -> users(id), NULL", description: "Assigned L1/L2 IT Specialist" },
      { name: "subject", type: "TEXT", constraints: "NOT NULL", description: "Brief issue summary" },
      { name: "description", type: "TEXT", constraints: "NOT NULL", description: "Full problem statement provided by user" },
      { name: "status", type: "ENUM('new','triaged','in_progress','resolved','closed')", constraints: "DEFAULT 'new'", description: "Lifecycle status" },
      { name: "priority", type: "ENUM('low','medium','high','urgent')", constraints: "DEFAULT 'medium'", description: "Calculated SLA priority" },
      { name: "category", type: "VARCHAR(50)", constraints: "NOT NULL", description: "AI detected category (Hardware, VPN, Software, Account)" },
      { name: "sentiment", type: "VARCHAR(20)", constraints: "DEFAULT 'neutral'", description: "AI detected sentiment (frustrated, calm, critical)" },
      { name: "urgency_score", type: "INT", constraints: "CHECK (0-100)", description: "0-100 AI calculated urgency metric" },
      { name: "resolution_draft", type: "TEXT", constraints: "NULL", description: "AI-generated initial resolution response" },
      { name: "sla_deadline", type: "TIMESTAMPTZ", constraints: "NOT NULL", description: "SLA expiration deadline" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Submission timestamp" }
    ]
  },
  {
    name: "kb_articles",
    description: "Knowledge Base articles converted into vector embeddings for RAG",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "KB article ID" },
      { name: "title", type: "VARCHAR(255)", constraints: "NOT NULL", description: "Article title" },
      { name: "content", type: "TEXT", constraints: "NOT NULL", description: "Full documentation text" },
      { name: "category", type: "VARCHAR(50)", constraints: "NOT NULL", description: "System module (Network, IAM, ERP)" },
      { name: "embedding", type: "VECTOR(768)", constraints: "pgvector Index", description: "Gemini embedding vector representation" },
      { name: "view_count", type: "INT", constraints: "DEFAULT 0", description: "Usage metrics" },
      { name: "updated_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Last modification date" }
    ]
  },
  {
    name: "ai_triage_logs",
    description: "Audit trail for AI classifier decisions, confidence, and RAG matches",
    columns: [
      { name: "id", type: "UUID", constraints: "PRIMARY KEY", description: "Audit record ID" },
      { name: "ticket_id", type: "UUID", constraints: "FOREIGN KEY -> tickets(id)", description: "Target ticket" },
      { name: "confidence_score", type: "FLOAT", constraints: "0.0 - 1.0", description: "AI confidence percentage" },
      { name: "matched_kb_ids", type: "JSONB", constraints: "NULL", description: "Array of matched KB article UUIDs" },
      { name: "suggested_routing", type: "VARCHAR(100)", constraints: "NOT NULL", description: "Recommended IT Tier or Team Queue" },
      { name: "execution_time_ms", type: "INT", constraints: "NOT NULL", description: "AI pipeline latency in milliseconds" },
      { name: "created_at", type: "TIMESTAMPTZ", constraints: "DEFAULT NOW()", description: "Triage execution timestamp" }
    ]
  }
];

export const API_MATRIX: ApiEndpoint[] = [
  {
    method: "POST",
    path: "/v1/ai/triage",
    summary: "Runs real-time LLM categorization, sentiment evaluation, and urgency ranking on raw ticket text",
    access: "Employee",
    requestBody: JSON.stringify({ subject: "Cannot connect to VPN", description: "GlobalProtect keeps timing out error 403", user_department: "Finance" }, null, 2),
    responseBody: JSON.stringify({ category: "Network / VPN", priority: "high", urgency_score: 82, sentiment: "frustrated", confidence: 0.94, suggested_tier: "Tier 2 Network Ops", auto_resolution_possible: true }, null, 2)
  },
  {
    method: "POST",
    path: "/v1/kb/search",
    summary: "Executes vector similarity (RAG) against kb_articles embedding table using cosine distance",
    access: "Employee",
    requestBody: JSON.stringify({ query: "Reset SAP ERP master password", top_k: 3 }, null, 2),
    responseBody: JSON.stringify({ results: [{ id: "kb-091", title: "SAP Password Self-Service Manual", similarity: 0.89, solution: "Navigate to sso.company.com/sap-reset and authenticate via MFA" }] }, null, 2)
  },
  {
    method: "GET",
    path: "/v1/tickets",
    summary: "Fetches ticket list filtered by user role (Employees see own tickets; Agents see queue)",
    access: "Employee",
    responseBody: JSON.stringify({ tickets: [{ id: "TCK-8492", subject: "VPN Connection Drop", status: "triaged", priority: "high", sla_remaining_min: 42 }] }, null, 2)
  },
  {
    method: "PATCH",
    path: "/v1/tickets/:id/route",
    summary: "Smart re-routes or escalates ticket to specialized IT team with audit log",
    access: "Agent",
    requestBody: JSON.stringify({ new_agent_id: "usr-7712", reason: "Requires Tier 2 Firewall rule update" }, null, 2),
    responseBody: JSON.stringify({ success: true, updated_status: "in_progress", notification_sent: true }, null, 2)
  },
  {
    method: "POST",
    path: "/v1/ai/copilot-draft",
    summary: "Generates step-by-step resolution response draft for support agents using full ticket history and KB",
    access: "Agent",
    requestBody: JSON.stringify({ ticket_id: "TCK-8492", agent_notes: "Checked firewall log, IP was blocked" }, null, 2),
    responseBody: JSON.stringify({ draft_reply: "Hi Alex, I have unblocked your IP on Gateway East. Please reconnect GlobalProtect and verify.", confidence: 0.98 }, null, 2)
  }
];

export const RBAC_ROLES: RbacRole[] = [
  {
    role: "Standard Employee",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    description: "General corporate employee seeking IT support and self-service help.",
    permissions: [
      { resource: "Tickets", create: true, read: true, update: false, delete: false, special: "View/Edit own tickets only" },
      { resource: "Knowledge Base", create: false, read: true, update: false, delete: false, special: "Public articles" },
      { resource: "AI Triage Engine", create: true, read: true, update: false, delete: false, special: "Auto-trigger on submission" },
      { resource: "System Settings", create: false, read: false, update: false, delete: false }
    ]
  },
  {
    role: "IT Support Agent (L1/L2)",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    description: "Support technician responding to tickets, utilizing AI copilot, and managing queue.",
    permissions: [
      { resource: "Tickets", create: true, read: true, update: true, delete: false, special: "Assigned department queue" },
      { resource: "Knowledge Base", create: true, read: true, update: true, delete: false, special: "Draft/Publish articles" },
      { resource: "AI Triage Engine", create: true, read: true, update: true, delete: false, special: "Override AI classification" },
      { resource: "System Settings", create: false, read: false, update: false, delete: false }
    ]
  },
  {
    role: "IT Administrator",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    description: "Superuser managing SLA rules, RBAC policies, vector ingestion, and analytics.",
    permissions: [
      { resource: "Tickets", create: true, read: true, update: true, delete: true, special: "Full system access" },
      { resource: "Knowledge Base", create: true, read: true, update: true, delete: true, special: "Admin purge & re-index" },
      { resource: "AI Triage Engine", create: true, read: true, update: true, delete: true, special: "Tune model prompts & weights" },
      { resource: "System Settings", create: true, read: true, update: true, delete: true, special: "Full configuration" }
    ]
  }
];

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: 1,
    title: "Raw Ticket Ingestion",
    iconName: "FileText",
    description: "User submits ticket via Web Form, Email, Slack, or Teams API.",
    latencyMs: "12ms",
    tech: "Express / Fastify Router",
    input: "Raw text, user metadata, attachment list",
    output: "Sanitized ticket payload"
  },
  {
    step: 2,
    title: "Zero-Shot Intent Classification",
    iconName: "BrainCircuit",
    description: "Gemini AI classifies category (VPN, IAM, Hardware), priority, and extracts key entities.",
    latencyMs: "180ms",
    tech: "Gemini 2.5 Flash Structured JSON",
    input: "Ticket subject & body text",
    output: "{ category: 'Network', urgency: 85, sentiment: 'frustrated' }"
  },
  {
    step: 3,
    title: "Vector Embedding & RAG Search",
    iconName: "Search",
    description: "Generates text embedding vector and performs pgvector similarity search against KB corpus.",
    latencyMs: "65ms",
    tech: "pgvector HNSW index (Cosine distance)",
    input: "768-dim query embedding",
    output: "Top 3 relevant KB articles (similarity > 0.82)"
  },
  {
    step: 4,
    title: "Smart Routing & SLA Engine",
    iconName: "GitFork",
    description: "Evaluates sentiment, user VIP status, and agent workload to calculate SLA clock and routing.",
    latencyMs: "25ms",
    tech: "Rules Engine + Redis State",
    input: "Urgency score + Agent capacity matrix",
    output: "Assigned queue: Tier-2 Network Ops (SLA 60m)"
  },
  {
    step: 5,
    title: "Auto-Resolution or Agent Copilot Draft",
    iconName: "Bot",
    description: "If confidence > 0.90, sends instant auto-resolution step to user; otherwise drafts response for Agent.",
    latencyMs: "120ms",
    tech: "Gemini Copilot + Notification Queue",
    input: "Matched KB + Ticket Context",
    output: "Structured response ready for delivery or one-click approval"
  }
];

export const USER_FLOWS = [
  {
    role: "Employee Self-Service Flow",
    steps: [
      "1. Employee opens IT Helpdesk portal and types issue: 'My dual monitors are not detected after Windows update'.",
      "2. Instant AI Triage triggers in background (<300ms) detecting Category: Hardware / Display, Priority: Medium.",
      "3. RAG Search retrieves KB-104 'Display Driver Reset Guide' with 92% match confidence.",
      "4. Helpdesk presents interactive step-by-step self-remediation guide with 'Fixed Issue' or 'Escalate to Agent' buttons.",
      "5. If escalated, ticket auto-routes to Hardware Support Queue with pre-attached AI diagnostics."
    ]
  },
  {
    role: "IT Support Agent Resolution Flow",
    steps: [
      "1. Support Agent receives live desktop push notification for high-urgency VPN issue.",
      "2. Agent opens Ticket Workspace; sees AI summary, sentiment alert ('Frustrated user'), and SLA countdown (38 mins left).",
      "3. Copilot panel suggests exact terminal commands and pre-drafted response based on matched KB-091.",
      "4. Agent clicks 'Approve & Send', executing remote diagnostic script and updating ticket status to Resolved.",
      "5. Closed loop feeds agent feedback to AI training telemetry for continuous triage refinement."
    ]
  }
];

export const FEATURES_LIST = [
  {
    title: "Automated AI Ticket Triage",
    desc: "Uses Gemini LLM to instantly categorize incoming tickets, detect user sentiment, calculate urgency scores (0-100), and auto-assign initial priority level.",
    icon: "Zap",
    highlight: "< 200ms Triage"
  },
  {
    title: "RAG Knowledge Base Engine",
    desc: "Converts documentation into pgvector embeddings for semantic similarity search. Delivers exact solution steps to users before human agent involvement.",
    icon: "Database",
    highlight: "pgvector Cosine Search"
  },
  {
    title: "Smart Multi-Tier Routing",
    desc: "Dynamic load-balancing algorithm routes tickets based on agent skill tags, current ticket workload, user VIP priority, and detected technical domain.",
    icon: "GitBranch",
    highlight: "Skill-Based Routing"
  },
  {
    title: "Agent Copilot Assistance",
    desc: "Equips support technicians with AI-generated resolution drafts, suggested CLI commands, and similar past resolved tickets in a side-by-side workspace.",
    icon: "Sparkles",
    highlight: "One-Click Resolution"
  },
  {
    title: "SLA Tracking & Risk Prediction",
    desc: "Real-time clock tracking response and resolution SLAs with predictive alerts that flag tickets at risk of breach before violations occur.",
    icon: "Clock",
    highlight: "Proactive SLA Alerts"
  },
  {
    title: "ITIL-Compliant Audit & Analytics",
    desc: "Comprehensive logging of AI decisions, ticket state changes, agent actions, and CSAT scores for executive compliance reporting.",
    icon: "ShieldCheck",
    highlight: "Complete Auditability"
  }
];
