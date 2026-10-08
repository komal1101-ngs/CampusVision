import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../../hooks/useAuth';
import { UserRole } from '../../../shared/types';
import { RoleBadge } from './StatusBadge';
import {
  ShieldAlert,
  Camera,
  UserCheck,
  ChevronDown,
  Building,
  Bell,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, role, switchRole } = useAuth();
  const navigate = useNavigate();

  const roleOptions: { role: UserRole; label: string; desc: string }[] = [
    { role: 'SAFETY_OFFICER', label: 'Safety Officer', desc: 'Audit, verify hazards, escalate issues' },
    { role: 'FACILITY_MANAGER', label: 'Facility Manager', desc: 'Assign staff, resolve work orders' },
    { role: 'ADMIN', label: 'Administrator', desc: 'Full system control & hierarchy management' },
    { role: 'TEACHER', label: 'Faculty / Teacher', desc: 'Report lab hazards, view safety metrics' },
    { role: 'STUDENT', label: 'Student', desc: 'Submit safety hazards from mobile or web' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                Vision<span className="text-teal-400">Campus</span>
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1">
                Visual Risk Intelligence
              </span>
            </div>
          </Link>

          {/* Active Campus Tag */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <Building className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-medium text-slate-200">GMR Institute of Technology (GMRIT)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Action: New Inspection */}
          <Link
            to="/inspections/new"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-900/30 hover:shadow-teal-800/50 transition-all duration-200"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">New Inspection</span>
          </Link>

          {/* Interactive Role Switcher */}
          <div className="relative group">
            <button
              id="role-switcher-button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 text-xs text-slate-200 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <div className="text-left hidden sm:block">
                <span className="block text-[10px] text-slate-400 leading-none">Switch Role</span>
                <span className="font-semibold text-white leading-tight">{currentUser.full_name}</span>
              </div>
              <RoleBadge role={role} className="ml-1" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-72 p-2 rounded-xl glass-panel shadow-2xl border border-slate-700/80 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="text-xs font-semibold text-white">Active Profile & RBAC Role</p>
                <p className="text-[11px] text-slate-400">{currentUser.department}</p>
              </div>

              <div className="space-y-1">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => switchRole(opt.role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-start gap-2.5 transition-all ${
                      role === opt.role
                        ? 'bg-teal-500/15 border border-teal-500/30 text-teal-300'
                        : 'hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <RoleBadge role={opt.role} className="mt-0.5" />
                    <div>
                      <p className="font-medium text-white">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 leading-tight">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
