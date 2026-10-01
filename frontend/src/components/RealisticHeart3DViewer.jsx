/**
 * RealisticHeart3DViewer — Interactive WebGL 3D Heart Centerpiece
 * Integrates real 3D volumetric polygonal models with interactive orbital controls
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Heart, RefreshCw, Maximize2 } from 'lucide-react';

const MODELS = {
  realistic: {
    id: '3f8072336ce94d18b3d0d055a1ece089',
    title: 'Realistic Human Heart',
    author: 'neshallads',
    label: 'Realistic Anatomy',
    desc: 'Volumetric textured cardiovascular mesh with aortic branches & coronary anatomy',
  },
  beating: {
    id: 'd9845afb1ee64ad094adc96320c67d98',
    title: 'Beating Heart',
    author: 'jalmer',
    label: 'Beating Cycle',
    desc: 'Real-time animated systolic/diastolic cardiac muscle contraction',
  },
};

export default function RealisticHeart3DViewer() {
  const [selectedModel, setSelectedModel] = useState('realistic');
  const currentModel = MODELS[selectedModel];

  const embedUrl = `https://sketchfab.com/models/${currentModel.id}/embed?autostart=1&preload=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_stop=0`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[560px] sm:max-w-[620px] flex flex-col items-center select-none"
    >
      {/* 3D Model Card Stage Container */}
      <div className="relative w-full h-[460px] sm:h-[490px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900/5 backdrop-blur-xl">
        
        {/* Soft Volumetric Backdrop Glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.12) 0%, rgba(56,189,248,0.08) 50%, transparent 72%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Floating Control Bar: Model Toggle */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm pointer-events-auto">
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
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-slate-200 border border-slate-700/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            3D WebGL Active
          </span>
        </div>

        {/* Embedded Interactive 3D WebGL Frame */}
        <iframe
          key={currentModel.id}
          title={currentModel.title}
          src={embedUrl}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          className="w-full h-full border-0 relative z-10"
        />

        {/* Bottom Floating Orbital Guide */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-[10px] font-mono text-slate-200 shadow-sm flex items-center gap-2 pointer-events-none whitespace-nowrap">
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
