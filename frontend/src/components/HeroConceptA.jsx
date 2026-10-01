/**
 * HeroConceptA — HeartBloom Cinematic
 * Centerpiece: Photorealistic anatomical heart image with transparent background
 *
 * Updates:
 * - Removed Live ECG and Clinical CDS per clinical specification
 * - Removed aggressive beeping / pinging circles; replaced with sleek medical pinpoint dots
 * - Breakdown card docks on the right side with zero overlap on the heart
 * - Zero auto-opened cards on initial load (clean resting state)
 * - 3D parallax pointer tilt & smooth GSAP heartbeat pulse
 */

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';

gsap.registerPlugin(useGSAP);

// ─── Vessel state → colour + label ───────────────────────────────────────────
const VESSEL_COLOR = { normal: '#10b981', moderate: '#f59e0b', critical: '#ef4444' };
const VESSEL_LABEL = { normal: 'Clear', moderate: 'Moderate', critical: 'Severe' };

// ─── Clinical Vessel Targets & Anatomical Territories ────────────────────────
// 1. LAD: Left Anterior Descending (anterior interventricular sulcus → apex)
// 2. LCX: Left Circumflex (coronary sulcus → obtuse marginal branches)
// 3. RCA: Right Coronary Artery (right atrioventricular groove → crux / PDA)
const VESSEL_TARGETS = [
  {
    code: 'LAD',
    name: 'Left Anterior Descending',
    shortName: 'Anterior',
    clinicalRole: 'Supplies ~50% of left ventricle, anterior wall & septum',
    pathway: 'Anterior interventricular groove to cardiac apex',
    stenosisImpact: 'Known as the "Widow Maker" — severe blockage causes large anterior wall infarction',
    coords: { x: 50, y: 58 },
    ffr: '0.74',
    flow: '26 cm/s',
    risk: 'Elevated Ischemia Risk',
  },
  {
    code: 'LCX',
    name: 'Left Circumflex Artery',
    shortName: 'Lateral',
    clinicalRole: 'Supplies lateral and posterolateral left ventricle',
    pathway: 'Left coronary sulcus wrapping around lateral margin',
    stenosisImpact: 'Blockage causes lateral wall ischemia and potential mitral valve dysfunction',
    coords: { x: 67, y: 44 },
    ffr: '0.94',
    flow: '38 cm/s',
    risk: 'Normal Patent Flow',
  },
  {
    code: 'RCA',
    name: 'Right Coronary Artery',
    shortName: 'Inferior',
    clinicalRole: 'Supplies right atrium, right ventricle & SA/AV conduction nodes',
    pathway: 'Right atrioventricular groove to cardiac crux & PDA',
    stenosisImpact: 'Blockage causes inferior wall infarction, high risk of bradycardia and AV nodal blocks',
    coords: { x: 33, y: 52 },
    ffr: '0.58',
    flow: '14 cm/s',
    risk: 'Critical Stenosis / Perfusion Deficit',
  },
];

