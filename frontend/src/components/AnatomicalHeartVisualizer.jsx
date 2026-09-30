import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, AlertCircle, Info, Sparkles, Sliders } from 'lucide-react';

const STATUS_CONFIG = {
  normal: {
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.8)',
    label: 'Normal (< 50%)',
    badgeBg: 'bg-emerald-950/80 border-emerald-500 text-emerald-300',
    pulseSpeed: '3s',
  },
  moderate: {
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.9)',
    label: 'Moderate (50-69%)',
    badgeBg: 'bg-amber-950/80 border-amber-500 text-amber-300',
    pulseSpeed: '1.8s',
  },
  critical: {
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 1.0)',
    label: 'Critical (≥ 70%)',
    badgeBg: 'bg-red-950/90 border-red-500 text-red-200 animate-pulse',
    pulseSpeed: '0.8s',
  },
};

export default function AnatomicalHeartVisualizer({
  vesselStates = { LAD: 'normal', LCX: 'moderate', RCA: 'normal' },
  selectedArtery = 'LAD',
  onSelectArtery = () => {},
}) {
  const [hoveredArtery, setHoveredArtery] = useState(null);

  const ladCfg = STATUS_CONFIG[vesselStates.LAD] || STATUS_CONFIG.normal;
  const lcxCfg = STATUS_CONFIG[vesselStates.LCX] || STATUS_CONFIG.normal;
  const rcaCfg = STATUS_CONFIG[vesselStates.RCA] || STATUS_CONFIG.normal;

  const activeArtery = hoveredArtery || selectedArtery;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-white/10 p-4 sm:p-6 bg-gradient-to-b from-slate-900/90 via-indigo-950/40 to-slate-950/90 shadow-2xl backdrop-blur-2xl">
      
      {/* Telemetry Header HUD */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-slate-300 font-semibold">Anatomical Twin</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">72 BPM</span>
        </div>
        <div className="text-[11px] text-slate-400">
          Coronary Artery Tree • Dual-Ventricle
        </div>
      </div>

      {/* SVG Canvas Area with Biological Heartbeat contraction */}
      <div className="relative w-full h-[440px] sm:h-[500px] flex items-center justify-center overflow-hidden">
        
        {/* Soft Ambient Glow in background matching active vessel */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{
            background:
              activeArtery === 'LAD'
                ? ladCfg.color
                : activeArtery === 'LCX'
                ? lcxCfg.color
                : rcaCfg.color,
          }}
        />

        <motion.div
          className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center"
          animate={{
            scale: [1, 1.03, 0.99, 1.04, 1],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <svg
            viewBox="0 0 500 620"
            className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] select-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Muscle tissue volumetric radial gradients */}
              <radialGradient id="leftVentricleGrad" cx="60%" cy="55%" r="65%">
                <stop offset="0%" stopColor="#b91c1c" />
                <stop offset="45%" stopColor="#881337" />
                <stop offset="85%" stopColor="#4c0519" />
                <stop offset="100%" stopColor="#1e020a" />
              </radialGradient>

              <radialGradient id="rightVentricleGrad" cx="45%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#991b1b" />
                <stop offset="55%" stopColor="#701a24" />
                <stop offset="100%" stopColor="#2a050c" />
              </radialGradient>

              <linearGradient id="aortaArchGrad" x1="0%" y1="100%" x2="70%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="40%" stopColor="#ef4444" />
                <stop offset="70%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>

              <linearGradient id="pulmonaryArteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="60%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>

              <linearGradient id="venaCavaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>

              {/* Dynamic Glow Filters for Coronaries */}
              <filter id="glow-lad" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={ladCfg.color} floodOpacity="0.9" />
              </filter>
              <filter id="glow-lcx" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={lcxCfg.color} floodOpacity="0.9" />
              </filter>
              <filter id="glow-rca" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={rcaCfg.color} floodOpacity="0.9" />
              </filter>
            </defs>

            {/* ==============================================================
                1. GREAT VESSELS (Aorta, Vena Cava, Pulmonary Trunk)
                ============================================================== */}
            {/* Superior Vena Cava */}
            <path
              d="M175,70 C175,40 205,35 205,70 L212,180 C195,185 180,185 170,180 Z"
              fill="url(#venaCavaGrad)"
              opacity="0.9"
            />
            {/* Innominate / Brachiocephalic Branch */}
            <path d="M228,80 L220,15 L238,12 L245,75 Z" fill="url(#aortaArchGrad)" />
            {/* Left Common Carotid Branch */}
            <path d="M255,70 L258,15 L274,15 L270,68 Z" fill="url(#aortaArchGrad)" />
            {/* Left Subclavian Branch */}
            <path d="M280,72 L295,20 L310,24 L295,80 Z" fill="url(#aortaArchGrad)" />

            {/* Aortic Arch (Curving up from LV and branching left) */}
            <path
              d="M210,180 C210,100 240,60 290,65 C345,70 365,120 355,190 C335,195 320,190 315,175 C320,130 305,105 275,100 C245,95 235,130 235,185 Z"
              fill="url(#aortaArchGrad)"
              filter="drop-shadow(0 4px 10px rgba(220,38,38,0.3))"
            />

            {/* Pulmonary Trunk & Bifurcation (Crosses anterior to aorta) */}
            <path
              d="M260,160 C265,130 290,120 330,125 C345,128 355,145 350,155 C320,150 300,160 295,180 L255,225 C245,215 240,190 260,160 Z"
              fill="url(#pulmonaryArteryGrad)"
              opacity="0.92"
            />

            {/* ==============================================================
                2. CARDIAC CHAMBERS (Muscular Myocardium)
                ============================================================== */}
            {/* Right Atrium (Anatomical Right = Viewer's Left) */}
            <path
              d="M140,180 C110,210 115,280 150,310 C165,305 175,280 178,250 C180,215 165,185 140,180 Z"
              fill="url(#rightVentricleGrad)"
            />

            {/* Left Atrium / Auricle */}
            <path
              d="M340,195 C370,210 380,260 360,290 C345,285 338,260 335,230 Z"
              fill="url(#leftVentricleGrad)"
            />

            {/* Right Ventricle (Anterior wall, rounded triangular shape) */}
            <path
              d="M165,280 C150,330 160,410 200,465 C220,490 245,505 270,515 C265,460 260,370 255,275 C220,270 185,270 165,280 Z"
              fill="url(#rightVentricleGrad)"
              stroke="#58101a"
              strokeWidth="1.5"
            />

            {/* Left Ventricle & Cardiac Apex (Dominant, forms the true apex pointed to bottom-left/center) */}
            <path
              d="M255,275 C260,370 265,460 270,515 C275,525 285,555 300,565 C308,570 316,565 325,545 C355,480 385,395 380,310 C378,280 360,265 335,268 C310,270 280,272 255,275 Z"
              fill="url(#leftVentricleGrad)"
              stroke="#701221"
              strokeWidth="2"
            />

            {/* Muscular Sulcus Shadow (Interventricular Groove) */}
            <path
              d="M255,275 Q262,400 300,565"
              fill="none"
              stroke="#2e050c"
              strokeWidth="8"
              opacity="0.8"
            />

            {/* ==============================================================
                3. CORONARY ARTERY VASCULAR NETWORK (LAD, LCX, RCA)
                ============================================================== */}

            {/* --- RCA: RIGHT CORONARY ARTERY & BRANCHES --- */}
            <g
              onClick={() => onSelectArtery('RCA')}
              onMouseEnter={() => setHoveredArtery('RCA')}
              onMouseLeave={() => setHoveredArtery(null)}
              className="cursor-pointer transition-all"
            >
              {/* RCA Main Trunk */}
              <path
                d="M208,230 C195,250 180,280 175,320 C170,360 178,410 198,455 C205,470 215,485 230,498"
                fill="none"
                stroke={rcaCfg.color}
                strokeWidth={activeArtery === 'RCA' ? '8' : '5'}
                strokeLinecap="round"
                filter="url(#glow-rca)"
                className="transition-all duration-300"
              />
              {/* Acute Marginal Branch */}
              <path
                d="M176,335 C160,355 145,385 148,405"
                fill="none"
                stroke={rcaCfg.color}
                strokeWidth={activeArtery === 'RCA' ? '4' : '2.5'}
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Conus Branch */}
              <path
                d="M205,245 C190,240 175,235 168,232"
                fill="none"
                stroke={rcaCfg.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              {/* Animated Blood Flow Dash */}
              <path
                d="M208,230 C195,250 180,280 175,320 C170,360 178,410 198,455 C205,470 215,485 230,498"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="8,16"
                strokeLinecap="round"
                opacity="0.8"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-48"
                  dur={rcaCfg.pulseSpeed}
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* --- LCX: LEFT CIRCUMFLEX ARTERY & BRANCHES --- */}
            <g
              onClick={() => onSelectArtery('LCX')}
              onMouseEnter={() => setHoveredArtery('LCX')}
              onMouseLeave={() => setHoveredArtery(null)}
              className="cursor-pointer transition-all"
            >
              {/* LCX Main Trunk wrapping around lateral border */}
              <path
                d="M275,240 C305,245 340,260 360,295 C372,325 368,365 350,400"
                fill="none"
                stroke={lcxCfg.color}
                strokeWidth={activeArtery === 'LCX' ? '7' : '4.5'}
                strokeLinecap="round"
                filter="url(#glow-lcx)"
                className="transition-all duration-300"
              />
              {/* Obtuse Marginal Branch (OM1) */}
              <path
                d="M340,265 C355,290 365,330 360,355"
                fill="none"
                stroke={lcxCfg.color}
                strokeWidth={activeArtery === 'LCX' ? '4' : '2.5'}
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Animated Blood Flow Dash */}
              <path
                d="M275,240 C305,245 340,260 360,295 C372,325 368,365 350,400"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="8,16"
                strokeLinecap="round"
                opacity="0.8"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-48"
                  dur={lcxCfg.pulseSpeed}
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* --- LAD: LEFT ANTERIOR DESCENDING (The Widowmaker) --- */}
            <g
              onClick={() => onSelectArtery('LAD')}
              onMouseEnter={() => setHoveredArtery('LAD')}
              onMouseLeave={() => setHoveredArtery(null)}
              className="cursor-pointer transition-all"
            >
              {/* LAD Main Trunk running straight down sulcus to apex */}
              <path
                d="M265,235 C262,280 264,340 270,400 C276,460 288,510 300,560"
                fill="none"
                stroke={ladCfg.color}
                strokeWidth={activeArtery === 'LAD' ? '9' : '6'}
                strokeLinecap="round"
                filter="url(#glow-lad)"
                className="transition-all duration-300"
              />
              {/* First Diagonal Branch (D1) */}
              <path
                d="M266,310 C290,340 315,370 325,410"
                fill="none"
                stroke={ladCfg.color}
                strokeWidth={activeArtery === 'LAD' ? '4.5' : '3'}
                strokeLinecap="round"
                opacity="0.88"
              />
              {/* Second Diagonal Branch (D2) */}
              <path
                d="M272,395 C295,430 310,465 315,495"
                fill="none"
                stroke={ladCfg.color}
                strokeWidth={activeArtery === 'LAD' ? '3.5' : '2.2'}
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Septal Perforator Branches */}
              <path
                d="M264,345 C250,360 240,380 236,395"
                fill="none"
                stroke={ladCfg.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.75"
              />
              {/* Animated Flow Pulse */}
              <path
                d="M265,235 C262,280 264,340 270,400 C276,460 288,510 300,560"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeDasharray="10,20"
                strokeLinecap="round"
                opacity="0.9"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-60"
                  dur={ladCfg.pulseSpeed}
                  repeatCount="indefinite"
                />
              </path>
            </g>

            {/* Interactive Anatomical Pins */}
            {/* LAD Pin */}
            <g transform="translate(295, 360)">
              <circle r="14" fill="rgba(15,23,42,0.9)" stroke={ladCfg.color} strokeWidth="2.5" filter="url(#glow-lad)" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">LAD</text>
            </g>

            {/* LCX Pin */}
            <g transform="translate(370, 310)">
              <circle r="14" fill="rgba(15,23,42,0.9)" stroke={lcxCfg.color} strokeWidth="2.5" filter="url(#glow-lcx)" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">LCX</text>
            </g>

            {/* RCA Pin */}
            <g transform="translate(155, 360)">
              <circle r="14" fill="rgba(15,23,42,0.9)" stroke={rcaCfg.color} strokeWidth="2.5" filter="url(#glow-rca)" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="monospace">RCA</text>
            </g>
          </svg>
        </motion.div>

      </div>

      {/* Interactive Vessel Selector Buttons below the Heart */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
        {[
          { key: 'LAD', name: 'LAD', full: 'Left Anterior Descending', cfg: ladCfg },
          { key: 'LCX', name: 'LCX', full: 'Left Circumflex', cfg: lcxCfg },
          { key: 'RCA', name: 'RCA', full: 'Right Coronary Artery', cfg: rcaCfg },
        ].map((v) => {
          const isSelected = activeArtery === v.key;
          return (
            <button
              key={v.key}
              onClick={() => onSelectArtery(v.key)}
              onMouseEnter={() => setHoveredArtery(v.key)}
              onMouseLeave={() => setHoveredArtery(null)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-white/30 shadow-lg'
                  : 'bg-slate-950/60 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-white text-xs">{v.name}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: v.cfg.color,
                    boxShadow: `0 0 8px ${v.cfg.color}`,
                  }}
                />
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">{v.full}</div>
              <div
                className="text-[10px] font-bold font-mono mt-0.5"
                style={{ color: v.cfg.color }}
              >
                {v.cfg.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Inspector Details Box */}
      <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-slate-300">
            {activeArtery === 'LAD' && 'LAD feeds anterior wall & apex. Primary culprit in anterior STEMI.'}
            {activeArtery === 'LCX' && 'LCX feeds posterolateral left ventricle and obtuse marginal branches.'}
            {activeArtery === 'RCA' && 'RCA perfuses right ventricle, inferior wall, and SA/AV conduction nodes.'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap hidden sm:inline">
          Click artery to inspect
        </span>
      </div>

    </div>
  );
}
