import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Network, Layers, ShieldCheck, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    step: '01',
    phase: 'PHASE 01 // NON-INVASIVE PANEL',
    title: 'Standard Medical Tests Collected',
    subtitle: 'ECG, Ultrasound & Blood Work',
    desc: 'Uses the routine tests you already take at the clinic: ECG heart rhythm, echocardiogram ultrasound of heart muscle movement, and standard cholesterol blood panels. Zero needles or invasive catheters needed.',
    metric: 'Zero Catheters Needed',
    badgeColor: 'text-sky-600 border-sky-200 bg-sky-50/60',
    accentColor: '#0284c7',
    renderGraphic: () => (
      <div className="w-full h-24 rounded-xl bg-slate-950 p-2.5 flex flex-col justify-between overflow-hidden relative border border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-sky-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            LEAD II · V1–V6
          </span>
          <span className="text-slate-500">72 BPM</span>
        </div>
        {/* ECG Rhythm Waveform SVG */}
        <div className="relative w-full h-10 flex items-center">
          <svg viewBox="0 0 240 40" className="w-full h-full stroke-sky-400 fill-none" preserveAspectRatio="none">
            <path
              d="M0,20 L40,20 L48,15 L54,26 L62,4 L72,36 L78,18 L84,20 L130,20 L138,15 L144,26 L152,4 L162,36 L168,18 L174,20 L240,20"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>Non-Invasive Diagnostic Inputs</span>
          <span className="text-sky-400 font-semibold">100% Painless</span>
        </div>
      </div>
    ),
  },
  {
    step: '02',
    phase: 'PHASE 02 // NEURAL MULTI-VESSEL TRIAGE',
    title: 'AI Evaluates Each Artery',
    subtitle: 'Under 30 Milliseconds',
    desc: 'The trained clinical algorithm cross-references your test markers to determine the individual blood flow health of your front (LAD), side (LCX), and right (RCA) coronary arteries.',
    metric: '< 30ms Inference Latency',
    badgeColor: 'text-emerald-600 border-emerald-200 bg-emerald-50/60',
    accentColor: '#059669',
    renderGraphic: () => (
      <div className="w-full h-24 rounded-xl bg-slate-950 p-2.5 flex flex-col justify-between overflow-hidden relative border border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Network className="w-3 h-3" />
            3-VESSEL TENSOR
          </span>
          <span className="text-emerald-400 font-mono text-[9px] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/80">
            28 ms
          </span>
        </div>
        {/* 3 Artery Probability Bars */}
        <div className="space-y-1.5 my-auto">
          {[
            { name: 'LAD', val: 84, color: 'bg-rose-500' },
            { name: 'LCX', val: 73, color: 'bg-sky-400' },
            { name: 'RCA', val: 72, color: 'bg-amber-400' },
          ].map((v) => (
            <div key={v.name} className="flex items-center gap-2 text-[9px] font-mono">
              <span className="w-6 text-slate-400 font-bold">{v.name}</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${v.color} rounded-full`} style={{ width: `${v.val}%` }} />
              </div>
              <span className="w-6 text-right text-slate-300 font-semibold">{v.val}%</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>SHAP Feature Attribution</span>
          <span className="text-emerald-400 font-semibold">Calibrated</span>
        </div>
      </div>
    ),
  },
  {
    step: '03',
    phase: 'PHASE 03 // 3D HEMODYNAMIC TWIN',
    title: '3D Heart Twin Updates',
    subtitle: 'Clear Visual Color Coding',
    desc: 'Your personalized 3D heart shows how blood flows in real time: green where arteries are clear and unobstructed, amber for mild plaque, and red where narrowing needs clinical care.',
    metric: 'Real-Time Hemodynamics',
    badgeColor: 'text-rose-600 border-rose-200 bg-rose-50/60',
    accentColor: '#e11d48',
    renderGraphic: () => (
      <div className="w-full h-24 rounded-xl bg-slate-950 p-2.5 flex flex-col justify-between overflow-hidden relative border border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
            <Layers className="w-3 h-3" />
            3D BLOODWAY TWIN
          </span>
          <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          </span>
        </div>
        {/* Hemodynamic Channel SVG */}
        <div className="relative w-full h-8 flex items-center justify-center my-auto">
          <div className="w-full h-4 rounded-full bg-slate-900 border border-slate-800 p-0.5 flex items-center relative overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 w-3/4 opacity-90 shadow-sm" />
            <div className="absolute right-3 w-2 h-2 rounded-full bg-rose-500 animate-ping opacity-75" />
          </div>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>Stenosis Stage Coding</span>
          <span className="text-rose-400 font-semibold">Immediate 3D</span>
        </div>
      </div>
    ),
  },
  {
    step: '04',
    phase: 'PHASE 04 // ACTIONABLE CONSENSUS',
    title: 'Shared Doctor-Patient Care Plan',
    subtitle: 'Empowered Health Decisions',
    desc: 'Doctor and patient look at the same clear visual model together to plan next steps—whether simple daily habit changes, targeted medication, or advanced cardiology consultation.',
    metric: 'Empowered Shared Decisions',
    badgeColor: 'text-indigo-600 border-indigo-200 bg-indigo-50/60',
    accentColor: '#4f46e5',
    renderGraphic: () => (
      <div className="w-full h-24 rounded-xl bg-slate-950 p-2.5 flex flex-col justify-between overflow-hidden relative border border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
            <ShieldCheck className="w-3 h-3" />
            CARE PROTOCOL
          </span>
          <span className="text-indigo-300 font-mono text-[9px] bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/80">
            Validated
          </span>
        </div>
        {/* Care Action Milestones */}
        <div className="space-y-1.5 my-auto">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="truncate">Statin & Lifestyle Optimization</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="truncate">Systolic BP Target &lt; 120 mmHg</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>Outpatient Pathway</span>
          <span className="text-indigo-400 font-semibold">Action Plan</span>
        </div>
      </div>
    ),
  },
];

export default function ClinicalWorkflow() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      // Header entrance animation
      gsap.fromTo(
        '.workflow-header',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.workflow-header', start: 'top 85%' },
        }
      );

      // Connecting pipeline rail line draws smoothly
      gsap.fromTo(
        '.workflow-pipeline-rail',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Staggered cards entrance with subtle scale & smooth y
      gsap.fromTo(
        '.workflow-step-card',
        { y: 35, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section id="clinical-workflow" ref={sectionRef} className="py-24 bg-slate-50/70 border-t border-slate-200 relative overflow-hidden">
      <div className="container-custom relative z-10">

        {/* Section Header */}
        <div className="workflow-header text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-rose-600 uppercase">
              Multi-Modal Methodology — Diagnostic Pipeline
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            From Routine Medical Tests to a <span className="text-gradient-vivid">Living Heart Model</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A clear 4-step pathway that transforms complex diagnostic biomarkers into an actionable, interactive 3D anatomical twin.
          </p>
        </div>

        {/* Desktop Process Conduit Rail */}
        <div className="relative mb-6 hidden lg:block">
          <div className="workflow-pipeline-rail absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-sky-400 via-emerald-400 via-rose-400 to-indigo-400 -translate-y-1/2 opacity-30" />
        </div>

        {/* 4 Steps Grid: Bespoke Medical Telemetry Cards */}
        <div className="workflow-steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {WORKFLOW_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="workflow-step-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div>
                {/* Step Metadata Bar: Technical Phase Tag instead of generic bubble pill */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <span className="font-mono text-xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                    {step.step}
                  </span>
                  <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {step.phase}
                  </span>
                </div>

                {/* Bespoke Interactive Micro-Graphic */}
                <div className="mb-5 shadow-xs rounded-xl overflow-hidden group-hover:shadow-md transition-shadow">
                  {step.renderGraphic()}
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-slate-950 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-rose-600 mb-2.5">
                  {step.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Bottom Metric Strip */}
              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] font-bold text-slate-700">
                  {step.metric}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Step {idx + 1} of 4
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
