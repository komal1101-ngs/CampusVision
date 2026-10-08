import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserProfile, UserRole } from '../../shared/types';
import { RoleBadge } from '../components/common/StatusBadge';
import { Users2, Shield, Mail, Building, Check, Key } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const permissionMatrix: Record<UserRole, { inspections: string; transitions: string; admin: string }> = {
    ADMIN: {
      inspections: 'Full Read & Write',
      transitions: 'All Statuses & Reassignments',
      admin: 'Full Hierarchy & System Control',
    },
    SAFETY_OFFICER: {
      inspections: 'Full Read & Write',
      transitions: 'NEW, REVIEWED, IN_PROGRESS, RESOLVED',
      admin: 'Read Only',
    },
    FACILITY_MANAGER: {
      inspections: 'Full Read & Write',
      transitions: 'ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED',
      admin: 'Read Only',
    },
    TEACHER: {
      inspections: 'Create & View Reports',
      transitions: 'Read Only',
      admin: 'Restricted',
    },
    STUDENT: {
      inspections: 'Submit Inspection / Report',
      transitions: 'Read Only',
      admin: 'Restricted',
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <Users2 className="w-6 h-6 text-teal-400" />
          Role-Based Access Control (RBAC) &amp; Personnel Matrix
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configured campus profiles, security roles, and authorization policies enforced by Supabase RLS.
        </p>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold font-display text-white">Configured User Directory</h3>

        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-white">{u.full_name}</span>
                  <RoleBadge role={u.role} />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-500" />
                    {u.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-500" />
                    {u.department}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-[11px] text-teal-400 font-semibold">Active Profile</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Permission Matrix Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold font-display text-white">
          Authorization Capabilities by Role
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Visual Inspections</th>
                <th className="py-2.5 px-3">Lifecycle Transitions</th>
                <th className="py-2.5 px-3">Location Hierarchy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(Object.keys(permissionMatrix) as UserRole[]).map((r) => (
                <tr key={r} className="hover:bg-slate-900/40">
                  <td className="py-3 px-3 font-semibold text-white">
                    <RoleBadge role={r} />
                  </td>
                  <td className="py-3 px-3 text-slate-300">{permissionMatrix[r].inspections}</td>
                  <td className="py-3 px-3 text-slate-300">{permissionMatrix[r].transitions}</td>
                  <td className="py-3 px-3 text-slate-300">{permissionMatrix[r].admin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
