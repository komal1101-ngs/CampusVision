import React, { useState } from 'react';
import { useLocations } from '../hooks/useLocations';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  FolderTree,
  Plus,
  Building2,
  Layers,
  MapPin,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export const AdminLocations: React.FC = () => {
  const { role } = useAuth();
  const { campuses, loading, refreshLocations } = useLocations();

  const [activeTab, setActiveTab] = useState<'building' | 'floor' | 'area'>('building');

  // Form states
  const [buildingName, setBuildingName] = useState('');
  const [buildingCode, setBuildingCode] = useState('');
  const [floorLevel, setFloorLevel] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [areaName, setAreaName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const campus = campuses[0];
  const buildings = campus?.buildings || [];
  const floors = buildings.flatMap((b) => b.floors || []);

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campus || !buildingName || !buildingCode) return;
    try {
      setSubmitting(true);
      await api.createBuilding({
        campusId: campus.id,
        name: buildingName,
        code: buildingCode,
      });
      setStatusMessage(`Building "${buildingName}" created successfully.`);
      setBuildingName('');
      setBuildingCode('');
      refreshLocations();
    } catch (err: any) {
      alert(err?.message || 'Failed to create building');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddFloor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuildingId || !floorLevel) return;
    try {
      setSubmitting(true);
      await api.createFloor({
        buildingId: selectedBuildingId,
        level: floorLevel,
      });
      setStatusMessage(`Floor "${floorLevel}" added successfully.`);
      setFloorLevel('');
      refreshLocations();
    } catch (err: any) {
      alert(err?.message || 'Failed to create floor');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFloorId || !areaName) return;
    try {
      setSubmitting(true);
      await api.createArea({
        floorId: selectedFloorId,
        name: areaName,
        roomNumber: roomNumber || undefined,
      });
      setStatusMessage(`Area / Room "${areaName}" created successfully.`);
      setAreaName('');
      setRoomNumber('');
      refreshLocations();
    } catch (err: any) {
      alert(err?.message || 'Failed to create area');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-teal-400" />
          Campus Location Hierarchy Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage nested 4-tier spatial nodes (Campus &rarr; Buildings &rarr; Floors &rarr; Areas) consumed by the multimodal AI inspection flow.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-xs text-teal-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid: Add Node Card + Tree View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creator Forms */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex border-b border-slate-800 pb-3 gap-2">
            <button
              onClick={() => setActiveTab('building')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'building' ? 'bg-teal-600 text-white' : 'text-slate-400'
              }`}
            >
              + Building
            </button>
            <button
              onClick={() => setActiveTab('floor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'floor' ? 'bg-teal-600 text-white' : 'text-slate-400'
              }`}
            >
              + Floor
            </button>
            <button
              onClick={() => setActiveTab('area')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'area' ? 'bg-teal-600 text-white' : 'text-slate-400'
              }`}
            >
              + Area/Room
            </button>
          </div>

          {activeTab === 'building' && (
            <form onSubmit={handleAddBuilding} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Building Name</label>
                <input
                  type="text"
                  placeholder="e.g. Media Arts Complex"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Building Code</label>
                <input
                  type="text"
                  placeholder="e.g. ARTS-BLD"
                  value={buildingCode}
                  onChange={(e) => setBuildingCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white mt-2"
              >
                Add Building Node
              </button>
            </form>
          )}

          {activeTab === 'floor' && (
            <form onSubmit={handleAddFloor} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Building</label>
                <select
                  value={selectedBuildingId}
                  onChange={(e) => setSelectedBuildingId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200"
                >
                  <option value="">Choose Building...</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Floor Level</label>
                <input
                  type="text"
                  placeholder="e.g. 3rd Floor / Mezzanine"
                  value={floorLevel}
                  onChange={(e) => setFloorLevel(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white mt-2"
              >
                Add Floor Level
              </button>
            </form>
          )}

          {activeTab === 'area' && (
            <form onSubmit={handleAddArea} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select Floor Level</label>
                <select
                  value={selectedFloorId}
                  onChange={(e) => setSelectedFloorId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-200"
                >
                  <option value="">Choose Floor...</option>
                  {floors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Area / Space Name</label>
                <input
                  type="text"
                  placeholder="e.g. West Fire Exit Egress"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Room Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. RM-305"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input bg-slate-900 border border-slate-700 text-slate-200"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white mt-2"
              >
                Add Area Node
              </button>
            </form>
          )}
        </div>

        {/* Existing Spatial Tree Viewer */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold font-display text-white">
              Active Campus Tree ({campus?.name || 'Institution'})
            </h3>
            <button
              onClick={refreshLocations}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading tree...</div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {buildings.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <span>{b.name}</span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {b.code}
                    </span>
                  </div>

                  <div className="pl-6 space-y-2 border-l border-slate-800">
                    {b.floors?.map((f) => (
                      <div key={f.id} className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{f.level}</span>
                        </div>

                        <div className="pl-6 flex flex-wrap gap-2">
                          {f.areas?.map((a) => (
                            <span
                              key={a.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-950 border border-slate-800 text-slate-300"
                            >
                              <MapPin className="w-3 h-3 text-teal-400" />
                              <span>{a.name}</span>
                              {a.room_number && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ({a.room_number})
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
