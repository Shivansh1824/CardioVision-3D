import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

const STATUS = {
  normal:   { color: '#10b981', glow: 'rgba(16,185,129,0.8)',  label: 'Normal  (<50%)',   pulse: '3s'   },
  moderate: { color: '#f59e0b', glow: 'rgba(245,158,11,0.9)', label: 'Moderate (50–69%)', pulse: '1.8s' },
  critical: { color: '#ef4444', glow: 'rgba(239,68,68,1.0)',  label: 'Critical (≥70%)',   pulse: '0.7s' },
};

const VESSEL_INFO = {
  LAD: 'LAD — Anterior wall & apex. Primary culprit in anterior STEMI. The "Widowmaker" artery.',
  LCX: 'LCX — Posterolateral left ventricle & obtuse marginal branches. AV groove supply.',
  RCA: 'RCA — Right ventricle, inferior wall, SA node & AV conduction system.',
};

export default function AnatomicalHeartVisualizer({
  vesselStates = { LAD: 'normal', LCX: 'moderate', RCA: 'normal' },
  selectedArtery = 'LAD',
  onSelectArtery = () => {},
}) {
  const [hovered, setHovered] = useState(null);

  const lad = STATUS[vesselStates.LAD] || STATUS.normal;
  const lcx = STATUS[vesselStates.LCX] || STATUS.normal;
  const rca = STATUS[vesselStates.RCA] || STATUS.normal;
  const active = hovered || selectedArtery;

  const glowColor =
    active === 'LAD' ? lad.glow : active === 'LCX' ? lcx.glow : rca.glow;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a0316] to-slate-950 border border-white/10 shadow-2xl backdrop-blur-xl p-4 sm:p-5">

      {/* ── HUD bar ── */}
      <div className="flex items-center justify-between pb-3 mb-1 border-b border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-slate-300 font-semibold tracking-wide">Anatomical Digital Twin</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">72 BPM</span>
        </div>
        <span className="text-[10px] text-slate-500">Coronary Artery Tree • Dual-Ventricle</span>
      </div>

      {/* ── Canvas ── */}
      <div className="relative w-full flex items-center justify-center overflow-hidden" style={{ height: '460px' }}>

        {/* Ambient glow behind heart */}
        <div
          className="absolute rounded-full blur-3xl opacity-25 pointer-events-none transition-all duration-700"
          style={{ width: 280, height: 280, background: glowColor }}
        />

        {/* Pulsing heartbeat contraction */}
        <motion.div
          className="relative w-full max-w-[400px] flex items-center justify-center"
          style={{ aspectRatio: '4/5' }}
          animate={{ scale: [1, 1.025, 0.995, 1.03, 1] }}
          transition={{ duration: 1.0, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            viewBox="0 0 520 640"
            className="w-full h-full select-none"
            style={{ overflow: 'visible', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))' }}
          >
            <defs>
              {/* ── Radial gradients for realistic myocardial muscle depth ── */}
              <radialGradient id="lvGrad" cx="55%" cy="60%" r="65%">
                <stop offset="0%"   stopColor="#c0273c" />
                <stop offset="30%"  stopColor="#9b1d2f" />
                <stop offset="65%"  stopColor="#6b1020" />
                <stop offset="100%" stopColor="#2c0410" />
              </radialGradient>

              <radialGradient id="rvGrad" cx="40%" cy="50%" r="60%">
                <stop offset="0%"   stopColor="#a82030" />
                <stop offset="50%"  stopColor="#7a1522" />
                <stop offset="100%" stopColor="#300510" />
              </radialGradient>

              <radialGradient id="laGrad" cx="60%" cy="45%" r="55%">
                <stop offset="0%"   stopColor="#b82a3a" />
                <stop offset="100%" stopColor="#4a0e18" />
              </radialGradient>

              <radialGradient id="raGrad" cx="40%" cy="45%" r="55%">
                <stop offset="0%"   stopColor="#a81c2c" />
                <stop offset="100%" stopColor="#3c0c14" />
              </radialGradient>

              <linearGradient id="aortaGrad" x1="0%" y1="100%" x2="60%" y2="0%">
                <stop offset="0%"   stopColor="#dc2626" />
                <stop offset="50%"  stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>

              <linearGradient id="paGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>

              <linearGradient id="svcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>

              {/* ── Glow filters per vessel ── */}
              <filter id="glowLAD" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={lad.color} floodOpacity="1" />
              </filter>
              <filter id="glowLCX" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={lcx.color} floodOpacity="1" />
              </filter>
              <filter id="glowRCA" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={rca.color} floodOpacity="1" />
              </filter>
              <filter id="vesselGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ================================================================
                LAYER 1 — GREAT VESSELS (behind chambers)
                ================================================================ */}

            {/* Superior Vena Cava — runs inferiorly into right atrium */}
            <path
              d="M178,68 C176,42 196,30 206,58 L214,172 C200,178 186,177 178,170 Z"
              fill="url(#svcGrad)"
              opacity="0.88"
            />
            {/* Inferior Vena Cava stub */}
            <path
              d="M178,420 C166,440 168,460 176,468 L196,468 C200,460 200,440 192,420 Z"
              fill="url(#svcGrad)"
              opacity="0.6"
            />

            {/* Aortic root + ascending aorta */}
            <path
              d="M242,168 C240,130 250,105 272,95 C296,84 324,88 342,110 C360,132 355,168 340,185 L316,180 C322,162 320,140 305,130 C288,118 270,124 265,148 L252,175 Z"
              fill="url(#aortaGrad)"
              filter="drop-shadow(0 4px 12px rgba(220,38,38,0.35))"
            />
            {/* Aortic arch — the characteristic looping arch */}
            <path
              d="M342,110 C360,88 375,70 385,55 C390,48 382,38 374,40 L358,44 C350,60 338,72 330,82 L318,78 C326,65 340,50 346,38 L360,34 C376,30 398,46 390,62 C382,76 368,94 352,112 Z"
              fill="url(#aortaGrad)"
              opacity="0.85"
            />
            {/* Brachiocephalic trunk */}
            <path d="M354,44 L360,5 L376,8 L368,46 Z" fill="url(#aortaGrad)" opacity="0.9" />
            {/* Left common carotid */}
            <path d="M372,40 L380,4 L392,6 L384,42 Z" fill="url(#aortaGrad)" opacity="0.85" />
            {/* Left subclavian */}
            <path d="M388,48 L400,16 L412,20 L400,54 Z" fill="url(#aortaGrad)" opacity="0.8" />

            {/* Pulmonary trunk — anterior to aorta, crosses left */}
            <path
              d="M250,182 C248,158 260,140 280,135 C305,128 330,140 332,162 C335,178 320,192 300,198 L278,220 C264,212 252,200 250,182 Z"
              fill="url(#paGrad)"
              opacity="0.9"
            />
            {/* Right pulmonary artery */}
            <path d="M332,162 C352,155 372,160 380,172 L375,186 C362,176 348,170 330,176 Z" fill="url(#paGrad)" opacity="0.8" />
            {/* Left pulmonary artery */}
            <path d="M298,135 C295,114 285,98 270,90 L260,98 C272,106 282,122 285,138 Z" fill="url(#paGrad)" opacity="0.8" />

            {/* ================================================================
                LAYER 2 — CARDIAC CHAMBERS (authentic morphology)
                The heart is oblique: apex points infero-laterally to the left.
                Right ventricle is anterior/superior; LV is posterior/inferior.
                ================================================================ */}

            {/* Right Atrium — right side, behind SVC */}
            <path
              d="M152,195 C118,215 112,270 120,305 C128,338 155,355 185,352 C190,330 194,295 196,258 C198,222 185,196 152,195 Z"
              fill="url(#raGrad)"
              stroke="#3a0810"
              strokeWidth="1.5"
            />
            {/* Right auricle (ear-like appendage) */}
            <path
              d="M152,195 C138,185 128,180 120,190 C112,200 116,218 130,220 C140,220 148,210 152,195 Z"
              fill="url(#raGrad)"
              opacity="0.8"
            />

            {/* Left Atrium — posterior, mostly hidden; auricle visible left of PA */}
            <path
              d="M335,205 C360,215 375,255 368,290 C360,318 338,332 316,326 C310,300 308,265 310,230 Z"
              fill="url(#laGrad)"
              stroke="#3a0c18"
              strokeWidth="1.5"
            />
            {/* Left auricle */}
            <path
              d="M260,190 C248,175 238,172 232,182 C226,196 236,215 250,218 C258,218 264,205 260,190 Z"
              fill="url(#laGrad)"
              opacity="0.85"
            />

            {/* Right Ventricle — thin-walled crescent wrapping anterior LV */}
            <path
              d="M185,310 C168,348 170,408 196,460 C210,488 228,508 250,522 C248,470 246,390 248,308 C225,304 202,304 185,310 Z"
              fill="url(#rvGrad)"
              stroke="#420c18"
              strokeWidth="1.8"
            />

            {/* Left Ventricle — dominant chamber, conical, thick walls */}
            <path
              d="M248,308 C246,390 248,470 250,522 C255,534 264,558 278,570 C286,576 296,572 308,554 C340,495 372,415 370,335 C368,302 350,284 326,284 C300,284 272,290 248,308 Z"
              fill="url(#lvGrad)"
              stroke="#580e20"
              strokeWidth="2.2"
            />

            {/* Interventricular groove — separating RV from LV */}
            <path
              d="M248,308 Q254,415 278,570"
              fill="none"
              stroke="#1a0208"
              strokeWidth="10"
              opacity="0.85"
            />
            {/* Muscular ridge highlight */}
            <path
              d="M249,308 Q255,415 279,570"
              fill="none"
              stroke="rgba(255,60,60,0.15)"
              strokeWidth="3"
            />

            {/* Anterior interventricular vein (subtle blue) */}
            <path
              d="M252,315 Q258,420 282,570"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="2.5"
              opacity="0.4"
            />

            {/* ================================================================
                LAYER 3 — CORONARY ARTERIES (LAD, LCX, RCA)
                ================================================================ */}

            {/* ── RCA: Right Coronary Artery ── */}
            <g
              onClick={() => onSelectArtery('RCA')}
              onMouseEnter={() => setHovered('RCA')}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Main trunk — runs right AV groove */}
              <path
                d="M220,230 C204,252 188,280 182,318 C176,356 182,400 204,445 C212,462 224,480 238,496"
                fill="none"
                stroke={rca.color}
                strokeWidth={active === 'RCA' ? 8 : 5}
                strokeLinecap="round"
                filter="url(#glowRCA)"
                className="transition-all duration-300"
              />
              {/* Acute marginal branch */}
              <path
                d="M182,340 C166,362 154,390 158,412"
                fill="none"
                stroke={rca.color}
                strokeWidth={active === 'RCA' ? 4 : 2.5}
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Posterior descending artery */}
              <path
                d="M240,496 C248,510 252,530 248,548"
                fill="none"
                stroke={rca.color}
                strokeWidth={active === 'RCA' ? 3 : 2}
                strokeLinecap="round"
                opacity="0.75"
              />
              {/* Blood flow animation */}
              <path
                d="M220,230 C204,252 188,280 182,318 C176,356 182,400 204,445 C212,462 224,480 238,496"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="8 18"
                strokeLinecap="round"
                opacity="0.75"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-52" dur={rca.pulse} repeatCount="indefinite" />
              </path>
            </g>

            {/* ── LCX: Left Circumflex ── */}
            <g
              onClick={() => onSelectArtery('LCX')}
              onMouseEnter={() => setHovered('LCX')}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Courses left AV groove posteriorly */}
              <path
                d="M285,248 C316,252 348,268 368,302 C382,328 378,368 360,404"
                fill="none"
                stroke={lcx.color}
                strokeWidth={active === 'LCX' ? 7 : 4.5}
                strokeLinecap="round"
                filter="url(#glowLCX)"
                className="transition-all duration-300"
              />
              {/* Obtuse marginal branch (OM1) */}
              <path
                d="M350,275 C368,298 378,335 372,360"
                fill="none"
                stroke={lcx.color}
                strokeWidth={active === 'LCX' ? 4 : 2.5}
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Blood flow animation */}
              <path
                d="M285,248 C316,252 348,268 368,302 C382,328 378,368 360,404"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="8 18"
                strokeLinecap="round"
                opacity="0.75"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-52" dur={lcx.pulse} repeatCount="indefinite" />
              </path>
            </g>

            {/* ── LAD: Left Anterior Descending ── */}
            <g
              onClick={() => onSelectArtery('LAD')}
              onMouseEnter={() => setHovered('LAD')}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Runs anterior interventricular groove to apex */}
              <path
                d="M274,245 C270,292 270,352 274,412 C280,468 292,514 308,558"
                fill="none"
                stroke={lad.color}
                strokeWidth={active === 'LAD' ? 9 : 6}
                strokeLinecap="round"
                filter="url(#glowLAD)"
                className="transition-all duration-300"
              />
              {/* First diagonal branch (D1) */}
              <path
                d="M272,318 C292,346 316,374 326,410"
                fill="none"
                stroke={lad.color}
                strokeWidth={active === 'LAD' ? 4.5 : 3}
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Second diagonal branch (D2) */}
              <path
                d="M276,400 C298,432 312,464 318,496"
                fill="none"
                stroke={lad.color}
                strokeWidth={active === 'LAD' ? 3.5 : 2.2}
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Septal perforators */}
              <path
                d="M272,350 C256,365 244,382 240,398"
                fill="none"
                stroke={lad.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Blood flow animation */}
              <path
                d="M274,245 C270,292 270,352 274,412 C280,468 292,514 308,558"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeDasharray="10 22"
                strokeLinecap="round"
                opacity="0.85"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-64" dur={lad.pulse} repeatCount="indefinite" />
              </path>
            </g>

            {/* ================================================================
                LAYER 4 — ANATOMICAL PIN LABELS
                ================================================================ */}
            {/* LAD pin */}
            <g transform="translate(306, 368)">
              <circle r="15" fill="rgba(10,15,30,0.95)" stroke={lad.color} strokeWidth="2.5" filter="url(#glowLAD)" />
              <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold" fontFamily="monospace">LAD</text>
            </g>
            {/* LCX pin */}
            <g transform="translate(378, 320)">
              <circle r="15" fill="rgba(10,15,30,0.95)" stroke={lcx.color} strokeWidth="2.5" filter="url(#glowLCX)" />
              <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold" fontFamily="monospace">LCX</text>
            </g>
            {/* RCA pin */}
            <g transform="translate(160, 360)">
              <circle r="15" fill="rgba(10,15,30,0.95)" stroke={rca.color} strokeWidth="2.5" filter="url(#glowRCA)" />
              <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold" fontFamily="monospace">RCA</text>
            </g>

            {/* Apex label */}
            <text x="310" y="590" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace" fontStyle="italic">Cardiac Apex</text>
            {/* Base label */}
            <text x="285" y="82" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace" fontStyle="italic">Cardiac Base (Great Vessels)</text>
          </svg>
        </motion.div>
      </div>

      {/* ── Vessel selector buttons ── */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
        {[
          { key: 'LAD', label: 'LAD', full: 'Left Anterior Descending', cfg: lad },
          { key: 'LCX', label: 'LCX', full: 'Left Circumflex',          cfg: lcx },
          { key: 'RCA', label: 'RCA', full: 'Right Coronary Artery',     cfg: rca },
        ].map((v) => {
          const isActive = active === v.key;
          return (
            <button
              key={v.key}
              onClick={() => onSelectArtery(v.key)}
              onMouseEnter={() => setHovered(v.key)}
              onMouseLeave={() => setHovered(null)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 border-white/25 shadow-lg'
                  : 'bg-slate-950/60 border-white/5 hover:border-white/18'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-white text-xs">{v.label}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: v.cfg.color, boxShadow: `0 0 8px ${v.cfg.color}` }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">{v.full}</div>
              <div className="text-[10px] font-bold font-mono mt-0.5" style={{ color: v.cfg.color }}>
                {v.cfg.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Inspector callout ── */}
      <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-xs flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <span className="text-slate-300 leading-snug">{VESSEL_INFO[active]}</span>
      </div>
    </div>
  );
}
