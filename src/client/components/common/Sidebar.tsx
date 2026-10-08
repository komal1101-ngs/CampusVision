import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Camera,
  ClipboardList,
  AlertOctagon,
  MapPin,
  FolderTree,
  Sliders,
  Users2,
  ShieldAlert,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();
  const isAdmin = role === 'ADMIN';

  const navItems = [
    {
      to: '/dashboard',
      label: 'Analytics & KPIs',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/inspections/new',
      label: 'New Inspection',
      icon: Camera,
      badge: 'AI Vision',
    },
    {
      to: '/inspections',
      label: 'Inspection Audits',
      icon: ClipboardList,
      badge: null,
    },
    {
      to: '/issues',
      label: 'Issue Lifecycle',
      icon: AlertOctagon,
      badge: null,
    },
    {
      to: '/map',
      label: 'Campus GIS Map',
      icon: MapPin,
      badge: null,
    },
  ];

  const adminItems = [
    {
      to: '/admin/locations',
      label: 'Location Hierarchy',
      icon: FolderTree,
    },
    {
      to: '/admin/categories',
      label: 'Detection Domains',
      icon: Sliders,
    },
    {
      to: '/admin/users',
      label: 'Role & User Matrix',
      icon: Users2,
    },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        {/* Main Navigation */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Operations
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 border-l-2 border-teal-400 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Navigation */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Administration
            </p>
            {!isAdmin && (
              <span className="text-[10px] text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded">
                Admin Only
              </span>
            )}
          </div>
          <nav className="space-y-1">
            {adminItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-l-2 border-indigo-400 font-semibold'
                        : isAdmin
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                        : 'text-slate-600 hover:text-slate-500 cursor-not-allowed'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Campus Status Banner */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white">System Sentinel Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Gemini 3.8 Visual Intelligence engine connected with automated hazard triage.
        </p>
      </div>
    </aside>
  );
};
