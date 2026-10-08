import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { DashboardStats } from '../../../shared/types';
import { BarChart3, PieChart as PieIcon, Building } from 'lucide-react';

interface AnalyticsChartsProps {
  stats: DashboardStats;
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

const CATEGORY_COLORS = ['#ef4444', '#0284c7', '#a855f7', '#14b8a6'];

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ stats }) => {
  // 1. Severity Data
  const severityData = [
    { name: 'Low', count: stats.severityBreakdown.LOW, color: SEVERITY_COLORS.LOW },
    { name: 'Medium', count: stats.severityBreakdown.MEDIUM, color: SEVERITY_COLORS.MEDIUM },
    { name: 'High', count: stats.severityBreakdown.HIGH, color: SEVERITY_COLORS.HIGH },
    { name: 'Critical', count: stats.severityBreakdown.CRITICAL, color: SEVERITY_COLORS.CRITICAL },
  ];

  // 2. Category Data
  const categoryData = [
    { name: 'Safety Hazards', value: stats.categoryBreakdown.SAFETY },
    { name: 'ADA Accessibility', value: stats.categoryBreakdown.ACCESSIBILITY },
    { name: 'Infrastructure Damage', value: stats.categoryBreakdown.INFRASTRUCTURE },
    { name: 'Crowd & Operations', value: stats.categoryBreakdown.CROWD_OPERATIONAL },
  ];

  // 3. Building Breakdown Data
  const buildingData = stats.buildingBreakdown.map((b) => ({
    name: b.buildingName.replace('Engineering & Technology Hall', 'Eng Hall').replace('Science & Innovation Complex', 'Sci Complex'),
    Low: b.low,
    Medium: b.medium,
    High: b.high,
    Critical: b.critical,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Severity Bar Chart */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white font-display">
            Hazards by Risk Severity
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Category Distribution Pie */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white font-display">
            Inspection Domain Breakdown
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Facility Building Stacked Chart */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <Building className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white font-display">
            Facility Risk by Building
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buildingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="Low" stackId="a" fill="#10b981" />
              <Bar dataKey="Medium" stackId="a" fill="#f59e0b" />
              <Bar dataKey="High" stackId="a" fill="#f97316" />
              <Bar dataKey="Critical" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
