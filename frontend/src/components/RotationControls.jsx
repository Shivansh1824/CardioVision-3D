import React from 'react';
import { Compass, Play, Pause } from 'lucide-react';

export default function RotationControls({
  isAutoOrbit,
  onToggleAutoOrbit,
  normRot,
  onSetRotation,
  isPosteriorFacing,
}) {
  return (
    <div className="flex flex-col items-center gap-2 mt-2 w-full max-w-[420px] px-4 z-30">
      <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs">
        {/* 360° Auto-Orbit Toggle Button */}
        <button
          type="button"
          onClick={onToggleAutoOrbit}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isAutoOrbit
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/70'
          }`}
          title="Toggle continuous 360° rotation orbit"
        >
          {isAutoOrbit ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>360° Orbit</span>
        </button>

        {/* Quick Angle Presets */}
        <button
          type="button"
          onClick={() => onSetRotation(0)}
          className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
            normRot < 30 || normRot > 330
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Front 0°
        </button>

        <button
          type="button"
          onClick={() => onSetRotation(75)}
          className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
            normRot >= 60 && normRot <= 110
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Lateral 75°
        </button>

        <button
          type="button"
          onClick={() => onSetRotation(180)}
          className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
            normRot >= 160 && normRot <= 200
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Back 180°
        </button>
      </div>

      {/* Interactive Rotation Angle Slider & Drag Hint */}
      <div className="flex items-center gap-2.5 w-full text-slate-500 text-[11px] font-mono">
        <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <input
          type="range"
          min="0"
          max="360"
          value={Math.round(normRot)}
          onChange={(e) => onSetRotation(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
          aria-label="Rotate heart angle in 3D"
        />
        <span className="w-10 text-right font-bold text-slate-700">{Math.round(normRot)}°</span>
      </div>

      <p className="font-mono text-[10px] text-slate-400 tracking-wider text-center">
        {isPosteriorFacing
          ? 'Inspecting Posterior Wall · Coronary Sinus & PDA visible'
          : 'Drag heart horizontally or use 360° Orbit to inspect all angles'}
      </p>
    </div>
  );
}
