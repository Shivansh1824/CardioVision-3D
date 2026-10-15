import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Stethoscope, 
  Activity, 
  FileText, 
  Heart, 
  Smile, 
  Users, 
  ShieldCheck
} from 'lucide-react';

export default function AuthContentStage({ role }) {
  const containerRef = useRef(null);

  // GSAP Smooth Staggered Entrance & Role Transitions
  useGSAP(() => {
    gsap.fromTo(
      '.stage-header',
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }
    );

    // Smooth fade & gentle upward slide for the 3 explanation cards
    gsap.fromTo(
      '.explanation-card',
      { y: 20, autoAlpha: 0, scale: 0.97 },
      { 
        y: 0, 
        autoAlpha: 1, 
        scale: 1, 
        duration: 0.5, 
        stagger: 0.08, 
        ease: 'power3.out' 
      }
    );
  }, { scope: containerRef, dependencies: [role] });

  return (
    <div ref={containerRef} className="flex flex-col space-y-6 text-left max-w-xl">
      
      {/* ─── Header: Overline, Headline, and Simple Subtitle ─────────────── */}
      <div className="stage-header space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 shadow-2xs backdrop-blur-sm">
          <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
          <span className="text-xs font-semibold tracking-tight text-sky-800">
            Clinical Decision Support Suite
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.14]">
          Fast Artery Risk Triage &amp; <br />
          <span className="text-gradient-cyan">Clear Clinical Guidance</span>
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Helps doctors make rapid, confident decisions for heart patients without getting lost in complicated data.
        </p>
      </div>

      {/* ─── 3 Simple, Beautifully Explained Cards ────────────────────────── */}
      <div className="space-y-3.5 pt-0.5">
        {/* Card 1 */}
        <div className="explanation-card group p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 shrink-0 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">1. Check 3 Main Heart Arteries</h3>
              <span className="text-[11px] text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 font-semibold tracking-tight">
                LAD &bull; LCX &bull; RCA
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quickly see if the three main heart arteries are open or narrowed, helping you decide right away who needs urgent hospital catheterization.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="explanation-card group p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">2. Clear Explanations, Zero Guesswork</h3>
              <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 font-semibold tracking-tight">
                91.2% Accuracy
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              See the exact clinical reasons behind every risk assessment—such as ECG wave changes or cholesterol levels—backed by 91.2% tested accuracy.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="explanation-card group p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">3. Ready Clinical Notes in One Click</h3>
              <span className="text-[11px] text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 font-semibold tracking-tight">
                One-Click Export
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create clean diagnostic summaries ready for hospital records, doctor-to-doctor referrals, and patient charts in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Footer Trust Indicator ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Validated Clinical AI • 100% HIPAA Private &amp; Secure</span>
      </div>

    </div>
  );
}
