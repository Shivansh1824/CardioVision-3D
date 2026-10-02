import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SafetyDisclaimer() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.safety-card',
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section id="safety-disclaimer" ref={sectionRef} className="py-12 bg-slate-50 border-t border-slate-200 relative">
      <div className="container-custom">
        <div className="safety-card p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-slate-900 text-base">
                  Medical Notice &amp; Safety Guidance
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CardioVision AI is an interactive clinical educational tool and risk visualization support system. Visual artery projections and stenosis estimates are provided to support clinical triage and empower patient understanding. They do <strong>not</strong> substitute for formal coronary angiography, catheterization, or personalized care from a licensed cardiologist. Always consult your healthcare provider for medical decisions.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-slate-500 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Clinical Education &amp; Triage Aid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Non-Invasive Diagnostic Support</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
