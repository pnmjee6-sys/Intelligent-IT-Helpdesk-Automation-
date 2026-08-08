import React from 'react';
import { FEATURES_LIST, USER_FLOWS, SYSTEM_METADATA } from '../data/architectureData';
import { Zap, Database, GitBranch, Sparkles, Clock, ShieldCheck, ArrowRight, Activity, Server, Users } from 'lucide-react';

interface OverviewViewProps {
  onNavigateToSimulator: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigateToSimulator }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-indigo-400" />;
      case 'Database': return <Database className="w-5 h-5 text-indigo-400" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5 text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'Clock': return <Clock className="w-5 h-5 text-indigo-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      default: return <Activity className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] border border-indigo-500/30 rounded uppercase tracking-wider font-mono font-bold">
              System Architecture Blueprint
            </span>
            <span className="text-slate-400 text-xs font-mono">v{SYSTEM_METADATA.version}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Intelligent IT Helpdesk Automation System
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            An enterprise-grade, ITIL-compliant helpdesk platform powered by zero-shot Gemini LLM triage, pgvector semantic Knowledge Base search, predictive SLA risk tracking, and agent copilot auto-resolution.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={onNavigateToSimulator}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2.5 rounded-md font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Launch Live AI Triage Sandbox</span>
          </button>
        </div>
      </div>

      {/* SLA & Performance Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">Average AI Triage Speed</span>
          <div className="text-xl font-bold text-indigo-400 font-mono mt-1">{SYSTEM_METADATA.avgTriageLatency}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">End-to-end classification & RAG match</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">System SLA Target</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{SYSTEM_METADATA.targetSLA}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Cloud Run container uptime</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">RAG Deflection Rate</span>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1">~ 42% Deflected</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Self-service KB auto-resolutions</p>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block">Security Compliance</span>
          <div className="text-xl font-bold text-purple-400 font-mono mt-1">SOC-2 / ITIL</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Zero-Trust RBAC & Audit Trails</p>
        </div>
      </div>

      {/* Core Architectural Features Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>Key System Capabilities & Features</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES_LIST.map((feat, idx) => (
            <div key={idx} className="bg-slate-800 p-5 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-colors space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-md bg-indigo-950 border border-indigo-500/30 flex items-center justify-center">
                    {getIcon(feat.icon)}
                  </div>
                  <span className="text-[10px] font-mono bg-slate-900 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded">
                    {feat.highlight}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Flow Architecture */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Core User & Support Flow Architecture</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {USER_FLOWS.map((flow, idx) => (
            <div key={idx} className="bg-slate-900 p-4 rounded-lg border border-slate-700 space-y-3">
              <span className="text-xs font-bold font-mono text-indigo-300 block uppercase tracking-wider">
                {flow.role}
              </span>
              <div className="space-y-2">
                {flow.steps.map((step, sIdx) => (
                  <p key={sIdx} className="text-xs text-slate-300 font-sans leading-relaxed pl-2 border-l-2 border-indigo-500/60">
                    {step}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
