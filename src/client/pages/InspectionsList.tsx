import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Inspection } from '../../shared/types';
import { OverallStatusBadge } from '../components/common/StatusBadge';
import {
  ClipboardList,
  Search,
  Filter,
  Camera,
  RefreshCw,
  Building2,
  Calendar,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const InspectionsList: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const data = await api.getInspections();
      setInspections(data);
    } catch (err) {
      console.error('Failed to load inspections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const filtered = inspections.filter((ins) => {
    if (statusFilter !== 'ALL' && ins.overall_status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const areaMatch = ins.area?.name?.toLowerCase().includes(term);
      const bMatch = ins.building?.name?.toLowerCase().includes(term);
      const summaryMatch = ins.inspection_summary?.toLowerCase().includes(term);
      return areaMatch || bMatch || summaryMatch;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-teal-400" />
            Historical Campus Inspections
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit archive of AI-evaluated campus facilities and spatial risk evaluations.
          </p>
        </div>

        <Link
          to="/inspections/new"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2 shadow-md transition-all"
        >
          <Camera className="w-4 h-4" />
          <span>New Inspection</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by area, building, or hazard description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="SAFE">Safe Space</option>
            <option value="ISSUES_FOUND">Issues Found</option>
            <option value="REVIEW_REQUIRED">Review Required</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
          Loading inspection records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel border border-slate-800 text-slate-400">
          No inspections match your search filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ins) => (
            <Link
              key={ins.id}
              to={`/inspections/${ins.id}`}
              className="p-4 rounded-xl glass-card border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group block"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={ins.image_url}
                  alt="Audit thumb"
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                />

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <OverallStatusBadge status={ins.overall_status} />
                    <span className="text-xs text-slate-400">
                      {ins.issues?.length || 0} findings recorded
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 truncate">
                    {ins.area?.name || 'Inspection Area'}
                  </h3>

                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>
                      {ins.building?.name} &bull; {ins.floor?.level}
                    </span>
                    <span className="text-slate-600">&bull;</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(ins.created_at).toLocaleString()}</span>
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300 group-hover:text-teal-300 hidden sm:inline">
                  View Full Report
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
