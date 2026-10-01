import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// --------------------------------------------------
// Cross-section peel slider — drag reveals internal chambers
// --------------------------------------------------
function DissectionSlider({ slicePercent, onChange }) {
  const trackRef = useRef(null);
  const dragging = useRef(false);

  function applySlice(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    onChange(Math.max(0, Math.min(1, raw)));
  }

  function onPointerDown(e) {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    applySlice(e.clientX);
  }
  function onPointerMove(e) {
    if (!dragging.current) return;
    applySlice(e.clientX);
  }
  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'absolute', bottom: 22, left: '10%', right: '10%',
        height: 36, cursor: 'ew-resize', zIndex: 30,
        display: 'flex', alignItems: 'center', gap: 0,
      }}
      aria-label="Anatomical dissection slider"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(slicePercent * 100)}
    >
      {/* Track groove */}
      <div style={{ position: 'relative', flex: 1, height: 3, background: 'rgba(226,232,240,0.6)', borderRadius: 99 }}>
        <div
          style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: `${slicePercent * 100}%`, background: '#e11d48',
            borderRadius: 99, boxShadow: '0 0 8px rgba(225,29,72,0.5)',
          }}
        />
        {/* Thumb handle */}
        <div
          style={{
            position: 'absolute', top: '50%', left: `${slicePercent * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 20, height: 20, borderRadius: '50%',
            background: '#e11d48', border: '3px solid #fff',
            boxShadow: '0 0 12px rgba(225,29,72,0.55), 0 2px 6px rgba(0,0,0,0.2)',
            transition: 'box-shadow 0.15s',
          }}
        />
      </div>
    </div>
  );
}

// --------------------------------------------------
// SVG Anatomical Heart — dissection-aware layered render
// --------------------------------------------------
const LAYERS = [
  { id: 'epicardium', label: 'Epicardium',  threshold: 0.0 },
  { id: 'myocardium', label: 'Myocardium',  threshold: 0.25 },
  { id: 'endocardium', label: 'Endocardium', threshold: 0.5 },
  { id: 'chambers',   label: 'Chambers',    threshold: 0.75 },
];

function LayeredHeart({ slicePercent, vesselStates, selectedArtery }) {
  const S = { LAD: vesselStates?.LAD || 'moderate', LCX: vesselStates?.LCX || 'normal', RCA: vesselStates?.RCA || 'critical' };
  const C = { normal: '#10b981', moderate: '#f59e0b', critical: '#ef4444' };

  const visibleLayer = slicePercent < 0.25 ? 0 : slicePercent < 0.5 ? 1 : slicePercent < 0.75 ? 2 : 3;
  const clipX = Math.round(slicePercent * 500);

  return (
    <svg viewBox="0 0 500 560" width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        {/* Clip: left half = intact, right half = peeled */}
        <clipPath id="cb-peel-intact">
          <rect x="0" y="0" width={clipX} height="560" />
        </clipPath>
        <clipPath id="cb-peel-open">
          <rect x={clipX} y="0" width={500 - clipX} height="560" />
        </clipPath>

        {/* Tissue gradients */}
        <radialGradient id="cb-epi" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="55%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </radialGradient>
        <radialGradient id="cb-myo" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="60%" stopColor="#be123c" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
        <radialGradient id="cb-chamber" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>

        {/* Wet gloss highlight */}
        <radialGradient id="cb-gloss" cx="35%" cy="28%" r="40%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        <linearGradient id="cb-aorta" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <linearGradient id="cb-pulm" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <filter id="cb-glow-sm">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="cb-glow-lg">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ── INTACT LEFT SIDE (before slice line) ── */}
      <g clipPath="url(#cb-peel-intact)">
        {/* Epicardium — outermost wall */}
        <path
          d="M150 175 C110 200 95 255 110 325 C130 405 200 480 250 520 C305 475 370 400 395 320 C415 255 400 190 355 175 C310 160 260 165 220 168 Z"
          fill="url(#cb-epi)" stroke="#881337" strokeWidth="2"
        />
        {/* Great vessels */}
        <rect x="210" y="68" width="38" height="110" rx="10" fill="url(#cb-aorta)" />
        <rect x="254" y="78" width="28" height="95" rx="9" fill="url(#cb-pulm)" />
        {/* Gloss overlay */}
        <ellipse cx="185" cy="230" rx="68" ry="100" fill="url(#cb-gloss)" />
      </g>

      {/* ── PEELED RIGHT SIDE (after slice line) ── */}
      <g clipPath="url(#cb-peel-open)">
        {/* Myocardium layer */}
        {slicePercent >= 0.25 && (
          <path
            d="M150 175 C110 200 95 255 110 325 C130 405 200 480 250 520 C305 475 370 400 395 320 C415 255 400 190 355 175 C310 160 260 165 220 168 Z"
            fill="url(#cb-myo)" stroke="#7f1d1d" strokeWidth="2.5"
          />
        )}
        {/* Chambers (dark blood cavities) — only at 50%+ */}
        {slicePercent >= 0.5 && (
          <>
            {/* Right ventricle */}
            <path d="M170 310 C155 360 178 430 210 465 C240 455 250 415 248 340 C225 315 195 305 170 310 Z"
              fill="url(#cb-chamber)" />
            {/* Interventricular septum */}
            <path d="M248 340 C248 420 244 475 250 520 C256 475 258 410 255 340 Z"
              fill="#7f1d1d" stroke="#450a0a" strokeWidth="2" />
            {/* Left ventricle */}
            <path d="M255 345 C258 420 278 470 310 445 C345 415 355 355 335 325 C315 335 285 340 255 345 Z"
              fill="url(#cb-chamber)" />
            {/* Valve flaps */}
            <path d="M185 305 C198 328 220 325 232 308" stroke="#f1f5f9" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M270 310 C283 333 305 330 315 312" stroke="#f1f5f9" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}
        {/* Endocardium lining — only at 75%+ */}
        {slicePercent >= 0.75 && (
          <>
            <path d="M170 310 C155 360 178 430 210 465 C240 455 250 415 248 340 C225 315 195 305 170 310 Z"
              fill="none" stroke="#fda4af" strokeWidth="2.5" strokeDasharray="6,4" opacity="0.7" />
            <path d="M255 345 C258 420 278 470 310 445 C345 415 355 355 335 325 C315 335 285 340 255 345 Z"
              fill="none" stroke="#a5f3fc" strokeWidth="2.5" strokeDasharray="6,4" opacity="0.7" />
            <text x="172" y="385" fill="#a5f3fc" fontSize="11" fontFamily="monospace" fontWeight="bold">R. Ventricle</text>
            <text x="265" y="385" fill="#fda4af" fontSize="11" fontFamily="monospace" fontWeight="bold">L. Ventricle</text>
          </>
        )}
      </g>

      {/* ── CORONARY ARTERIES (above both halves) ── */}
      {/* RCA */}
      <path
        d="M210 255 C185 280 172 320 175 375 C180 415 195 440 220 465"
        stroke={C[S.RCA]} strokeWidth={selectedArtery === 'RCA' ? 5 : 3.5}
        strokeLinecap="round" fill="none"
        filter={selectedArtery === 'RCA' ? 'url(#cb-glow-lg)' : 'url(#cb-glow-sm)'}
      />
      {/* LAD */}
      <path
        d="M272 250 C262 290 258 340 262 390 C265 445 272 490 282 540"
        stroke={C[S.LAD]} strokeWidth={selectedArtery === 'LAD' ? 5 : 3.5}
        strokeLinecap="round" fill="none"
        filter={selectedArtery === 'LAD' ? 'url(#cb-glow-lg)' : 'url(#cb-glow-sm)'}
      />
      {/* LCX */}
      <path
        d="M288 255 C322 268 358 290 378 320 C395 350 395 390 385 425"
        stroke={C[S.LCX]} strokeWidth={selectedArtery === 'LCX' ? 5 : 3.5}
        strokeLinecap="round" fill="none"
        filter={selectedArtery === 'LCX' ? 'url(#cb-glow-lg)' : 'url(#cb-glow-sm)'}
      />

      {/* Slice edge glow (at split) */}
      {slicePercent > 0.02 && slicePercent < 0.98 && (
        <line
          x1={clipX} y1={140} x2={clipX} y2={535}
          stroke="rgba(225,29,72,0.5)" strokeWidth="2.5"
          strokeDasharray="6,3"
          style={{ filter: 'drop-shadow(0 0 6px rgba(225,29,72,0.7))' }}
        />
      )}
    </svg>
  );
}

// --------------------------------------------------
// HeroConceptB — Orinex Medical Luxury
// --------------------------------------------------
export default function HeroConceptB({ onOpenSignIn, onScrollToSection, vesselStates, selectedArtery }) {
  const sectionRef = useRef(null);
  const [slicePercent, setSlicePercent] = useState(0.05);
  const currentLayer = LAYERS.findIndex((l, i) => {
    const next = LAYERS[i + 1];
    return slicePercent >= l.threshold && (!next || slicePercent < next.threshold);
  });

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.cb-index', { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.45 })
        .fromTo('.cb-headline', { y: 45, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 }, '-=0.25')
        .fromTo('.cb-sub', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.5')
        .fromTo('.cb-cta', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, '-=0.35')
        .fromTo('.cb-rail-stat', { x: 22, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.09 }, '-=0.45')
        .fromTo('.cb-center', { scale: 0.94, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1, ease: 'back.out(1.3)' }, 0.15)
        .fromTo('.cb-slider-ui', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, '-=0.4');
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        minHeight: '94vh',
        background: '#060d18',
        paddingTop: '5rem',
        paddingBottom: '5rem',
      }}
    >
      {/* Dark surgical background grid */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, opacity: 0.12,
        backgroundImage: 'linear-gradient(rgba(248,250,252,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(248,250,252,0.07) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Deep crimson light bloom from heart position */}
      <div aria-hidden="true" style={{
        position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%, -50%)',
        width: 720, height: 720,
        background: 'radial-gradient(circle, rgba(225,29,72,0.22) 0%, rgba(225,29,72,0.06) 35%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="container-custom relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center" style={{ minHeight: '80vh' }}>

          {/* ── LEFT EDITORIAL COLUMN ── */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-8 lg:pr-4">

            {/* Engineering index */}
            <div className="cb-index">
              <span className="font-mono text-[10px] font-semibold text-rose-500/80 tracking-[0.22em] uppercase">
                01 — Cardiovascular Intelligence
              </span>
            </div>

            {/* Headline — oversized, white */}
            <h1
              className="cb-headline font-display font-extrabold leading-[1.0]"
              style={{
                fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)',
                letterSpacing: '-0.05em',
                color: '#f8fafc',
                textWrap: 'balance',
              }}
            >
              Cardiac<br />
              <span style={{ color: '#e11d48' }}>Dissection</span><br />
              Reimagined
            </h1>

            <p className="cb-sub text-slate-400 leading-relaxed max-w-xs" style={{ fontSize: '0.96rem' }}>
              Peel back each anatomical layer. Inspect your coronary arteries in real-time, powered by 
              validated AI clinical decision support.
            </p>

            <div className="cb-cta flex items-center gap-3 flex-wrap">
              <button
                onClick={() => onScrollToSection?.('vessel-explorer')}
                className="cb-cta cursor-pointer flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl text-white transition-all"
                style={{
                  background: '#e11d48',
                  boxShadow: '0 0 24px rgba(225,29,72,0.45), 0 4px 12px rgba(0,0,0,0.4)',
                }}
                id="concept-b-explore-btn"
              >
                <span>Explore</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenSignIn?.('doctor')}
                className="cb-cta cursor-pointer flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl text-slate-300 border border-slate-700 hover:border-slate-500 transition-all"
                id="concept-b-signin-btn"
              >
                <span>Clinical Access</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Layer label (updates as user drags) */}
            <div className="cb-slider-ui pt-2">
              <p className="font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-1.5">
                Active Layer
              </p>
              <div className="flex items-center gap-2">
                {LAYERS.map((l, i) => (
                  <div
                    key={l.id}
                    className="flex items-center gap-1.5 font-mono text-[10px] transition-all"
                    style={{ color: i === currentLayer ? '#e11d48' : 'rgba(100,116,139,0.5)', fontWeight: i === currentLayer ? 700 : 400 }}
                  >
                    <span className="w-1 h-1 rounded-full" style={{ background: i === currentLayer ? '#e11d48' : '#334155' }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CENTRE: Large anatomy canvas ── */}
          <div className="lg:col-span-5 relative cb-center">
            <div
              className="relative rounded-3xl overflow-hidden mx-auto"
              style={{
                height: 520,
                maxWidth: 440,
                background: 'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(225,29,72,0.14) 0%, rgba(6,13,24,0.9) 75%)',
                border: '1px solid rgba(225,29,72,0.22)',
                boxShadow: '0 0 80px rgba(225,29,72,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <LayeredHeart slicePercent={slicePercent} vesselStates={vesselStates} selectedArtery={selectedArtery} />
              <DissectionSlider slicePercent={slicePercent} onChange={setSlicePercent} />

              {/* Slice percent label */}
              <div
                className="cb-slider-ui absolute bottom-8 left-1/2 font-mono text-[9px] text-slate-500 tracking-wider"
                style={{ transform: 'translateX(-50%)', whiteSpace: 'nowrap', userSelect: 'none', marginTop: 4 }}
                aria-hidden="true"
              >
                Drag to dissect — {Math.round(slicePercent * 100)}%
              </div>
            </div>
          </div>

          {/* ── RIGHT: Vertical telemetry rail ── */}
          <div className="lg:col-span-3 flex flex-col justify-center gap-5 lg:pl-4">
            <p className="font-mono text-[10px] font-semibold text-slate-600 tracking-[0.18em] uppercase mb-1">
              Telemetry Rail
            </p>

            {[
              { label: 'Detection Rate', value: '91.2%', sub: 'Overall CAD', color: '#10b981' },
              { label: 'LAD Accuracy',   value: '84.4%', sub: 'Left Anterior', color: '#e11d48' },
              { label: 'LCX Accuracy',   value: '73.1%', sub: 'Left Circumflex', color: '#0284c7' },
              { label: 'RCA Accuracy',   value: '72.1%', sub: 'Right Coronary', color: '#d97706' },
              { label: 'Patients Scanned', value: '2,847', sub: 'Dataset', color: '#8b5cf6' },
            ].map((stat, i) => (
              <div
                key={i}
                className="cb-rail-stat flex flex-col gap-0.5 py-3 px-4 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${stat.color}28`,
                  borderLeft: `2px solid ${stat.color}`,
                }}
              >
                <span className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">{stat.label}</span>
                <span className="font-display font-extrabold text-slate-100 leading-none" style={{ fontSize: '1.55rem', letterSpacing: '-0.03em', color: stat.color }}>
                  {stat.value}
                </span>
                <span className="font-mono text-[9px] text-slate-600">{stat.sub}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
