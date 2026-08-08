import React, { useState } from 'react';
import { Page, User } from '../types';
import { motion } from 'motion/react';
import { 
  SparklesIcon, 
  ArrowRightIcon, 
  CpuChipIcon, 
  BoltIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ChartBarIcon, 
  Square3Stack3DIcon, 
  UserGroupIcon, 
  CommandLineIcon,
  AdjustmentsHorizontalIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  currentUser: User | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, currentUser }) => {
  // Demo Interactive Simulator State
  const [demoQuery, setDemoQuery] = useState('GlobalProtect VPN times out with 403 error during SAP month-end closing');
  const [demoVolume, setDemoVolume] = useState(2500); // Monthly ticket volume slider
  const [isAnnual, setIsAnnual] = useState(true);

  // How It Works Active Step State
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(0);

  // Computed ROI Values
  const hoursSavedPerYear = Math.round((demoVolume * 0.45 * 22) / 60);
  const dollarsSavedPerYear = Math.round(hoursSavedPerYear * 65);

  const sampleQueries = [
    { label: 'VPN 403 Timeout', text: 'GlobalProtect VPN drops every 5 mins with Error 403' },
    { label: 'SAP Lockout', text: 'SAP ERP account locked out after 3 failed password attempts' },
    { label: 'MacBook Hardware', text: 'M2 MacBook Pro trackpad bulging and bottom chassis overheating' }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Multi-Channel Omnichannel Ingestion',
      badge: 'Capture Phase',
      icon: ChatBubbleLeftRightIcon,
      summary: 'Automatically captures incoming employee requests across Slack (#it-helpdesk), Microsoft Teams, Email, and Portal forms.',
      details: [
        'Parses rich context including user role, department, workstation specs, and error attachments',
        'De-duplicates repeated requests and merges related incident threads instantly',
        'Applies SOC-2 compliant encryption and anonymization before LLM processing'
      ],
      previewSnippet: {
        channel: 'Slack #it-helpdesk',
        sender: 'Sarah Jenkins (Finance Dept)',
        message: 'My SAP login fails with code 403-Forbidden during month-end payroll run.'
      }
    },
    {
      step: '02',
      title: 'Gemini 2.5 Zero-Shot Triage & RAG Retrieval',
      badge: 'AI Core Phase',
      icon: CpuChipIcon,
      summary: 'Vectorizes ticket contents, queries internal knowledge bases (Notion, Confluence, Jira), and calculates urgency metrics.',
      details: [
        'Generates sub-200ms vector embeddings to match against verified KB solutions',
        'Computes dynamic Urgency Scores (0-100) and user sentiment analysis (Frustrated / Neutral)',
        'Determines auto-deflection feasibility against configured confidence thresholds'
      ],
      previewSnippet: {
        category: 'IAM & Access Management',
        urgencyScore: 88,
        sentiment: 'High Frustration',
        kbMatch: 'KB-892: SAP Month-End Access Escalation'
      }
    },
    {
      step: '03',
      title: 'Automated Deflection or Copilot Escalation',
      badge: 'Resolution Phase',
      icon: RocketLaunchIcon,
      summary: 'Executes zero-touch deflection for standard queries or prepares full copilot drafts and queue assignment for human agents.',
      details: [
        'Delivers step-by-step interactive self-serve guides directly in Slack or Teams',
        'Auto-routes complex incidents to Tier 2 specialized agent queues with pre-filled responses',
        'Syncs resolution metadata bi-directionally with Jira Service Desk & ServiceNow'
      ],
      previewSnippet: {
        actionTaken: 'Auto-Deflected in Slack (Deflection Score 94%)',
        agentTimeSaved: '18 minutes saved',
        ticketStatus: 'Closed - Verified by User'
      }
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500 selection:text-white bg-grid-pattern relative overflow-hidden">
      
      {/* Ambient Orb Backdrops */}
      <div className="glow-orb-indigo w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2" />
      <div className="glow-orb-purple w-[500px] h-[500px] top-[600px] -right-20" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 glass-panel border border-indigo-500/30 px-4 py-1.5 rounded-full text-xs text-indigo-300 font-mono shadow-lg shadow-indigo-950/50"
            >
              <SparklesIcon className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Next-Gen Helpdesk Engine Powered by Gemini 2.5</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Deflect 60%+ of IT Tickets <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-300">
                Before They Hit Your Agents
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              AutoDesk AI ingests corporate Slack, email, and portal requests, executes real-time RAG against internal docs, and resolves standard issues automatically with enterprise security.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate(currentUser ? 'dashboard' : 'register')}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-7 py-4 rounded-xl shadow-xl shadow-indigo-600/30 border border-indigo-400/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{currentUser ? 'Open Helpdesk Dashboard' : 'Start 14-Day Free Trial'}</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto glass-panel hover:bg-slate-800/80 text-slate-200 border border-slate-700/80 font-semibold text-xs px-7 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CommandLineIcon className="w-4 h-4 text-indigo-400" />
                <span>Explore Live Agent Dashboard</span>
              </motion.button>
            </motion.div>

            {/* Trust Metrics Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80"
            >
              <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-center">
                <span className="text-2xl font-black text-white font-mono block">64.2%</span>
                <span className="text-[11px] text-slate-400 font-medium">AI First-Contact Deflection</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-center">
                <span className="text-2xl font-black text-indigo-400 font-mono block">2.4 mins</span>
                <span className="text-[11px] text-slate-400 font-medium">Average Resolution Time</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-center">
                <span className="text-2xl font-black text-emerald-400 font-mono block">99.4%</span>
                <span className="text-[11px] text-slate-400 font-medium">SLA Compliance Rate</span>
              </div>
              <div className="glass-card p-4 rounded-2xl border border-slate-800/80 text-center">
                <span className="text-2xl font-black text-purple-400 font-mono block">SOC-2</span>
                <span className="text-[11px] text-slate-400 font-medium">Type II Certified Security</span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Live Demo Card in Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 max-w-4xl mx-auto glass-card border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">Interactive AI Triage Sandbox</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
                Gemini 2.5 Active
              </span>
            </div>

            {/* Sample Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-slate-400 font-medium">Try scenario:</span>
              {sampleQueries.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setDemoQuery(sample.text)}
                  className="text-xs bg-slate-900/80 hover:bg-slate-800 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-all cursor-pointer font-mono"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Input Field */}
            <div className="relative mb-5">
              <input
                type="text"
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                placeholder="Type any employee IT issue here..."
                className="w-full glass-input rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
              />
            </div>

            {/* Live Triage Output Preview */}
            <div className="bg-slate-950/80 rounded-xl p-4 sm:p-5 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-indigo-400" />
                  Gemini Vector Analysis Output
                </span>
                <span className="text-[10px] font-mono text-slate-500">Execution Time: 124ms</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Classified Category</span>
                  <span className="text-white font-bold block truncate">
                    {demoQuery.toLowerCase().includes('vpn') ? 'Network & Security / VPN' :
                     demoQuery.toLowerCase().includes('sap') ? 'IAM & Access Management' : 'Hardware & Safety'}
                  </span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Urgency Meter</span>
                  <span className="text-amber-400 font-bold block">
                    {demoQuery.toLowerCase().includes('bulg') ? '98 / 100 (CRITICAL)' : '84 / 100 (HIGH)'}
                  </span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Auto-Deflection Status</span>
                  <span className="text-emerald-400 font-bold block">
                    Deflectable via KB-091
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Grid Section */}
      <section id="features" className="py-24 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built for High-Velocity IT Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              Replace manual queue sorting with intelligent vector classification, automated agent copilot drafts, and real-time SLA risk monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -4 }}
              className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <BoltIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white">AI Zero-Shot Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically categorizes incoming tickets, assigns sentiment scores, and ranks urgency from 0 to 100 in under 200 milliseconds.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                <Square3Stack3DIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-white">RAG Knowledge Graph</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects directly to Notion, Confluence, and GitHub docs to surface exact resolution steps for both users and L1/L2 support agents.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-white">SLA Breach Predictor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitors ticket queues continuously and escalates high-impact tickets before SLA targets are breached.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Workflow Section */}
      <section id="how-it-works" className="py-24 border-b border-slate-800/80 relative scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              3-Step Resolution Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              How AutoDesk AI Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">
              From employee issue submission to zero-touch deflection or agent copilot escalation in under 3 seconds.
            </p>
          </div>

          {/* Interactive Step Switcher Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {workflowSteps.map((stepItem, idx) => {
              const StepIcon = stepItem.icon;
              const isActive = activeWorkflowStep === idx;
              return (
                <motion.div
                  key={stepItem.step}
                  whileHover={{ y: -3 }}
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isActive 
                      ? 'glass-card border-indigo-500/80 shadow-2xl shadow-indigo-600/20 bg-slate-900/90' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-2xl font-black font-mono ${isActive ? 'text-indigo-400' : 'text-slate-600'}`}>
                      {stepItem.step}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold uppercase ${
                      isActive ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}>
                      {stepItem.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-indigo-600/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{stepItem.title}</h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {stepItem.summary}
                  </p>

                  {isActive && (
                    <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center gap-1.5 text-xs text-indigo-400 font-bold font-mono">
                      <span>Currently Viewing Step {stepItem.step}</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Detailed Workflow Step Inspector Panel */}
          <div className="glass-card border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl bg-slate-950/90">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    Phase {workflowSteps[activeWorkflowStep].step} Breakdown
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {workflowSteps[activeWorkflowStep].badge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {workflowSteps[activeWorkflowStep].title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {workflowSteps[activeWorkflowStep].summary}
                </p>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-300 font-sans">
                  {workflowSteps[activeWorkflowStep].details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2.5">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setActiveWorkflowStep((prev) => (prev + 1) % workflowSteps.length)}
                    className="glass-button text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>Next Phase</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="text-xs text-indigo-300 hover:text-white font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Try in Live Dashboard</span>
                    <ArrowPathIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Interactive Code/Data Execution Mockup */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 font-mono text-xs space-y-3 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[10px] text-slate-400 ml-1">autodesk-ai-pipeline.log</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded font-bold">
                    SYSTEM ACTIVE
                  </span>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed">
                  {Object.entries(workflowSteps[activeWorkflowStep].previewSnippet).map(([key, val]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 gap-1">
                      <span className="text-slate-500 uppercase tracking-wider text-[9px] font-bold">{key}</span>
                      <span className="text-indigo-200 font-bold text-right">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-[10px] text-slate-500 text-center border-t border-slate-800/80 pt-2 flex items-center justify-center gap-2">
                  <CpuChipIcon className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  <span>Sub-200ms Vector Execution • Gemini 2.5 Flash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-24 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card border border-indigo-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Calculate Your Enterprise ROI</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">Estimate hours and cost saved using AutoDesk AI deflection</p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                  <span>Monthly Ticket Volume:</span>
                  <span className="font-bold text-indigo-400">{demoVolume.toLocaleString()} tickets / month</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={demoVolume}
                  onChange={(e) => setDemoVolume(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800/80 font-mono">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 uppercase block">Estimated Hours Saved / Year</span>
                  <span className="text-3xl font-black text-indigo-400 mt-1 block">{hoursSavedPerYear.toLocaleString()} hrs</span>
                </div>
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center">
                  <span className="text-[11px] text-slate-500 uppercase block">Annual Cost Savings</span>
                  <span className="text-3xl font-black text-emerald-400 mt-1 block">${dollarsSavedPerYear.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Simple, Transparent Pricing</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Scale as your IT engineering and support team expands</p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-8 inline-flex items-center gap-2 glass-panel p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setIsAnnual(false)}
                className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${!isAnnual ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${isAnnual ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="glass-card p-8 rounded-3xl border border-slate-800/80 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For growing IT teams needing automated ticket routing</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-white">${isAnnual ? '49' : '59'}</span>
                  <span className="text-xs text-slate-400"> / agent / month</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 500 tickets/mo</li>
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Gemini Zero-Shot Triage</li>
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Email & Portal channel</li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('register')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
              >
                Start Starter Trial
              </button>
            </div>

            {/* Pro - Featured */}
            <div className="glass-card p-8 rounded-3xl border-2 border-indigo-500/80 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Professional</h3>
                <p className="text-xs text-slate-400 mt-1">Full AI Deflection & Slack/Teams RAG Integration</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-white">${isAnnual ? '89' : '109'}</span>
                  <span className="text-xs text-slate-400"> / agent / month</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited tickets</li>
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Gemini 2.5 RAG Knowledge Vectoring</li>
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Slack & Microsoft Teams Bot</li>
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Custom SLA Breach Alerts</li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('register')}
                className="w-full glass-button text-white text-xs font-bold py-3 rounded-xl cursor-pointer"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="glass-card p-8 rounded-3xl border border-slate-800/80 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">Dedicated cloud hosting & custom SSO integration</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                </div>
                <ul className="mt-8 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Custom LLM fine-tuning</li>
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Okta / Azure AD SSO & RBAC</li>
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> Dedicated SLA Account Manager</li>
                  <li className="flex items-center gap-2.5"><CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" /> On-Premises / VPC Deployment</li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('register')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer"
              >
                Contact Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CpuChipIcon className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">AutoDesk AI</span>
            <span>© 2026 Enterprise Operations Inc.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#pricing" className="hover:text-slate-300">Terms of Service</a>
            <button onClick={() => onNavigate('login')} className="hover:text-slate-300 cursor-pointer">Agent Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
