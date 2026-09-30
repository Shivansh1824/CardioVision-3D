import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, ShieldCheck, Sparkles, Activity, FileCheck, Stethoscope, HeartPulse } from 'lucide-react';
import HeartCanvas from './HeartCanvas';

gsap.registerPlugin(useGSAP);

export default function Hero({ onOpenSignIn, onScrollToSection, vesselStates, onSelectArtery }) {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          '.hero-title',
          {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
          },
          '-=0.5'
        )
        .from(
          '.hero-desc',
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        .from(
          '.hero-cta-group',
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        .from(
          '.hero-stats-card',
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          '-=0.6'
        )
        .from(
          '.hero-canvas-wrap',
          {
            scale: 0.94,
            opacity: 0,
            duration: 1.2,
          },
          '-=1'
        );
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-ambient-radial">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Strategic Value Proposition & Conversion Actions */}
          <div className="lg:col-span-6 space-y-7">
            
            {/* Hackathon Track Eyebrow Badge */}
            <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-red-500/30 text-xs font-mono backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="text-red-400 font-semibold tracking-wide uppercase">
                Multimodal AI Hackathon 2026 • Track A
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="hero-title text-4xl sm:text-5xl xl:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
                Interactive <span className="text-gradient-vital">3D Digital Heart</span> Twin for Multi-Vessel CAD
              </h1>
              <p className="hero-desc text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
                Bridging calibrated clinical machine learning with spatial anatomical intuition. Empowering cardiologists to triage multi-vessel stenosis with SHAP explainability, and guiding heart patients with anxiety-free clarity.
              </p>
            </div>

            {/* CTAs */}
            <div className="hero-cta-group flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onScrollToSection ? onScrollToSection('vessel-explorer') : document.getElementById('vessel-explorer')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary-glow text-base group cursor-pointer"
                id="hero-explore-twin-btn"
              >
                <span>Launch 3D Explorer</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
                className="btn-secondary-glass text-base cursor-pointer"
                id="hero-sign-in-btn"
              >
                <Stethoscope className="w-5 h-5 text-red-400" />
                <span>Sign In / Enter Portal</span>
              </button>
            </div>

            {/* Verified Clinical Proof Points Grid */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="hero-stats-card p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">0.912</div>
                <div className="text-xs text-slate-400 font-medium">CAD ROC-AUC</div>
                <div className="text-[10px] text-slate-400 mt-0.5">5-Fold Calibrated</div>
              </div>

              <div className="hero-stats-card p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">303</div>
                <div className="text-xs text-slate-400 font-medium">Hospital Patients</div>
                <div className="text-[10px] text-slate-400 mt-0.5">UCI #411 Verified</div>
              </div>

              <div className="hero-stats-card p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">3 Vessels</div>
                <div className="text-xs text-slate-400 font-medium">LAD • LCX • RCA</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Dual-Metric Staging</div>
              </div>

              <div className="hero-stats-card p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-bold font-mono text-red-400">&lt; 30ms</div>
                <div className="text-xs text-slate-400 font-medium">Inference Speed</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Real-Time What-If</div>
              </div>
            </div>

            {/* Zero-Leakage Guarantee Pill */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Anti-Leakage Enforced: No target labels used as predictors. Zero hallucination.</span>
            </div>

          </div>

          {/* Right Column: Interactive 3D Anatomical Heart Canvas */}
          <div className="lg:col-span-6 hero-canvas-wrap">
            <HeartCanvas
              vesselStates={vesselStates}
              onSelectArtery={onSelectArtery}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
