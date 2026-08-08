import React, { useState } from 'react';
import { User } from '../types';
import { motion } from 'motion/react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  TrophyIcon, 
  StarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  PencilSquareIcon, 
  BookmarkIcon, 
  TagIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline';

interface ProfilePageProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.title);
  const [department, setDepartment] = useState(currentUser.department);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      title,
      department,
      skills
    });
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Agent Profile & Performance</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your operator credentials, assigned queues, and CSAT history</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsEditing(!isEditing)}
          className="glass-panel text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer"
        >
          <PencilSquareIcon className="w-4 h-4 text-indigo-400" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </motion.button>
      </div>

      {/* Main Profile Info Card */}
      <div className="glass-card border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl"
          />

          {isEditing ? (
            <form onSubmit={handleSave} className="flex-1 space-y-3 w-full">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full glass-input rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{currentUser.title}</p>
              <p className="text-xs text-slate-400">{currentUser.department} • {currentUser.email}</p>
              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
                <span>Employee ID: {currentUser.employeeId}</span>
                <span>•</span>
                <span>Member Since: {currentUser.joinedDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card border border-slate-800/80 p-6 rounded-2xl text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-400 mb-3">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black text-white font-mono">{currentUser.ticketsResolved}</span>
          <span className="text-xs text-slate-400 block mt-1">Total Tickets Resolved</span>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card border border-slate-800/80 p-6 rounded-2xl text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 mb-3">
            <StarIcon className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black text-amber-400 font-mono">{currentUser.csatRating} / 5.0</span>
          <span className="text-xs text-slate-400 block mt-1">Customer CSAT Score</span>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card border border-slate-800/80 p-6 rounded-2xl text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400 mb-3">
            <ClockIcon className="w-6 h-6" />
          </div>
          <span className="text-3xl font-black text-emerald-400 font-mono">{currentUser.avgResponseTime}</span>
          <span className="text-xs text-slate-400 block mt-1">Avg Resolution Speed</span>
        </motion.div>
      </div>

      {/* Skills & Queue Specializations */}
      <div className="glass-card border border-slate-800/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <span className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
            Technical Skill Tags & Auto-Assignment Queues
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-slate-950/80 text-indigo-300 border border-indigo-500/30 font-mono text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2"
            >
              <TagIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{skill}</span>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-rose-400 hover:text-rose-300 ml-1 font-bold cursor-pointer"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>

        {isEditing && (
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill tag (e.g. Cisco VPN, Kubernetes)..."
              className="glass-input text-xs text-white rounded-xl px-3.5 py-2 focus:outline-none flex-1"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              Add Tag
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
