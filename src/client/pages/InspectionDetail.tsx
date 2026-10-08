import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Inspection } from '../../shared/types';
import { InspectionResultCard } from '../components/inspection/InspectionResultCard';
import { IssueListTable } from '../components/inspection/IssueListTable';
import {
  ArrowLeft,
  RefreshCw,
  Code2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sparkles,
  Camera,
} from 'lucide-react';

export const InspectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getInspectionById(id);
        setInspection(data);
      } catch (err: any) {
        console.error('[InspectionDetail] Error:', err);
        setError(err?.message || 'Failed to load inspection record');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading comprehensive inspection dossier...</p>
      </div>
    );
  }

  if (error || !inspection) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Inspection Record Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'Unable to retrieve inspection data'}</p>
        <Link
          to="/inspections"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Inspection Logs</span>
        </Link>
      </div>
    );
  }

  const issues = inspection.issues || [];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Back navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/inspections"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Inspections</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/inspections/new"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Conduct New Inspection</span>
          </Link>
        </div>
      </div>

      {/* 1. Primary Inspection Result Dossier Card */}
      <InspectionResultCard inspection={inspection} />

      {/* 2. Detected Issues & Action Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Detected Hazards &amp; Non-Compliance Findings ({issues.length})
            </h3>
            <p className="text-xs text-slate-400">
              Each finding is verified by visual evidence and logged with specific remediation actions.
            </p>
          </div>
        </div>

        <IssueListTable issues={issues} showFilters={false} />
      </div>

      {/* 3. Raw Structured AI Payload Auditor Drawer */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <button
          onClick={() => setShowRawJson(!showRawJson)}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-slate-300 hover:bg-slate-900/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-teal-400" />
            <span>View Raw Gemini Multimodal Output &amp; Zod Schema Payloads</span>
          </div>
          {showRawJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRawJson && (
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <pre className="text-xs font-mono text-teal-300 overflow-x-auto p-4 rounded-xl bg-black/60 max-h-96">
              {JSON.stringify(inspection.raw_ai_response || inspection, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
