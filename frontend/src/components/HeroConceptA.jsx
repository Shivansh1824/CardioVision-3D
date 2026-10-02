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

import React, { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import RealisticHeart3DViewer from './RealisticHeart3DViewer';
import { preloadHeartModels } from '../services/heartModelService';

export default function HeroConceptA({
  onOpenSignIn,
  onScrollToSection,
}) {
  const containerRef = useRef(null);

  // Background preload 3D models immediately when site opens
  useEffect(() => {
    preloadHeartModels();
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        '.hero-anim-item',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
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

          {/* ─── LEFT: Editorial copy & Proof Metric Cards ─────────────────── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="hero-anim-item ca-overline inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-rose-600 uppercase tracking-widest">
                Interactive Heart &amp; Artery Health Guide
              </span>
            </div>

            <h1 className="hero-anim-item ca-headline font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.06]">
              Understand <br />
              Your Heart <br />
              &amp; <span className="text-gradient-vivid">Coronary Arteries</span>
            </h1>

            <p className="hero-anim-item ca-sub text-base sm:text-lg text-slate-600 leading-relaxed max-w-md">
              An intuitive visual platform that helps doctors triage coronary disease
              and helps patients clearly see how blood flows through their heart.
              Explore the three main arteries with zero medical confusion.
            </p>

            <div className="hero-anim-item ca-cta flex flex-wrap items-center gap-3">
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
                <span>Sign In to Portal</span>
              </button>
            </div>

            {/* 4 Stat Proof Metric Cards (Matching Design Specification) */}
            <div className="hero-anim-item grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="font-display text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  91.2%
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight mt-1">
                  Detection Accuracy
                </span>
                <span className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                  5-Fold Validated
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="font-display text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  3 Vessels
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight mt-1">
                  Main Heart Arteries
                </span>
                <span className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                  LAD, LCX &amp; RCA
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="font-display text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Real-Time
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight mt-1">
                  Instant Visual Updates
                </span>
                <span className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                  Immediate 3D feedback
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <span className="font-display text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Simple
                </span>
                <span className="text-xs font-bold text-slate-800 leading-tight mt-1">
                  Plain Language
                </span>
                <span className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                  Zero confusing jargon
                </span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Full-Stage 3D Heart Centerpiece ─────────── */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center ca-heart-stage relative">
            <RealisticHeart3DViewer />
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
