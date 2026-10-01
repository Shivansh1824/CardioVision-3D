/**
 * HeroConceptA — HeartBloom Cinematic
 * Centerpiece: Photorealistic anatomical heart image
 * (rendered at Cinema4D quality, used as a high-fidelity asset —
 *  the same approach used by every award-winning medical design studio)
 *
 * Animations:
 * - GSAP heartbeat: scale pulse at 72 BPM on the heart image
 * - GSAP entrance: staggered copy, HUDs, heart scale-in
 * - Framer Motion: hover lift on each HUD card
 * - Canvas: live ECG waveform
 * - SVG overlays: coronary artery paths with glow, colour-coded to vessel state
 */

import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Crosshair } from 'lucide-react';

gsap.registerPlugin(useGSAP);

// ─── Vessel state → colour + label ───────────────────────────────────────────
const VESSEL_COLOR = { normal: '#10b981', moderate: '#f59e0b', critical: '#ef4444' };
const VESSEL_LABEL = { normal: 'Clear', moderate: 'Moderate', critical: 'Severe' };

// ─── Clinical Vessel Targets & Anatomical Territories ────────────────────────
// LAD: Left Anterior Descending (anterior interventricular sulcus → apex)
// LCX: Left Circumflex (coronary sulcus → obtuse marginal / posterolateral wall)
// RCA: Right Coronary Artery (right atrioventricular groove → crux / inferior wall)
const VESSEL_TARGETS = [
  {
    code: 'LAD',
    name: 'Left Anterior Descending',
    shortName: 'Anterior',
    pathway: 'Anterior interventricular groove to apex',
    territory: 'Anterior LV Wall & 2/3 Interventricular Septum',
    coords: { x: 52, y: 58 },
    ffr: '0.74',
    flow: '26 cm/s',
    hemodynamics: 'Elevated Ischemia Risk',
  },
  {
    code: 'LCX',
    name: 'Left Circumflex Artery',
    shortName: 'Lateral',
    pathway: 'Left atrioventricular groove along lateral margin',
    territory: 'Lateral & Posterolateral Left Ventricle',
    coords: { x: 67, y: 44 },
    ffr: '0.94',
    flow: '38 cm/s',
    hemodynamics: 'Normal Patent Flow',
  },
  {
    code: 'RCA',
    name: 'Right Coronary Artery',
    shortName: 'Inferior',
    pathway: 'Right coronary sulcus down to cardiac crux',
    territory: 'Right Atrium, RV & Conduction (SA/AV Nodes)',
    coords: { x: 33, y: 52 },
    ffr: '0.58',
    flow: '14 cm/s',
    hemodynamics: 'Critical Stenosis / Perfusion Deficit',
  },
];

// ─── Live ECG canvas ─────────────────────────────────────────────────────────
function ECGWaveform() {
  const canvasRef = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const mid = H / 2;
    let offset = 0;

    // Anatomically shaped ECG cycle
    function ecgY(x) {
      const c = (x % 120) / 120;
      if (c < 0.12) return -Math.sin((c / 0.12) * Math.PI) * 3.5;  // P
      if (c < 0.22) return 0;
      if (c < 0.26) return Math.sin(((c - 0.22) / 0.04) * Math.PI) * 20; // QRS up
      if (c < 0.30) return -Math.sin(((c - 0.26) / 0.04) * Math.PI) * 12; // S
      if (c < 0.38) return 0;
      if (c < 0.55) return Math.sin(((c - 0.38) / 0.17) * Math.PI) * 5.5; // T
      return 0;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 1.6;
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 5;
      for (let x = 0; x < W; x++) {
        const y = mid + ecgY(x + offset);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += 1.1;
      raf.current = requestAnimationFrame(draw);
    }

    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={42}
      className="w-full"
      style={{ height: 42 }}
      aria-hidden="true"
    />
  );
}


