import React from 'react';
import { Inspection } from '../../../shared/types';
import { OverallStatusBadge } from '../common/StatusBadge';
import {
  Building2,
  Calendar,
  User,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface InspectionResultCardProps {
  inspection: Inspection;
}

export const InspectionResultCard: React.FC<InspectionResultCardProps> = ({ inspection }) => {
  const issuesCount = inspection.issues?.length || 0;
  const criticalCount =
    inspection.issues?.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length || 0;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <OverallStatusBadge status={inspection.overall_status} />
            {criticalCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                {criticalCount} Urgent / High Risk
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            {inspection.area?.name || 'Campus Inspection Area'}
          </h2>
          <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>
              {inspection.building?.name} &bull; {inspection.floor?.level}
            </span>
          </p>
        </div>

        {/* Metadata pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(inspection.created_at).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 font-medium">{inspection.user?.full_name || 'Inspector'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Photo + AI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo View */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
          <img
            src={inspection.image_url}
            alt="Campus visual evidence"
            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span className="px-2 py-1 rounded bg-slate-900/90 backdrop-blur-md border border-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-teal-400" />
              {inspection.area?.name}
            </span>
            <a
              href={inspection.image_url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* AI Multimodal Assessment */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Gemini Vision Reasoning Assessment</span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              {inspection.inspection_summary}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Issues Discovered</p>
              <p className="text-2xl font-bold font-display text-white mt-0.5">
                {issuesCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Remediation Status</p>
              <p className="text-sm font-bold text-teal-300 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Triaged &amp; Logged
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
