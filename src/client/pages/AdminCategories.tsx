import React from 'react';
import {
  Sliders,
  Flame,
  Accessibility,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const categories = [
    {
      id: 'SAFETY',
      name: 'Safety & Emergency Egress',
      icon: Flame,
      color: 'text-red-400 border-red-500/30 bg-red-950/40',
      description: 'Critical hazards impacting life safety and emergency response.',
      rules: [
        'Blocked emergency exits & fire doors (Zero tolerance - HIGH/CRITICAL)',
        'Blocked fire extinguishers / hose stations (Immediate clearance SLA)',
        'Exposed or unsafe electrical wiring / junction boxes',
        'Wet, oily, or slippery floor conditions without warning signage',
        'Dangerous obstacles in primary egress corridors (<44in clearance)',
        'Unsafe chemical or flammable storage outside containment',
      ],
    },
    {
      id: 'ACCESSIBILITY',
      name: 'ADA & Universal Accessibility',
      icon: Accessibility,
      color: 'text-sky-400 border-sky-500/30 bg-sky-950/40',
      description: 'Compliance with Title II/III ADA regulations and campus barrier removal.',
      rules: [
        'Blocked wheelchair ramps or automatic door buttons',
        'Obstructed accessible entrances and elevators',
        'Obstacles inside designated accessible restroom corridors',
        'Missing or obscured ADA / accessibility directional signage',
        'Curb cut obstructions & tactile paving encroachment',
      ],
    },
    {
      id: 'INFRASTRUCTURE',
      name: 'Physical Infrastructure & Structural',
      icon: Building2,
      color: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
      description: 'Architectural wear, water intrusions, and structural envelope defects.',
      rules: [
        'Damaged/broken ceiling tiles, walls, or flooring',
        'Damaged doors, locks, or shattered glass windows',
        'Visible water leaks, active drips, or structural moisture stains',
        'Deteriorated stair treads or loose handrails',
        'Exterior facade cracks and drainage blockages',
      ],
    },
    {
      id: 'CROWD_OPERATIONAL',
      name: 'Crowd Flow & Operations',
      icon: Users,
      color: 'text-teal-400 border-teal-500/30 bg-teal-950/40',
      description: 'Transit bottlenecks, congregation chokepoints, and operational flow.',
      rules: [
        'Overcrowded hallway choke points during peak transit',
        'Congested egress/ingress gates during campus events',
        'Unplanned queue lines blocking emergency travel routes',
        'Unauthorized vendor or club tabling restricting walking corridors',
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-teal-400" />
          Detection Domains &amp; Compliance Thresholds
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configured domain taxonomies evaluated by the Gemini Visual Intelligence reasoning engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">{cat.name}</h3>
                  <p className="text-[11px] text-slate-400">{cat.description}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <p className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  Active Automated Inspection Rules:
                </p>
                <ul className="space-y-1.5">
                  {cat.rules.map((rule, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
