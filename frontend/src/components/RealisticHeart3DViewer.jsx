/**
 * RealisticHeart3DViewer — Interactive WebGL 3D Heart Centerpiece
 * Integrates real 3D volumetric polygonal models with interactive orbital controls,
 * custom plain-English cardiac cycle annotations, and LAD coronary supply breakdown.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Heart, Activity, AlertCircle, X, CheckCircle2, ChevronRight } from 'lucide-react';

const MODELS = {
  beating: {
    id: 'd9845afb1ee64ad094adc96320c67d98',
    title: 'Beating Heart',
    author: 'jalmer',
    label: 'Beating Cycle',
    desc: 'Real-time animated systolic & diastolic cardiac contraction cycle',
  },
  realistic: {
    id: '3f8072336ce94d18b3d0d055a1ece089',
    title: 'Realistic Human Heart',
    author: 'neshallads',
    label: 'Realistic Anatomy',
    desc: 'Volumetric textured cardiovascular mesh with aortic branches & coronary anatomy',
  },
};

// Simplified, plain-English breakdown of the heart's beating cycle & landmarks
const BEATING_CYCLE_POINTS = [
  {
    num: 1,
    short: 'Aorta Outflow',
    tag: 'Systolic Ejection',
    title: 'Aorta & Main Outflow Valve',
    simpleExplain:
      'The main exit highway. Every time your heart squeezes, this valve snaps open to shoot freshly oxygenated blood into the aorta, feeding your brain and entire body.',
    beatingCycle: 'Opens during peak systole (squeezing phase) at ~120 mmHg arterial pressure.',
    coronaryLink:
      'Coronary artery branch openings sit right at the root of this valve, receiving fresh blood immediately after every beat.',
  },
  {
    num: 2,
    short: 'Pulmonary Flow',
    tag: 'Venous Filling',
    title: 'Right Ventricle & Tricuspid Valve',
    simpleExplain:
      'The oxygen recharge room. It collects tired, deoxygenated blood returning from your body, and gently pumps it forward into your lungs to absorb fresh oxygen.',
    beatingCycle: 'Fills with venous blood during diastole (resting phase) and gently propels it toward the lungs.',
    coronaryLink:
      'Fed primarily by the Right Coronary Artery (RCA). If the RCA is blocked, this chamber loses pumping strength.',
  },
  {
    num: 3,
    short: 'Main Engine (LV)',
    tag: 'High-Pressure Pump',
    title: 'Left Ventricle & Mitral Complex',
    simpleExplain:
      'The heart’s main engine. This is the thickest, strongest muscle chamber in your body. It beats ~100,000 times a day, creating the vital pulse that keeps you alive.',
    beatingCycle: 'Undergoes powerful muscular contraction to circulate ~5 liters of blood through your body every minute.',
    coronaryLink:
      'Demands the highest amount of oxygen. Highly vulnerable to severe damage if coronary arteries narrow.',
  },
  {
    num: 4,
    short: 'LAD & Septum',
    tag: 'Coronary Lifeline',
    title: 'Interventricular Septum & LAD Artery',
    simpleExplain:
      'The electrical divider & LAD artery. This muscular wall carries the electrical timing wires of the heart. Crucially, the Left Anterior Descending (LAD) artery runs right across this groove.',
    beatingCycle: 'Coordinates the synchronized electrical squeeze between left and right pumping chambers.',
    coronaryLink:
      'CRITICAL: The LAD artery provides >50% of this wall’s entire blood supply. A blockage here triggers massive anterior heart attacks ("Widow Maker").',
  },
];

export default function RealisticHeart3DViewer() {
  const [selectedModel, setSelectedModel] = useState('beating');
  const [activePoint, setActivePoint] = useState(4); // Default to point 4 (LAD & Septum)
  const currentModel = MODELS[selectedModel];

  const embedUrl = `https://sketchfab.com/models/${currentModel.id}/embed?autostart=1&preload=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_stop=0`;

  const activePointData = BEATING_CYCLE_POINTS.find((p) => p.num === activePoint);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[580px] sm:max-w-[640px] flex flex-col items-center select-none"
    >
      {/* 3D Model Card Stage Container */}
      <div className="relative w-full h-[470px] sm:h-[500px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900/5 backdrop-blur-xl">
        
        {/* Soft Volumetric Backdrop Glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.12) 0%, rgba(56,189,248,0.08) 50%, transparent 72%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Control Bar: Model Toggle */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm pointer-events-auto">
            <button
              type="button"
              onClick={() => setSelectedModel('beating')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedModel === 'beating'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Heart className="w-3 h-3" />
              <span>Beating Cycle</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel('realistic')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedModel === 'realistic'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Box className="w-3 h-3" />
              <span>Realistic Anatomy</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-slate-200 border border-slate-700/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            3D WebGL Active
          </span>
        </div>

        {/* ── Sub-header: Interactive Simplified Landmarks (1, 2, 3, 4 & LAD) ── */}
        {selectedModel === 'beating' && (
          <div className="absolute top-14 left-3 right-3 z-20 flex items-center justify-center pointer-events-none">
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md pointer-events-auto max-w-full overflow-x-auto">
              {BEATING_CYCLE_POINTS.map((pt) => {
                const isActive = activePoint === pt.num;
                return (
                  <button
                    key={pt.num}
                    type="button"
                    onClick={() => setActivePoint(isActive ? null : pt.num)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                        isActive ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {pt.num}
                    </span>
                    <span>{pt.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Embedded Interactive 3D WebGL Frame */}
        <iframe
          key={currentModel.id}
          title={currentModel.title}
          src={embedUrl}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          className="w-full h-full border-0 relative z-10"
        />

        {/* ── Simplified Clinical Callout Card (Plain English) ── */}
        <AnimatePresence>
          {selectedModel === 'beating' && activePointData && (
            <motion.div
              key={activePointData.num}
              initial={{ opacity: 0, y: 15, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.94 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute bottom-12 right-3 z-30 w-[290px] sm:w-[310px] bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl border border-slate-200/90 text-left pointer-events-auto"
              style={{
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                    {activePointData.num}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    {activePointData.tag}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePoint(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-display text-xs font-bold text-slate-900 leading-tight mb-1.5">
                {activePointData.title}
              </h4>

              {/* Simplified Explanation in Everyday Language */}
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium mb-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                {activePointData.simpleExplain}
              </p>

              {/* Coronary / LAD Connection */}
              <div className="bg-rose-50/80 rounded-xl p-2 border border-rose-100 text-[10.5px] text-rose-900 leading-relaxed font-medium">
                <span className="font-bold text-rose-700 block mb-0.5">Coronary &amp; LAD Lifeline:</span>
                {activePointData.coronaryLink}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Brand Overlay: Covers the Sketchfab Blue Logo in bottom-left ── */}
        <div className="absolute bottom-2.5 left-2.5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-slate-700/90 shadow-lg text-[11px] font-mono text-white pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-bold tracking-wide">CardioVision 3D</span>
        </div>

        {/* Bottom Floating Orbital Guide */}
        <div className="hidden sm:flex absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono text-slate-200 shadow-sm items-center gap-2 pointer-events-none whitespace-nowrap">
          <span className="text-rose-400 font-bold">Orbit:</span>
          <span>Left-click + drag to rotate 360°</span>
          <span className="text-slate-600">·</span>
          <span>Scroll to zoom</span>
        </div>
      </div>

      {/* Model Description Footnote */}
      <p className="font-mono text-[10px] text-slate-400 tracking-wider mt-2 text-center">
        {currentModel.desc} · 3D model by {currentModel.author}
      </p>
    </motion.div>
  );
}
