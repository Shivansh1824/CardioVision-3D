/**
 * RealisticHeart3DViewer — Interactive WebGL 3D Heart Centerpiece
 * Pure 3D model viewport: zero clutter, full 360° orbital interaction
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Heart } from 'lucide-react';

const MODELS = {
  realistic: {
    id: '3f8072336ce94d18b3d0d055a1ece089',
    title: 'Realistic Human Heart',
    author: 'neshallads',
    label: 'Realistic Anatomy',
  },
  beating: {
    id: 'd9845afb1ee64ad094adc96320c67d98',
    title: 'Beating Heart',
    author: 'jalmer',
    label: 'Beating Cycle',
  },
};

export default function RealisticHeart3DViewer() {
  const [selectedModel, setSelectedModel] = useState('realistic');
  const currentModel = MODELS[selectedModel];

  // Clean Sketchfab embed URL without watermarks or overlay clutter
  const embedUrl = `https://sketchfab.com/models/${currentModel.id}/embed?autostart=1&preload=1&transparent=1&ui_infos=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_inspector=0&ui_stop=0`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[580px] sm:max-w-[640px] flex flex-col items-center select-none"
    >
      {/* Pure 3D Model Stage Container */}
      <div className="relative w-full h-[470px] sm:h-[510px] rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900/5 backdrop-blur-xl">
        
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

        {/* Minimal Model Selector Pill */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm pointer-events-auto">
          <button
            type="button"
            onClick={() => setSelectedModel('realistic')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedModel === 'beating'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-3 h-3" />
            <span>Beating Cycle</span>
          </button>
        </div>

        {/* Pure 3D WebGL Model Iframe */}
        <iframe
          key={currentModel.id}
          title={currentModel.title}
          src={embedUrl}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          className="w-full h-full border-0 relative z-10"
        />
      </div>
    </motion.div>
  );
}
