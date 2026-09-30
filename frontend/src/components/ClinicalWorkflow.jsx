import React from 'react';
import { Database, Cpu, Eye, Sliders, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: Database,
    title: 'Multimodal Clinical Intake',
    subtitle: 'Labs, ECG & Echocardiogram',
    desc: 'Ingests standard hospital data without requiring invasive catheterization: 12-lead ECG waveforms, Echo Regional Wall Motion Abnormalities (RWMA), and lipid biomarker panels.',
    badge: 'Non-Invasive Input',
    badgeColor: 'text-cyan-400 bg-cyan-950/70 border-cyan-800',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Anti-Leakage AI Ensemble',
    subtitle: 'XGBoost + LightGBM + SHAP',
    desc: 'Calibrated soft-voting classifiers evaluate multi-vessel CAD risk and individual LAD, LCX, and RCA stenosis status with SHAP local feature attribution in under 30 milliseconds.',
    badge: '0.912 ROC-AUC',
    badgeColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-800',
  },
  {
    step: '03',
    icon: Eye,
    title: '3D Spatial Heart Twin',
    subtitle: 'Anatomical Coronary Mapping',
    desc: 'Translates abstract numbers into spatial anatomical intuition. Coronary vessels pulse in real-time with physiological systolic/diastolic motion and color-coded stenosis alerts.',
    badge: '3D WebGL / R3F',
    badgeColor: 'text-red-400 bg-red-950/70 border-red-800',
  },
  {
    step: '04',
    icon: Sliders,
    title: 'Interactive "What-If" Engine',
    subtitle: 'Treatment & Habit Simulator',
    desc: 'Clinicians adjust pharmacotherapy; patients simulate daily walking and dietary changes. The 3D heart dynamically cools from high-risk crimson to healthy emerald in real time.',
    badge: 'Real-Time Dynamic',
    badgeColor: 'text-amber-400 bg-amber-950/70 border-amber-800',
  },
];

export default function ClinicalWorkflow() {
  return (
    <section id="clinical-workflow" className="py-20 bg-slate-950 border-t border-slate-900 relative">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 font-mono text-xs font-semibold uppercase">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>How CardioVision 3D Works</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
            From Raw Medical Records to a <span className="text-gradient-vital">Living Digital Twin</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A seamless bridge between complex clinical diagnostics and intuitive visual understanding for clinicians and patients alike.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKFLOW_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel relative group hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-red-500/80 transition-colors">
                      {step.step}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${step.badgeColor}`}>
                      {step.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 group-hover:border-red-500/50 group-hover:text-red-400 transition-colors mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold font-display text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400 mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                  <span>Verified Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
