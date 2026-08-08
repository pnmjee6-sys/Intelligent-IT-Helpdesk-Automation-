import { User, Ticket, KbArticle, AppSettings } from '../types';

export const CURRENT_USER: User = {
  id: 'usr-9021',
  name: 'Alex Morgan',
  email: 'alex.morgan@enterprise.corp',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'agent',
  department: 'Tier 2 IT Operations',
  title: 'Senior Systems Engineer & AI Copilot Lead',
  employeeId: 'EMP-4482',
  skills: ['Palo Alto VPN', 'Azure AD / Okta IAM', 'MacOS Security', 'PostgreSQL RAG', 'Kubernetes'],
  ticketsResolved: 342,
  csatRating: 4.92,
  avgResponseTime: '8.4 mins',
  joinedDate: 'March 2023'
};

export const MOCK_AGENTS: User[] = [
  CURRENT_USER,
  {
    id: 'usr-3312',
    name: 'David Chen',
    email: 'david.chen@enterprise.corp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'agent',
    department: 'Tier 1 Service Desk',
    title: 'L1 IT Support Specialist',
    employeeId: 'EMP-3109',
    skills: ['Password Resets', 'Hardware Diagnostics', 'Office 365'],
    ticketsResolved: 512,
    csatRating: 4.88,
    avgResponseTime: '4.2 mins',
    joinedDate: 'Jan 2022'
  },
  {
    id: 'usr-8819',
    name: 'Sarah Jenkins',
    email: 'sarah.j@enterprise.corp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    department: 'IT Infrastructure & Security',
    title: 'Director of IT Helpdesk Operations',
    employeeId: 'EMP-1002',
    skills: ['SLA Governance', 'RBAC Management', 'SOC-2 Compliance', 'AI Pipeline Tuning'],
    ticketsResolved: 890,
    csatRating: 4.98,
    avgResponseTime: '12.0 mins',
    joinedDate: 'June 2020'
  }
];

