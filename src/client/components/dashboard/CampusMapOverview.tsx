import React, { useState } from 'react';
import { Building, Issue } from '../../../shared/types';
import { SeverityBadge, IssueStatusBadge } from '../common/StatusBadge';
import {
  MapPin,
  Building2,
  Navigation,
  Layers,
  Info,
  X,
  AlertTriangle,
  Compass,
  Maximize2,
} from 'lucide-react';

interface CampusMapOverviewProps {
  buildings: Building[];
  issues?: Issue[];
}

export const CampusMapOverview: React.FC<CampusMapOverviewProps> = ({
  buildings,
  issues = [],
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(buildings[0] || null);

  // Simulated outdoor campus pins for GMRIT
  const outdoorHazardPins = [
    {
      id: 'pin-1',
      title: 'Main Block to SAC Main Pathway',
      type: 'SAFETY',
      status: 'CRITICAL',
      coords: { x: '45%', y: '48%' },
      notes: 'Emergency pathway lighting check and night audit inspection point.',
    },
    {
      id: 'pin-2',
      title: 'CMB Accessible East Ramp Approach',
      type: 'ACCESSIBILITY',
      status: 'HIGH',
      coords: { x: '72%', y: '42%' },
      notes: 'Tactile paving warning indicator and wheelchair ramp clearance zone.',
    },
    {
      id: 'pin-3',
      title: 'EEE High Voltage Bay Exterior Perimeter',
      type: 'INFRASTRUCTURE',
      status: 'LOW',
      coords: { x: '30%', y: '78%' },
      notes: 'Substation enclosure fence and danger sign compliance verified.',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-400" />
            Campus GIS Spatial Intelligence Layer
          </h3>
          <p className="text-xs text-slate-400">
            Geographic footprint of campus buildings and outdoor safety points of interest.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Critical / High Hazard
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Audited Safe
          </span>
        </div>
      </div>

      {/* Map Canvas / Simulated GIS Layer */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0a0f1d] h-[440px] shadow-2xl">
        {/* Subtle SVG Grid Map Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Campus Outline Illustration */}
        <div className="absolute inset-8 border border-slate-800/80 rounded-3xl pointer-events-none bg-slate-900/10"></div>

        {/* Building Polygons / Markers */}
        {buildings.map((b, idx) => {
          const isSelected = selectedBuilding?.id === b.id;
          const positions = [
            { top: '28%', left: '26%' }, // Main Block
            { top: '32%', left: '74%' }, // Civil & Mechanical Block
            { top: '68%', left: '30%' }, // Electrical & Electronics Block
            { top: '72%', left: '72%' }, // SAC & Canteen
          ];
          const pos = positions[idx] || { top: `${30 + idx * 15}%`, left: `${25 + idx * 20}%` };

          return (
            <button
              key={b.id}
              onClick={() => setSelectedBuilding(b)}
              style={pos}
              className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all duration-300 text-left ${
                isSelected
                  ? 'bg-teal-950/90 border-2 border-teal-400 shadow-xl shadow-teal-500/20 scale-105 z-20'
                  : 'bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-teal-500/50 z-10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Building2 className={`w-4 h-4 ${isSelected ? 'text-teal-300' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-white whitespace-nowrap">{b.name}</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {b.floors?.length || 2} Floors &bull; {b.code}
              </p>
            </button>
          );
        })}

        {/* Outdoor Hazard Pins */}
        {outdoorHazardPins.map((pin) => (
          <div
            key={pin.id}
            style={{ left: pin.coords.x, top: pin.coords.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
          >
            <div className="relative">
              <span
                className={`flex h-4 w-4 rounded-full ${
                  pin.status === 'CRITICAL' ? 'bg-red-500' : pin.status === 'HIGH' ? 'bg-orange-500' : 'bg-emerald-500'
                } shadow-md`}
              >
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                    pin.status === 'CRITICAL' ? 'bg-red-400 opacity-75' : 'bg-orange-400 opacity-50'
                  }`}
                ></span>
              </span>

              {/* Hover Tooltip */}
              <div className="absolute left-6 -top-2 w-56 p-2.5 rounded-xl bg-slate-950/95 border border-slate-700 text-xs shadow-2xl hidden group-hover:block pointer-events-none z-30">
                <p className="font-bold text-white">{pin.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">{pin.notes}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Map Legend & HUD Overlay */}
        <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 space-y-1 z-20">
          <p className="font-bold text-white">GMRIT Rajam Coordinates</p>
          <p className="text-slate-400 font-mono">18.4674° N, 83.6603° E</p>
          <p className="text-[10px] text-teal-400">Rajam, Vizianagaram, Andhra Pradesh</p>
        </div>

        {/* Selected Building Detail Drawer */}
        {selectedBuilding && (
          <div className="absolute top-4 right-4 w-72 p-4 rounded-xl bg-slate-950/95 backdrop-blur-md border border-slate-700/90 shadow-2xl z-20 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400">
                  Facility Node
                </span>
                <h4 className="text-sm font-bold text-white">{selectedBuilding.name}</h4>
              </div>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1.5 text-slate-300 border-t border-slate-800/80 pt-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Building Code:</span>
                <span className="font-mono text-teal-300">{selectedBuilding.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Floors Configured:</span>
                <span>{selectedBuilding.floors?.length || 2} Levels</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Compliance Audit:</span>
                <span className="text-emerald-400 font-semibold">Active Monitoring</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
