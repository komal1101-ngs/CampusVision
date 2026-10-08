import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Issue, IssueAuditLog, UserProfile, IssueStatus } from '../../shared/types';
import { useAuth } from '../hooks/useAuth';
import { SeverityBadge, CategoryBadge, IssueStatusBadge } from '../components/common/StatusBadge';
import { IssueStatusTracker } from '../components/issue/IssueStatusTracker';
import { AuditTimeline } from '../components/issue/AuditTimeline';
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  Send,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const IssueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, role } = useAuth();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [auditLogs, setAuditLogs] = useState<IssueAuditLog[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [issueData, usersData] = await Promise.all([
        api.getIssueById(id),
        api.getUsers(),
      ]);
      setIssue(issueData.issue);
      setAuditLogs(issueData.auditLogs);
      setUsers(usersData);
      setSelectedAssignee(issueData.issue.assigned_to || '');
    } catch (err) {
      console.error('Failed to load issue remediation details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleTransitionStatus = async (newStatus: IssueStatus) => {
    if (!id) return;
    try {
      setIsUpdating(true);
      const commentText = newComment.trim() || `Status updated to ${newStatus}`;
      const result = await api.updateIssueStatus(id, {
        status: newStatus,
        assigned_to: selectedAssignee || undefined,
        comment: commentText,
      });

      setNewComment('');
      fetchDetail();
    } catch (err: any) {
      alert(`Update failed: ${err?.message || 'Check permissions'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignPersonnel = async () => {
    if (!id || !issue) return;
    try {
      setIsUpdating(true);
      await api.updateIssueStatus(id, {
        status: issue.status === 'NEW' ? 'ASSIGNED' : issue.status,
        assigned_to: selectedAssignee,
        comment: `Work order dispatched and assigned to facility staff.`,
      });
      fetchDetail();
    } catch (err: any) {
      alert(`Assignment failed: ${err?.message || 'Check permissions'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading issue remediation file...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Issue File Not Found</h2>
        <Link
          to="/issues"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues Board</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Navigation */}
      <Link
        to="/issues"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Issues Lifecycle Board</span>
      </Link>

      {/* Primary Issue Header Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={issue.severity} />
              <CategoryBadge category={issue.category} />
              <IssueStatusBadge status={issue.status} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
              {issue.title}
            </h1>

            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{issue.area?.name || 'Area node'}</span>
              <span className="text-slate-600">&bull;</span>
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Created {new Date(issue.created_at).toLocaleString()}</span>
            </p>
          </div>

          {issue.inspection && (
            <Link
              to={`/inspections/${issue.inspection.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 flex items-center gap-1.5"
            >
              <span>View Parent Inspection</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            </Link>
          )}
        </div>

        {/* Issue Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <p className="text-xs font-bold text-teal-400 uppercase tracking-wide">
              Visual Risk Evidence
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {issue.visual_evidence || issue.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              Actionable Remediation Prescription
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {issue.recommended_action}
            </p>
          </div>
        </div>
      </div>

      {/* Lifecycle Progression Tracker */}
      <IssueStatusTracker
        currentStatus={issue.status}
        userRole={role}
        onTransitionStatus={handleTransitionStatus}
        isUpdating={isUpdating}
      />

      {/* Assignment & Comment Action Form */}
      {['SAFETY_OFFICER', 'FACILITY_MANAGER', 'ADMIN'].includes(role) && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold font-display text-white">
            Remediation Dispatch &amp; Work Order Notes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Assignee Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                Assign Personnel
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} ({u.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignPersonnel}
                  disabled={isUpdating}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white shrink-0"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Comment Form */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Add Remediation Log Comment
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Work order completed, verified exit door clearance..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
                />
                <button
                  onClick={() => handleTransitionStatus(issue.status)}
                  disabled={!newComment.trim() || isUpdating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Timeline History */}
      <AuditTimeline logs={auditLogs} />
    </div>
  );
};
