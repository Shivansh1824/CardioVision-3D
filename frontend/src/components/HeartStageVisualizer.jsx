/**
 * HeartStageVisualizer — Interactive 3D Cardiac Centerpiece
 * 
 * Features:
 * - Two modes: 'surface' (coronary blood perfusion) & 'dissected' (coronal chamber opening)
 * - Anatomical Coronal Split-Peel Animation:
 *     Splits outer heart into Left and Right hemisections that rotate and part open
 *     Smooth camera zoom-out reframe
 *     Reveals underlying coronal cross-section of internal chambers
 * - Prominent clinical landmark badges & targeting reticles (LV, RV, IVS, Valves)
 * - Reactive hover callout cards with clinical significance and pathology
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VESSEL_COLOR,
  SURFACE_VESSELS,
  DISSECTION_LANDMARKS,
} from './cardiacAnatomyData';
import AnatomicalCalloutTooltip from './AnatomicalCalloutTooltip';

export default function HeartStageVisualizer({
  viewMode,
  vesselStates,
  onSelectArtery,
  onScrollToSection,
}) {
  const heartWrapRef = useRef(null);
  const [activeCallout, setActiveCallout] = useState(null);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);

  // Proximity detection & 3D parallax tilt
  const handlePointerMove = (e) => {
    if (!heartWrapRef.current) return;
    const rect = heartWrapRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -normY * 7, ry: normX * 9 });
    setIsHoveringHeart(true);

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
        setActiveCallout(minDistance < 18 ? nearest : null);
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
        setActiveCallout(minDistance < 20 ? nearest : null);
      }
    }
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setIsHoveringHeart(false);
    setIsHoveringCard(false);
    setActiveCallout(null);
  };

  const activeVesselData = SURFACE_VESSELS.find((v) => v.code === activeCallout) || null;
  const activeDissectionData = DISSECTION_LANDMARKS.find((d) => d.id === activeCallout) || null;

  const isDissected = viewMode === 'dissected';

  return (
    <div
      ref={heartWrapRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative w-full max-w-[480px] sm:max-w-[510px] flex items-center justify-center cursor-crosshair py-2"
    >
      {/* Soft volumetric glow backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -10,
          background: isDissected
            ? 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(225,29,72,0.16) 0%, rgba(56,189,248,0.12) 50%, transparent 72%)'
            : 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(225,29,72,0.14) 0%, rgba(186,230,253,0.12) 48%, transparent 72%)',
          borderRadius: '50%',
          filter: 'blur(24px)',
          transition: 'background 0.5s ease',
        }}
      />

      {/* 3D Perspective Tilt Stage & Camera Zoom-Out */}
      <motion.div
        id="ca-heart-canvas"
        animate={{
          scale: isDissected ? 0.93 : isHoveringHeart ? 1.03 : 1.0,
          rotateX: tilt.rx,
          rotateY: tilt.ry,
        }}
        transition={{
          scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          rotateX: { duration: 0.15, ease: 'easeOut' },
          rotateY: { duration: 0.15, ease: 'easeOut' },
        }}
        style={{
          position: 'relative',
          width: '100%',
          perspective: 1200,
        }}
      >
        {/* ── Layer 1: Internal Dissected Chamber View (Revealed when open) ── */}
        <motion.div
          animate={{
            opacity: isDissected ? 1 : 0,
            scale: isDissected ? 1 : 0.95,
            filter: isDissected ? 'blur(0px)' : 'blur(4px)',
          }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: isDissected ? 'relative' : 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: isDissected ? 'auto' : 'none',
          }}
        >
          <img
            src="/heart-dissected.png"
            alt="Coronal cross section showing left and right ventricles, valves and septum"
            width={500}
            height={500}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              userSelect: 'none',
              WebkitUserDrag: 'none',
              filter: 'drop-shadow(0 20px 32px rgba(0,0,0,0.16))',
            }}
            draggable={false}
          />
        </motion.div>

        {/* ── Layer 2: Surgical Dissection Incision Line (Seam flash effect) ── */}
        <AnimatePresence>
          {isDissected && (
            <motion.div
              key="incision-laser"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: [0, 0.9, 0], scaleY: [0.2, 1, 0.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '12%',
                bottom: '12%',
                width: 2,
                transform: 'translateX(-50%)',
                background: 'linear-gradient(180deg, rgba(225,29,72,0) 0%, #38bdf8 30%, #ffffff 50%, #e11d48 80%, rgba(225,29,72,0) 100%)',
                boxShadow: '0 0 12px #38bdf8, 0 0 20px rgba(255,255,255,0.8)',
                zIndex: 25,
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Layer 3: Surface Heart (Anterior Coronal Hemisections Split & Peel) ── */}
        <div
          style={{
            position: isDissected ? 'absolute' : 'relative',
            inset: 0,
            zIndex: 20,
            pointerEvents: isDissected ? 'none' : 'auto',
          }}
        >
          {/* Left Flap (Left Hemisection: x: 0% -> 50%) */}
          <motion.div
            animate={
              isDissected
                ? {
                    x: -36,
                    rotateY: -35,
                    opacity: 0,
                    scale: 0.96,
                  }
                : {
                    x: 0,
                    rotateY: 0,
                    opacity: 1,
                    scale: 1,
                  }
            }
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'polygon(0% 0%, 50.2% 0%, 50.2% 100%, 0% 100%)',
              transformOrigin: 'left center',
              backfaceVisibility: 'hidden',
            }}
          >
            <img
              src="/heart-clean.png"
              alt="Anterior heart left coronal section"
              width={500}
              height={500}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                userSelect: 'none',
                WebkitUserDrag: 'none',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.12))',
              }}
              draggable={false}
            />
          </motion.div>

          {/* Right Flap (Right Hemisection: x: 50% -> 100%) */}
          <motion.div
            animate={
              isDissected
                ? {
                    x: 36,
                    rotateY: 35,
                    opacity: 0,
                    scale: 0.96,
                  }
                : {
                    x: 0,
                    rotateY: 0,
                    opacity: 1,
                    scale: 1,
                  }
            }
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: isDissected ? 'absolute' : 'relative',
              inset: 0,
              clipPath: 'polygon(49.8% 0%, 100% 0%, 100% 100%, 49.8% 100%)',
              transformOrigin: 'right center',
              backfaceVisibility: 'hidden',
            }}
          >
            <img
              src="/heart-clean.png"
              alt="Anterior heart right coronal section"
              width={500}
              height={500}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                userSelect: 'none',
                WebkitUserDrag: 'none',
                filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.12))',
              }}
              draggable={false}
            />
          </motion.div>
        </div>

        {/* ── Layer 4: Active Coronary Blood Flow Streams (Active in Surface Mode) ── */}
        <motion.div
          animate={{ opacity: isDissected ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 22,
            pointerEvents: 'none',
          }}
        >
          <svg
            viewBox="0 0 400 420"
            className="w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="visBloodFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#e11d48" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#991b1b" stopOpacity="0.45" />
              </linearGradient>
              <filter id="visBloodGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* LAD Arterial Blood Flow Stream */}
            <path
              d="M 198 165 C 194 200 192 235 195 270 C 198 305 204 338 206 370"
              fill="none"
              stroke="url(#visBloodFlowGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray="10 8"
              className="animate-blood-flow"
              filter="url(#visBloodGlow)"
              opacity={activeCallout === 'LAD' ? 1 : 0.65}
            />

            {/* LCX Arterial Blood Flow Stream */}
            <path
              d="M 205 162 C 230 162 255 174 275 198 C 292 220 298 245 292 275"
              fill="none"
              stroke="url(#visBloodFlowGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray="9 7"
              className="animate-blood-flow-fast"
              filter="url(#visBloodGlow)"
              opacity={activeCallout === 'LCX' ? 1 : 0.65}
            />

            {/* RCA Arterial Blood Flow Stream */}
            <path
              d="M 185 175 C 168 195 156 222 154 252 C 152 280 160 308 172 334"
              fill="none"
              stroke="url(#visBloodFlowGrad)"
              strokeWidth="3.0"
              strokeLinecap="round"
              strokeDasharray="10 8"
              className="animate-blood-flow"
              filter="url(#visBloodGlow)"
              opacity={activeCallout === 'RCA' ? 1 : 0.65}
            />
          </svg>
        </motion.div>

        {/* ── Layer 5: Precision Surface Pinpoints (Active in Surface Mode) ── */}
        {!isDissected &&
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
                  zIndex: isSelected ? 35 : 24,
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
                        : '0 2px 6px rgba(0,0,0,0.35)',
                    }}
                  />
                </button>
              </div>
            );
          })}

        {/* ── Layer 6: Visible Clinical Internal Landmark Targets (Dissection Mode) ── */}
        {isDissected &&
          DISSECTION_LANDMARKS.map((landmark, idx) => {
            const isSelected = activeCallout === landmark.id;

            return (
              <motion.div
                key={landmark.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.25 + idx * 0.08, ease: 'backOut' }}
                style={{
                  position: 'absolute',
                  left: `${landmark.coords.x}%`,
                  top: `${landmark.coords.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isSelected ? 40 : 30,
                }}
              >
                <div className="relative flex items-center group">
                  {/* Interactive Reticle Target */}
                  <button
                    type="button"
                    onClick={() => setActiveCallout(isSelected ? null : landmark.id)}
                    onMouseEnter={() => setActiveCallout(landmark.id)}
                    className="relative flex items-center justify-center p-2 cursor-pointer focus:outline-none"
                    aria-label={`Inspect ${landmark.name}`}
                  >
                    {/* Concentric radar pulse ring */}
                    <span
                      className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40"
                      style={{ background: '#e11d48' }}
                    />

                    {/* Surgical crosshair core */}
                    <span
                      className="rounded-full transition-all duration-200 relative z-10 flex items-center justify-center"
                      style={{
                        width: isSelected ? 16 : 12,
                        height: isSelected ? 16 : 12,
                        background: '#e11d48',
                        border: '2px solid #ffffff',
                        boxShadow: isSelected
                          ? '0 0 0 4px rgba(225,29,72,0.45), 0 0 16px #e11d48'
                          : '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  </button>

                  {/* High-Visibility Clinical Floating Badge (Clearly Identifiable) */}
                  <div
                    onClick={() => setActiveCallout(isSelected ? null : landmark.id)}
                    className={`cursor-pointer absolute whitespace-nowrap px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold transition-all shadow-md pointer-events-auto ${
                      landmark.badgePos === 'left'
                        ? 'right-full mr-1 top-1/2 -translate-y-1/2'
                        : landmark.badgePos === 'top'
                        ? 'bottom-full mb-1 left-1/2 -translate-x-1/2'
                        : landmark.badgePos === 'bottom'
                        ? 'top-full mt-1 left-1/2 -translate-x-1/2'
                        : 'left-full ml-1 top-1/2 -translate-y-1/2'
                    } ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/25 scale-105'
                        : 'bg-slate-900/90 text-slate-100 hover:bg-slate-950 border-slate-700/80 backdrop-blur-sm'
                    }`}
                  >
                    <span className="text-rose-400 font-extrabold mr-1">[{landmark.id}]</span>
                    <span>{landmark.name}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

        {/* ── Layer 7: Interactive Detailed Callout Card (Floating near landmark) ── */}
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
      </motion.div>
    </div>
  );
}
