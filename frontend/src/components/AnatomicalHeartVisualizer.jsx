import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Layers, ZoomIn, ZoomOut, Activity, Droplets } from 'lucide-react';

const STATUS = {
  normal:   { color: '#059669', bg: '#d1fae5', label: 'Clear Flow (<50% Stenosis)',   badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  moderate: { color: '#d97706', bg: '#fef3c7', label: 'Narrowed (50–69% Stenosis)',  badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  critical: { color: '#e11d48', bg: '#ffe4e6', label: 'Severe Blockage (≥70%)',      badge: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export default function AnatomicalHeartVisualizer({
  vesselStates = { LAD: 'moderate', LCX: 'normal', RCA: 'critical' },
  selectedArtery = 'LAD',
  onSelectArtery = () => {},
}) {
  // Modes: 'coronary' (surface arteries) | 'chambers' (internal cross-section) | 'flow' (animated blood circulation)
  const [activeLayer, setActiveLayer] = useState('coronary');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredPart, setHoveredPart] = useState(null);

  const ladStatus = STATUS[vesselStates.LAD] || STATUS.normal;
  const lcxStatus = STATUS[vesselStates.LCX] || STATUS.normal;
  const rcaStatus = STATUS[vesselStates.RCA] || STATUS.normal;

  const currentArteryStatus =
    selectedArtery === 'LAD' ? ladStatus : selectedArtery === 'LCX' ? lcxStatus : rcaStatus;

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-white via-rose-50/30 to-slate-50 border border-slate-200/90 shadow-xl overflow-hidden p-5 sm:p-6 transition-all">

      {/* Top HUD: Mode Selector & Clinical Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-2 border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100/80 border border-rose-200 text-rose-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>72 BPM Cardiac Rhythm</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-medium">Anatomical Human Heart</span>
        </div>

        {/* View Layer Selector */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveLayer('coronary')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'coronary'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Coronary Arteries
          </button>
          <button
            onClick={() => setActiveLayer('chambers')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'chambers'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chambers &amp; Valves
          </button>
          <button
            onClick={() => setActiveLayer('flow')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'flow'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blood Circulation
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative w-full flex items-center justify-center min-h-[460px] select-none overflow-hidden">
        
        {/* Floating Zoom & Controls Widget */}
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.15))}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Anatomical Heart SVG Model with Beating Systole/Diastole Motion */}
        <motion.div
          className="relative w-full max-w-[440px] flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
          animate={{
            scale: [zoomLevel, zoomLevel * 1.025, zoomLevel * 0.995, zoomLevel * 1.028, zoomLevel],
          }}
          transition={{
            duration: 0.92,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <svg
            viewBox="0 0 500 580"
            className="w-full h-auto drop-shadow-2xl overflow-visible"
          >
            <defs>
              {/* Muscle tissue gradient (Myocardium) */}
              <radialGradient id="myoGrad" cx="45%" cy="55%" r="60%">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="45%" stopColor="#be123c" />
                <stop offset="80%" stopColor="#9f1239" />
                <stop offset="100%" stopColor="#4c0519" />
              </radialGradient>

              {/* Internal Chamber Depth */}
              <radialGradient id="chamberDeep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="100%" stopColor="#310511" />
              </radialGradient>

              {/* Aorta Arterial Blood Gradient */}
              <linearGradient id="aortaArch" x1="0%" y1="100%" x2="60%" y2="0%">
                <stop offset="0%" stopColor="#e11d48" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>

              {/* Pulmonary Artery (Deoxygenated blue) */}
              <linearGradient id="pulmonaryBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="60%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#075985" />
              </linearGradient>

              {/* Vena Cava (Deoxygenated venous blue) */}
              <linearGradient id="venaCava" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Valve White Pearlescent */}
              <linearGradient id="valveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>

              {/* Drop Shadows */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. SUPERIOR & INFERIOR VENA CAVA (Right Venous Return) */}
            <g className="vena-cava-group" onMouseEnter={() => setHoveredPart('Vena Cava')} onMouseLeave={() => setHoveredPart(null)}>
              {/* Superior Vena Cava */}
              <path
                d="M140 60 C140 100 145 150 155 185 L185 180 C180 140 175 95 175 60 Z"
                fill="url(#venaCava)"
                stroke="#0369a1"
                strokeWidth="1.5"
              />
              {/* Inferior Vena Cava */}
              <path
                d="M175 420 C170 450 165 490 160 520 L195 520 C200 485 202 450 200 420 Z"
                fill="url(#venaCava)"
                stroke="#0369a1"
                strokeWidth="1.5"
              />
            </g>

            {/* 2. AORTA ARCH & 3 BRACHIOCEPHALIC ARTERIAL BRANCHES */}
            <g className="aorta-group" onMouseEnter={() => setHoveredPart('Aortic Arch')} onMouseLeave={() => setHoveredPart(null)}>
              {/* 3 Upper branches: Brachiocephalic, Left Common Carotid, Left Subclavian */}
              <path d="M225 45 L225 95 L242 98 L242 45 Z" fill="url(#aortaArch)" stroke="#9f1239" strokeWidth="1.2" />
              <path d="M255 35 L255 95 L272 98 L272 35 Z" fill="url(#aortaArch)" stroke="#9f1239" strokeWidth="1.2" />
              <path d="M285 45 L285 105 L302 110 L302 45 Z" fill="url(#aortaArch)" stroke="#9f1239" strokeWidth="1.2" />

              {/* Massive Aortic Arch curving across behind pulmonary trunk */}
              <path
                d="M205 180 C195 120 220 75 270 75 C335 75 365 125 360 190 C340 190 325 180 320 165 C320 120 300 105 270 105 C240 105 228 130 235 180 Z"
                fill="url(#aortaArch)"
                stroke="#9f1239"
                strokeWidth="2"
              />
            </g>

            {/* 3. PULMONARY TRUNK & LEFT/RIGHT PULMONARY ARTERIES */}
            <g className="pulmonary-trunk-group" onMouseEnter={() => setHoveredPart('Pulmonary Artery Trunk')} onMouseLeave={() => setHoveredPart(null)}>
              {/* Left Branch */}
              <path
                d="M280 180 C320 165 370 170 410 185 L405 210 C370 200 330 195 285 205 Z"
                fill="url(#pulmonaryBlue)"
                stroke="#075985"
                strokeWidth="1.5"
              />
              {/* Right Branch */}
              <path
                d="M190 190 C150 180 115 185 85 195 L90 220 C120 210 155 205 195 210 Z"
                fill="url(#pulmonaryBlue)"
                stroke="#075985"
                strokeWidth="1.5"
              />
              {/* Central Trunk crossing over aorta */}
              <path
                d="M215 240 C210 195 240 165 285 165 C310 165 330 180 330 215 C330 245 300 255 255 255 Z"
                fill="url(#pulmonaryBlue)"
                stroke="#075985"
                strokeWidth="2"
              />
            </g>

            {/* 4. MAIN VENTRICULAR & ATRIAL MYOCARDIUM BODY */}
            {activeLayer !== 'chambers' ? (
              /* Surface Muscle Wall with Anatomical Contours */
              <g className="myocardium-surface">
                {/* Right Atrium Body */}
                <path
                  d="M150 185 C115 200 100 250 115 310 C130 355 165 385 180 395 C175 320 165 240 150 185 Z"
                  fill="url(#myoGrad)"
                  stroke="#4c0519"
                  strokeWidth="2"
                />

                {/* Left Atrium Auricle */}
                <path
                  d="M335 200 C370 205 405 240 395 280 C380 295 355 300 340 300 Z"
                  fill="url(#myoGrad)"
                  stroke="#4c0519"
                  strokeWidth="2"
                />

                {/* Left & Right Ventricles Muscular Apex Cone */}
                <path
                  d="M175 380 C155 410 170 450 205 480 C245 515 270 545 285 550 C305 540 350 490 390 420 C425 350 420 290 380 260 C340 235 270 245 230 260 C185 300 175 350 175 380 Z"
                  fill="url(#myoGrad)"
                  stroke="#4c0519"
                  strokeWidth="2.5"
                />

                {/* Anatomical Muscle Striations / Shading Creases */}
                <path
                  d="M205 390 C220 440 250 480 280 520"
                  stroke="rgba(76, 5, 25, 0.45)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M340 310 C355 360 365 410 350 460"
                  stroke="rgba(76, 5, 25, 0.35)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : (
              /* Internal Chambers & Valves Cutaway View (Wikimedia Anatomy) */
              <g className="heart-chambers-internal">
                {/* Thick Cut Myocardium Wall Outer Border */}
                <path
                  d="M140 200 C95 240 100 320 120 370 C155 450 240 540 285 550 C320 540 405 460 415 360 C425 280 390 220 340 200 Z"
                  fill="#9f1239"
                  stroke="#4c0519"
                  strokeWidth="6"
                />

                {/* Right Ventricle Cavity */}
                <path
                  d="M170 330 C155 370 175 425 210 465 C235 455 245 420 245 350 C225 330 195 320 170 330 Z"
                  fill="url(#chamberDeep)"
                />

                {/* Thick Interventricular Septum (Wall dividing ventricles) */}
                <path
                  d="M245 350 C245 425 240 470 280 535 C285 530 295 480 290 400 C285 350 270 340 245 350 Z"
                  fill="#881337"
                  stroke="#4c0519"
                  strokeWidth="2"
                />

                {/* Left Ventricle Cavity (Deep, thick muscular chamber) */}
                <path
                  d="M295 400 C300 475 320 480 345 450 C375 410 380 350 355 330 C335 340 310 355 295 400 Z"
                  fill="url(#chamberDeep)"
                />

                {/* Tricuspid Valve Flaps (Right side) */}
                <path d="M185 320 C195 340 215 340 225 325" stroke="url(#valveGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Chordae Tendineae (Heart strings) */}
                <path d="M195 335 L190 370 M215 335 L220 370" stroke="#f1f5f9" strokeWidth="1.2" opacity="0.8" />

                {/* Mitral / Bicuspid Valve Flaps (Left side) */}
                <path d="M320 325 C335 345 355 340 365 325" stroke="url(#valveGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M330 340 L335 385 M350 340 L345 385" stroke="#f1f5f9" strokeWidth="1.2" opacity="0.8" />

                {/* Chamber Labels in HUD */}
                <text x="175" y="380" fill="#93c5fd" fontSize="11" fontWeight="bold" fontFamily="monospace">R. Ventricle</text>
                <text x="315" y="390" fill="#fda4af" fontSize="11" fontWeight="bold" fontFamily="monospace">L. Ventricle</text>
                <text x="160" y="270" fill="#93c5fd" fontSize="11" fontWeight="bold" fontFamily="monospace">R. Atrium</text>
                <text x="325" y="270" fill="#fda4af" fontSize="11" fontWeight="bold" fontFamily="monospace">L. Atrium</text>
              </g>
            )}

            {/* 5. CORONARY ARTERY TREE (LAD, LCX, RCA) */}
            {activeLayer !== 'chambers' && (
              <g className="coronary-artery-tree">

                {/* RCA: Right Coronary Artery — Runs down right atrioventricular groove */}
                <g
                  className="cursor-pointer group"
                  onClick={() => onSelectArtery('RCA')}
                  onMouseEnter={() => setHoveredPart('Right Coronary Artery (RCA)')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  {/* RCA Glow Halo */}
                  <path
                    d="M210 260 C185 285 175 320 180 375 C185 415 195 440 220 465"
                    stroke={rcaStatus.color}
                    strokeWidth={selectedArtery === 'RCA' ? "12" : "7"}
                    strokeOpacity={selectedArtery === 'RCA' ? "0.4" : "0.2"}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Main RCA Branch */}
                  <path
                    d="M210 260 C185 285 175 320 180 375 C185 415 195 440 220 465"
                    stroke={rcaStatus.color}
                    strokeWidth={selectedArtery === 'RCA' ? "4.5" : "3.5"}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Acute Marginal Branch of RCA */}
                  <path
                    d="M178 350 C160 365 145 385 140 405"
                    stroke={rcaStatus.color}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                  />
                </g>

                {/* LAD: Left Anterior Descending — The "Widowmaker" running down anterior groove to apex */}
                <g
                  className="cursor-pointer group"
                  onClick={() => onSelectArtery('LAD')}
                  onMouseEnter={() => setHoveredPart('Left Anterior Descending Artery (LAD)')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  {/* LAD Glow Halo */}
                  <path
                    d="M275 255 C265 295 260 340 262 390 C265 445 272 490 282 540"
                    stroke={ladStatus.color}
                    strokeWidth={selectedArtery === 'LAD' ? "14" : "8"}
                    strokeOpacity={selectedArtery === 'LAD' ? "0.45" : "0.22"}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Main LAD Stem */}
                  <path
                    d="M275 255 C265 295 260 340 262 390 C265 445 272 490 282 540"
                    stroke={ladStatus.color}
                    strokeWidth={selectedArtery === 'LAD' ? "5" : "3.8"}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Diagonal Branches D1 & D2 */}
                  <path
                    d="M264 340 C285 360 310 375 330 385"
                    stroke={ladStatus.color}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />
                  <path
                    d="M265 415 C285 435 305 450 320 460"
                    stroke={ladStatus.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                  />
                  {/* Septal Perforators */}
                  <path
                    d="M262 370 C245 380 230 385 220 390"
                    stroke={ladStatus.color}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.75"
                  />
                </g>

                {/* LCX: Left Circumflex — Curves around left atrioventricular groove to lateral wall */}
                <g
                  className="cursor-pointer group"
                  onClick={() => onSelectArtery('LCX')}
                  onMouseEnter={() => setHoveredPart('Left Circumflex Artery (LCX)')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  {/* LCX Glow Halo */}
                  <path
                    d="M290 260 C325 270 360 290 380 320 C395 350 395 390 385 425"
                    stroke={lcxStatus.color}
                    strokeWidth={selectedArtery === 'LCX' ? "12" : "7"}
                    strokeOpacity={selectedArtery === 'LCX' ? "0.4" : "0.2"}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Main LCX Branch */}
                  <path
                    d="M290 260 C325 270 360 290 380 320 C395 350 395 390 385 425"
                    stroke={lcxStatus.color}
                    strokeWidth={selectedArtery === 'LCX' ? "4.5" : "3.5"}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Obtuse Marginal (OM1) Branch */}
                  <path
                    d="M355 295 C370 330 375 365 370 395"
                    stroke={lcxStatus.color}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.85"
                  />
                </g>

              </g>
            )}

            {/* 6. ANIMATED BLOOD CIRCULATION PARTICLES (Flow Mode) */}
            {activeLayer === 'flow' && (
              <g className="circulation-flow-particles">
                {/* Deoxygenated Blood (Venous -> Lungs via Pulmonary) */}
                <circle cx="160" cy="110" r="4" fill="#38bdf8">
                  <animate attributeName="cy" values="60;185;240" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="280" cy="190" r="4.5" fill="#0284c7">
                  <animate attributeName="cx" values="240;330;400" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite" />
                </circle>

                {/* Oxygenated Blood (Lungs -> Left Ventricle -> Aorta to Body) */}
                <circle cx="270" cy="95" r="5" fill="#f43f5e">
                  <animate attributeName="cy" values="180;100;45" dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="cx" values="220;270;285" dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="265" cy="340" r="4" fill="#e11d48">
                  <animate attributeName="cy" values="260;370;510" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* Vessel Interactive Pins */}
            {activeLayer !== 'chambers' && (
              <g className="anatomical-pins text-xs font-sans">
                {/* LAD Pin */}
                <g onClick={() => onSelectArtery('LAD')} className="cursor-pointer">
                  <circle cx="264" cy="380" r="7" fill={ladStatus.color} stroke="#ffffff" strokeWidth="2" />
                  <text x="277" y="384" fill="#0f172a" fontWeight="bold" fontSize="11">LAD</text>
                </g>
                {/* LCX Pin */}
                <g onClick={() => onSelectArtery('LCX')} className="cursor-pointer">
                  <circle cx="378" cy="320" r="7" fill={lcxStatus.color} stroke="#ffffff" strokeWidth="2" />
                  <text x="390" y="324" fill="#0f172a" fontWeight="bold" fontSize="11">LCX</text>
                </g>
                {/* RCA Pin */}
                <g onClick={() => onSelectArtery('RCA')} className="cursor-pointer">
                  <circle cx="180" cy="360" r="7" fill={rcaStatus.color} stroke="#ffffff" strokeWidth="2" />
                  <text x="148" y="364" fill="#0f172a" fontWeight="bold" fontSize="11">RCA</text>
                </g>
              </g>
            )}

          </svg>
        </motion.div>
      </div>

      {/* Bottom Context Panel: Active Vessel or Chamber Info */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-slate-900 text-sm">
                {hoveredPart || (
                  selectedArtery === 'LAD'
                    ? 'Left Anterior Descending (LAD)'
                    : selectedArtery === 'LCX'
                    ? 'Left Circumflex (LCX)'
                    : 'Right Coronary Artery (RCA)'
                )}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${currentArteryStatus.badge}`}>
                {currentArteryStatus.label}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {selectedArtery === 'LAD' && 'Feeds the front wall and apex. Most critical artery for left ventricular pump function.'}
              {selectedArtery === 'LCX' && 'Feeds the lateral and back walls of the heart. Essential for heart muscle oxygenation.'}
              {selectedArtery === 'RCA' && 'Feeds the right side of the heart and cardiac pacemaker nodes controlling rhythm.'}
            </p>
          </div>

          {/* Quick Vessel Selector Buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {['LAD', 'LCX', 'RCA'].map((v) => (
              <button
                key={v}
                onClick={() => onSelectArtery(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedArtery === v
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
