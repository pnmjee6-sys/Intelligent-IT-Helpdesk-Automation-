import React from 'react';
import { Page, User } from '../types';
import { motion } from 'motion/react';
import { 
  ServerIcon, 
  SparklesIcon, 
  ArrowRightOnRectangleIcon, 
  UserPlusIcon, 
  Squares2X2Icon, 
  ShieldCheckIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  currentUser: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, currentUser }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30 group-hover:border-indigo-300 transition-all">
              <CpuChipIcon className="w-6 h-6 text-white group-hover:rotate-6 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight">
                  AutoDesk AI
                </span>
                <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono font-semibold tracking-wide">
                  v2.5 Enterprise
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Intelligent IT Helpdesk & Automation Engine
              </p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/80 backdrop-blur-md">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                currentPage === 'landing' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Overview
            </button>
            <a 
              href="#features" 
              className="px-4 py-1.5 text-xs font-semibold rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="px-4 py-1.5 text-xs font-semibold rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              className="px-4 py-1.5 text-xs font-semibold rounded-full text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              Pricing
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('dashboard')}
                className="glass-button text-white text-xs px-4 py-2 rounded-xl font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Squares2X2Icon className="w-4 h-4 text-indigo-200" />
                <span>Go to Dashboard</span>
              </motion.button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-slate-300 hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 text-slate-400" />
                  <span>Sign In</span>
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate('register')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 border border-indigo-400/20 cursor-pointer"
                >
                  <SparklesIcon className="w-4 h-4 text-indigo-200" />
                  <span>Get Started Free</span>
                </motion.button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
