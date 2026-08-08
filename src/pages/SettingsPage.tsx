import React, { useState } from 'react';
import { AppSettings } from '../types';
import { motion } from 'motion/react';
import { 
  CpuChipIcon, 
  CheckCircleIcon, 
  LockClosedIcon, 
  ShareIcon
} from '@heroicons/react/24/outline';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings }) => {
  const [form, setForm] = useState<AppSettings>(settings);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System & AI Engine Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure Gemini model parameters, SLA targets, and SSO integrations</p>
        </div>

        {showSavedToast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>Settings Saved Successfully!</span>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Gemini AI Pipeline Configuration */}
        <div className="glass-card border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <CpuChipIcon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Gemini AI & Deflection Threshold
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Active LLM Model</label>
              <select
                value={form.geminiModel}
                onChange={(e) => setForm({ ...form, geminiModel: e.target.value })}
                className="w-full glass-input text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none font-mono cursor-pointer"
              >
                <option value="gemini-2.5-flash" className="bg-slate-900">Gemini 2.5 Flash (Recommended - Sub-200ms)</option>
                <option value="gemini-2.5-pro" className="bg-slate-900">Gemini 2.5 Pro (Deep Reasoning)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default SLA Target (Minutes)</label>
              <input
                type="number"
                value={form.defaultSlaMinutes}
                onChange={(e) => setForm({ ...form, defaultSlaMinutes: Number(e.target.value) })}
                className="w-full glass-input text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
              <span>Auto-Deflection Confidence Threshold:</span>
              <span className="font-bold text-indigo-400">{form.autoDeflectionThreshold}% Minimum Match</span>
            </div>
            <input
              type="range"
              min="50"
              max="98"
              value={form.autoDeflectionThreshold}
              onChange={(e) => setForm({ ...form, autoDeflectionThreshold: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Tickets with KB similarity scores above this percentage will receive automated resolution suggestions before reaching human agents.
            </p>
          </div>
        </div>

        {/* Section 2: Channel Integrations */}
        <div className="glass-card border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <ShareIcon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Enterprise Channel & SSO Integrations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Slack Helpdesk Bot</span>
                <span className="text-[11px] text-slate-400">Capture tickets from #it-helpdesk</span>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, enableSlackIntegration: !form.enableSlackIntegration })}
                className={`text-xs px-3.5 py-1.5 rounded-full font-mono font-bold cursor-pointer transition-all ${
                  form.enableSlackIntegration ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {form.enableSlackIntegration ? 'Connected' : 'Disabled'}
              </button>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Microsoft Teams Agent</span>
                <span className="text-[11px] text-slate-400">Direct message IT resolution bot</span>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, enableTeamsIntegration: !form.enableTeamsIntegration })}
                className={`text-xs px-3.5 py-1.5 rounded-full font-mono font-bold cursor-pointer transition-all ${
                  form.enableTeamsIntegration ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {form.enableTeamsIntegration ? 'Connected' : 'Disabled'}
              </button>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Okta Identity SSO</span>
                <span className="text-[11px] text-slate-400">SAML 2.0 & OIDC Authentication</span>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, enableOktaSSO: !form.enableOktaSSO })}
                className={`text-xs px-3.5 py-1.5 rounded-full font-mono font-bold cursor-pointer transition-all ${
                  form.enableOktaSSO ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {form.enableOktaSSO ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Jira Service Desk Sync</span>
                <span className="text-[11px] text-slate-400">Bi-directional issue tracking</span>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, enableJiraSync: !form.enableJiraSync })}
                className={`text-xs px-3.5 py-1.5 rounded-full font-mono font-bold cursor-pointer transition-all ${
                  form.enableJiraSync ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                }`}
              >
                {form.enableJiraSync ? 'Connected' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Security & Alerts */}
        <div className="glass-card border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-3">
            <LockClosedIcon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Security Governance & Alerts
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-white block">Sentiment Analysis Frustration Alerts</span>
                <span className="text-slate-400 text-[11px]">Flag tickets with negative sentiment for priority agent triage</span>
              </div>
              <input
                type="checkbox"
                checked={form.sentimentAlerts}
                onChange={(e) => setForm({ ...form, sentimentAlerts: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 cursor-pointer">
              <div>
                <span className="font-bold text-white block">Enforce Two-Factor Authentication (2FA)</span>
                <span className="text-slate-400 text-[11px]">Require WebAuthn or TOTP hardware keys for all IT agents</span>
              </div>
              <input
                type="checkbox"
                checked={form.require2FA}
                onChange={(e) => setForm({ ...form, require2FA: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="glass-button text-white text-xs font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <CheckCircleIcon className="w-4 h-4" />
            <span>Save System Configuration</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};