// ─── Main component ───────────────────────────────────────────────────────────
export default function HeroConceptA({
  onOpenSignIn,
  onScrollToSection,
  vesselStates,
  selectedArtery,
  onSelectArtery,
}) {
  const sectionRef = useRef(null);
  const heartWrapRef = useRef(null);
  const [activeVessel, setActiveVessel] = useState(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  // GSAP entrance + persistent heartbeat pulse
  useGSAP(
    () => {
      // Entrance sequence
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.ca-overline', { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 })
        .fromTo('.ca-headline', { y: 38, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.78 }, '-=0.35')
        .fromTo('.ca-sub',      { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62 }, '-=0.48')
        .fromTo('.ca-cta',      { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, '-=0.38')
        .fromTo('.ca-stat',     { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.07 }, '-=0.3')
        .fromTo('.ca-heart-wrap', { scale: 0.88, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.05, ease: 'back.out(1.3)' }, '-=0.65')
        .fromTo('.ca-hud',      { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.1 }, '-=0.55');

      // Heartbeat pulse (~72 BPM)
      const heartImg = document.getElementById('ca-heart-image');
      if (heartImg) {
        gsap.to(heartImg, {
          scale: 1.034,
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

  // Pointer proximity & 3D tilt tracking
  const handlePointerMove = (e) => {
    if (!heartWrapRef.current) return;
    const rect = heartWrapRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    // 3D perspective tilt
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -normY * 9, ry: normX * 11 });

    // Find nearest vessel target pin
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

    if (minDistance < 24) {
      setActiveVessel(nearest);
    } else {
      setActiveVessel(null);
    }
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setActiveVessel(null);
  };

  const LADs = vesselStates?.LAD || 'moderate';
  const LCXs = vesselStates?.LCX || 'normal';
  const RCAs = vesselStates?.RCA || 'critical';

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '92vh',
        paddingTop: '5.5rem',
        paddingBottom: '5rem',
        background:
          'radial-gradient(ellipse 85% 65% at 68% 42%, rgba(225,29,72,0.09) 0%, transparent 58%),' +
          'radial-gradient(ellipse 65% 55% at 12% 62%, rgba(186,230,253,0.28) 0%, transparent 58%),' +
          'linear-gradient(168deg, #f8fafc 0%, #fdf4f7 48%, #f0f9ff 100%)',
      }}
    >
      {/* Soft ambient backdrop bloom */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', right: -60, top: '45%', transform: 'translateY(-50%)',
          width: 700, height: 700, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(225,29,72,0.09) 0%, transparent 70%)',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* ─── LEFT: Editorial copy ──────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-7 lg:pr-4">

            {/* Overline — Style A monospace */}
            <div className="ca-overline flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0" />
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-rose-600 uppercase">
                Interactive Cardiovascular Twin
              </span>
            </div>

            <h1
              className="ca-headline font-display font-extrabold text-slate-900 leading-[1.05]"
              style={{ fontSize: 'clamp(2.5rem, 5.2vw, 4.1rem)', letterSpacing: '-0.04em' }}
            >
              Understand Your Heart &amp;{' '}
              <span className="text-gradient-vivid">Coronary Arteries</span>
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
            <div className="pt-1">
              <p className="font-mono text-[10px] font-semibold text-slate-400 tracking-widest uppercase mb-2.5">
                Live Vessel Triage
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {[
                  { code: 'LAD', name: 'Anterior', status: LADs },
                  { code: 'LCX', name: 'Lateral',  status: LCXs },
                  { code: 'RCA', name: 'Inferior', status: RCAs },
                ].map((v) => (
                  <div
                    key={v.code}
                    className="ca-stat flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-sm"
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Heart + HUDs ──────────────────────────────────────── */}
          <div className="lg:col-span-7 relative ca-heart-wrap">

            {/* ── HUD: ECG Monitor (top-left) ── */}
            <motion.div
              className="ca-hud absolute left-0 top-2 z-20 bg-white/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-lg"
              style={{
                minWidth: 188,
                border: '1px solid rgba(225,29,72,0.18)',
                boxShadow: '0 8px 32px rgba(225,29,72,0.10), 0 2px 8px rgba(0,0,0,0.07)',
              }}
              whileHover={{ y: -3, transition: { duration: 0.22 } }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
                </span>
                <span className="font-mono text-[10px] font-bold text-rose-600 tracking-wider uppercase flex-1">Live ECG</span>
                <span className="font-display font-bold text-slate-900 text-sm">72 BPM</span>
              </div>
              <ECGWaveform />
              <p className="mt-1 font-mono text-[9px] text-slate-400 tracking-wider">Normal sinus rhythm</p>
            </motion.div>

            {/* ── HUD: Detection accuracy (top-right) ── */}
            <motion.div
              className="ca-hud absolute right-0 top-2 z-20 bg-white/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-lg"
              style={{
                minWidth: 152,
                border: '1px solid rgba(5,150,105,0.18)',
                boxShadow: '0 8px 32px rgba(5,150,105,0.10), 0 2px 8px rgba(0,0,0,0.06)',
              }}
              whileHover={{ y: -3, transition: { duration: 0.22 } }}
            >
              <p className="font-mono text-[10px] font-bold text-emerald-700 tracking-wider uppercase mb-1">Detection Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-emerald-700 text-2xl">91.2%</span>
                <span className="text-[10px] text-slate-500 font-medium">Overall CAD</span>
              </div>
              <div className="mt-2 w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: '91.2%', boxShadow: '0 0 6px #10b98166' }}
                />
              </div>
              <p className="mt-1.5 font-mono text-[9px] text-slate-400 tracking-wider">5-Fold Stratified</p>
            </motion.div>

            {/* ── HEART CENTREPIECE + INTERACTIVE CLINICAL TARGET HUD ── */}
            <div
              ref={heartWrapRef}
              onMouseMove={handlePointerMove}
              onMouseLeave={handlePointerLeave}
              className="relative mx-auto cursor-crosshair"
              style={{
                width: '100%',
                maxWidth: 480,
                paddingTop: '3.5rem',
                paddingBottom: '3.5rem',
              }}
            >
              {/* Soft radial glow behind heart */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse 75% 70% at 50% 52%, rgba(225,29,72,0.14) 0%, rgba(186,230,253,0.12) 45%, transparent 72%)',
                  borderRadius: '50%', filter: 'blur(18px)',
                }}
              />

              {/* Heart image container with 3D tilt */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transition: 'transform 0.12s ease-out',
                }}
              >
                <img
                  id="ca-heart-image"
                  src="/heart-clean.png"
                  alt="Photorealistic anatomical human heart showing natural coronary arteries LAD, LCX, RCA on transparent background"
                  width={480}
                  height={480}
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

                {/* ── Interactive Vessel Target Pins ("Three Nerves") ── */}
                {VESSEL_TARGETS.map((vt) => {
                  const isHovered = activeVessel === vt.code;
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
                        zIndex: isTargeted ? 35 : 20,
                      }}
                    >
                      {/* Clinical Target Hotspot */}
                      <button
                        type="button"
                        onClick={() => onSelectArtery?.(vt.code)}
                        onMouseEnter={() => setActiveVessel(vt.code)}
                        className="relative group cursor-pointer focus:outline-none flex items-center justify-center p-3"
                        aria-label={`Inspect ${vt.name}`}
                      >
                        {/* Radar Pulse Wave */}
                        <span
                          className="absolute inset-1 rounded-full animate-ping opacity-60"
                          style={{
                            background: color,
                            animationDuration: isTargeted ? '1.4s' : '3s',
                          }}
                        />
                        {/* Target Crosshair Ring */}
                        <span
                          className="relative flex items-center justify-center rounded-full transition-all duration-300"
                          style={{
                            width: isTargeted ? 24 : 18,
                            height: isTargeted ? 24 : 18,
                            background: isTargeted ? `${color}25` : 'rgba(255,255,255,0.92)',
                            border: `2px solid ${color}`,
                            boxShadow: `0 0 ${isTargeted ? '16px' : '6px'} ${color}`,
                          }}
                        >
                          <span
                            className="rounded-full transition-all duration-300"
                            style={{
                              width: isTargeted ? 8 : 6,
                              height: isTargeted ? 8 : 6,
                              background: color,
                            }}
                          />
                        </span>
                      </button>

                      {/* Expanding Clinical Breakdown Card */}
                      <AnimatePresence>
                        {isTargeted && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 6 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute z-50 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200/90 pointer-events-auto text-left"
                            style={{
                              width: 275,
                              left: vt.coords.x > 50 ? 'auto' : 24,
                              right: vt.coords.x > 50 ? 24 : 'auto',
                              top: vt.coords.y > 55 ? 'auto' : -30,
                              bottom: vt.coords.y > 55 ? 24 : 'auto',
                              boxShadow: `0 20px 40px -12px ${color}35, 0 8px 24px rgba(0,0,0,0.09)`,
                            }}
                          >
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                                <span className="font-mono text-xs font-bold text-slate-900">{vt.code}</span>
                                <span className="text-[10px] text-slate-400 font-mono tracking-wider">Artery</span>
                              </div>
                              <span
                                className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md"
                                style={{ background: `${color}18`, color }}
                              >
                                {VESSEL_LABEL[status]} Stenosis
                              </span>
                            </div>

                            {/* Anatomical Name & Territory */}
                            <p className="font-display text-xs font-bold text-slate-800 leading-tight mb-1">
                              {vt.name}
                            </p>
                            <p className="text-[10px] text-slate-500 mb-2 leading-snug">
                              {vt.territory}
                            </p>

                            {/* Hemodynamic Telemetry Breakdown */}
                            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100 mb-2.5">
                              <div>
                                <p className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">Perfusion FFR</p>
                                <p className="font-display font-bold text-xs text-slate-800 mt-0.5">{vt.ffr} FFR</p>
                              </div>
                              <div>
                                <p className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">Flow Velocity</p>
                                <p className="font-display font-bold text-xs text-slate-800 mt-0.5">{vt.flow}</p>
                              </div>
                            </div>

                            {/* Clinical Simulator Trigger */}
                            <button
                              onClick={() => {
                                onSelectArtery?.(vt.code);
                                onScrollToSection?.('vessel-explorer');
                              }}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[10px] font-bold text-white transition-all cursor-pointer shadow-xs"
                              style={{ background: color }}
                            >
                              <span>Explore Stenosis Simulation</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── HUD: Vessel accuracy (bottom-left) ── */}
            <motion.div
              className="ca-hud absolute left-0 bottom-0 z-20 bg-white/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-lg"
              style={{
                minWidth: 170,
                border: '1px solid rgba(2,132,199,0.14)',
                boxShadow: '0 8px 32px rgba(2,132,199,0.09), 0 2px 8px rgba(0,0,0,0.07)',
              }}
              whileHover={{ y: -3, transition: { duration: 0.22 } }}
            >
              <p className="font-mono text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-2">Vessel Accuracy</p>
              {[
                { code: 'LAD', pct: 84.4, color: '#e11d48' },
                { code: 'LCX', pct: 73.1, color: '#0284c7' },
                { code: 'RCA', pct: 72.1, color: '#d97706' },
              ].map((v) => (
                <div key={v.code} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <span className="font-mono text-[10px] font-bold text-slate-700 w-7">{v.code}</span>
                  <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: v.color }} />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 w-9 text-right">{v.pct}%</span>
                </div>
              ))}
            </motion.div>

            {/* ── HUD: Clinical grade (bottom-right) ── */}
            <motion.div
              className="ca-hud absolute right-2 bottom-0 z-20 bg-white/90 backdrop-blur-xl rounded-2xl p-3.5 shadow-lg"
              style={{
                border: '1px solid rgba(14,165,233,0.16)',
                boxShadow: '0 8px 24px rgba(14,165,233,0.10), 0 2px 8px rgba(0,0,0,0.06)',
              }}
              whileHover={{ y: -3, transition: { duration: 0.22 } }}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                <div>
                  <p className="font-mono text-[9px] font-bold text-sky-700 tracking-wider uppercase">Clinical CDS</p>
                  <p className="font-display font-bold text-slate-900 text-xs mt-0.5">Triage Ready</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
