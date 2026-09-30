import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, ShieldCheck, Stethoscope, Layers, Sparkles, Activity } from 'lucide-react';
import AnatomicalHeartVisualizer from './AnatomicalHeartVisualizer';
import HeartCanvas from './HeartCanvas';

gsap.registerPlugin(useGSAP);

export default function Hero({ onOpenSignIn, onScrollToSection, vesselStates, onSelectArtery, selectedArtery }) {
  const heroRef = useRef(null);
  const [viewMode, setViewMode] = useState('anatomical'); // 'anatomical' or '3d'

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: -15,
        opacity: 0,
        duration: 0.7,
      })
        .from(
          '.hero-title',
          {
            y: 25,
            opacity: 0,
            duration: 0.9,
          },
          '-=0.4'
        )
        .from(
          '.hero-desc',
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        .from(
          '.hero-cta-group',
          {
            y: 15,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.4'
        )
        .from(
          '.hero-stats-card',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          '-=0.5'
        )
        .from(
          '.hero-visualizer-wrap',
          {
            scale: 0.96,
            opacity: 0,
            duration: 1,
          },
          '-=0.8'
        );
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Vision & Clinical AI Precision */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Luminous Brand Pill (No Track A) */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-rose-500/30 text-xs font-mono backdrop-blur-xl shadow-lg shadow-rose-950/20">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-rose-300 font-semibold tracking-wide uppercase">
                Multi-Vessel Coronary Decision System
              </span>
            </div>

            {/* Main Editorial Headline */}
            <div className="space-y-3">
              <h1 className="hero-title text-4xl sm:text-5xl xl:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.08]">
                Spatial Anatomical Twin for <span className="text-gradient-vivid">Coronary CAD</span>
              </h1>
              <p className="hero-desc text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Bridging calibrated machine learning with anatomical spatial intuition. Empowering cardiologists to triage multi-vessel stenosis with SHAP attribution, and giving heart patients a clear, compassionate view of their heart.
              </p>
            </div>

            {/* Conversion CTA Group */}
            <div className="hero-cta-group flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => onScrollToSection ? onScrollToSection('vessel-explorer') : document.getElementById('vessel-explorer')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary-vibrant text-base group cursor-pointer"
                id="hero-explore-twin-btn"
              >
                <span>Launch Interactive Twin</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
                className="btn-secondary-glass text-base cursor-pointer"
                id="hero-sign-in-btn"
              >
                <Stethoscope className="w-5 h-5 text-rose-400" />
                <span>Doctor & Patient Sign In</span>
              </button>
            </div>

            {/* 4 Proof Cards with Gradient Accents */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="hero-stats-card p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all">
                <div className="text-2xl font-black font-mono text-emerald-400">0.912</div>
                <div className="text-xs text-slate-300 font-medium">CAD ROC-AUC</div>
                <div className="text-[10px] text-slate-400 mt-0.5">5-Fold Calibrated</div>
              </div>

              <div className="hero-stats-card p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-all">
                <div className="text-2xl font-black font-mono text-cyan-400">303</div>
                <div className="text-xs text-slate-300 font-medium">Hospital Patients</div>
                <div className="text-[10px] text-slate-400 mt-0.5">UCI #411 Verified</div>
              </div>

              <div className="hero-stats-card p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md hover:border-amber-500/40 transition-all">
                <div className="text-2xl font-black font-mono text-amber-400">3 Vessels</div>
                <div className="text-xs text-slate-300 font-medium">LAD • LCX • RCA</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Stenosis Staging</div>
              </div>

              <div className="hero-stats-card p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md hover:border-rose-500/40 transition-all">
                <div className="text-2xl font-black font-mono text-rose-400">&lt; 30ms</div>
                <div className="text-xs text-slate-300 font-medium">Inference Speed</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Sub-30ms Real-Time</div>
              </div>
            </div>

            {/* Zero-Leakage Guarantee */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero-Leakage Anti-Hallucination Pipeline • Verified on UCI #411</span>
            </div>

          </div>

          {/* Right Column: Anatomical Heart Twin with View Switcher */}
          <div className="lg:col-span-6 hero-visualizer-wrap space-y-3">
            
            {/* View Mode Toggle: Anatomical Scientific SVG vs 3D WebGL Mesh */}
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono text-slate-400">
                Visualizer Engine:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md text-xs">
                <button
                  onClick={() => setViewMode('anatomical')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === 'anatomical'
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Scientific Anatomy
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D Spatial Mesh
                </button>
              </div>
            </div>

            {/* Visualizer Display */}
            {viewMode === 'anatomical' ? (
              <AnatomicalHeartVisualizer
                vesselStates={vesselStates}
                selectedArtery={selectedArtery}
                onSelectArtery={onSelectArtery}
              />
            ) : (
              <HeartCanvas
                vesselStates={vesselStates}
                onSelectArtery={onSelectArtery}
              />
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
