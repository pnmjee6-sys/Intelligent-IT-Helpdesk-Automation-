import React from 'react';
import { Cloud, Shield, Server, Database, Cpu, Lock, ArrowDown, Activity, CheckCircle, Layers } from 'lucide-react';

export const InfraTopologyView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Cloud className="w-5 h-5 text-indigo-400" />
          Deployment & Infrastructure Architecture Topology
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          High-availability, containerized Cloud Run / Kubernetes deployment with auto-scaling microservices, edge WAF security, managed PostgreSQL + pgvector, and zero-trust API proxies.
        </p>
      </div>

      {/* Visual Diagram */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col items-center">
        {/* Layer 1: Edge & WAF */}
        <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg p-4 text-center shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white">Cloudflare Edge WAF & Global CDN</span>
            </div>
            <span className="text-[10px] font-mono bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
              DDoS Protection & SSL Termination
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Filters malicious bots, enforces rate limits, handles CORS and TLS 1.3</p>
        </div>

        <ArrowDown className="w-5 h-5 text-slate-500 my-2 animate-bounce" />

        {/* Layer 2: Compute Container Service */}
        <div className="w-full max-w-xl bg-slate-900 border border-indigo-500/50 rounded-lg p-4 text-center shadow-lg relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">GCP Cloud Run / EKS Kubernetes Cluster</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
              Auto-Scaling 1 to 50 Instances
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 font-mono text-[11px]">
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
              <span className="block text-indigo-300 font-bold">API Router Pod</span>
              <span className="text-[9px] text-slate-400">Node.js Express</span>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
              <span className="block text-indigo-300 font-bold">AI Triage Worker</span>
              <span className="text-[9px] text-slate-400">Gemini SDK Service</span>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
              <span className="block text-indigo-300 font-bold">WebSocket Server</span>
              <span className="text-[9px] text-slate-400">Realtime SLA Clock</span>
            </div>
          </div>
        </div>

        <ArrowDown className="w-5 h-5 text-slate-500 my-2" />

        {/* Layer 3: Managed Databases & AI Gateway */}
        <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-center">
            <Database className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">PostgreSQL + pgvector</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">Cloud SQL Master/Replica</span>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-center">
            <Layers className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Redis Cluster + BullMQ</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">Session Cache & LLM Queue</span>
          </div>

          <div className="bg-slate-900 border border-indigo-500/40 rounded-lg p-3 text-center">
            <Cpu className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <span className="text-xs font-bold text-white block">Google Gemini API Gateway</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-1">Enterprise Vertex AI</span>
          </div>
        </div>
      </div>

      {/* SLA & Security Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>High Availability & Resilience</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Multi-region database read-replicas with automatic failover in &lt; 15 seconds. Background queue worker retry logic ensures zero dropped ticket triage events during traffic spikes.
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 space-y-2">
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Secret Management & Environment Safety</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            API Keys (GEMINI_API_KEY, DB credentials) are injected directly into server runtime memory via Secret Manager. Zero secrets exposed to client browsers.
          </p>
        </div>
      </div>
    </div>
  );
};
