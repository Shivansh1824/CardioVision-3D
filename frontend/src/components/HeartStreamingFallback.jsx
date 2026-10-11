import { Html } from '@react-three/drei';
import { Activity, Heart } from 'lucide-react';

/**
 * HeartStreamingFallback — Luminous Medical Digital Twin Loading State
 *
 * Designed with:
 * - Frosted glassmorphism capsule matching clinical aesthetic
 * - Pulsing heartbeat ripple & animated SVG electrocardiogram rhythm
 * - Real-time telemetry indicators (72 BPM rhythm, 60fps WebGL)
 * - Hardware-accelerated GPU animations for zero frame drops
 */
export default function HeartStreamingFallback({ isCanvas = false }) {
  const content = (
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl bg-white/90 backdrop-blur-xl border border-rose-100/90 shadow-[0_20px_50px_rgba(225,29,72,0.12)] max-w-[300px] sm:max-w-[340px] text-center select-none pointer-events-none">
        {/* Soft radial backdrop aura */}
        <div
          aria-hidden="true"
          className="absolute -inset-6 rounded-full opacity-60 pointer-events-none -z-10 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.18) 0%, rgba(56,189,248,0.10) 45%, transparent 70%)',
          }}
        />

        {/* Pulsing Cardiac Beacon */}
        <div className="relative flex items-center justify-center w-14 h-14 mb-4">
          {/* Animated concentric pulse waves */}
          <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
          <span className="absolute -inset-1.5 rounded-full bg-rose-500/15 animate-pulse" />

          {/* Central glowing icon container */}
          <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-500/30">
            <Heart className="w-6 h-6 animate-pulse" fill="currentColor" />
          </div>
        </div>

        {/* ECG Electrocardiogram Track */}
        <div className="w-full flex items-center justify-center mb-3.5 px-4">
          <svg
            className="w-48 h-7 text-rose-500 overflow-visible"
            viewBox="0 0 200 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Background ECG baseline */}
            <path
              d="M0 20 L40 20 L50 20 L58 10 L66 32 L74 6 L82 28 L90 20 L100 20 L140 20 L150 20 L158 10 L166 32 L174 6 L182 28 L190 20 L200 20"
              stroke="rgba(244,63,94,0.22)"
              strokeWidth="2"
            />
            {/* Animated foreground pulse line */}
            <path
              d="M0 20 L40 20 L50 20 L58 10 L66 32 L74 6 L82 28 L90 20 L100 20 L140 20 L150 20 L158 10 L166 32 L174 6 L182 28 L190 20 L200 20"
              className="animate-ecg-trace"
            />
          </svg>
        </div>

        {/* Header Title */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest uppercase text-rose-600 mb-1">
          <Activity className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Calibrating 3D Cardiac Twin</span>
        </div>

        {/* Clinical Subtext */}
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3">
          Streaming anatomical myocardium &amp; coronary vessel geometries...
        </p>

        {/* Telemetry Status Pills */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[10px] font-mono text-slate-600">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>72 BPM</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-slate-500">
            <span>60 FPS WebGL</span>
          </span>
        </div>

        {/* ECG Animation CSS */}
        <style>{`
          @keyframes ecgSweep {
            0% {
              stroke-dasharray: 40 160;
              stroke-dashoffset: 200;
            }
            100% {
              stroke-dasharray: 40 160;
              stroke-dashoffset: 0;
            }
          }
          .animate-ecg-trace {
            animation: ecgSweep 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        `}</style>
    </div>
  );

  if (isCanvas) {
    return <Html center zIndexRange={[100, 50]}>{content}</Html>;
  }

  return content;
}

