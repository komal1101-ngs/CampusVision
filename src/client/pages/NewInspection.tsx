import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocations } from '../hooks/useLocations';
import { LocationSelector } from '../components/inspection/LocationSelector';
import { ImageCaptureUpload } from '../components/inspection/ImageCaptureUpload';
import { api } from '../services/api';
import {
  Camera,
  Compass,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const NewInspection: React.FC = () => {
  const navigate = useNavigate();
  const { campuses, loading: loadingLocations } = useLocations();

  const [selectedLocation, setSelectedLocation] = useState({
    campusId: '',
    buildingId: '',
    floorId: '',
    areaId: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLocationChange = (locs: {
    campusId: string;
    buildingId: string;
    floorId: string;
    areaId: string;
  }) => {
    setSelectedLocation(locs);
  };

  const handleImageSelected = (file: File, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setErrorMessage(null);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLocation.areaId) {
      setErrorMessage('Please complete all 4 location steps (Campus -> Building -> Floor -> Area).');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Please capture or upload an inspection photograph before analyzing.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setAnalysisStatus('1/3: Validating binary payload and optimizing file buffer...');

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('campus_id', selectedLocation.campusId);
      formData.append('building_id', selectedLocation.buildingId);
      formData.append('floor_id', selectedLocation.floorId);
      formData.append('area_id', selectedLocation.areaId);

      // Status updates
      setTimeout(() => {
        setAnalysisStatus('2/3: Invoking Google Gemini 3.8 Visual Intelligence model...');
      }, 900);

      setTimeout(() => {
        setAnalysisStatus('3/3: Evaluating spatial hazards and validating Zod schema...');
      }, 2200);

      const result = await api.analyzeInspection(formData);

      if (result.success && result.inspection) {
        navigate(`/inspections/${result.inspection.id}`);
      } else {
        throw new Error('Analysis completed with unexpected response structure.');
      }
    } catch (err: any) {
      console.error('[NewInspection] Submission error:', err);
      setErrorMessage(err?.message || 'Failed to analyze campus image. Please verify connection and retry.');
    } finally {
      setIsSubmitting(false);
      setAnalysisStatus('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          Server-Side Multimodal Reasoning
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
          New AI Campus Visual Inspection
        </h1>
        <p className="text-sm text-slate-300">
          Select the exact campus location node and upload visual evidence. The platform evaluates spatial relationships, distinguishes storage from egress hazards, and assigns actionable risk ratings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Location Hierarchy Engine */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-800 pb-3">
            <Compass className="w-5 h-5 text-teal-400" />
            <span>Step 1: Campus Spatial Location Metadata</span>
          </div>

          {loadingLocations ? (
            <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
              Loading campus location nodes...
            </div>
          ) : (
            <LocationSelector
              campuses={campuses}
              selectedCampusId={selectedLocation.campusId}
              selectedBuildingId={selectedLocation.buildingId}
              selectedFloorId={selectedLocation.floorId}
              selectedAreaId={selectedLocation.areaId}
              onChange={handleLocationChange}
            />
          )}
        </div>

        {/* Step 2: Image Pipeline (Upload or Camera) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base border-b border-slate-800 pb-3">
            <Camera className="w-5 h-5 text-teal-400" />
            <span>Step 2: Visual Evidence Capture &amp; Ingestion</span>
          </div>

          <ImageCaptureUpload
            onImageSelected={handleImageSelected}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onClear={handleClearImage}
          />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-200">Inspection Analysis Error</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Action Button & Processing Overlay */}
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white">Ready for Multimodal Evaluation</p>
            <p className="text-[11px] text-slate-400">
              Payload analyzed server-side with strict Zod schema validation.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !selectedFile || !selectedLocation.areaId}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Gemini AI Reasoning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Execute AI Hazard Inspection</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Live Processing Stepper Indicator */}
        {isSubmitting && (
          <div className="p-5 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-center space-y-2 animate-in fade-in">
            <div className="flex items-center justify-center gap-2 text-teal-300 text-sm font-semibold">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
              <span>{analysisStatus}</span>
            </div>
            <p className="text-xs text-slate-400">
              Analyzing object clearance, emergency egress paths, and accessibility compliance...
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
