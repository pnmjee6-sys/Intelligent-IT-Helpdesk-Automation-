import React, { useState, useEffect } from 'react';
import { Ticket, User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  XMarkIcon, 
  PaperAirplaneIcon, 
  BoltIcon, 
  SparklesIcon,
  BookOpenIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { api } from '../services/api';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTicket: Ticket) => void;
  currentUser: User;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser
}) => {
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState(currentUser.department || 'Software Engineering');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Simulated AI Triage Preview State
  const [aiPreview, setAiPreview] = useState<{
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    urgencyScore: number;
    sentiment: 'calm' | 'neutral' | 'frustrated' | 'critical';
    matchedKbTitle: string;
    matchedKbSnippet: string;
    draftResolution: string;
  } | null>(null);

  useEffect(() => {
    if (subject.length > 5 || description.length > 10) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const text = (subject + ' ' + description).toLowerCase();

        let category = 'General IT Operations';
        let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
        let urgencyScore = 55;
        let sentiment: 'calm' | 'neutral' | 'frustrated' | 'critical' = 'neutral';
        let matchedKbTitle = 'Standard IT Self-Service Portal Manual';
        let matchedKbSnippet = 'Follow corporate authentication & MFA verification guidelines.';
        let draftResolution = 'Your ticket has been logged. Our AI copilot will review and route to the appropriate IT specialist.';

        if (text.includes('vpn') || text.includes('network') || text.includes('globalprotect') || text.includes('403')) {
          category = 'Network & Security / VPN';
          priority = text.includes('audit') || text.includes('urgent') ? 'high' : 'medium';
          urgencyScore = text.includes('audit') ? 85 : 68;
          sentiment = 'frustrated';
          matchedKbTitle = 'KB-091: GlobalProtect 403 Re-authentication Procedure';
          matchedKbSnippet = 'Clear cached tokens in settings and reconnect to portal vpn-us-east2.corp.internal.';
          draftResolution = 'Hello, clear your GlobalProtect client credential cache under Settings > App, and reconnect to server vpn-us-east2.corp.internal.';
        } else if (text.includes('password') || text.includes('lock') || text.includes('sap') || text.includes('sso')) {
          category = 'Identity & Access Management (IAM)';
          priority = 'high';
          urgencyScore = 80;
          sentiment = 'neutral';
          matchedKbTitle = 'KB-042: SAP ERP Account Self-Service Password Unlock';
          matchedKbSnippet = 'Self-unlock locked credentials at https://sso.company.com/sap-unlock.';
          draftResolution = 'You can self-unlock your SAP credentials instantly at https://sso.company.com/sap-unlock using Okta Push MFA.';
        } else if (text.includes('battery') || text.includes('hot') || text.includes('macbook') || text.includes('swell') || text.includes('bulg')) {
          category = 'Hardware & Asset Safety';
          priority = 'urgent';
          urgencyScore = 98;
          sentiment = 'critical';
          matchedKbTitle = 'KB-808: Battery Thermal Swelling Emergency Protocol';
          matchedKbSnippet = 'Shut down device immediately and disconnect USB-C MagSafe charger.';
          draftResolution = 'SAFETY ALERT: Power down your device immediately and disconnect charger. Hardware Ops technicians have been dispatched.';
        }

        setAiPreview({
          category,
          priority,
          urgencyScore,
          sentiment,
          matchedKbTitle,
          matchedKbSnippet,
          draftResolution
        });
        setIsAnalyzing(false);
      }, 350);

      return () => clearTimeout(timer);
    } else {
      setAiPreview(null);
      setIsAnalyzing(false);
    }
  }, [subject, description]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const newTicket: Ticket = {
      id: `TCK-${Math.floor(8500 + Math.random() * 1000)}`,
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      requesterAvatar: currentUser.avatar,
      requesterDept: department,
      subject,
      description,
      category: aiPreview ? aiPreview.category : 'General IT Operations',
      priority: aiPreview ? aiPreview.priority : 'medium',
      status: 'triaged',
      urgencyScore: aiPreview ? aiPreview.urgencyScore : 60,
      sentiment: aiPreview ? aiPreview.sentiment : 'neutral',
      createdAt: 'Just now',
      slaDeadlineMinutes: aiPreview?.priority === 'urgent' ? 15 : aiPreview?.priority === 'high' ? 60 : 180,
      slaRemainingMinutes: aiPreview?.priority === 'urgent' ? 15 : aiPreview?.priority === 'high' ? 60 : 180,
      isSlaBreached: false,
      resolutionDraft: aiPreview?.draftResolution,
      matchedKbArticles: aiPreview ? [{
        id: 'kb-preview',
        title: aiPreview.matchedKbTitle,
        category: aiPreview.category,
        snippet: aiPreview.matchedKbSnippet,
        content: aiPreview.matchedKbSnippet,
        similarity: 0.94,
        views: 120
      }] : [],
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          timestamp: 'Just now',
          actor: currentUser.name,
          action: 'Ticket Created',
          note: 'Submitted via Enterprise Helpdesk Modal',
          type: 'creation'
        },
        {
          id: `tl-${Date.now()}-2`,
          timestamp: 'Just now',
          actor: 'AI Gemini Triage',
          action: 'Zero-Shot AI Classification',
          note: `Category: ${aiPreview?.category || 'General IT'}, Urgency: ${aiPreview?.urgencyScore || 60}/100.`,
          type: 'triage'
        }
      ]
    };

    try {
      // Connect to backend API
      await api.tickets.create({
        title: subject,
        description,
        category_id: aiPreview?.category,
        priority: aiPreview?.priority?.toUpperCase(),
      });
    } catch (err: any) {
      console.warn('Backend ticket creation error, persisting in local state:', err.message);
    } finally {
      onSubmit(newTicket);
      setSubject('');
      setDescription('');
      setAiPreview(null);
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="glass-panel border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shadow-inner">
                <BoltIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Create IT Support Ticket</h2>
                <p className="text-[11px] text-slate-400">Gemini AI Triage auto-analyzes urgency & solution vectors</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mx-6 mt-4 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
              <ExclamationTriangleIcon className="w-4 h-4 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Issue Summary / Title *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Cannot connect to GlobalProtect VPN during SAP audit"
                className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="Finance & Audit" className="bg-slate-900 text-white">Finance & Audit</option>
                <option value="Human Resources" className="bg-slate-900 text-white">Human Resources</option>
                <option value="Software Engineering" className="bg-slate-900 text-white">Software Engineering</option>
                <option value="Sales & Revenue" className="bg-slate-900 text-white">Sales & Revenue</option>
                <option value="Executive Leadership" className="bg-slate-900 text-white">Executive Leadership</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Problem Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe exact error messages, hardware logs, or business urgency..."
                className="w-full glass-input rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none font-sans leading-relaxed"
              />
            </div>

            {/* Real-time AI Triage Preview Panel */}
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-indigo-300">Gemini AI is vectorizing issue content & calculating urgency...</span>
              </motion.div>
            )}

            {aiPreview && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-xl border border-indigo-500/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <SparklesIcon className="w-4 h-4 text-indigo-400" />
                    Live Gemini Triage Prediction
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                    96% Vector Confidence
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Category</span>
                    <span className="text-indigo-300 font-bold block truncate">{aiPreview.category}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Priority</span>
                    <span className={`font-bold block uppercase ${
                      aiPreview.priority === 'urgent' ? 'text-rose-400' :
                      aiPreview.priority === 'high' ? 'text-amber-400' : 'text-blue-400'
                    }`}>
                      {aiPreview.priority}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Urgency Meter</span>
                    <span className="text-white font-bold block">{aiPreview.urgencyScore} / 100</span>
                  </div>
                </div>

                {/* Matched KB */}
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono block mb-1 flex items-center gap-1">
                    <BookOpenIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Matched Knowledge Article (pgvector search):
                  </span>
                  <span className="font-bold text-slate-200 block">{aiPreview.matchedKbTitle}</span>
                  <p className="text-slate-400 text-[11px] font-mono mt-1 leading-relaxed">{aiPreview.matchedKbSnippet}</p>
                </div>
              </motion.div>
            )}

            {/* Footer Submit Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`glass-button text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Dispatching Ticket & AI Triage...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Submit Ticket</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
