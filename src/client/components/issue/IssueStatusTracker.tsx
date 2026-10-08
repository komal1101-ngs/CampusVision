import React from 'react';
import { IssueStatus, UserRole } from '../../../shared/types';
import {
  CheckCircle,
  Circle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Wrench,
  UserCheck,
  XCircle,
} from 'lucide-react';

interface IssueStatusTrackerProps {
  currentStatus: IssueStatus;
  userRole: UserRole;
  onTransitionStatus: (newStatus: IssueStatus) => void;
  isUpdating?: boolean;
}

const LIFECYCLE_STEPS: { status: IssueStatus; label: string; icon: any }[] = [
  { status: 'NEW', label: '1. New Discovery', icon: Circle },
  { status: 'REVIEWED', label: '2. Triage Reviewed', icon: Clock },
  { status: 'ASSIGNED', label: '3. Assigned Staff', icon: UserCheck },
  { status: 'IN_PROGRESS', label: '4. In Remediation', icon: Wrench },
  { status: 'RESOLVED', label: '5. Resolved Hazard', icon: CheckCircle },
  { status: 'CLOSED', label: '6. Verified Closed', icon: XCircle },
];

export const IssueStatusTracker: React.FC<IssueStatusTrackerProps> = ({
  currentStatus,
  userRole,
  onTransitionStatus,
  isUpdating = false,
}) => {
  const currentIndex = LIFECYCLE_STEPS.findIndex((s) => s.status === currentStatus);
  const canUpdate = ['SAFETY_OFFICER', 'FACILITY_MANAGER', 'ADMIN'].includes(userRole);

  const getNextStatuses = (): IssueStatus[] => {
    switch (currentStatus) {
      case 'NEW':
        return ['REVIEWED', 'ASSIGNED', 'IN_PROGRESS'];
      case 'REVIEWED':
        return ['ASSIGNED', 'IN_PROGRESS'];
      case 'ASSIGNED':
        return ['IN_PROGRESS', 'RESOLVED'];
      case 'IN_PROGRESS':
        return ['RESOLVED'];
      case 'RESOLVED':
        return ['CLOSED', 'IN_PROGRESS'];
      case 'CLOSED':
        return ['IN_PROGRESS'];
      default:
        return [];
    }
  };

  const nextOptions = getNextStatuses();

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-bold font-display text-white">
            Remediation Lifecycle Progression
          </h3>
          <p className="text-xs text-slate-400">
            Audit-tracked progression from discovery to certified closure.
          </p>
        </div>

        {canUpdate && nextOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick Transition:</span>
            {nextOptions.map((target) => (
              <button
                key={target}
                disabled={isUpdating}
                onClick={() => onTransitionStatus(target)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>Move to {target.replace('_', ' ')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visual Stepper Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {LIFECYCLE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div
              key={step.status}
              className={`p-3 rounded-xl border transition-all text-center relative ${
                isCurrent
                  ? 'bg-teal-500/15 border-teal-500/50 shadow-lg shadow-teal-500/10'
                  : isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <div className="flex justify-center mb-1.5">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${
                      isCurrent ? 'text-teal-400 animate-pulse' : 'text-slate-600'
                    }`}
                  />
                )}
              </div>
              <p
                className={`text-xs font-bold leading-tight ${
                  isCurrent ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-slate-400'
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-teal-500/30 text-teal-200">
                  Active
                </span>
              )}
            </div>
          );
        })}
      </div>

      {!canUpdate && (
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Read-only mode for role <strong className="text-white">{userRole}</strong>. Transition controls require Safety Officer, Facility Manager, or Admin authorization.
          </span>
        </div>
      )}
    </div>
  );
};
