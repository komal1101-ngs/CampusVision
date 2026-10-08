import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Building, Issue } from '../../shared/types';
import { CampusMapOverview } from '../components/dashboard/CampusMapOverview';
import { MapPin, RefreshCw } from 'lucide-react';

export const CampusMapPage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([api.getHierarchy(), api.getIssues()])
      .then(([hierarchy, issuesData]) => {
        setBuildings(hierarchy[0]?.buildings || []);
        setIssues(issuesData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
        <p className="text-sm text-slate-400">Loading campus spatial GIS map...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <MapPin className="w-6 h-6 text-teal-400" />
          Campus GIS Spatial Intelligence Layer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Geographic map layer displaying campus building footprints and outdoor hazard pins.
        </p>
      </div>

      <CampusMapOverview buildings={buildings} issues={issues} />
    </div>
  );
};