export default function HeroConceptA({
  onOpenSignIn,
  onScrollToSection,
  vesselStates,
  selectedArtery,
  onSelectArtery,
}) {
  const sectionRef = useRef(null);
  const heartWrapRef = useRef(null);
  
  // Inspected vessel: null on initial load (no pre-opened card overlapping the heart)
  const [inspectedVessel, setInspectedVessel] = useState(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // GSAP entrance + persistent heartbeat pulse
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.ca-overline', { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 })
        .fromTo('.ca-headline', { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.78 }, '-=0.35')
        .fromTo('.ca-sub',      { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62 }, '-=0.48')
        .fromTo('.ca-cta',      { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, '-=0.38')
        .fromTo('.ca-stat',     { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.07 }, '-=0.3')
        .fromTo('.ca-heart-wrap', { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.95, ease: 'back.out(1.2)' }, '-=0.55')
        .fromTo('.ca-hud',      { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.1 }, '-=0.55');

      // Heartbeat pulse (~72 BPM) on the heart image
      const heartImg = document.getElementById('ca-heart-image');
      if (heartImg) {
        gsap.to(heartImg, {
          scale: 1.03,
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

  // 3D perspective tilt & pointer proximity detection
  const handlePointerMove = (e) => {
    if (!heartWrapRef.current) return;
    const rect = heartWrapRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    // Gentle 3D perspective tilt
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -normY * 8, ry: normX * 10 });

    // Proximity detection for the nearest vessel pin
    let nearest = null;
    let minDistance = Infinity;
    VESSEL_TARGETS.forEach((vt) => {
      const dx = px - vt.coords.x;
      const dy = py - vt.coords.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = vt.code;
      }
    });

    // Proximity activation radius: 20%
    if (minDistance < 20) {
      setInspectedVessel(nearest);
    }
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setInspectedVessel(null);
  };

  const LADs = vesselStates?.LAD || 'moderate';
  const LCXs = vesselStates?.LCX || 'normal';
  const RCAs = vesselStates?.RCA || 'critical';

  // Active target details (if user hovered or selected)
  const activeTarget = VESSEL_TARGETS.find((v) => v.code === inspectedVessel) || null;
  const activeStatus = activeTarget ? vesselStates?.[activeTarget.code] || 'normal' : null;
  const activeColor = activeStatus ? VESSEL_COLOR[activeStatus] : '#e11d48';

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '92vh',
        paddingTop: '5.5rem',
        paddingBottom: '5rem',
        background:
          'radial-gradient(ellipse 85% 65% at 68% 42%, rgba(225,29,72,0.08) 0%, transparent 58%),' +
          'radial-gradient(ellipse 65% 55% at 12% 62%, rgba(186,230,253,0.25) 0%, transparent 58%),' +
          'linear-gradient(168deg, #f8fafc 0%, #fdf4f7 48%, #f0f9ff 100%)',
      }}
    >
      {/* Soft ambient backdrop bloom */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', right: -60, top: '45%', transform: 'translateY(-50%)',
          width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(225,29,72,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* ─── LEFT: Editorial copy ────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="ca-overline inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-rose-600 uppercase tracking-widest">
                Interactive Cardiovascular Twin
              </span>
            </div>

            <h1 className="ca-headline font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.08]">
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
                className="ca-cta btn-primary-vibrant text-sm cursor-pointer"
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
              <div className="flex items-center justify-between mb-2">
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
                  const isActive = inspectedVessel === v.code || selectedArtery === v.code;
                  return (
                    <button
                      key={v.code}
                      type="button"
                      onClick={() => {
                        onSelectArtery?.(v.code);
                        setInspectedVessel(v.code);
                      }}
                      onMouseEnter={() => setInspectedVessel(v.code)}
                      className={`ca-stat flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xs transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-white border-slate-400 shadow-md ring-2 ring-rose-500/20'
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

          {/* ─── RIGHT: Heart + Side-by-Side Right Breakdown Panel ────────── */}
          <div className="lg:col-span-7 relative ca-heart-wrap">

            {/* Top Bar: CAD Detection Rate & Vessel Accuracy */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <motion.div
                className="ca-hud inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-emerald-600/20 shadow-xs"
                whileHover={{ y: -2 }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-[10px] font-bold text-slate-600 uppercase tracking-wider">CAD Detection</span>
                <span className="font-display font-extrabold text-emerald-700 text-sm">91.2%</span>
                <span className="text-[9px] text-slate-400 font-mono">Stratified</span>
              </motion.div>

              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/70 text-[10px] font-mono text-slate-500 shadow-xs">
                <span>LAD <b className="text-slate-800">84.4%</b></span>
                <span className="text-slate-300">•</span>
                <span>LCX <b className="text-slate-800">73.1%</b></span>
                <span className="text-slate-300">•</span>
                <span>RCA <b className="text-slate-800">72.1%</b></span>
              </div>
            </div>

            {/* Main Stage: Heart + Dedicated Right Inspection Panel */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

              {/* Heart Centerpiece Column */}
              <div
                ref={heartWrapRef}
                onMouseMove={handlePointerMove}
                onMouseLeave={handlePointerLeave}
                className="md:col-span-7 relative flex items-center justify-center cursor-crosshair py-2"
              >
                {/* Soft glow behind heart */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(225,29,72,0.12) 0%, rgba(186,230,253,0.10) 45%, transparent 72%)',
                    borderRadius: '50%', filter: 'blur(20px)',
                  }}
                />

                {/* 3D Perspective Tilt Wrapper */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 360,
                    transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                    transition: 'transform 0.14s ease-out',
                  }}
                >
                  <img
                    id="ca-heart-image"
                    src="/heart-clean.png"
                    alt="Photorealistic 3D human heart showing natural coronary arteries LAD, LCX, RCA on transparent background"
                    width={360}
                    height={360}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      userSelect: 'none',
                      WebkitUserDrag: 'none',
                    }}
                    draggable={false}
                  />

                  {/* ── Precision Medical Pinpoint Dots (No beeping circles) ── */}
                  {VESSEL_TARGETS.map((vt) => {
                    const isHovered = inspectedVessel === vt.code;
                    const isSelected = selectedArtery === vt.code;
                    const isTargeted = isHovered || isSelected;
                    const status = vesselStates?.[vt.code] || 'normal';
                    const color = VESSEL_COLOR[status];

                    return (
                      <div
                        key={vt.code}
                        style={{
                          position: 'absolute',
                          left: `${vt.coords.x}%`,
                          top: `${vt.coords.y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: isTargeted ? 30 : 20,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectArtery?.(vt.code);
                            setInspectedVessel(vt.code);
                          }}
                          onMouseEnter={() => setInspectedVessel(vt.code)}
                          className="relative flex items-center justify-center p-2 group cursor-pointer focus:outline-none"
                          aria-label={`Inspect ${vt.name}`}
                        >
                          {/* Clean Pinpoint Dot */}
                          <span
                            className="rounded-full transition-all duration-200"
                            style={{
                              width: isTargeted ? 12 : 8,
                              height: isTargeted ? 12 : 8,
                              background: color,
                              border: '2px solid #ffffff',
                              boxShadow: isTargeted
                                ? `0 0 0 3px ${color}40, 0 0 12px ${color}`
                                : `0 0 4px rgba(0,0,0,0.25)`,
                            }}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Right-Side Inspection Panel (Never overlaps the heart) ── */}
              <div className="md:col-span-5 relative">
                <AnimatePresence mode="wait">
                  {activeTarget ? (
                    <motion.div
                      key={activeTarget.code}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-slate-200/90 text-left"
                      style={{
                        boxShadow: `0 16px 36px -10px ${activeColor}25, 0 4px 16px rgba(0,0,0,0.06)`,
                      }}
                    >
                      {/* Header with status */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: activeColor }} />
                          <span className="font-mono text-xs font-bold text-slate-900">{activeTarget.code}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Artery</span>
                        </div>
                        <span
                          className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md"
                          style={{ background: `${activeColor}15`, color: activeColor }}
                        >
                          {VESSEL_LABEL[activeStatus]} Stenosis
                        </span>
                      </div>

                      {/* Artery Name & Pathway */}
                      <p className="font-display text-sm font-bold text-slate-800 leading-tight">
                        {activeTarget.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 mb-2 leading-relaxed">
                        {activeTarget.pathway}
                      </p>

                      {/* Functional territory */}
                      <div className="p-2 rounded-xl bg-slate-50/90 border border-slate-100 mb-2.5">
                        <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                          {activeTarget.clinicalRole}
                        </p>
                      </div>

                      {/* Hemodynamic Telemetry */}
                      <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 mb-3">
                        <div>
                          <p className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">Perfusion FFR</p>
                          <p className="font-display font-bold text-xs text-slate-800 mt-0.5">{activeTarget.ffr} FFR</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">Flow Velocity</p>
                          <p className="font-display font-bold text-xs text-slate-800 mt-0.5">{activeTarget.flow}</p>
                        </div>
                      </div>

                      {/* Simulator Trigger CTA */}
                      <button
                        onClick={() => {
                          onSelectArtery?.(activeTarget.code);
                          onScrollToSection?.('vessel-explorer');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold text-white transition-all cursor-pointer shadow-xs hover:opacity-95"
                        style={{ background: activeColor }}
                      >
                        <span>Simulate in Vessel Explorer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ) : (
                    /* Default Clean Resting State (No overlap, inviting guide) */
                    <motion.div
                      key="resting-guide"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm text-left"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-rose-500" />
                        <p className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Coronary Navigator
                        </p>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        Hover over any pinpoint on the heart or select an artery below to inspect real-time hemodynamics, perfusion territories, and AI stenosis predictions.
                      </p>

                      <div className="space-y-1.5">
                        {VESSEL_TARGETS.map((vt) => (
                          <button
                            key={vt.code}
                            type="button"
                            onClick={() => {
                              onSelectArtery?.(vt.code);
                              setInspectedVessel(vt.code);
                            }}
                            onMouseEnter={() => setInspectedVessel(vt.code)}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50/80 hover:bg-white border border-slate-100 hover:border-slate-300 transition-all text-left cursor-pointer"
                          >
                            <span className="font-mono text-[11px] font-bold text-slate-700">{vt.code}</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[130px]">{vt.name}</span>
                            <span className="text-[10px] font-bold" style={{ color: VESSEL_COLOR[vesselStates?.[vt.code] || 'normal'] }}>
                              {VESSEL_LABEL[vesselStates?.[vt.code] || 'normal']}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
