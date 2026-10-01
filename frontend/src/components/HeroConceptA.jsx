/**
 * HeroConceptA — Interactive Cardiovascular Twin & Dissection
 *
 * Features:
 * - Full-stage photorealistic anatomical heart (zero excessive white space)
 * - Two interactive anatomical views:
 *     1) Surface & Active Blood Flow (LAD, LCX, RCA animated coronary blood perfusion)
 *     2) Universal Chamber Dissection (Internal ventricles, septum, and valves)
 * - Subtle pop-up tooltip near each artery with full functional explanation & simulator CTA
 * - Dismissible tooltip with (x) close button
 * - Clean medical pinpoints (no beeping/pinging circles)
 * - 3D parallax pointer tilt & organic 72 BPM cardiac cycle pulse
 */

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, Layers, Droplet } from 'lucide-react';

gsap.registerPlugin(useGSAP);

import {
  VESSEL_COLOR,
  VESSEL_LABEL,
  SURFACE_VESSELS,
} from './cardiacAnatomyData';
import HeartStageVisualizer from './HeartStageVisualizer';

export default function HeroConceptA({
  onOpenSignIn,
  onScrollToSection,
  vesselStates,
  selectedArtery,
  onSelectArtery,
}) {
  const sectionRef = useRef(null);

  // View Mode: 'surface' (external vessels + blood flow) or 'dissected' (interior chambers)
  const [viewMode, setViewMode] = useState('surface');

  // GSAP entrance
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.ca-overline', { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 })
        .fromTo('.ca-headline', { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.78 }, '-=0.35')
        .fromTo('.ca-sub',      { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62 }, '-=0.48')
        .fromTo('.ca-cta',      { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, '-=0.38')
        .fromTo('.ca-stat',     { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.07 }, '-=0.3')
        .fromTo('.ca-heart-stage', { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.95, ease: 'back.out(1.2)' }, '-=0.55');
    },
    { scope: sectionRef }
  );

  const LADs = vesselStates?.LAD || 'moderate';
  const LCXs = vesselStates?.LCX || 'normal';
  const RCAs = vesselStates?.RCA || 'critical';

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '92vh',
        paddingTop: '5rem',
        paddingBottom: '4.5rem',
        background:
          'radial-gradient(ellipse 90% 70% at 65% 45%, rgba(225,29,72,0.08) 0%, transparent 60%),' +
          'radial-gradient(ellipse 65% 55% at 15% 60%, rgba(186,230,253,0.25) 0%, transparent 60%),' +
          'linear-gradient(168deg, #f8fafc 0%, #fdf4f7 48%, #f0f9ff 100%)',
      }}
    >
      {/* Soft ambient backdrop glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', right: -40, top: '45%', transform: 'translateY(-50%)',
          width: 750, height: 750, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(225,29,72,0.09) 0%, transparent 68%)',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ─── LEFT: Editorial copy & Triage ─────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="ca-overline inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-rose-600 uppercase tracking-widest">
                Interactive Cardiovascular Twin
              </span>
            </div>

            <h1 className="ca-headline font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.06]">
              Understand <br />
              Your Heart <br />
              &amp; <span className="text-gradient-vivid">Coronary Arteries</span>
            </h1>

            <p className="ca-sub text-base sm:text-lg text-slate-600 leading-relaxed max-w-md">
              A visual intelligence platform that helps doctors triage coronary disease
              and patients see exactly how blood flows — with zero medical confusion.
            </p>

            <div className="ca-cta flex flex-wrap items-center gap-3">
              <button
                onClick={() => onScrollToSection?.('vessel-explorer')}
                className="ca-cta btn-primary-vibrant text-sm cursor-pointer shadow-md"
                id="concept-a-explore-btn"
              >
                <span>Explore Arteries</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenSignIn?.('doctor')}
                className="ca-cta btn-secondary-glass text-sm cursor-pointer"
                id="concept-a-signin-btn"
              >
                <span>Clinical Portal</span>
              </button>
            </div>

            {/* Live vessel triage strip */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2.5">
                <p className="font-mono text-[10px] font-semibold text-slate-400 tracking-widest uppercase">
                  Coronary Arteries Triage
                </p>
                <span className="text-[10px] text-slate-400 font-mono">Hover to inspect</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { code: 'LAD', name: 'Anterior', status: LADs },
                  { code: 'LCX', name: 'Lateral',  status: LCXs },
                  { code: 'RCA', name: 'Inferior', status: RCAs },
                ].map((v) => {
                  const isActive = activeCallout === v.code || selectedArtery === v.code;
                  return (
                    <button
                      key={v.code}
                      type="button"
                      onClick={() => {
                        onSelectArtery?.(v.code);
                        setActiveCallout(v.code);
                        setViewMode('surface');
                      }}
                      onMouseEnter={() => {
                        setActiveCallout(v.code);
                        setViewMode('surface');
                      }}
                      className={`ca-stat flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xs transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-white border-rose-300 shadow-md ring-2 ring-rose-500/20'
                          : 'bg-white/85 border-slate-200/80 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background: VESSEL_COLOR[v.status],
                          boxShadow: `0 0 6px ${VESSEL_COLOR[v.status]}99`,
                        }}
                      />
                      <span className="font-mono text-xs font-bold text-slate-800">{v.code}</span>
                      <span className="text-[10px] text-slate-500">{v.name}</span>
                      <span className="text-[10px] font-bold" style={{ color: VESSEL_COLOR[v.status] }}>
                        {VESSEL_LABEL[v.status]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Full-Stage Heart Centerpiece & Dissection ─────────── */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center ca-heart-stage relative">

            {/* Mode Switcher: Surface (Blood Flow) vs Dissected Chambers */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm mb-3 z-30">
              <button
                type="button"
                onClick={() => setViewMode('surface')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'surface'
                    ? 'bg-rose-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>Surface &amp; Blood Flow</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('dissected')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'dissected'
                    ? 'bg-rose-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Chamber Dissection</span>
              </button>
            </div>

            {/* Interactive Anatomical Dissection & Perfusion Stage */}
            <HeartStageVisualizer
              viewMode={viewMode}
              vesselStates={vesselStates}
              onSelectArtery={onSelectArtery}
              onScrollToSection={onScrollToSection}
            />

            {/* Subtle Guidance Footnote */}
            <p className="font-mono text-[10px] text-slate-400 tracking-wider mt-1 text-center">
              {viewMode === 'surface'
                ? 'Hover near LAD, LCX, or RCA to inspect blood supply & functionality'
                : 'Coronal dissection active · Click or hover labeled anatomical landmarks'}
            </p>

          </div>
        </div>
      </div>

      {/* Blood Flow Keyframe Styles */}
      <style>{`
        @keyframes bloodFlowAnimation {
          0% { stroke-dashoffset: 36; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-blood-flow {
          animation: bloodFlowAnimation 1.1s linear infinite;
        }
        .animate-blood-flow-fast {
          animation: bloodFlowAnimation 0.85s linear infinite;
        }
      `}</style>
    </section>
  );
}
