import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardStats, Campus } from '../../shared/types';
import { DashboardMetrics } from '../components/dashboard/DashboardMetrics';
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts';
import { CampusMapOverview } from '../components/dashboard/CampusMapOverview';
import { OverallStatusBadge, SeverityBadge, IssueStatusBadge } from '../components/common/StatusBadge';
import {
  Camera,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Building2,
  Calendar,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hierarchy, setHierarchy] = useState<Campus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, hierarchyData] = await Promise.all([
        api.getDashboardStats(),
        api.getHierarchy(),
      ]);
      setStats(statsData);
      setHierarchy(hierarchyData);
    } catch (err: any) {
      console.error('[Dashboard] Error:', err);
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading campus risk intelligence metrics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Dashboard Offline</h2>
        <p className="text-sm text-slate-400">{error || 'Unable to connect to service'}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const buildings = hierarchy[0]?.buildings || [];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden glass-panel border border-teal-500/20 bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Multimodal Hazard Sentinel Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              Campus Safety, Accessibility &amp; Infrastructure Intelligence
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Automated visual risk reasoning powered by Google Gemini 3.8. Inspect egress corridors, detect ADA compliance barriers, and track facility work orders in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/inspections/new"
              className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Launch AI Inspection</span>
            </Link>
            <button
              onClick={loadData}
              className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. KPI Top Metric Tiles */}
      <DashboardMetrics stats={stats} />

      {/* 2. Visual Analytics Breakdown Graphs */}
      <AnalyticsCharts stats={stats} />

      {/* 3. Campus GIS Spatial Map Layer */}
      <CampusMapOverview buildings={buildings} issues={stats.recentIssues} />

      {/* 4. Two-Column Activity & Recent Findings Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visual Audits */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-400" />
              Recent Campus Visual Audits
            </h3>
            <Link
              to="/inspections"
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentInspections.map((ins) => (
              <Link
                key={ins.id}
                to={`/inspections/${ins.id}`}
                className="p-3 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4 group block"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={ins.image_url}
                    alt="Thumbnail"
                    className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-teal-300 truncate">
                      {ins.area?.name || 'Inspection Area'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {ins.building?.name} &bull; {ins.floor?.level}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {new Date(ins.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <OverallStatusBadge status={ins.overall_status} />
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Priority Remediation Queue */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Priority Remediation Queue
            </h3>
            <Link
              to="/issues"
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              <span>Manage Lifecycle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentIssues.map((issue) => (
              <Link
                key={issue.id}
                to={`/issues/${issue.id}`}
                className="p-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-2 group block"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={issue.severity} />
                    <IssueStatusBadge status={issue.status} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {Math.round(issue.confidence_score * 100)}% Conf
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-teal-300">
                    {issue.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {issue.recommended_action}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
