import React from 'react';
import { Page, User } from '../types';
import { motion } from 'motion/react';
import { 
  Squares2X2Icon, 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon, 
  CpuChipIcon, 
  BoltIcon,
  TicketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentUser: User;
  openTicketsCount: number;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  openTicketsCount,
  onSignOut
}) => {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Helpdesk Dashboard', icon: Squares2X2Icon, badge: openTicketsCount },
    { id: 'workflows' as Page, label: 'n8n Automation Engine', icon: CommandLineIcon, badge: 3 },
    { id: 'profile' as Page, label: 'Profile & Performance', icon: UserCircleIcon },
    { id: 'settings' as Page, label: 'System & AI Settings', icon: Cog6ToothIcon }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen z-20">
      <div>
        {/* Brand Header */}
        <motion.div
          whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.4)' }}
          onClick={() => onNavigate('landing')}
          className="p-5 border-b border-slate-800/80 flex items-center gap-3 cursor-pointer transition-all"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
            <CpuChipIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">AutoDesk AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-sans">Enterprise IT Engine</p>
          </div>
        </motion.div>

        {/* Live System Status Pill */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <BoltIcon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Gemini 2.5 Pipeline
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider">
              READY
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2 block font-mono">
            Control Center
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/50 shadow-md shadow-indigo-950/40 backdrop-blur-md'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-mono text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm shadow-indigo-500/40">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Account Box */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/70">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/50 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">{currentUser.department}</span>
            </div>
          </div>

          <button
            onClick={onSignOut}
            title="Sign Out"
            className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
