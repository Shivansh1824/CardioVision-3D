import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Stethoscope, Heart, Users, ArrowRight, Brain, FileText, Activity, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DOCTOR_FEATURES = [
  { icon: Brain,    label: 'SHAP Attribution',     desc: 'Log-odds waterfall plots decomposing marginal risk per biomarker with feature importance ranking.' },
  { icon: Activity, label: 'Multi-Vessel Staging',  desc: 'Proportional 0/3 → 3/3 vessel disease classification with triage urgency codes (SVD/DVD/TVD).' },
  { icon: FileText, label: 'Clinical PDF Report',   desc: 'Official Cardiology Diagnostic Report PDF with physician signature line for medical records.' },
  { icon: Shield,   label: 'Zero-Leakage Pipeline', desc: 'Calibrated XGBoost + LightGBM ensemble validated on 303-patient UCI #411 cohort. 0.912 AUC.' },
];

const PATIENT_FEATURES = [
  { icon: Heart,    label: 'My Heart Twin',         desc: '"Your front heart artery shows high alert ⚠️" — plain English, zero medical jargon.' },
  { icon: Activity, label: 'Top 3 Risk Drivers',    desc: "Simple, prioritized list of what's most affecting your heart health, not intimidating numbers." },
  { icon: Brain,    label: '"What-If" Lifestyle',   desc: 'See how a 30-minute daily walk or cutting sodium changes your heart risk in real time.' },
  { icon: FileText, label: 'Heart Health Passport', desc: 'A simplified take-home summary designed for family members and caregivers to understand.' },
];

export default function PersonaComparison({ onOpenSignIn }) {
  const [activeTab, setActiveTab] = useState('both');
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from('.persona-header', {
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.persona-header', start: 'top 85%' },
      });
      gsap.from('.persona-card', {
        y: 45,
        opacity: 0,
        duration: 0.75,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.persona-cards', start: 'top 80%' },
      });
    },
    { scope: sectionRef }
  );

  const showDoctor = activeTab === 'both' || activeTab === 'doctor';
  const showPatient = activeTab === 'both' || activeTab === 'patient';

  return (
    <section id="persona-section" ref={sectionRef} className="py-24 border-t border-white/10 relative overflow-hidden">

      {/* Ambient background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
           style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }} />

      <div className="container-custom relative z-10">

        {/* ── Section Header ── */}
        <div className="persona-header text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 font-mono text-xs font-semibold uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>Dual-Persona Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
            Built for <span className="text-gradient-cyan">Cardiologists</span>{' '}
            &amp; <span className="text-gradient-vivid">Heart Patients</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            One synchronized platform. Two completely different, purpose-built experiences.
          </p>

          {/* Tab selector */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-900 border border-slate-800 mt-4">
            {[
              { id: 'both',    label: 'Side-by-Side' },
              { id: 'doctor',  label: '🩺 Doctor Only', active: 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-500/20' },
              { id: 'patient', label: '❤️ Patient Only', active: 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/20' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? tab.id === 'both'
                      ? 'bg-slate-700 text-white shadow-md'
                      : `${tab.active} text-white shadow-md`
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Persona Cards ── */}
        <div className={`persona-cards grid gap-8 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>

          {/* Doctor Card */}
          {showDoctor && (
            <div className="persona-card relative rounded-3xl overflow-hidden border border-cyan-500/25 bg-gradient-to-b from-slate-900/95 via-cyan-950/20 to-slate-950/95 shadow-2xl shadow-cyan-950/40">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400" />

              <div className="p-8">
                {/* Card header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-600/30">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display text-white">Doctor View</h3>
                      <p className="text-xs font-mono text-cyan-400">Clinical Decision Support Portal</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/80 border border-cyan-700/60 text-cyan-300">
                    High Precision
                  </span>
                </div>

                {/* Feature rows */}
                <div className="mt-6 space-y-3">
                  {DOCTOR_FEATURES.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-cyan-800/40 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{f.label}</div>
                          <div className="text-[11px] text-slate-400 leading-snug mt-0.5">{f.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
                  className="mt-7 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/20 group"
                >
                  <span>Enter as Cardiologist</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Patient Card */}
          {showPatient && (
            <div className="persona-card relative rounded-3xl overflow-hidden border border-red-500/25 bg-gradient-to-b from-slate-900/95 via-rose-950/20 to-slate-950/95 shadow-2xl shadow-red-950/40">
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-red-500 via-rose-500 to-pink-400" />

              <div className="p-8">
                {/* Card header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-600/30">
                      <Heart className="w-6 h-6 text-white fill-white/20" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display text-white">Patient View</h3>
                      <p className="text-xs font-mono text-red-400">My Digital Heart Twin</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-red-950/80 border border-red-700/60 text-red-300">
                    Anxiety-Free
                  </span>
                </div>

                {/* Feature rows */}
                <div className="mt-6 space-y-3">
                  {PATIENT_FEATURES.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-red-800/40 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800/50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{f.label}</div>
                          <div className="text-[11px] text-slate-400 leading-snug mt-0.5">{f.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <button
                  onClick={() => onOpenSignIn && onOpenSignIn('patient')}
                  className="mt-7 w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20 group"
                >
                  <span>Enter as Heart Patient</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
