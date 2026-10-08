import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../hooks/useAuth';
import { UserRole } from '../../shared/types';
import { RoleBadge } from '../components/common/StatusBadge';
import {
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Lock,
  Mail,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SAFETY_OFFICER');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    navigate('/dashboard');
  };

  const handlePersonaClick = (role: UserRole) => {
    switchRole(role);
    navigate('/dashboard');
  };

  const personas = [
    {
      role: 'SAFETY_OFFICER' as UserRole,
      title: 'Safety Officer Marcus Reed',
      dept: 'GMRIT Campus Safety & Compliance',
      access: 'Verify hazards, advance lifecycle, trigger work orders',
    },
    {
      role: 'FACILITY_MANAGER' as UserRole,
      title: 'Manager Sarah Chen',
      dept: 'GMRIT Infrastructure & Maintenance',
      access: 'Assign maintenance crews, track resolution milestones',
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Director Alex Vance',
      dept: 'GMRIT Campus Operations & Administration',
      access: 'Full system control, location hierarchy, user matrix',
    },
    {
      role: 'TEACHER' as UserRole,
      title: 'Prof. David Miller',
      dept: 'GMRIT Engineering Faculty',
      access: 'Inspect labs, report accessibility barriers and hazards',
    },
    {
      role: 'STUDENT' as UserRole,
      title: 'Jordan Taylor',
      dept: 'GMRIT Student Council',
      access: 'Submit hazard inspections from device camera',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="ambient-glow bg-teal-500 top-10 left-10"></div>
      <div className="ambient-glow bg-emerald-500 bottom-10 right-10"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 items-center">
        {/* Left: Branding & Role Selector */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white">
                Vision<span className="text-teal-400">Campus</span>
              </h1>
              <p className="text-xs text-slate-400">AI Visual Risk &amp; Facility Intelligence</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Select a Persona for Instant Demo Access:</h2>
            <p className="text-xs text-slate-400 mt-1">
              Test multi-role RBAC permissions, audit workflows, and location hierarchies directly.
            </p>
          </div>

          <div className="space-y-2.5">
            {personas.map((p) => (
              <button
                key={p.role}
                onClick={() => handlePersonaClick(p.role)}
                className="w-full text-left p-3.5 rounded-xl glass-card border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/90 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white group-hover:text-teal-300">
                      {p.title}
                    </span>
                    <RoleBadge role={p.role} />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight truncate">{p.access}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 shrink-0 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Traditional Auth Form */}
        <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold font-display text-white">Sign In to VisionCampus</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter institution credentials to access your safety dashboard.
            </p>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                Institutional Email
              </label>
              <input
                type="email"
                placeholder="safety@gmrit.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                Select Access Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200"
              >
                <option value="SAFETY_OFFICER">Safety Officer (Audit &amp; Triage)</option>
                <option value="FACILITY_MANAGER">Facility Manager (Dispatch &amp; Maintenance)</option>
                <option value="ADMIN">Administrator (Full Control)</option>
                <option value="TEACHER">Faculty / Teacher</option>
                <option value="STUDENT">Student Representative</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 mt-4"
            >
              <span>Authenticate &amp; Enter Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 text-center">
            Supabase Auth &bull; Multi-Tier RLS Policies Enforced
          </div>
        </div>
      </div>
    </div>
  );
};
