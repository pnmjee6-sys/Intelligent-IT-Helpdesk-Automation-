import React from 'react';
import { FOLDER_STRUCTURE, TECH_STACK } from '../data/architectureData';
import { FolderTree, FileCode, Folder, Cpu, Layers } from 'lucide-react';

export const ProjectStructureView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FolderTree className="w-5 h-5 text-indigo-400" />
          Codebase Directory & Modular File Architecture
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Clean TypeScript project structure enforcing strict separation of concerns between API routing, AI services, database ORM models, and modular React views.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Folder Tree */}
        <div className="lg:col-span-7 bg-slate-800 rounded-lg border border-slate-700 p-5 font-mono text-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Project Directory Tree</span>
          </h3>

          <div className="space-y-1 bg-slate-950 p-4 rounded border border-slate-900 text-slate-300 overflow-x-auto leading-relaxed">
            {FOLDER_STRUCTURE.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between hover:bg-slate-900/60 px-2 py-0.5 rounded">
                <span className={`${item.type === 'dir' ? 'text-indigo-400 font-bold' : 'text-slate-300'}`}>
                  {item.path}
                </span>
                {item.desc && (
                  <span className="text-[10px] text-slate-500 font-sans ml-4 hidden sm:inline">
                    # {item.desc}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tech Stack Summary */}
        <div className="lg:col-span-5 bg-slate-800 rounded-lg border border-slate-700 p-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Technology Stack Specifications</span>
          </h3>

          <div className="space-y-3">
            {TECH_STACK.map((tech, idx) => (
              <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-700/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{tech.category}</span>
                  <span className="text-[10px] font-mono bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
                    {tech.badge}
                  </span>
                </div>
                <div className="text-xs font-bold text-white font-mono">{tech.tech}</div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">{tech.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
