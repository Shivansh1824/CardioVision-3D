import BrandLogo from '../BrandLogo';
import { ShieldCheck } from 'lucide-react';

export default function AuthLoadingOverlay({ 
  message = 'Connecting to Secure Portal...', 
  subMessage = 'Redirecting to authentication service. Please wait a moment.' 
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/85 backdrop-blur-xl transition-all duration-500 font-body selection:bg-rose-500/20 selection:text-rose-900">
      
      {/* Subtle Luminous Background Glows (Light Texture) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-gradient-to-tr from-rose-200/40 via-sky-100/30 to-rose-100/40 rounded-full blur-3xl opacity-70 animate-pulse-gentle" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] bg-sky-200/30 rounded-full blur-2xl opacity-60" />
      </div>

      {/* Central Floating Card with Smooth Dual Spinner & Logo */}
      <div className="relative flex flex-col items-center p-8 sm:p-10 rounded-3xl bg-white/90 border border-slate-200/80 shadow-2xl max-w-sm w-full mx-4 text-center">
        
        {/* Animated Badge Container */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Smooth Rotating Gradient Ring */}
          <div className="w-20 h-20 rounded-full border-3 border-slate-100 border-t-rose-600 border-r-rose-400 animate-spin-smooth" />
          
          {/* Inner Glowing Badge */}
          <div className="absolute inset-2 bg-gradient-to-b from-rose-50 to-white rounded-full flex items-center justify-center shadow-inner">
            <BrandLogo size={32} />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 tracking-tight">
          {message}
        </h3>
        
        <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
          {subMessage}
        </p>

        {/* Elegant Progress Indicator */}
        <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-rose-500 via-rose-600 to-sky-500 rounded-full animate-progress-smooth" />
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/70 text-[11px] font-medium text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Medical Session</span>
        </div>

      </div>

      <style>{`
        @keyframes spinSmooth {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGentle {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.8; }
        }
        @keyframes progressSmooth {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(100%); }
        }
        .animate-spin-smooth {
          animation: spinSmooth 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-pulse-gentle {
          animation: pulseGentle 4s ease-in-out infinite;
        }
        .animate-progress-smooth {
          animation: progressSmooth 1.4s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
}
