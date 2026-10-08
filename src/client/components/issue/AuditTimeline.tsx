import React from 'react';
import { IssueAuditLog } from '../../../shared/types';
import { IssueStatusBadge } from '../common/StatusBadge';
import { History, User, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

interface AuditTimelineProps {
  logs: IssueAuditLog[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <History className="w-4 h-4 text-teal-400" />
        <h3 className="text-base font-bold font-display text-white">
          Remediation Audit Trail &amp; History
        </h3>
      </div>

      {logs.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500">
          No audit entries recorded yet.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-slate-950 shadow-sm shadow-teal-500/50"></div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {log.previous_status && (
                      <>
                        <IssueStatusBadge status={log.previous_status} />
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      </>
                    )}
                    <IssueStatusBadge status={log.new_status} />
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span className="font-semibold text-white">
                    {log.changer?.full_name || 'Authorized Personnel'}
                  </span>
                  {log.changer?.role && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      ({log.changer.role.replace('_', ' ')})
                    </span>
                  )}
                </div>

                {log.comment && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{log.comment}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
