import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ShieldCheck, Stethoscope, Activity } from 'lucide-react';
import HeartCanvas from './HeartCanvas';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ── Live ECG strip ────────────────────────────────────────────────────
function EcgStrip({ className = '' }) {
  const d = 'M0,28 L35,28 L40,28 L44,8 L48,50 L52,12 L56,28 L72,28 L76,22 L80,28 L130,28 L165,28 L169,8 L173,50 L177,12 L181,28 L197,28 L201,22 L205,28 L255,28';
  return (
    <svg viewBox="0 0 255 56" className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id="ecgFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(244,63,94,0)" />
          <stop offset="15%"  stopColor="rgba(244,63,94,0.5)" />
          <stop offset="85%"  stopColor="rgba(244,63,94,0.5)" />
          <stop offset="100%" stopColor="rgba(244,63,94,0)" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#ecgFade)" strokeWidth="1.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="-255,0" dur="3.2s" repeatCount="indefinite" />
      </path>
      <path d={d} fill="none" stroke="url(#ecgFade)" strokeWidth="1.5" strokeLinecap="round" transform="translate(255,0)">
        <animateTransform attributeName="transform" type="translate" from="255,0" to="0,0" dur="3.2s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────
function StatPill({ value, label, color }) {
  return (
    <div className="hero-stat flex flex-col gap-0.5">
      <span className="metric-num text-2xl font-bold" style={{ color }}>{value}</span>
      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{label}</span>
    </div>
  );
}

export default function Hero({ onOpenSignIn, onScrollToSection, vesselStates, onSelectArtery }) {
  const heroRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.h-badge',   { y: -14, autoAlpha: 0, duration: 0.7 })
      .from('.h-title',   { y: 30,  autoAlpha: 0, duration: 0.9 }, '-=0.45')
      .from('.h-desc',    { y: 20,  autoAlpha: 0, duration: 0.75 }, '-=0.5')
      .from('.h-cta',     { y: 14,  autoAlpha: 0, duration: 0.65 }, '-=0.45')
      .from('.hero-stat', { y: 16,  autoAlpha: 0, duration: 0.55, stagger: 0.07 }, '-=0.5')
      .from('.h-canvas',  { scale: 0.97, autoAlpha: 0, duration: 1.1 }, '-=0.9');
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">

      {/* ECG ambient strip */}
      <div className="absolute bottom-4 left-0 right-0 opacity-30 pointer-events-none overflow-hidden" style={{ height: 56 }}>
        <EcgStrip className="w-full h-full" />
      </div>

      {/* Fine grid overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
        maskImage: 'radial-gradient(ellipse 90% 100% at 50% 50%, black 40%, transparent 100%)',
      }} />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">

          {/* ── Left ── */}
          <div className="space-y-7">

            <div className="h-badge inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full font-mono text-xs"
              style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.22)', color: '#fca5a5' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Multi-Vessel Coronary Decision System
            </div>

            <div className="h-title space-y-2">
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-display font-extrabold text-white leading-[1.06]">
                Spatial Heart<br />
                <span className="text-crimson-vital">Twin</span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>for</span>
              </h1>
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-display font-extrabold leading-[1.06]" style={{
                background: 'linear-gradient(135deg, #00e5ff 0%, #a5f3fc 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Coronary CAD
              </h1>
            </div>

            <p className="h-desc text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg font-light">
              Calibrated AI meets anatomical spatial intuition. Cardiologists get SHAP-grade clinical precision. Heart patients get a clear, human picture of their arteries.
            </p>

            <div className="h-cta flex flex-wrap gap-3 items-center">
              <button
                className="btn-primary"
                onClick={() => onScrollToSection?.('vessel-explorer')}
                id="hero-launch-btn"
              >
                <Activity className="w-4 h-4" />
                Launch Interactive Twin
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                className="btn-glass"
                onClick={() => onOpenSignIn?.('doctor')}
                id="hero-signin-btn"
              >
                <Stethoscope className="w-4 h-4" style={{ color: '#f43f5e' }} />
                Doctor &amp; Patient Sign In
              </button>
            </div>

            {/* Proof stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              <StatPill value="0.912" label="CAD ROC-AUC"      color="#00d68f" />
              <div className="w-px h-10 self-center" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <StatPill value="303"   label="Hospital Patients" color="#00e5ff" />
              <div className="w-px h-10 self-center" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <StatPill value="3V"    label="LAD · LCX · RCA"  color="#f0a500" />
              <div className="w-px h-10 self-center" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <StatPill value="<30ms" label="Inference Speed"   color="#f43f5e" />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>Zero-Leakage Anti-Hallucination Pipeline · UCI #411 Verified</span>
            </div>
          </div>

          {/* ── Right: 3D Spatial Heart ── */}
          <div className="h-canvas">
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
