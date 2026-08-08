import React, { useState } from 'react';
import { Ticket, User, KbArticle } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  XMarkIcon, 
  CpuChipIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  PaperAirplaneIcon, 
  UserPlusIcon, 
  ExclamationCircleIcon, 
  SparklesIcon, 
  ChatBubbleLeftRightIcon, 
  ExclamationTriangleIcon, 
  DocumentTextIcon, 
  ArrowRightIcon, 
  BoltIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface TicketDetailDrawerProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTicket: (updatedTicket: Ticket) => void;
  agents: User[];
  currentUser: User;
}

export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateTicket,
  agents,
  currentUser
}) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !ticket) return null;

  const handleApproveDraft = () => {
    const updated: Ticket = {
      ...ticket,
      status: 'resolved',
      timeline: [
        ...ticket.timeline,
        {
          id: `tl-${Date.now()}`,
          timestamp: 'Just now',
          actor: currentUser.name,
          actorAvatar: currentUser.avatar,
          action: 'Approved AI Resolution & Closed Ticket',
          note: ticket.resolutionDraft || 'Resolution sent to user',
          type: 'resolution'
        }
      ]
    };
    onUpdateTicket(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const updated: Ticket = {
      ...ticket,
      timeline: [
        ...ticket.timeline,
        {
          id: `tl-${Date.now()}`,
          timestamp: 'Just now',
          actor: currentUser.name,
          actorAvatar: currentUser.avatar,
          action: 'Agent Note',
          note: commentText,
          type: 'comment'
        }
      ]
    };

    onUpdateTicket(updated);
    setCommentText('');
  };

  const handleReassign = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const updated: Ticket = {
      ...ticket,
      assignedAgentId: agent.id,
      assignedAgentName: agent.name,
      assignedAgentAvatar: agent.avatar,
      timeline: [
        ...ticket.timeline,
        {
          id: `tl-${Date.now()}`,
          timestamp: 'Just now',
          actor: currentUser.name,
          actorAvatar: currentUser.avatar,
          action: `Reassigned Ticket to ${agent.name}`,
          type: 'assignment'
        }
      ]
    };
    onUpdateTicket(updated);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-full max-w-2xl glass-panel border-l border-slate-800/80 h-full flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold bg-indigo-950/80 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/30">
                {ticket.id}
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                ticket.status === 'resolved' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
                ticket.status === 'in_progress' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
              }`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Ticket Title & Requester info */}
            <div>
              <h2 className="text-base font-bold text-white leading-snug">{ticket.subject}</h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{ticket.requesterName}</span>
                <span>•</span>
                <span>{ticket.requesterDept}</span>
                <span>•</span>
                <span>Created {ticket.createdAt}</span>
              </div>
            </div>

            {/* AI Metadata Cards Row */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Category</span>
                <span className="text-indigo-300 font-bold block truncate">{ticket.category}</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Priority</span>
                <span className={`font-bold block uppercase ${
                  ticket.priority === 'urgent' ? 'text-rose-400' :
                  ticket.priority === 'high' ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  {ticket.priority}
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">SLA Clock</span>
                <span className="text-slate-200 font-bold block flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5 text-indigo-400" />
                  {ticket.slaRemainingMinutes}m left
                </span>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Requester Problem Statement
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{ticket.description}</p>
            </div>

            {/* AI Copilot Draft Assistant Box */}
            {ticket.resolutionDraft && (
              <div className="glass-card p-4 rounded-xl border border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-300 font-mono uppercase tracking-wider">
                      Gemini AI Resolution Copilot
                    </span>
                  </div>

                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    KB Match Found
                  </span>
                </div>

                <p className="text-xs text-slate-200 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-sans">
                  {ticket.resolutionDraft}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Ready to resolve and email {ticket.requesterName}?
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApproveDraft}
                    disabled={ticket.status === 'resolved'}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/30"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span>{ticket.status === 'resolved' ? 'Ticket Resolved' : 'Approve & Close Ticket'}</span>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Reassignment Dropdown */}
            <div className="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <UserPlusIcon className="w-4 h-4 text-indigo-400" />
                <span>Assigned Agent:</span>
                <span className="font-bold text-white">{ticket.assignedAgentName || 'Unassigned'}</span>
              </div>

              <select
                onChange={(e) => handleReassign(e.target.value)}
                value={ticket.assignedAgentId || ''}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="" disabled>Reassign Agent...</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id} className="bg-slate-900">{agent.name} ({agent.department})</option>
                ))}
              </select>
            </div>

            {/* Timeline & Audit Log */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Audit Trail & Activity Timeline
              </span>

              <div className="space-y-3 border-l-2 border-indigo-500/30 pl-4 ml-2">
                {ticket.timeline.map((event) => (
                  <div key={event.id} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-slate-950 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>{event.actor} — {event.action}</span>
                      <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
                    </div>
                    {event.note && (
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{event.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Agent Comment / Reply */}
            <form onSubmit={handleAddComment} className="space-y-2 pt-3 border-t border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300">Add Internal Note or Reply</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type internal note or reply to requester..."
                  className="flex-1 glass-input rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
