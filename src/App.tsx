import React, { useState } from 'react';
import { Page, User, Ticket, AppSettings } from './types';
import { CURRENT_USER, MOCK_AGENTS, INITIAL_TICKETS, DEFAULT_SETTINGS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(CURRENT_USER);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [agents, setAgents] = useState<User[]>(MOCK_AGENTS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const handleCreateTicket = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setAgents(prev => prev.map(a => a.id === updatedUser.id ? updatedUser : a));
  };

  const openTicketsCount = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;

  // Render Auth or Landing views with Top Navbar
  if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register') {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
        <Navbar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          currentUser={currentUser}
        />

        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {currentPage === 'landing' && (
                <LandingPage
                  onNavigate={(page) => setCurrentPage(page)}
                  currentUser={currentUser}
                />
              )}

              {currentPage === 'login' && (
                <LoginPage
                  onNavigate={(page) => setCurrentPage(page)}
                  onLoginSuccess={(user) => {
                    setCurrentUser(user);
                    setCurrentPage('dashboard');
                  }}
                />
              )}

              {currentPage === 'register' && (
                <RegisterPage
                  onNavigate={(page) => setCurrentPage(page)}
                  onRegisterSuccess={(user) => {
                    setCurrentUser(user);
                    setCurrentPage('dashboard');
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  // Render Logged-In Application Views with Sidebar Navigation
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex selection:bg-indigo-500 selection:text-white">
      {currentUser && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          currentUser={currentUser}
          openTicketsCount={openTicketsCount}
          onSignOut={() => {
            setCurrentUser(null);
            setCurrentPage('landing');
          }}
        />
      )}

      <main className="flex-1 overflow-y-auto min-h-screen bg-slate-950">
        {/* Secondary Header Bar */}
        <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 py-3 flex items-center justify-between text-xs z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('landing')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer font-mono flex items-center gap-1.5"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Back to Overview Site</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Active Operator: <strong className="text-white">{currentUser?.name}</strong></span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              SOC-2 Verified
            </span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {currentPage === 'dashboard' && (
              <DashboardPage
                tickets={tickets}
                onUpdateTicket={handleUpdateTicket}
                onCreateTicket={handleCreateTicket}
                currentUser={currentUser || CURRENT_USER}
                agents={agents}
                settings={settings}
              />
            )}

            {currentPage === 'workflows' && (
              <WorkflowsPage />
            )}

            {currentPage === 'profile' && currentUser && (
              <ProfilePage
                currentUser={currentUser}
                onUpdateUser={handleUpdateUser}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsPage
                settings={settings}
                onUpdateSettings={(newSet) => setSettings(newSet)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
