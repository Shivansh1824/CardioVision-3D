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
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function AuthContentStage({ role }) {
  const containerRef = useRef(null);

  // GSAP Smooth Staggered Entrance & Role Transitions
  useGSAP(() => {
    // Smooth fade & gentle upward slide for the 3 explanation cards
    gsap.fromTo(
      '.explanation-card',
      { y: 18, opacity: 0, scale: 0.98 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.45, 
        stagger: 0.08, 
        ease: 'power2.out' 
      }
    );
  }, { scope: containerRef, dependencies: [role] });

  return (
    <div ref={containerRef} className="flex flex-col space-y-6 text-left max-w-xl">
      
      {/* ─── Header: Overline, Headline, and Simple Subtitle ─────────────── */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${role === 'doctor' ? 'bg-sky-500' : 'bg-rose-500'} animate-pulse`} />
          <span className={`font-mono text-xs font-bold tracking-widest uppercase ${role === 'doctor' ? 'text-sky-700' : 'text-rose-600'}`}>
            {role === 'doctor' ? 'Doctor Clinical Decision Support' : 'Heart Patient Visual Guide'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.14]">
          {role === 'doctor' ? (
            <>
              Fast Artery Risk Triage &amp; <br />
              <span className="text-gradient-cyan">Clear Clinical Guidance</span>
            </>
          ) : (
            <>
              Understand Your Heart with <br />
              <span className="text-gradient-vital">Complete Peace of Mind</span>
            </>
          )}
        </h1>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          {role === 'doctor'
            ? 'Helps doctors make rapid, confident decisions for heart patients without getting lost in complicated data.'
            : 'No frightening medical words or confusing charts. See how your heart is doing and know the exact steps to feel your best.'}
        </p>
      </div>

      {/* ─── 3 Simple, Beautifully Explained Cards ────────────────────────── */}
      <div className="space-y-3.5 pt-0.5">
        {role === 'doctor' ? (
          /* ── DOCTOR'S 3 CARDS (Very simple, clear words) ── */
          <>
            {/* Card 1 */}
            <div className="explanation-card group p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 shrink-0 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">1. Check 3 Main Heart Arteries</h3>
                  <span className="font-mono text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 font-semibold">
                    LAD • LCX • RCA
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
                  <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-semibold">
                    91.2% ACCURACY
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
                  <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                    ONE-CLICK EXPORT
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Create clean diagnostic summaries ready for hospital records, doctor-to-doctor referrals, and patient charts in seconds.
                </p>
              </div>
            </div>
          </>
        ) : (
          /* ── PATIENT'S 3 CARDS (Very simple, comforting words) ── */
          <>
            {/* Card 1 */}
            <div className="explanation-card group p-4 rounded-2xl bg-white/95 border border-rose-100 shadow-2xs hover:shadow-md hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 shrink-0 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">1. See Your Heart in Clear 3D</h3>
                  <span className="font-mono text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                    EASY TO SEE
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instead of reading scary medical test numbers, look at a friendly 3D model showing where blood is flowing freely and smoothly through your heart.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="explanation-card group p-4 rounded-2xl bg-white/95 border border-rose-100 shadow-2xs hover:shadow-md hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0 group-hover:scale-105 transition-transform">
                <Smile className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">2. Simple Words, No Medical Jargon</h3>
                  <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                    ZERO CONFUSION
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Everything is explained simply, like "Your main heart artery is healthy," so you always leave your visit feeling confident, calm, and relieved.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="explanation-card group p-4 rounded-2xl bg-white/95 border border-rose-100 shadow-2xs hover:shadow-md hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">3. Actionable Steps for You &amp; Family</h3>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    FAMILY CARE
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get simple daily advice—like easy walking routines, healthy food tips, and medicine schedules—plus a guide you can share with your family.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── Footer Trust Indicator ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Validated Clinical AI • 100% HIPAA Private &amp; Secure</span>
      </div>

    </div>
  );
}
