import React from 'react';
import { PIPELINE_STEPS } from '../data/architectureData';
import { Bot, Zap, Clock, BrainCircuit, Search, GitFork, ArrowRight, Sparkles } from 'lucide-react';

export const AiPipelineView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          AI Helpdesk Automation Pipeline Architecture
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          End-to-end asynchronous LLM pipeline operating under 450ms total SLA to triage, retrieve knowledge context, evaluate sentiment, route tickets, and generate agent suggestions.
        </p>
      </div>

      {/* 5 Pipeline Stages Visual Pipeline */}
      <div className="space-y-4">
        {PIPELINE_STEPS.map((step) => (
          <div key={step.step} className="bg-slate-800 rounded-lg border border-slate-700 p-5 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold font-mono text-indigo-300 shrink-0 text-sm">
                  0{step.step}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    <span className="text-[10px] font-mono bg-slate-900 text-indigo-300 border border-slate-700 px-2 py-0.5 rounded">
                      {step.tech}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto shrink-0 font-mono text-xs">
                <div className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA: {step.latencyMs}</span>
                </div>
              </div>
            </div>

            {/* Input & Output Specifications Grid */}
            <div className="mt-4 pt-3 border-t border-slate-700/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900 p-2.5 rounded border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Stage Payload Input</span>
                <span className="text-slate-300">{step.input}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-700/80">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-0.5">Stage Output / Effect</span>
                <span className="text-indigo-300">{step.output}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RAG Engine Highlights */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Vector Search RAG Optimization Principles</span>
        </h3>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed font-sans">
          <li>Chunking strategy: 500-token semantic chunks with 50-token overlap for IT manuals and troubleshooting guides.</li>
          <li>Embedding Model: <code className="text-indigo-300 font-mono">text-embedding-004</code> (768 dimensions) indexed via pgvector HNSW cosine distance.</li>
          <li>Re-ranking threshold: Only matches with cosine similarity &gt; 0.82 trigger automatic self-service solution delivery.</li>
        </ul>
      </div>
    </div>
  );
};
