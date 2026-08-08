import React, { useState } from 'react';
import { Page, User } from '../types';
import { motion } from 'motion/react';
import { 
  CpuChipIcon, 
  ArrowRightIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  UserIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CURRENT_USER } from '../data/mockData';
import { api } from '../services/api';

interface RegisterPageProps {
  onNavigate: (page: Page) => void;
  onRegisterSuccess: (user: User) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('IT Operations');
  const [role, setRole] = useState<'END_USER' | 'L1_AGENT' | 'L2_AGENT' | 'HELPDESK_MANAGER' | 'SYS_ADMIN'>('L1_AGENT');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.auth.register({
        email,
        password,
        full_name: fullName,
        role,
        department,
      });

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }

      const newUser: User = {
        id: response.data.user.id,
        name: response.data.user.full_name,
        email: response.data.user.email,
        avatar: CURRENT_USER.avatar,
        role: role.includes('ADMIN') ? 'admin' : 'agent',
        department: response.data.user.department || 'General',
        title: 'IT Support Engineer',
        employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        skills: ['IT Support', 'Gemini AI Triage'],
        ticketsResolved: 0,
        csatRating: 5.0,
        avgResponseTime: '0m',
        joinedDate: 'Just now',
      };

      onRegisterSuccess(newUser);
      onNavigate('dashboard');
    } catch (err: any) {
      console.warn('Backend register attempt failed, using demo fallback:', err.message);
      setErrorMsg(err.message || 'Registration failed');
      // Fallback
      onRegisterSuccess({
        ...CURRENT_USER,
        name: fullName || 'New Engineer',
        email: email || CURRENT_USER.email,
      });
      onNavigate('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-4 bg-grid-pattern relative overflow-hidden">
      
      {/* Glow Orbs */}
      <div className="glow-orb-indigo w-[400px] h-[400px] -top-20 left-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-card border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10 my-6"
      >
        {/* Brand Top */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/30 mx-auto mb-3">
            <CpuChipIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Create Enterprise Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">Register new support agent or IT administrator</p>
        </div>

        {/* Error Message Banner */}
        {errorMsg && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 p-3 rounded-2xl flex items-center gap-2 text-rose-300 text-xs">
            <ExclamationTriangleIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="s.jenkins@company.corp"
                className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <div className="relative">
                <BuildingOfficeIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="IT Operations"
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Claim</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full glass-input rounded-xl px-3 py-2.5 text-xs text-white bg-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="END_USER">End User</option>
                <option value="L1_AGENT">L1 Agent</option>
                <option value="L2_AGENT">L2 Specialist</option>
                <option value="HELPDESK_MANAGER">Manager</option>
                <option value="SYS_ADMIN">System Admin</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full glass-button text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registering JWT Account...</span>
              </>
            ) : (
              <>
                <span>Create Workspace Account</span>
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <span>Already have an account? </span>
          <button
            onClick={() => onNavigate('login')}
            className="text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
};
