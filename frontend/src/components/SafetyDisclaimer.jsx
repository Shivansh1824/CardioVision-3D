import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

export default function SafetyDisclaimer() {
  return (
    <section id="safety-disclaimer" className="section-sm border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-start gap-8">

          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.18)' }}>
            <ShieldAlert className="w-5 h-5" style={{ color: '#f43f5e' }} />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display font-bold text-white text-base">
                Clinical Safety &amp; Research Disclaimer
              </span>
              <span className="chip" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.18)', color: '#fca5a5' }}>
                FDA / CE Research Prototype
              </span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
              CardioVision 3D is an AI-driven clinical research prototype built for the{' '}
              <strong className="text-slate-300">Multimodal AI Hackathon 2026</strong>.
              Risk projections and stenosis probabilities are for triage assistance, medical education, and patient comprehension — not definitive diagnosis.
              This software does not replace formal coronary angiography, CT angiograms, or consultation with a licensed cardiologist.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {['Zero Data Leakage', 'UCI Repository #411 Verified', 'SHAP Explainability Standard'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00d68f' }} />
                  <span className="font-mono text-[11px] text-slate-500">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
