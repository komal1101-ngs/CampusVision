import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Issue, IssueStatus } from '../../shared/types';
import { useAuth } from '../hooks/useAuth';
import { SeverityBadge, CategoryBadge, IssueStatusBadge } from '../components/common/StatusBadge';
import {
  AlertOctagon,
  Filter,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Kanban,
  List,
} from 'lucide-react';

export const IssuesBoard: React.FC = () => {
  const { role } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const data = await api.getIssues();
      setIssues(data);
    } catch (err) {
      console.error('Failed to load issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleQuickTransition = async (issueId: string, targetStatus: IssueStatus) => {
    try {
      await api.updateIssueStatus(issueId, { status: targetStatus });
      fetchIssues();
    } catch (err: any) {
      alert(`Status update failed: ${err?.message || 'Check role permissions'}`);
    }
  };

  const filteredIssues = issues.filter((iss) => {
    if (filterSeverity !== 'ALL' && iss.severity !== filterSeverity) return false;
    if (filterCategory !== 'ALL' && iss.category !== filterCategory) return false;
    return true;
  });

  const columns: { status: IssueStatus; title: string; color: string }[] = [
    { status: 'NEW', title: 'New Discovery', color: 'border-rose-500/40 text-rose-300' },
    { status: 'REVIEWED', title: 'Triage Reviewed', color: 'border-indigo-500/40 text-indigo-300' },
    { status: 'ASSIGNED', title: 'Assigned Personnel', color: 'border-blue-500/40 text-blue-300' },
    { status: 'IN_PROGRESS', title: 'In Remediation', color: 'border-amber-500/40 text-amber-300' },
    { status: 'RESOLVED', title: 'Resolved Hazard', color: 'border-emerald-500/40 text-emerald-300' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-teal-400" />
            Remediation Lifecycle Board
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and progress safety, accessibility, and infrastructure work orders across campus facilities.
          </p>
        </div>

        {/* View Switcher & Refresh */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
          </div>

          <button
            onClick={fetchIssues}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            title="Refresh Issues"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-2xl glass-panel border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Filter className="w-3.5 h-3.5 text-teal-400" />
          <span>Filters:</span>
        </div>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200"
        >
          <option value="ALL">All Domains</option>
          <option value="SAFETY">Safety</option>
          <option value="ACCESSIBILITY">Accessibility</option>
          <option value="INFRASTRUCTURE">Infrastructure</option>
          <option value="CROWD_OPERATIONAL">Crowd &amp; Ops</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
          Loading remediation lifecycle data...
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colIssues = filteredIssues.filter((i) => i.status === col.status);
            return (
              <div
                key={col.status}
                className="glass-panel rounded-2xl p-4 border border-slate-800/90 flex flex-col justify-between min-w-[220px]"
              >
                <div className="space-y-3">
                  <div className={`flex items-center justify-between border-b pb-2 ${col.color}`}>
                    <h3 className="text-xs font-bold uppercase tracking-wider">{col.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-900 border border-slate-800">
                      {colIssues.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colIssues.length === 0 ? (
                      <div className="p-4 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-500">
                        No issues in this stage
                      </div>
                    ) : (
                      colIssues.map((issue) => (
                        <div
                          key={issue.id}
                          className="glass-card rounded-xl p-3.5 border border-slate-800 hover:border-teal-500/40 transition-all space-y-2 group"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <SeverityBadge severity={issue.severity} />
                            <CategoryBadge category={issue.category} />
                          </div>

                          <Link
                            to={`/issues/${issue.id}`}
                            className="block font-bold text-xs text-white group-hover:text-teal-300 transition-colors line-clamp-2"
                          >
                            {issue.title}
                          </Link>

                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {issue.recommended_action}
                          </p>

                          {/* Quick advance button */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                            <Link
                              to={`/issues/${issue.id}`}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              Details <ChevronRight className="w-3 h-3" />
                            </Link>

                            {col.status !== 'RESOLVED' && (
                              <button
                                onClick={() => {
                                  const nextMap: Record<IssueStatus, IssueStatus> = {
                                    NEW: 'REVIEWED',
                                    REVIEWED: 'IN_PROGRESS',
                                    ASSIGNED: 'IN_PROGRESS',
                                    IN_PROGRESS: 'RESOLVED',
                                    RESOLVED: 'CLOSED',
                                    CLOSED: 'NEW',
                                  };
                                  handleQuickTransition(issue.id, nextMap[col.status]);
                                }}
                                className="text-[10px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-0.5"
                              >
                                Advance <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 rounded-xl glass-card border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={issue.severity} />
                  <CategoryBadge category={issue.category} />
                  <IssueStatusBadge status={issue.status} />
                </div>
                <h3 className="text-sm font-bold text-white">{issue.title}</h3>
                <p className="text-xs text-slate-300">{issue.recommended_action}</p>
              </div>

              <Link
                to={`/issues/${issue.id}`}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2"
              >
                <span>Remediate</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
