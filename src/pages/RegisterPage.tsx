import React, { useState } from 'react';
import { Page, User, UserRole } from '../types';
import { motion } from 'motion/react';
import { 
  CpuChipIcon, 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

interface RegisterPageProps {
  onNavigate: (page: Page) => void;
  onRegisterSuccess: (user: User) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState<UserRole>('agent');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newUser: User = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fullName,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: role,
      department: organization ? `${organization} IT Dept` : 'IT Operations',
      title: role === 'admin' ? 'IT Operations Manager' : 'IT Helpdesk Specialist',
      employeeId: `EMP-${Math.floor(2000 + Math.random() * 8000)}`,
      skills: ['Ticket Management', 'SLA Governance', 'Identity Access'],
      ticketsResolved: 0,
      csatRating: 5.0,
      avgResponseTime: '< 5 mins',
      joinedDate: 'Just now'
    };

    onRegisterSuccess(newUser);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-4 bg-grid-pattern relative overflow-hidden">
      
      {/* Glow Orbs */}
      <div className="glow-orb-purple w-[450px] h-[450px] -top-20 left-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg glass-card border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/30 mx-auto mb-3">
            <CpuChipIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Create Workspace Account</h1>
          <p className="text-xs text-slate-400 mt-1">Start your 14-day AutoDesk AI trial. No credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email *</label>
              <div className="relative">
                <EnvelopeIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.corp"
                  className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Organization / Company</label>
              <div className="relative">
                <BuildingOfficeIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Acme Enterprise"
                  className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="agent" className="bg-slate-900">IT Support Agent (Tier 1/2)</option>
                <option value="admin" className="bg-slate-900">IT Director / Administrator</option>
                <option value="employee" className="bg-slate-900">Corporate Employee</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <LockClosedIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full glass-button text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Create Account & Launch Dashboard</span>
            <ArrowRightIcon className="w-4 h-4" />
          </motion.button>
        </form>

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
