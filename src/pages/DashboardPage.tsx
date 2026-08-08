import React, { useState } from 'react';
import { Ticket, User, AppSettings } from '../types';
import { motion } from 'motion/react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  FunnelIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  CpuChipIcon, 
  SparklesIcon, 
  ArrowPathIcon, 
  Square3Stack3DIcon, 
  ArrowUpRightIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { CreateTicketModal } from '../components/CreateTicketModal';
import { TicketDetailDrawer } from '../components/TicketDetailDrawer';

interface DashboardPageProps {
  tickets: Ticket[];
  onUpdateTicket: (updatedTicket: Ticket) => void;
  onCreateTicket: (newTicket: Ticket) => void;
  currentUser: User;
  agents: User[];
  settings: AppSettings;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  tickets,
  onUpdateTicket,
  onCreateTicket,
  currentUser,
  agents,
  settings
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter Logic
  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Top Metric Counts
  const totalOpen = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length;
  const highUrgencyCount = tickets.filter(t => t.urgencyScore >= 80 && t.status !== 'resolved').length;
  const resolvedToday = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">Helpdesk Operations Queue</h1>
            <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
              Gemini 2.5 Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time zero-shot IT triage, RAG matching, and agent copilot responses</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="glass-button text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 text-indigo-200" />
            <span>Create New Ticket</span>
          </motion.button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Active Open Queue</span>
            <span className="text-2xl font-black text-white font-mono block mt-1">{totalOpen}</span>
            <span className="text-[10px] text-slate-500 font-medium">Tickets awaiting resolution</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Square3Stack3DIcon className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">AI Deflection Rate</span>
            <span className="text-2xl font-black text-emerald-400 font-mono block mt-1">{settings.autoDeflectionThreshold}%</span>
            <span className="text-[10px] text-emerald-500/80 font-medium">Configured in Settings</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BoltIcon className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">High Urgency Alerts</span>
            <span className="text-2xl font-black text-amber-400 font-mono block mt-1">{highUrgencyCount}</span>
            <span className="text-[10px] text-amber-500/80 font-medium">Urgency score ≥ 80 / 100</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ExclamationTriangleIcon className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Resolved Today</span>
            <span className="text-2xl font-black text-indigo-300 font-mono block mt-1">{resolvedToday}</span>
            <span className="text-[10px] text-slate-500 font-medium">100% SLA compliant</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <CheckCircleIcon className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, subject, requester..."
            className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Status:</span>
          {['all', 'triaged', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl font-mono capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}

          <span className="text-slate-400 font-mono text-[11px] ml-2 mr-1">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="glass-input text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none font-mono cursor-pointer"
          >
            <option value="all" className="bg-slate-900">All Priorities</option>
            <option value="urgent" className="bg-slate-900">Urgent</option>
            <option value="high" className="bg-slate-900">High</option>
            <option value="medium" className="bg-slate-900">Medium</option>
            <option value="low" className="bg-slate-900">Low</option>
          </select>
        </div>
      </div>

      {/* Ticket List Table */}
      <div className="glass-card border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800/80 font-mono text-[10px] uppercase text-slate-400">
              <tr>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Requester & Subject</th>
                <th className="p-4">Category</th>
                <th className="p-4">Urgency & Sentiment</th>
                <th className="p-4">SLA Clock</th>
                <th className="p-4">Assigned Agent</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 font-mono">
                    No matching helpdesk tickets found in current filter.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 font-mono font-bold text-indigo-300">
                      {t.id}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {t.requesterAvatar ? (
                          <img
                            src={t.requesterAvatar}
                            alt={t.requesterName}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700/80"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 font-bold text-[10px] text-white flex items-center justify-center shrink-0">
                            {t.requesterName[0]}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-white block group-hover:text-indigo-300 transition-colors">
                            {t.subject}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {t.requesterName} • {t.requesterDept}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-slate-400">
                      {t.category}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          t.urgencyScore >= 80 ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                          t.urgencyScore >= 60 ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          Urgency {t.urgencyScore}
                        </span>

                        <span className="text-[10px] text-slate-400 font-mono capitalize">
                          ({t.sentiment})
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4 text-indigo-400" />
                        {t.slaRemainingMinutes}m left
                      </span>
                    </td>

                    <td className="p-4 font-sans text-slate-300">
                      {t.assignedAgentName || (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button className="text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-semibold">
                        <span>Inspect</span>
                        <ArrowUpRightIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer & Modal */}
      <TicketDetailDrawer
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateTicket={(updated) => {
          onUpdateTicket(updated);
          setSelectedTicket(updated);
        }}
        agents={agents}
        currentUser={currentUser}
      />

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={onCreateTicket}
        currentUser={currentUser}
      />
    </div>
  );
};
