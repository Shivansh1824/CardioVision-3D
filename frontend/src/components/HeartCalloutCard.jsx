import { motion } from 'framer-motion';
import { Activity, AlertTriangle, X } from 'lucide-react';

/**
 * HeartCalloutCard
 * 
 * Floating right-side callout modal presenting dual-audience medical information:
 * - Clear, intuitive terms for patients ("How it works for you")
 * - High-precision diagnostic metrics for clinicians ("Doctor & Clinical Pathology")
 */
export default function HeartCalloutCard({
  selectedModel,
  activePin,
  activePhase,
  onClose,
}) {
  if (selectedModel === 'realistic' && activePin) {
    return (
      <motion.div
        key={activePin.id}
        initial={{ opacity: 0, x: 30, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 30, scale: 0.94 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-left w-[280px] sm:w-[310px]"
        style={{
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: activePin.color }}
            />
            <span className="font-mono text-xs font-bold text-slate-900">
              [{activePin.code}]
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {activePin.patientName}
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

        <h4 className="font-display text-xs sm:text-sm font-bold text-slate-900 leading-tight mb-2">
          {activePin.clinicalName || activePin.name}
        </h4>

        <div className="mb-2 bg-sky-50/70 rounded-xl p-2.5 border border-sky-100/90">
          <div className="flex items-center gap-1.5 mb-1 text-sky-800">
            <Activity className="w-3 h-3 text-sky-600 shrink-0" />
            <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
              How it works for you
            </span>
          </div>
          <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
            {activePin.patientExpl}
          </p>
        </div>

        <div className="bg-rose-50/70 rounded-xl p-2.5 border border-rose-100/90">
          <div className="flex items-center gap-1.5 mb-1 text-rose-800">
            <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
            <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
              Doctor &amp; Clinical Pathology
            </span>
          </div>
          <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
            {activePin.pathology}
          </p>
        </div>

        {activePin.bloodTerritory && (
          <div className="mt-2 pt-1.5 border-t border-slate-100 text-[9px] font-mono text-slate-400">
            Territory: {activePin.bloodTerritory}
          </div>
        )}
      </motion.div>
    );
  }

  if (selectedModel === 'beating' && activePhase) {
    return (
      <motion.div
        key={activePhase.id}
        initial={{ opacity: 0, x: 30, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 30, scale: 0.94 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-left w-[280px] sm:w-[310px]"
        style={{
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: activePhase.color }}
            />
            <span className="font-mono text-xs font-bold text-slate-900">
              [{activePhase.code}]
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
              {activePhase.timing}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close phase callout"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mb-2">
          <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 leading-tight">
            {activePhase.patientName}
          </h4>
          <p className="font-mono text-[10px] text-slate-500 font-medium mt-0.5">
            Clinical: {activePhase.clinicalName}
          </p>
        </div>

        <div className="mb-2 bg-sky-50/70 rounded-xl p-2.5 border border-sky-100/90">
          <div className="flex items-center gap-1.5 mb-1 text-sky-800">
            <Activity className="w-3 h-3 text-sky-600 shrink-0" />
            <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
              How it works for you
            </span>
          </div>
          <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
            {activePhase.patientExpl}
          </p>
        </div>

        <div className="mb-2 bg-slate-50 rounded-lg p-2 border border-slate-200/80">
          <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
            Cardiac Valve Mechanics
          </span>
          <p className="text-[10px] font-semibold text-slate-800">
            {activePhase.valves}
          </p>
        </div>

        <div className="bg-rose-50/70 rounded-xl p-2.5 border border-rose-100/90">
          <div className="flex items-center gap-1.5 mb-1 text-rose-800">
            <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
            <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
              Clinical Diagnostic Value
            </span>
          </div>
          <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
            {activePhase.clinicalPathology}
          </p>
        </div>
      </motion.div>
    );
  }

  return null;
}
