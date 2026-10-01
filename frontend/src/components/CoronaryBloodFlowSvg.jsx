import React from 'react';
import { motion } from 'framer-motion';

export default function CoronaryBloodFlowSvg({ isDissected, isPosteriorFacing, activeCallout }) {
  return (
    <motion.div
      animate={{ opacity: isDissected || isPosteriorFacing ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 22,
        pointerEvents: 'none',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(2px)',
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
  );
}
