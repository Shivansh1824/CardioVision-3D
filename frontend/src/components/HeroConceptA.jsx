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
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Layers, Droplet } from 'lucide-react';

gsap.registerPlugin(useGSAP);

import {
  VESSEL_COLOR,
  VESSEL_LABEL,
  SURFACE_VESSELS,
  DISSECTION_LANDMARKS,
} from './cardiacAnatomyData';
import AnatomicalCalloutTooltip from './AnatomicalCalloutTooltip';

export default function HeroConceptA({
  onOpenSignIn,
  onScrollToSection,
  vesselStates,
  selectedArtery,
  onSelectArtery,
}) {
  const sectionRef = useRef(null);
  const heartWrapRef = useRef(null);

  // View Mode: 'surface' (external vessels + blood flow) or 'dissected' (interior chambers)
  const [viewMode, setViewMode] = useState('surface');

  // Active callout tooltip (null on initial load, resets when pointer leaves)
  const [activeCallout, setActiveCallout] = useState(null);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);

  // GSAP entrance + persistent heartbeat pulse
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.ca-overline', { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 })
        .fromTo('.ca-headline', { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.78 }, '-=0.35')
        .fromTo('.ca-sub',      { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62 }, '-=0.48')
        .fromTo('.ca-cta',      { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, '-=0.38')
        .fromTo('.ca-stat',     { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.07 }, '-=0.3')
        .fromTo('.ca-heart-stage', { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.95, ease: 'back.out(1.2)' }, '-=0.55');

      // Heartbeat pulse (~72 BPM) on the heart image
      const heartEl = document.getElementById('ca-heart-canvas');
      if (heartEl) {
        gsap.to(heartEl, {
          scale: 1.028,
          duration: 0.18,
          ease: 'power2.out',
          repeat: -1,
          repeatDelay: 0.65,
          yoyo: true,
          yoyoEase: 'power1.inOut',
        });
      }
    },
    { scope: sectionRef }
  );

  // Pointer movement: 3D perspective tilt & proximity tracking
  const handlePointerMove = (e) => {
    if (!heartWrapRef.current) return;
    const rect = heartWrapRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    // 3D perspective tilt
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -normY * 8, ry: normX * 10 });
    setIsHoveringHeart(true);

    // Only update active vessel if user is not currently hovering over the card itself
    if (!isHoveringCard) {
      if (viewMode === 'surface') {
        let nearest = null;
        let minDistance = Infinity;
        SURFACE_VESSELS.forEach((v) => {
          const dx = px - v.coords.x;
          const dy = py - v.coords.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = v.code;
          }
        });

        if (minDistance < 18) {
          setActiveCallout(nearest);
        } else {
          setActiveCallout(null);
        }
      } else if (viewMode === 'dissected') {
        let nearest = null;
        let minDistance = Infinity;
        DISSECTION_LANDMARKS.forEach((l) => {
          const dx = px - l.coords.x;
          const dy = py - l.coords.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = l.id;
          }
        });

        if (minDistance < 18) {
          setActiveCallout(nearest);
        } else {
          setActiveCallout(null);
        }
      }
    }
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setIsHoveringHeart(false);
    setIsHoveringCard(false);
    setActiveCallout(null);
  };

  const LADs = vesselStates?.LAD || 'moderate';
  const LCXs = vesselStates?.LCX || 'normal';
  const RCAs = vesselStates?.RCA || 'critical';

  // Active callout details
  const activeVesselData = SURFACE_VESSELS.find((v) => v.code === activeCallout) || null;
  const activeDissectionData = DISSECTION_LANDMARKS.find((d) => d.id === activeCallout) || null;

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
                onClick={() => {
                  setViewMode('surface');
                  setActiveCallout(null);
                }}
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
                onClick={() => {
                  setViewMode('dissected');
                  setActiveCallout(null);
                }}
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

            {/* Heart Visualizer Stage */}
            <div
              ref={heartWrapRef}
              onMouseMove={handlePointerMove}
              onMouseLeave={handlePointerLeave}
              className="relative w-full max-w-[480px] sm:max-w-[500px] flex items-center justify-center cursor-crosshair py-2"
            >
              {/* Radial glow directly behind the heart */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(225,29,72,0.14) 0%, rgba(186,230,253,0.12) 48%, transparent 72%)',
                  borderRadius: '50%', filter: 'blur(22px)',
                }}
              />

              {/* 3D Perspective Tilt & Zoom Wrapper */}
              <div
                id="ca-heart-canvas"
                style={{
                  position: 'relative',
                  width: '100%',
                  transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${isHoveringHeart ? 1.04 : 1})`,
                  transition: 'transform 0.16s ease-out',
                }}
              >
                {/* ── 1. Surface Heart (Photorealistic Coronary Anatomy) ── */}
                <img
                  src="/heart-clean.png"
                  alt="Photorealistic 3D human heart showing natural coronary arteries LAD, LCX, RCA on transparent background"
                  width={500}
                  height={500}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    display: viewMode === 'surface' ? 'block' : 'none',
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.12))',
                  }}
                  draggable={false}
                />

                {/* ── 2. Dissected Heart (Universal Internal Chambers View) ── */}
                <img
                  src="/heart-dissected.png"
                  alt="Universal anatomical heart dissection coronal cross-section showing left and right ventricles, valves and septum"
                  width={500}
                  height={500}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    display: viewMode === 'dissected' ? 'block' : 'none',
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.14))',
                  }}
                  draggable={false}
                />

                {/* ── 3. Animated Blood Flow Streams (Active in Surface Mode) ── */}
                {viewMode === 'surface' && (
                  <svg
                    viewBox="0 0 400 420"
                    className="absolute inset-0 w-full h-full pointer-events-none z-15"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="bloodFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#e11d48" stopOpacity="0.75" />
                        <stop offset="100%" stopColor="#991b1b" stopOpacity="0.4" />
                      </linearGradient>
                      <filter id="bloodGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* LAD Arterial Blood Flow Stream (Anterior Groove → Apex) */}
                    <path
                      d="M 198 165 C 194 200 192 235 195 270 C 198 305 204 338 206 370"
                      fill="none"
                      stroke="url(#bloodFlowGrad)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeDasharray="10 8"
                      className="animate-blood-flow"
                      filter="url(#bloodGlow)"
                      opacity={activeCallout === 'LAD' ? 1 : 0.65}
                    />

                    {/* LCX Arterial Blood Flow Stream (Coronary Sulcus → Margin) */}
                    <path
                      d="M 205 162 C 230 162 255 174 275 198 C 292 220 298 245 292 275"
                      fill="none"
                      stroke="url(#bloodFlowGrad)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray="9 7"
                      className="animate-blood-flow-fast"
                      filter="url(#bloodGlow)"
                      opacity={activeCallout === 'LCX' ? 1 : 0.65}
                    />

                    {/* RCA Arterial Blood Flow Stream (Right Groove → Inferior) */}
                    <path
                      d="M 185 175 C 168 195 156 222 154 252 C 152 280 160 308 172 334"
                      fill="none"
                      stroke="url(#bloodFlowGrad)"
                      strokeWidth="3.0"
                      strokeLinecap="round"
                      strokeDasharray="10 8"
                      className="animate-blood-flow"
                      filter="url(#bloodGlow)"
                      opacity={activeCallout === 'RCA' ? 1 : 0.65}
                    />
                  </svg>
                )}

                {/* ── 4. Precision Medical Pinpoints (Surface Mode) ── */}
                {viewMode === 'surface' &&
                  SURFACE_VESSELS.map((v) => {
                    const isSelected = activeCallout === v.code;
                    const status = vesselStates?.[v.code] || 'normal';
                    const color = VESSEL_COLOR[status];

                    return (
                      <div
                        key={v.code}
                        style={{
                          position: 'absolute',
                          left: `${v.coords.x}%`,
                          top: `${v.coords.y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: isSelected ? 35 : 20,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectArtery?.(v.code);
                            setActiveCallout(isSelected ? null : v.code);
                          }}
                          onMouseEnter={() => setActiveCallout(v.code)}
                          className="relative flex items-center justify-center p-2.5 group cursor-pointer focus:outline-none"
                          aria-label={`Inspect ${v.name}`}
                        >
                          <span
                            className="rounded-full transition-all duration-200"
                            style={{
                              width: isSelected ? 13 : 9,
                              height: isSelected ? 13 : 9,
                              background: color,
                              border: '2px solid #ffffff',
                              boxShadow: isSelected
                                ? `0 0 0 4px ${color}45, 0 0 14px ${color}`
                                : '0 2px 6px rgba(0,0,0,0.3)',
                            }}
                          />
                        </button>
                      </div>
                    );
                  })}

                {/* ── 5. Internal Landmarks Pinpoints (Dissected Mode) ── */}
                {viewMode === 'dissected' &&
                  DISSECTION_LANDMARKS.map((landmark) => {
                    const isSelected = activeCallout === landmark.id;
                    return (
                      <div
                        key={landmark.id}
                        style={{
                          position: 'absolute',
                          left: `${landmark.coords.x}%`,
                          top: `${landmark.coords.y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: isSelected ? 35 : 20,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveCallout(isSelected ? null : landmark.id)}
                          onMouseEnter={() => setActiveCallout(landmark.id)}
                          className="relative flex items-center justify-center p-2.5 group cursor-pointer focus:outline-none"
                          aria-label={`Inspect ${landmark.name}`}
                        >
                          <span
                            className="rounded-full transition-all duration-200"
                            style={{
                              width: isSelected ? 13 : 9,
                              height: isSelected ? 13 : 9,
                              background: '#e11d48',
                              border: '2px solid #ffffff',
                              boxShadow: isSelected
                                ? '0 0 0 4px rgba(225,29,72,0.4), 0 0 14px #e11d48'
                                : '0 2px 6px rgba(0,0,0,0.35)',
                            }}
                          />
                        </button>
                      </div>
                    );
                  })}

                {/* ── 6. Subtle Interactive Callout Tooltip (Pops up near the section) ── */}
                <AnimatePresence>
                  <AnatomicalCalloutTooltip
                    viewMode={viewMode}
                    vesselData={activeVesselData}
                    dissectionData={activeDissectionData}
                    vesselStates={vesselStates}
                    onClose={() => setActiveCallout(null)}
                    onSelectArtery={onSelectArtery}
                    onScrollToSection={onScrollToSection}
                    onCardMouseEnter={() => setIsHoveringCard(true)}
                    onCardMouseLeave={() => {
                      setIsHoveringCard(false);
                      setActiveCallout(null);
                    }}
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Subtle Hint Footnote */}
            <p className="font-mono text-[10px] text-slate-400 tracking-wider mt-1 text-center">
              {viewMode === 'surface'
                ? 'Hover near LAD, LCX, or RCA to inspect blood supply & functionality'
                : 'Click or hover internal pinpoints to examine chambers, valves, and septum'}
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
