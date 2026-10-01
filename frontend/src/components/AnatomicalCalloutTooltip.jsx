import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { VESSEL_COLOR } from './cardiacAnatomyData';

export default function AnatomicalCalloutTooltip({
  viewMode,
  vesselData,
  dissectionData,
  vesselStates,
  onClose,
  onSelectArtery,
  onScrollToSection,
  onCardMouseEnter,
  onCardMouseLeave,
}) {
  if (viewMode === 'surface' && vesselData) {
    const status = vesselStates?.[vesselData.code] || 'normal';
    const color = VESSEL_COLOR[status];

    return (
      <motion.div
        key={`surface-card-${vesselData.code}`}
        onMouseEnter={onCardMouseEnter}
        onMouseLeave={onCardMouseLeave}
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 6 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute z-50 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-left pointer-events-auto"
        style={{
          width: 290,
          left: vesselData.coords.x > 50 ? 'auto' : `${vesselData.coords.x + 8}%`,
          right: vesselData.coords.x > 50 ? `${100 - vesselData.coords.x + 8}%` : 'auto',
          top: vesselData.coords.y > 60 ? 'auto' : `${vesselData.coords.y - 15}%`,
          bottom: vesselData.coords.y > 60 ? `${100 - vesselData.coords.y + 6}%` : 'auto',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="font-mono text-xs font-bold text-slate-900">{vesselData.code}</span>
            <span className="text-[10px] text-slate-400 font-mono">Artery</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="font-display text-sm font-bold text-slate-800 leading-tight mb-1">
          {vesselData.name}
        </p>

        <p className="text-[11px] text-slate-600 leading-relaxed mb-2 font-medium">
          {vesselData.role}
        </p>

        <p className="text-[10px] text-slate-500 leading-relaxed mb-3 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
          {vesselData.significance}
        </p>

        <button
          type="button"
          onClick={() => {
            onSelectArtery?.(vesselData.code);
            onScrollToSection?.('vessel-explorer');
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold text-white transition-all cursor-pointer shadow-xs hover:opacity-95"
          style={{ background: color }}
        >
          <span>Simulate in Vessel Explorer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    );
  }

  if (viewMode === 'dissected' && dissectionData) {
    return (
      <motion.div
        key={`dissection-card-${dissectionData.id}`}
        onMouseEnter={onCardMouseEnter}
        onMouseLeave={onCardMouseLeave}
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 6 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="absolute z-50 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-left pointer-events-auto"
        style={{
          width: 290,
          left: dissectionData.coords.x > 50 ? 'auto' : `${dissectionData.coords.x + 8}%`,
          right: dissectionData.coords.x > 50 ? `${100 - dissectionData.coords.x + 8}%` : 'auto',
          top: dissectionData.coords.y > 60 ? 'auto' : `${dissectionData.coords.y - 10}%`,
          bottom: dissectionData.coords.y > 60 ? `${100 - dissectionData.coords.y + 6}%` : 'auto',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="font-mono text-xs font-bold text-rose-600">Coronal Section</span>
            {dissectionData.tag && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                {dissectionData.tag}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="font-display text-sm font-bold text-slate-800 leading-tight mb-1.5">
          {dissectionData.name}
        </p>

        <p className="text-[11px] text-slate-600 leading-relaxed font-medium mb-2">
          {dissectionData.role}
        </p>

        {dissectionData.significance && (
          <p className="text-[10px] text-slate-500 leading-relaxed italic bg-rose-50/50 p-2 rounded-lg border border-rose-100">
            <span className="font-semibold text-rose-700 not-italic block mb-0.5">Clinical Pathology:</span>
            {dissectionData.significance}
          </p>
        )}
      </motion.div>
    );
  }

  return null;
}
