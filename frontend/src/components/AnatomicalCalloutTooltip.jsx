import React from 'react';
import { motion } from 'framer-motion';
import { X, Activity, AlertTriangle } from 'lucide-react';
import { VESSEL_COLOR, VESSEL_LABEL } from './cardiacAnatomyData';

export default function AnatomicalCalloutTooltip({
  viewMode,
  data,
  vesselStates,
  pinPos,
  onClose,
  onCardMouseEnter,
  onCardMouseLeave,
}) {
  if (!data) return null;

  const isVessel = viewMode === 'surface';
  const status = isVessel ? vesselStates?.[data.code] || 'normal' : null;
  const accentColor = isVessel
    ? VESSEL_COLOR[status] || '#10b981'
    : '#e11d48';

  const isLeft = data.calloutSide === 'left';
  const pinX = pinPos?.x ?? (data.coords?.x || 50);
  const pinY = pinPos?.y ?? (data.coords?.y || 50);

  // Clamp vertical position so the card stays within the stage
  const clampedTop = Math.max(6, Math.min(pinY - 14, 50));

  // Anchor point on the card border (where line docks)
  // On ~720px stage with 290px card:
  // Card on right starts at ~59.5%; Card on left ends at ~40.5%
  const cardAnchorX = isLeft ? 40.5 : 59.5;
  const cardAnchorY = clampedTop + 14;

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {/* ── 1. Dynamic SVG Leader Line System ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="leaderGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Pulsing targeting rings on the anatomical pinpoint */}
        <circle
          cx={`${pinX}%`}
          cy={`${pinY}%`}
          r="1.8"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.4"
          opacity="0.9"
        />
        <circle
          cx={`${pinX}%`}
          cy={`${pinY}%`}
          r="3.5"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.25"
          strokeDasharray="0.8 0.8"
          opacity="0.7"
        />
        <circle
          cx={`${pinX}%`}
          cy={`${pinY}%`}
          r="1.1"
          fill={accentColor}
          filter="url(#leaderGlow)"
        />

        {/* Angled leader line from pinpoint to external card anchor */}
        <path
          d={
            isLeft
              ? `M ${pinX} ${pinY} H ${Math.max(pinX - 5, cardAnchorX + 5)} L ${cardAnchorX + 2} ${cardAnchorY} H ${cardAnchorX}`
              : `M ${pinX} ${pinY} H ${Math.min(pinX + 5, cardAnchorX - 5)} L ${cardAnchorX - 2} ${cardAnchorY} H ${cardAnchorX}`
          }
          fill="none"
          stroke={accentColor}
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1.2 0.8"
          style={{
            filter: `drop-shadow(0 0 2px ${accentColor}cc)`,
          }}
        />

        {/* Solid underlying guide line for high visibility */}
        <path
          d={
            isLeft
              ? `M ${pinX} ${pinY} H ${Math.max(pinX - 5, cardAnchorX + 5)} L ${cardAnchorX + 2} ${cardAnchorY} H ${cardAnchorX}`
              : `M ${pinX} ${pinY} H ${Math.min(pinX + 5, cardAnchorX - 5)} L ${cardAnchorX - 2} ${cardAnchorY} H ${cardAnchorX}`
          }
          fill="none"
          stroke={accentColor}
          strokeWidth="0.25"
          strokeOpacity="0.75"
        />

        {/* Card anchor node dot */}
        <circle
          cx={`${cardAnchorX}%`}
          cy={`${cardAnchorY}%`}
          r="1.0"
          fill={accentColor}
        />
      </svg>

      {/* ── 2. External Clinical Callout Card (Positioned Outside the Heart) ── */}
      <motion.div
        key={data.code || data.id}
        onMouseEnter={onCardMouseEnter}
        onMouseLeave={onCardMouseLeave}
        initial={{ opacity: 0, scale: 0.92, y: 8, x: isLeft ? -12 : 12 }}
        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 6, x: isLeft ? -8 : 8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto absolute bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-left w-[285px] sm:w-[295px]"
        style={{
          left: isLeft ? '0%' : 'auto',
          right: isLeft ? 'auto' : '0%',
          top: `${clampedTop}%`,
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: accentColor }}
            />
            <span className="font-mono text-xs font-bold text-slate-900">
              [{data.code || data.id}]
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              {data.shortName || data.tag || 'Anatomy'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close callout"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Anatomical Name */}
        <h4 className="font-display text-sm font-bold text-slate-900 leading-tight mb-2.5">
          {data.name}
        </h4>

        {/* ── Section A: Hemodynamic Flow & Perfusion ── */}
        <div className="mb-2.5 bg-sky-50/70 rounded-xl p-2.5 border border-sky-100/90">
          <div className="flex items-center gap-1.5 mb-1 text-sky-800">
            <Activity className="w-3 h-3 text-sky-600 shrink-0" />
            <span className="font-mono text-[10px] font-bold tracking-wider uppercase">
              Hemodynamic Flow
            </span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
            {data.flow || data.role}
          </p>
        </div>

        {/* ── Section B: Clinical Pathology & Risk ── */}
        <div className="bg-rose-50/70 rounded-xl p-2.5 border border-rose-100/90">
          <div className="flex items-center gap-1.5 mb-1 text-rose-800">
            <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
            <span className="font-mono text-[10px] font-bold tracking-wider uppercase">
              Clinical Pathology
            </span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
            {data.pathology || data.significance}
          </p>
        </div>

        {/* Triage / Status Footer Pill */}
        {isVessel && status && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400">Arterial Status</span>
            <span
              className="font-bold px-2 py-0.5 rounded-full"
              style={{
                color: accentColor,
                backgroundColor: `${accentColor}18`,
                border: `1px solid ${accentColor}35`,
              }}
            >
              {VESSEL_LABEL[status]}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
