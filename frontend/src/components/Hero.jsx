import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import AnatomicalHeartVisualizer from './AnatomicalHeartVisualizer';

gsap.registerPlugin(useGSAP);

export default function Hero({
  onOpenSignIn,
  onScrollToSection,
  vesselStates,
  onSelectArtery,
  selectedArtery,
}) {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
        .fromTo('.hero-title', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
        .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-cta-btn', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .fromTo('.hero-stat-box', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .fromTo('.hero-heart-container', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, '-=0.6');
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative pt-6 pb-14 md:pt-12 md:pb-20 overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Rebalanced, Clear, Engaging Copy */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Style 1: Editorial Monospace Overline (No Bubble Pill) */}
            <div className="hero-badge flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
              <span className="font-mono text-xs font-bold tracking-widest text-rose-600 uppercase">
                Interactive Heart &amp; Artery Health Guide
              </span>
            </div>

            {/* Headline with Clean Typography */}
            <div className="space-y-4">
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Understand Your Heart &amp;{' '}
                <span className="text-gradient-vivid">Coronary Arteries</span>
              </h1>
              <p className="hero-desc text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                An intuitive visual platform that helps doctors triage coronary disease and helps patients clearly see how blood flows through their heart. Explore the three main arteries with zero medical confusion.
              </p>
            </div>

            {/* Clean Action Buttons (Doctor Icon Removed as Requested) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() =>
                  onScrollToSection
                    ? onScrollToSection('vessel-explorer')
                    : document.getElementById('vessel-explorer')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="hero-cta-btn btn-primary-vibrant text-sm cursor-pointer shadow-md"
                id="hero-explore-twin-btn"
              >
                <span>Explore Arteries</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
                className="hero-cta-btn btn-secondary-glass text-sm cursor-pointer"
                id="hero-sign-in-btn"
              >
                <span>Sign In to Portal</span>
              </button>
            </div>

            {/* 4 Proof Metric Cards with Clean, Human-Friendly Numbers */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { val: '91.2%', label: 'Detection Accuracy', sub: '5-Fold Validated', color: 'text-emerald-700' },
                { val: '3 Vessels', label: 'Main Heart Arteries', sub: 'LAD, LCX & RCA', color: 'text-rose-700' },
                { val: 'Real-Time', label: 'Instant Visual Updates', sub: 'Immediate 3D feedback', color: 'text-sky-700' },
                { val: 'Simple', label: 'Plain Language', sub: 'Zero confusing jargon', color: 'text-indigo-700' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="hero-stat-box p-3 rounded-2xl bg-white/90 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all"
                >
                  <div className={`text-xl font-bold font-display ${s.color}`}>{s.val}</div>
                  <div className="text-xs text-slate-800 font-semibold mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Anatomical Real Heart Centerpiece */}
          <div className="lg:col-span-6 hero-heart-container">
            <AnatomicalHeartVisualizer
              vesselStates={vesselStates}
              selectedArtery={selectedArtery}
              onSelectArtery={onSelectArtery}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
