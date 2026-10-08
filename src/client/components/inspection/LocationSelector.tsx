import React, { useState, useEffect } from 'react';
import { Campus, Building, Floor, Area } from '../../../shared/types';
import { Building2, Layers, MapPin, Compass, CheckCircle2 } from 'lucide-react';

interface LocationSelectorProps {
  campuses: Campus[];
  selectedCampusId: string;
  selectedBuildingId: string;
  selectedFloorId: string;
  selectedAreaId: string;
  onChange: (locations: {
    campusId: string;
    buildingId: string;
    floorId: string;
    areaId: string;
  }) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  campuses,
  selectedCampusId,
  selectedBuildingId,
  selectedFloorId,
  selectedAreaId,
  onChange,
}) => {
  // Cascading lists
  const currentCampus = campuses.find((c) => c.id === selectedCampusId) || campuses[0];
  const buildings = currentCampus?.buildings || [];
  const currentBuilding = buildings.find((b) => b.id === selectedBuildingId);
  const floors = currentBuilding?.floors || [];
  const currentFloor = floors.find((f) => f.id === selectedFloorId);
  const areas = currentFloor?.areas || [];

  // Auto-select first items if not selected
  useEffect(() => {
    if (campuses.length > 0 && !selectedCampusId) {
      const defaultCampus = campuses[0];
      const defaultBuilding = defaultCampus.buildings?.[0];
      const defaultFloor = defaultBuilding?.floors?.[0];
      const defaultArea = defaultFloor?.areas?.[0];

      onChange({
        campusId: defaultCampus.id,
        buildingId: defaultBuilding?.id || '',
        floorId: defaultFloor?.id || '',
        areaId: defaultArea?.id || '',
      });
    }
  }, [campuses, selectedCampusId, onChange]);

  const handleCampusChange = (cId: string) => {
    const campus = campuses.find((c) => c.id === cId);
    const bId = campus?.buildings?.[0]?.id || '';
    const fId = campus?.buildings?.[0]?.floors?.[0]?.id || '';
    const aId = campus?.buildings?.[0]?.floors?.[0]?.areas?.[0]?.id || '';
    onChange({ campusId: cId, buildingId: bId, floorId: fId, areaId: aId });
  };

  const handleBuildingChange = (bId: string) => {
    const building = buildings.find((b) => b.id === bId);
    const fId = building?.floors?.[0]?.id || '';
    const aId = building?.floors?.[0]?.areas?.[0]?.id || '';
    onChange({ campusId: selectedCampusId, buildingId: bId, floorId: fId, areaId: aId });
  };

  const handleFloorChange = (fId: string) => {
    const floor = floors.find((f) => f.id === fId);
    const aId = floor?.areas?.[0]?.id || '';
    onChange({
      campusId: selectedCampusId,
      buildingId: selectedBuildingId,
      floorId: fId,
      areaId: aId,
    });
  };

  const handleAreaChange = (aId: string) => {
    onChange({
      campusId: selectedCampusId,
      buildingId: selectedBuildingId,
      floorId: selectedFloorId,
      areaId: aId,
    });
  };

  return (
    <div className="space-y-4">
      {/* Visual Hierarchy Breadcrumb */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-300">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-teal-400" />
          Location Node:
        </span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-medium border border-slate-700">
          {currentCampus?.name || 'Select Campus'}
        </span>
        <span className="text-slate-600 font-bold">&gt;</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-medium border border-slate-700">
          {currentBuilding?.name || 'Select Building'}
        </span>
        <span className="text-slate-600 font-bold">&gt;</span>
        <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 font-medium border border-slate-700">
          {currentFloor?.level || 'Select Floor'}
        </span>
        <span className="text-slate-600 font-bold">&gt;</span>
        <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-200 font-semibold border border-teal-500/40">
          {areas.find((a) => a.id === selectedAreaId)?.name || 'Select Area / Room'}
        </span>
      </div>

      {/* Cascading 4-Tier Select Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tier 1: Campus */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            1. Campus Institution
          </label>
          <select
            id="select-campus"
            value={selectedCampusId}
            onChange={(e) => handleCampusChange(e.target.value)}
            className="w-full rounded-xl glass-input px-3 py-2.5 text-sm bg-slate-900 border border-slate-700 focus:border-teal-500 transition-colors"
          >
            {campuses.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Tier 2: Building */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            2. Campus Building
          </label>
          <select
            id="select-building"
            value={selectedBuildingId}
            onChange={(e) => handleBuildingChange(e.target.value)}
            disabled={buildings.length === 0}
            className="w-full rounded-xl glass-input px-3 py-2.5 text-sm bg-slate-900 border border-slate-700 focus:border-teal-500 transition-colors disabled:opacity-50"
          >
            {buildings.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tier 3: Floor */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            3. Floor / Level
          </label>
          <select
            id="select-floor"
            value={selectedFloorId}
            onChange={(e) => handleFloorChange(e.target.value)}
            disabled={floors.length === 0}
            className="w-full rounded-xl glass-input px-3 py-2.5 text-sm bg-slate-900 border border-slate-700 focus:border-teal-500 transition-colors disabled:opacity-50"
          >
            {floors.map((f) => (
              <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                {f.level}
              </option>
            ))}
          </select>
        </div>

        {/* Tier 4: Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            4. Area / Room / Corridor
          </label>
          <select
            id="select-area"
            value={selectedAreaId}
            onChange={(e) => handleAreaChange(e.target.value)}
            disabled={areas.length === 0}
            className="w-full rounded-xl glass-input px-3 py-2.5 text-sm bg-slate-900 border border-slate-700 focus:border-teal-500 transition-colors disabled:opacity-50"
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                {a.name} {a.room_number ? `(${a.room_number})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
