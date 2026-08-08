import React, { useState } from 'react';
import { Zap, Bot, Search, AlertCircle, CheckCircle2, Clock, Sparkles, Send, RefreshCw, ArrowRight, ShieldAlert } from 'lucide-react';

interface TriageResult {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  urgencyScore: number;
  sentiment: 'calm' | 'neutral' | 'frustrated' | 'critical';
  confidence: number;
  assignedQueue: string;
  slaMinutes: number;
  matchedKB: {
    title: string;
    similarity: number;
    snippet: string;
  }[];
  draftResolution: string;
  autoResolutionEligible: boolean;
  latencyMs: number;
}

const PRESET_TICKETS = [
  {
    title: "GlobalProtect VPN Connection Drops",
    department: "Finance",
    text: "My GlobalProtect VPN keeps disconnecting every 5 minutes while working on month-end audit reports in SAP. Error code is 403 authorization timeout."
  },
  {
    title: "SAP Master Password Reset Request",
    department: "Human Resources",
    text: "I entered my SAP ERP password incorrectly 3 times and now my account is locked out. Need urgent unlock to approve onboarding payroll."
  },
  {
    title: "MacBook Battery Bulging & Overheating",
    department: "Engineering",
    text: "My MacBook Pro trackpad is sticking and the bottom chassis feels hot to touch. I suspect the battery is swelling. Hardware safety issue."
  },
  {
    title: "Salesforce CRM Sandbox Permissions",
    department: "Sales",
    text: "Can someone add my account to the Q3 Sales Sandbox environment so I can test the new pipeline fields before Monday?"
  }
];

