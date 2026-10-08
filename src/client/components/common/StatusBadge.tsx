import React from 'react';
import {
  OverallStatus,
  IssueSeverity,
  IssueStatus,
  IssueCategory,
  UserRole,
} from '../../../shared/types';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  AlertCircle,
  Clock,
  CheckCircle2,
  UserCheck,
  Wrench,
  XCircle,
  Accessibility,
  Flame,
  Building2,
  Users,
} from 'lucide-react';

interface BadgeProps {
  className?: string;
}

export const OverallStatusBadge: React.FC<{ status: OverallStatus } & BadgeProps> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'SAFE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          SAFE SPACE
        </span>
      );
    case 'ISSUES_FOUND':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          ISSUES DETECTED
        </span>
      );
    case 'REVIEW_REQUIRED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          REVIEW REQUIRED
        </span>
      );
  }
};

export const SeverityBadge: React.FC<{ severity: IssueSeverity } & BadgeProps> = ({
  severity,
  className = '',
}) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse-subtle ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold tracking-wide uppercase bg-orange-500/20 text-orange-400 border border-orange-500/40 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          MEDIUM
        </span>
      );
    case 'LOW':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium tracking-wide uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          LOW
        </span>
      );
  }
};

export const IssueStatusBadge: React.FC<{ status: IssueStatus } & BadgeProps> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'NEW':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 ${className}`}
        >
          <AlertCircle className="w-3 h-3" />
          NEW
        </span>
      );
    case 'REVIEWED':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 ${className}`}
        >
          <HelpCircle className="w-3 h-3" />
          REVIEWED
        </span>
      );
    case 'ASSIGNED':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 ${className}`}
        >
          <UserCheck className="w-3 h-3" />
          ASSIGNED
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 ${className}`}
        >
          <Wrench className="w-3 h-3" />
          IN PROGRESS
        </span>
      );
    case 'RESOLVED':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3" />
          RESOLVED
        </span>
      );
    case 'CLOSED':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-600/30 text-slate-400 border border-slate-600/40 ${className}`}
        >
          <XCircle className="w-3 h-3" />
          CLOSED
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: IssueCategory } & BadgeProps> = ({
  category,
  className = '',
}) => {
  switch (category) {
    case 'SAFETY':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-red-950/60 text-red-300 border border-red-800/50 ${className}`}
        >
          <Flame className="w-3 h-3 text-red-400" />
          SAFETY
        </span>
      );
    case 'ACCESSIBILITY':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-sky-950/60 text-sky-300 border border-sky-800/50 ${className}`}
        >
          <Accessibility className="w-3 h-3 text-sky-400" />
          ACCESSIBILITY
        </span>
      );
    case 'INFRASTRUCTURE':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-purple-950/60 text-purple-300 border border-purple-800/50 ${className}`}
        >
          <Building2 className="w-3 h-3 text-purple-400" />
          INFRASTRUCTURE
        </span>
      );
    case 'CROWD_OPERATIONAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-teal-950/60 text-teal-300 border border-teal-800/50 ${className}`}
        >
          <Users className="w-3 h-3 text-teal-400" />
          CROWD & OPS
        </span>
      );
  }
};

export const RoleBadge: React.FC<{ role: UserRole } & BadgeProps> = ({ role, className = '' }) => {
  const styles: Record<UserRole, string> = {
    ADMIN: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    SAFETY_OFFICER: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    FACILITY_MANAGER: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    TEACHER: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    STUDENT: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${styles[role]} ${className}`}
    >
      {role.replace('_', ' ')}
    </span>
  );
};
