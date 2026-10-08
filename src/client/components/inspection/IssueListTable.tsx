import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Issue, UserProfile } from '../../../shared/types';
import { SeverityBadge, IssueStatusBadge, CategoryBadge } from '../common/StatusBadge';
import {
  ExternalLink,
  ChevronRight,
  UserCheck,
  Percent,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';

interface IssueListTableProps {
  issues: Issue[];
  users?: UserProfile[];
  onStatusUpdate?: (issueId: string, newStatus: string, assignedTo?: string) => Promise<void>;
  showFilters?: boolean;
}

export const IssueListTable: React.FC<IssueListTableProps> = ({
  issues,
  users = [],
  onStatusUpdate,
  showFilters = true,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredIssues = issues.filter((issue) => {
    if (filterSeverity !== 'ALL' && issue.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && issue.status !== filterStatus) return false;
    if (filterCategory !== 'ALL' && issue.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Optional Filter Controls */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl glass-panel border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Filter Findings:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-700 text-slate-200"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-700 text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-700 text-slate-200"
            >
              <option value="ALL">All Domains</option>
              <option value="SAFETY">Safety</option>
              <option value="ACCESSIBILITY">Accessibility</option>
              <option value="INFRASTRUCTURE">Infrastructure</option>
              <option value="CROWD_OPERATIONAL">Crowd &amp; Ops</option>
            </select>
          </div>
        </div>
      )}

      {/* Issues Cards Grid / Table */}
      {filteredIssues.length === 0 ? (
        <div className="p-8 text-center rounded-2xl glass-panel border border-slate-800 text-slate-400">
          <p className="text-sm font-medium">No hazard findings match the selected criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="glass-card rounded-xl p-5 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={issue.severity} />
                  <CategoryBadge category={issue.category} />
                  <IssueStatusBadge status={issue.status} />
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    <Percent className="w-3 h-3 text-teal-400" />
                    {Math.round(issue.confidence_score * 100)}% AI Confidence
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/60 text-xs">
                  <span className="font-semibold text-teal-400 block mb-0.5">Recommended Remediation:</span>
                  <span className="text-slate-300">{issue.recommended_action}</span>
                </div>
              </div>

              {/* Actions & Detail Link */}
              <div className="flex flex-col sm:flex-row items-end md:items-center gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <Link
                  to={`/issues/${issue.id}`}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center gap-2 border border-slate-700/80 transition-all"
                >
                  <span>Remediate Issue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