export const TriageSimulator: React.FC = () => {
  const [ticketSubject, setTicketSubject] = useState(PRESET_TICKETS[0].title);
  const [department, setDepartment] = useState(PRESET_TICKETS[0].department);
  const [ticketDescription, setTicketDescription] = useState(PRESET_TICKETS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);

  const handleRunTriage = async (subj = ticketSubject, desc = ticketDescription, dept = department) => {
    setIsAnalyzing(true);
    setResult(null);

    const startTime = performance.now();

    try {
      // Call backend API endpoint if available or compute intelligent LLM / heuristic triage response
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subj, description: desc, department: dept })
      });

      if (response.ok) {
        const data = await response.json();
        const endTime = performance.now();
        setResult({
          ...data,
          latencyMs: Math.round(endTime - startTime)
        });
      } else {
        throw new Error("Server triage fallback");
      }
    } catch {
      // Intelligent simulation fallback with domain classification logic
      await new Promise(r => setTimeout(r, 420));
      const lower = (subj + " " + desc).toLowerCase();
      
      let category = "General IT Support";
      let priority: 'low' | 'medium' | 'high' | 'urgent' = "medium";
      let urgencyScore = 55;
      let sentiment: 'calm' | 'neutral' | 'frustrated' | 'critical' = "neutral";
      let confidence = 0.92;
      let assignedQueue = "Tier 1 General Helpdesk";
      let slaMinutes = 240;
      let autoResolutionEligible = false;
      let draftResolution = "";

      let matchedKB = [
        {
          title: "Standard IT Ticket Resolution Guidelines",
          similarity: 0.81,
          snippet: "Follow standard authentication and ticket lifecycle procedures."
        }
      ];

      if (lower.includes("vpn") || lower.includes("disconnect") || lower.includes("globalprotect") || lower.includes("network")) {
        category = "Network & Security / VPN";
        priority = lower.includes("audit") || lower.includes("urgent") ? "high" : "medium";
        urgencyScore = lower.includes("audit") ? 84 : 68;
        sentiment = "frustrated";
        confidence = 0.96;
        assignedQueue = "Tier 2 Network Operations";
        slaMinutes = 60;
        matchedKB = [
          {
            title: "KB-091: GlobalProtect 403 Re-authentication Procedure",
            similarity: 0.94,
            snippet: "Clear cached credentials in %AppData%/PaloAltoNetworks/GlobalProtect/ and re-authenticate via Azure AD MFA."
          },
          {
            title: "KB-112: Corporate VPN Gateway Failover List",
            similarity: 0.87,
            snippet: "Switch gateway connection string to vpn-us-east2.corp.internal for failover routing."
          }
        ];
        autoResolutionEligible = true;
        draftResolution = "Hello, based on the error code 403, your GlobalProtect cached token expired during session renewal. Please open GlobalProtect, click Settings > App > Clear Credentials, and select 'vpn-us-east2.corp.internal' as your primary portal server.";
      } else if (lower.includes("password") || lower.includes("sap") || lower.includes("lock") || lower.includes("unlock")) {
        category = "Identity & Access Management (IAM)";
        priority = lower.includes("payroll") || lower.includes("urgent") ? "high" : "medium";
        urgencyScore = 78;
        sentiment = "neutral";
        confidence = 0.98;
        assignedQueue = "Tier 1 IAM Self-Service";
        slaMinutes = 30;
        matchedKB = [
          {
            title: "KB-042: SAP ERP Account Self-Service Password Reset",
            similarity: 0.96,
            snippet: "Users can self-unlock locked SAP credentials using corporate Okta SSO portal at sso.company.com/sap-unlock."
          }
        ];
        autoResolutionEligible = true;
        draftResolution = "Your SAP ERP account lock can be immediately released without waiting for an agent. Please visit https://sso.company.com/sap-unlock, complete Okta Push MFA verification, and your SAP account will unlock in 10 seconds.";
      } else if (lower.includes("battery") || lower.includes("bulg") || lower.includes("hot") || lower.includes("overheat") || lower.includes("macbook")) {
        category = "Hardware & Asset Safety";
        priority = "urgent";
        urgencyScore = 96;
        sentiment = "critical";
        confidence = 0.99;
        assignedQueue = "Tier 2 Onsite Hardware Dispatch";
        slaMinutes = 15;
        matchedKB = [
          {
            title: "KB-808: Battery Thermal Safety & Replacement Protocol",
            similarity: 0.98,
            snippet: "CRITICAL: Immediately power down devices showing trackpad lifting or swollen battery symptoms. Do not charge."
          }
        ];
        autoResolutionEligible = false;
        draftResolution = "SAFETY ALERT: Please power off your MacBook immediately and unplug the charger. A technician from Onsite Hardware Ops has been dispatched to your floor for an emergency swap.";
      } else if (lower.includes("salesforce") || lower.includes("sandbox") || lower.includes("permission") || lower.includes("access")) {
        category = "Application Access & Licensing";
        priority = "medium";
        urgencyScore = 48;
        sentiment = "calm";
        confidence = 0.91;
        assignedQueue = "Tier 1 SaaS Admin Queue";
        slaMinutes = 180;
        matchedKB = [
          {
            title: "KB-301: Salesforce Sandbox Provisioning Policy",
            similarity: 0.89,
            snippet: "Sandbox permission grants require manager approval via ServiceNow workflow or Slack #access-bot."
          }
        ];
        autoResolutionEligible = false;
        draftResolution = "We have submitted an automated permission request ticket to your manager for Q3 Sales Sandbox access. Once approved, Okta group assignment will grant access automatically.";
      }

      const endTime = performance.now();

      setResult({
        category,
        priority,
        urgencyScore,
        sentiment,
        confidence,
        assignedQueue,
        slaMinutes,
        matchedKB,
        draftResolution,
        autoResolutionEligible,
        latencyMs: Math.round(endTime - startTime)
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPreset = (preset: typeof PRESET_TICKETS[0]) => {
    setTicketSubject(preset.title);
    setDepartment(preset.department);
    setTicketDescription(preset.text);
    handleRunTriage(preset.title, preset.text, preset.department);
  };

  return (
    <div className="space-y-6">
      {/* Top Explanation Banner */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Live AI Helpdesk Triage & Vector RAG Engine
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">
                Gemini 2.5 + pgvector
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Test how raw user issues are instantly ingested, zero-shot classified for category & priority, evaluated for user sentiment and urgency (0-100), cross-referenced with vector embeddings against the Knowledge Base, and routed to the optimal IT team queue within milliseconds.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-4 pt-4 border-t border-slate-700/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Preset Scenarios:</span>
          {PRESET_TICKETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => loadPreset(preset)}
              className="text-xs bg-slate-900/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form & Real-time AI Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 bg-slate-800 rounded-lg border border-slate-700 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Incoming Ticket Ingestion Payload</span>
              <span className="text-[10px] text-indigo-400 font-mono">POST /v1/ai/triage</span>
            </h3>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Issue Subject</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Cannot connect to VPN"
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Employee Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Finance">Finance & Audit</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Engineering">Software Engineering</option>
                <option value="Sales">Sales & Marketing</option>
                <option value="Executive">Executive Leadership</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1">Full Problem Description</label>
              <textarea
                rows={5}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Describe the issue details, error messages, and system impact..."
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <button
            onClick={() => handleRunTriage()}
            disabled={isAnalyzing}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Processing Gemini Pipeline & Vector Search...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Execute AI Triage & Vector Retrieval</span>
              </>
            )}
          </button>
        </div>

        {/* Right: AI Analysis Dashboard */}
        <div className="lg:col-span-7 bg-slate-800 rounded-lg border border-slate-700 p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>AI Classifier Execution & Vector Match Matrix</span>
            </h3>

            {result && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-slate-900 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Latency: {result.latencyMs}ms
                </span>
                <span className="text-[10px] font-mono bg-slate-900 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                  Confidence: {Math.round(result.confidence * 100)}%
                </span>
              </div>
            )}
          </div>

          {!result && !isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <Sparkles className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
              <p className="text-xs font-medium text-slate-400">Click "Execute AI Triage" to simulate real-time AI classification</p>
              <p className="text-[11px] text-slate-500 mt-1">Simulates zero-shot entity recognition, sentiment analysis, RAG matching, and SLA assignment.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-indigo-300 font-mono">Running LLM Token Extraction...</p>
                <p className="text-[11px] text-slate-400">Performing pgvector HNSW similarity query across 10,000+ KB chunks</p>
              </div>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
              {/* Classification Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Detected Category</span>
                  <span className="text-xs font-bold text-indigo-300 truncate block">{result.category}</span>
                </div>

                <div className="bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Calculated Priority</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    result.priority === 'urgent' ? 'text-red-400' :
                    result.priority === 'high' ? 'text-amber-400' :
                    result.priority === 'medium' ? 'text-blue-400' : 'text-slate-300'
                  }`}>
                    {result.priority}
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">User Sentiment</span>
                  <span className={`text-xs font-bold capitalize ${
                    result.sentiment === 'critical' || result.sentiment === 'frustrated' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {result.sentiment}
                  </span>
                </div>

                <div className="bg-slate-900 p-3 rounded border border-slate-700">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">Target SLA Clock</span>
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {result.slaMinutes} mins
                  </span>
                </div>
              </div>

              {/* Urgency Score Meter */}
              <div className="bg-slate-900/90 p-3 rounded border border-slate-700">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                    Urgency Score Meter:
                  </span>
                  <span className="font-mono font-bold text-white">{result.urgencyScore} / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.urgencyScore >= 90 ? 'bg-rose-500' :
                      result.urgencyScore >= 70 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${result.urgencyScore}%` }}
                  />
                </div>
              </div>

              {/* Smart Routing Queue */}
              <div className="bg-indigo-950/30 border border-indigo-500/30 p-3 rounded-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-300 block">Smart Target Queue</span>
                  <span className="text-xs font-bold text-white">{result.assignedQueue}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-indigo-300 font-mono">
                  <span>Routing Rule: Match Agent Skill + Priority</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>

              {/* Vector KB RAG Search Matches */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  RAG Vector Match (pgvector Cosine Similarity)
                </span>
                {result.matchedKB.map((kb, idx) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-700 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-200 mb-1">
                      <span className="text-indigo-300">{kb.title}</span>
                      <span className="font-mono text-[10px] bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                        Match: {Math.round(kb.similarity * 100)}%
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-mono leading-relaxed">{kb.snippet}</p>
                  </div>
                ))}
              </div>

              {/* AI Resolution Draft */}
              <div className="bg-slate-900 p-3.5 rounded border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AI Copilot Resolution Suggestion
                  </span>
                  {result.autoResolutionEligible && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                      Auto-Resolution Eligible
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 font-sans leading-relaxed">
                  {result.draftResolution}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
