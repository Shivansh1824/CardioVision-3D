import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

export default function SafetyDisclaimer() {
  return (
    <section id="safety-disclaimer" className="py-16 border-t border-white/10 relative">
      <div className="container-custom">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/20 via-slate-900/60 to-slate-900/40 border border-red-500/20 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start gap-5">
            
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400 flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-bold text-white text-base sm:text-lg">
                  Clinical Safety & Medical Research Disclaimer
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-red-950 text-red-300 border border-red-800">
                  FDA / CE Research Prototype
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                CardioVision 3D is an AI-driven clinical research and decision support prototype built for the <strong>Multimodal AI Hackathon 2026</strong>. Visual spatial risk projections and vessel stenosis probabilities are intended for triage assistance, medical education, and patient comprehension. They do <strong>not</strong> constitute definitive medical diagnoses, surgical determinations, or therapeutic guarantees. This software does not replace formal coronary angiography, CT angiograms, or consultation with a licensed cardiologist.
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-mono text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero Data Leakage Pipeline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>UCI Repository #411 Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SHAP Explainability Standard</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