export const MOCK_KB_ARTICLES: KbArticle[] = [
  {
    id: 'kb-091',
    title: 'GlobalProtect 403 Re-authentication & Cache Clearing Procedure',
    category: 'Network & Security / VPN',
    snippet: 'Clear cached credentials in %AppData%/PaloAltoNetworks/GlobalProtect/ and re-authenticate via Azure AD MFA.',
    content: `### GlobalProtect VPN Error 403 Troubleshooting
When GlobalProtect experiences periodic disconnects or 403 authorization timeouts during month-end audit routines:
1. Open GlobalProtect client.
2. Click **Settings** (gear icon) > **App** tab.
3. Select **Clear Credentials**.
4. Re-enter primary portal URL: \`vpn-us-east2.corp.internal\`
5. Complete Okta Push or FIDO2 YubiKey MFA prompt.`,
    similarity: 0.94,
    views: 1420
  },
  {
    id: 'kb-042',
    title: 'SAP ERP Account Self-Service Password Unlock Manual',
    category: 'Identity & Access Management (IAM)',
    snippet: 'Users can self-unlock locked SAP credentials using corporate Okta SSO portal at sso.company.com/sap-unlock.',
    content: `### SAP ERP Self-Service Unlock Instructions
If an account is locked due to 3 incorrect password attempts:
1. Navigate to https://sso.company.com/sap-unlock.
2. Verify identity via Okta Push notification on registered mobile device.
3. System automatically releases the SAP RFC lock within 10 seconds.
4. No IT ticket escalation required.`,
    similarity: 0.96,
    views: 3105
  },
  {
    id: 'kb-808',
    title: 'MacBook Pro Battery Thermal Safety & Emergency Replacement Protocol',
    category: 'Hardware & Asset Safety',
    snippet: 'CRITICAL: Immediately power down devices showing trackpad lifting or swollen battery symptoms. Do not charge.',
    content: `### Battery Swelling Hazard Safety Protocol
Symptoms: Trackpad resistance, chassis warp, extreme bottom heat.
Action Plan:
1. Immediately shut down macOS via Apple menu > Shut Down.
2. Unplug USB-C MagSafe charger.
3. Place laptop on non-combustible surface.
4. Contact Onsite Hardware Ops for immediate emergency laptop swap.`,
    similarity: 0.98,
    views: 520
  },
  {
    id: 'kb-301',
    title: 'Salesforce CRM Sandbox Provisioning Policy',
    category: 'Application Access & Licensing',
    snippet: 'Sandbox permission grants require manager approval via ServiceNow workflow or Slack #access-bot.',
    content: `### Salesforce Sandbox Access Grants
Permissions for Q3 Sandbox environments require:
- Department manager signoff in ServiceNow.
- Group membership in Okta: \`okta-salesforce-sandbox-dev\`.
Provisioning takes 15 minutes post-approval.`,
    similarity: 0.89,
    views: 890
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TCK-8492',
    requesterName: 'Marcus Vance',
    requesterEmail: 'marcus.v@finance.corp',
    requesterAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    requesterDept: 'Finance & Audit',
    subject: 'GlobalProtect VPN drops every 5 minutes during SAP audit',
    description: 'My GlobalProtect VPN connection keeps timing out with Error 403 while generating month-end financial statements. Impacting closing deadline today.',
    category: 'Network & Security / VPN',
    priority: 'high',
    status: 'in_progress',
    urgencyScore: 84,
    sentiment: 'frustrated',
    assignedAgentId: CURRENT_USER.id,
    assignedAgentName: CURRENT_USER.name,
    assignedAgentAvatar: CURRENT_USER.avatar,
    createdAt: '12 minutes ago',
    slaDeadlineMinutes: 60,
    slaRemainingMinutes: 48,
    isSlaBreached: false,
    resolutionDraft: 'Hello Marcus, based on the Error 403 log, your GlobalProtect session token expired during heavy SAP data transfer. Please clear cached credentials in GlobalProtect settings and reconnect to portal vpn-us-east2.corp.internal.',
    matchedKbArticles: [MOCK_KB_ARTICLES[0]],
    timeline: [
      {
        id: 'tl-1',
        timestamp: '12 mins ago',
        actor: 'Marcus Vance',
        action: 'Ticket Submitted',
        note: 'Submitted via Helpdesk Portal',
        type: 'creation'
      },
      {
        id: 'tl-2',
        timestamp: '11 mins ago',
        actor: 'AI Gemini Triage',
        action: 'Automated Classification',
        note: 'Category: Network / VPN, Urgency: 84/100, Sentiment: Frustrated. Routed to Tier 2 Ops.',
        type: 'triage'
      },
      {
        id: 'tl-3',
        timestamp: '8 mins ago',
        actor: 'Alex Morgan',
        action: 'Assigned to Agent',
        note: 'Accepted from queue',
        type: 'assignment'
      }
    ]
  },
  {
    id: 'TCK-8493',
    requesterName: 'Elena Rostova',
    requesterEmail: 'elena.r@hr.corp',
    requesterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    requesterDept: 'Human Resources',
    subject: 'SAP ERP account locked after 3 password attempts',
    description: 'I entered my SAP master password incorrectly 3 times and now my account is locked out. Need urgent unlock to approve bi-weekly payroll batch.',
    category: 'Identity & Access Management (IAM)',
    priority: 'urgent',
    status: 'triaged',
    urgencyScore: 92,
    sentiment: 'critical',
    assignedAgentId: undefined,
    assignedAgentName: undefined,
    createdAt: '5 minutes ago',
    slaDeadlineMinutes: 30,
    slaRemainingMinutes: 25,
    isSlaBreached: false,
    resolutionDraft: 'Your SAP ERP account lock can be immediately released without waiting for an agent. Please visit https://sso.company.com/sap-unlock and complete Okta Push MFA.',
    matchedKbArticles: [MOCK_KB_ARTICLES[1]],
    timeline: [
      {
        id: 'tl-10',
        timestamp: '5 mins ago',
        actor: 'Elena Rostova',
        action: 'Ticket Submitted',
        note: 'Submitted via Slack #it-help',
        type: 'creation'
      },
      {
        id: 'tl-11',
        timestamp: '4 mins ago',
        actor: 'AI Gemini Triage',
        action: 'Automated Classification',
        note: 'Matched KB-042 (96% confidence). Auto-Deflection link sent.',
        type: 'triage'
      }
    ]
  },
  {
    id: 'TCK-8494',
    requesterName: 'David Wright',
    requesterEmail: 'david.w@eng.corp',
    requesterAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    requesterDept: 'Software Engineering',
    subject: 'MacBook Pro trackpad lifting & severe chassis overheating',
    description: 'My M2 MacBook Pro trackpad feels stiff and the bottom chassis is bulging near the battery area. Hardware thermal safety hazard.',
    category: 'Hardware & Asset Safety',
    priority: 'urgent',
    status: 'in_progress',
    urgencyScore: 98,
    sentiment: 'critical',
    assignedAgentId: CURRENT_USER.id,
    assignedAgentName: CURRENT_USER.name,
    assignedAgentAvatar: CURRENT_USER.avatar,
    createdAt: '18 minutes ago',
    slaDeadlineMinutes: 15,
    slaRemainingMinutes: 2,
    isSlaBreached: false,
    resolutionDraft: 'SAFETY ALERT: Power down your MacBook immediately and unplug the charger. Technicians are on route to Floor 4 with a replacement unit.',
    matchedKbArticles: [MOCK_KB_ARTICLES[2]],
    timeline: [
      {
        id: 'tl-20',
        timestamp: '18 mins ago',
        actor: 'David Wright',
        action: 'Ticket Submitted',
        type: 'creation'
      },
      {
        id: 'tl-21',
        timestamp: '17 mins ago',
        actor: 'AI Gemini Triage',
        action: 'Safety Override Triggered',
        note: 'Urgency 98/100. Dispatched emergency alert to Onsite Tech Queue.',
        type: 'triage'
      }
    ]
  },
  {
    id: 'TCK-8488',
    requesterName: 'Jessica Miller',
    requesterEmail: 'jessica.m@sales.corp',
    requesterAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    requesterDept: 'Sales & Revenue',
    subject: 'Request access to Q3 Salesforce CRM Sandbox testing environment',
    description: 'Need permission added to Okta group okta-salesforce-sandbox-dev for testing new deal pipeline workflow before rollout.',
    category: 'Application Access & Licensing',
    priority: 'low',
    status: 'resolved',
    urgencyScore: 35,
    sentiment: 'calm',
    assignedAgentId: MOCK_AGENTS[1].id,
    assignedAgentName: MOCK_AGENTS[1].name,
    assignedAgentAvatar: MOCK_AGENTS[1].avatar,
    createdAt: '2 hours ago',
    slaDeadlineMinutes: 240,
    slaRemainingMinutes: 180,
    isSlaBreached: false,
    resolutionDraft: 'Manager approval received via ServiceNow. Okta sandbox group added.',
    matchedKbArticles: [MOCK_KB_ARTICLES[3]],
    timeline: [
      {
        id: 'tl-30',
        timestamp: '2 hours ago',
        actor: 'Jessica Miller',
        action: 'Ticket Submitted',
        type: 'creation'
      },
      {
        id: 'tl-31',
        timestamp: '1 hour ago',
        actor: 'David Chen',
        action: 'Permission Granted & Ticket Closed',
        note: 'Automated provisioning completed',
        type: 'resolution'
      }
    ]
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  autoDeflectionThreshold: 85,
  geminiModel: 'gemini-2.5-flash',
  sentimentAlerts: true,
  defaultSlaMinutes: 60,
  enableSlackIntegration: true,
  enableTeamsIntegration: true,
  enableOktaSSO: true,
  enableJiraSync: false,
  enableEmailNotifications: true,
  enableDesktopPush: true,
  require2FA: true
};
