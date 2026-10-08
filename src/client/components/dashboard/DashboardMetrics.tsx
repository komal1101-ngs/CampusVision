import React from 'react';
import { DashboardStats } from '../../../shared/types';
import {
  ClipboardCheck,
  AlertOctagon,
  CheckCircle2,
  Timer,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

interface DashboardMetricsProps {
  stats: DashboardStats;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ stats }) => {
  const metricCards = [
    {
      title: 'Total Audits Conducted',
      value: stats.totalInspections,
      change: '+18% vs last month',
      icon: ClipboardCheck,
      color: 'teal',
      bgGlow: 'from-teal-500/20 to-teal-500/5',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400',
    },
    {
      title: 'Active High / Critical Risks',
      value: stats.criticalHazardsCount,
      change: stats.criticalHazardsCount > 0 ? 'Requires immediate action' : 'Zero active criticals',
      icon: AlertOctagon,
      color: 'red',
      bgGlow: 'from-red-500/20 to-red-500/5',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
    },
    {
      title: 'Resolved Compliance Rate',
      value: `${stats.resolvedIssuesPercentage}%`,
      change: `${stats.totalIssues - stats.openIssuesCount} issues mitigated`,
      icon: CheckCircle2,
      color: 'emerald',
      bgGlow: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Avg. Remediation Time',
      value: `${stats.avgRemediationDays} Days`,
      change: '48hr SLA target met',
      icon: Timer,
      color: 'sky',
      bgGlow: 'from-sky-500/20 to-sky-500/5',
      borderColor: 'border-sky-500/30',
      iconColor: 'text-sky-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`glass-card rounded-2xl p-5 border ${card.borderColor} bg-gradient-to-br ${card.bgGlow} relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <p className="text-3xl font-extrabold font-display text-white mt-1.5 tracking-tight">
                  {card.value}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 shadow-inner">
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">{card.change}</span>
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
