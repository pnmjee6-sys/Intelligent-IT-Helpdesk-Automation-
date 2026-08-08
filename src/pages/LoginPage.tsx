import React, { useState } from 'react';
import { Page, User } from '../types';
import { motion } from 'motion/react';
import { 
  CpuChipIcon, 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  SparklesIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { CURRENT_USER } from '../data/mockData';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('alex.morgan@enterprise.corp');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotMsg, setShowForgotMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(CURRENT_USER);
    onNavigate('dashboard');
  };

  const handleDemoLogin = () => {
    onLoginSuccess(CURRENT_USER);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-4 bg-grid-pattern relative overflow-hidden">
      
      {/* Glow Orbs */}
      <div className="glow-orb-indigo w-[400px] h-[400px] -top-20 left-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-card border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Brand Top */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/30 mx-auto mb-3">
            <CpuChipIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Sign in to AutoDesk AI</h1>
          <p className="text-xs text-slate-400 mt-1">Enter your enterprise credentials or Okta SSO</p>
        </div>

        {/* Quick Demo Agent Login Banner */}
        <div className="mb-6 bg-slate-950/80 p-3.5 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase">Demo Agent Account</span>
            <span className="text-xs font-semibold text-slate-200 block">Alex Morgan (Senior Systems Engineer)</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDemoLogin}
            type="button"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            One-Click Login
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Corporate Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotMsg(true)}
                className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <LockClosedIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {showForgotMsg && (
            <p className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-center">
              Password reset link sent to your corporate email.
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
              />
              <span>Remember session (30 days)</span>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full glass-button text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Portal</span>
            <ArrowRightIcon className="w-4 h-4" />
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <span>Don't have an enterprise workspace? </span>
          <button
            onClick={() => onNavigate('register')}
            className="text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            Create an Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};
