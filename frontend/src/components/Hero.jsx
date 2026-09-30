import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';
import AnatomicalHeartVisualizer from './AnatomicalHeartVisualizer';
import HeartCanvas from './HeartCanvas';

gsap.registerPlugin(useGSAP);

// Live ECG waveform — renders a looping SVG ECG trace as a background decoration
function EcgWaveLine({ className = '' }) {
  // Single QRS complex + T-wave repeated to fill the width
  const d = 'M0,30 L40,30 L48,30 L52,5 L56,55 L60,10 L64,30 L80,30 L86,22 L92,30 L140,30 L180,30 L188,30 L192,5 L196,55 L200,10 L204,30 L220,30 L226,22 L232,30 L280,30';
  return (
    <svg
      viewBox="0 0 280 60"
      className={`${className} overflow-visible`}
      preserveAspectRatio="none"
    >
      <path
        d={d}
        fill="none"
        stroke="rgba(239,68,68,0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0,0"
          to="-280,0"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </path>
      {/* Second copy offset to create seamless loop */}
      <path
        d={d}
        fill="none"
        stroke="rgba(239,68,68,0.45)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(280,0)"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          from="280,0"
          to="0,0"
          dur="3.5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export default function Hero({ onOpenSignIn, onScrollToSection, vesselStates, onSelectArtery, selectedArtery }) {
  const heroRef = useRef(null);
  const [viewMode, setViewMode] = useState('anatomical');

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge',         { y: -15, opacity: 0, duration: 0.7 })
        .from('.hero-title',         { y: 25,  opacity: 0, duration: 0.9 }, '-=0.4')
        .from('.hero-desc',          { y: 20,  opacity: 0, duration: 0.7 }, '-=0.5')
        .from('.hero-cta-group',     { y: 15,  opacity: 0, duration: 0.7 }, '-=0.4')
        .from('.hero-stats-card',    { y: 20,  opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
        .from('.hero-visualizer-wrap', { scale: 0.96, opacity: 0, duration: 1 }, '-=0.8');
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">

      {/* ── Ambient ECG strip across the bottom of the hero ── */}
      <div className="absolute bottom-6 left-0 right-0 opacity-40 pointer-events-none overflow-hidden" style={{ height: 60 }}>
        <EcgWaveLine className="w-full h-full" />
      </div>

      {/* ── Subtle grid pattern overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* ── Left Column ── */}
          <div className="lg:col-span-6 space-y-6">

            <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-rose-500/30 text-xs font-mono backdrop-blur-xl shadow-lg shadow-rose-950/20">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-300 font-semibold tracking-wide uppercase">
                Multi-Vessel Coronary Decision System
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="hero-title text-4xl sm:text-5xl xl:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.08]">
                Spatial Anatomical Twin for{' '}
                <span className="text-gradient-vivid">Coronary CAD</span>
              </h1>
              <p className="hero-desc text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Bridging calibrated machine learning with anatomical spatial intuition. Empowering cardiologists to triage multi-vessel stenosis with SHAP attribution, and giving heart patients a clear, compassionate view of their heart.
              </p>
            </div>

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
                <span>Doctor &amp; Patient Sign In</span>
              </button>
            </div>

            {/* 4 Proof Metric Cards */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { val: '0.912', label: 'CAD ROC-AUC',     sub: '5-Fold Calibrated', color: 'text-emerald-400', hover: 'hover:border-emerald-500/40' },
                { val: '303',   label: 'Hospital Patients', sub: 'UCI #411 Verified',  color: 'text-cyan-400',    hover: 'hover:border-cyan-500/40' },
                { val: '3 VES', label: 'LAD • LCX • RCA',  sub: 'Stenosis Staging',   color: 'text-amber-400',   hover: 'hover:border-amber-500/40' },
                { val: '<30ms', label: 'Inference Speed',  sub: 'Sub-30ms Real-Time', color: 'text-rose-400',    hover: 'hover:border-rose-500/40' },
              ].map((s, i) => (
                <div key={i} className={`hero-stats-card p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md ${s.hover} transition-all`}>
                  <div className={`text-2xl font-black font-mono ${s.color}`}>{s.val}</div>
                  <div className="text-xs text-slate-300 font-medium">{s.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero-Leakage Anti-Hallucination Pipeline • Verified on UCI #411</span>
            </div>
          </div>

          {/* ── Right Column: Heart Visualizer ── */}
          <div className="lg:col-span-6 hero-visualizer-wrap space-y-3">

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-mono text-slate-400">Visualizer Engine:</span>
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
