import React from 'react';
import { ShieldCheck, Download, Server, Sparkles, Terminal } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportMarkdown: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onExportMarkdown }) => {
  const tabs = [
    { id: 'overview', label: 'Architecture Overview' },
    { id: 'triage-simulator', label: 'AI Triage Sandbox', badge: 'Live AI' },
    { id: 'schemas', label: 'Database ERD' },
    { id: 'api-matrix', label: 'API Matrix' },
    { id: 'rbac', label: 'RBAC Policies' },
    { id: 'ai-pipeline', label: 'AI Pipeline' },
    { id: 'infra', label: 'Infra & Topology' },
    { id: 'structure', label: 'Folder Structure' }
  ];

  return (
    <header className="border-b border-slate-700 bg-slate-800/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Intelligent IT Helpdesk
                </h1>
                <span className="text-slate-400 font-normal text-xs sm:text-sm hidden sm:inline">
                  | System Architecture Blueprint v1.0.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Enterprise AI-Driven Triage, RAG Search & Smart Routing Engine
              </p>
            </div>
          </div>

          {/* Action Badges & Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-900/60 px-3 py-1.5 rounded-md border border-slate-700/80 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[10px]">Verified Blueprint</span>
            </div>
            <button
              onClick={onExportMarkdown}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-2 rounded-md font-medium transition-colors flex items-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Architecture (.md)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-700/50 pt-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
