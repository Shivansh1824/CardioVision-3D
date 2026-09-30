import React, { useState } from 'react';
import { Stethoscope, Heart, Users, ArrowRight } from 'lucide-react';

const COMPARISON_DIMENSIONS = [
  {
    title: 'Primary Mission',
    doctor: 'Diagnostic risk confirmation, emergency stratification & catheterization triaging.',
    patient: 'Personal empowerment, anxiety reduction & daily treatment adherence.',
  },
  {
    title: 'Language & Terminology',
    doctor: 'Medical: LAD Stenosis (≥70%), Regional Wall Motion Abnormality (RWMA), ST-Elevation, NYHA Class.',
    patient: 'Plain English: Front Main Artery (High Alert ⚠️), heart wall pumping weakness, rhythm flutter.',
  },
  {
    title: 'Data Scope & Access',
    doctor: 'Full multi-patient clinical queue (303 patient cohort) + bulk intake & lab record uploads.',
    patient: 'Private single-patient perspective strictly focused on "My Digital Heart Twin".',
  },
  {
    title: 'AI Explainability (SHAP)',
    doctor: 'Log-odds waterfall plots & feature attribution decomposing marginal risk per biomarker.',
    patient: '"Top 3 Things Affecting My Heart" — clear, non-intimidating prioritized health drivers.',
  },
  {
    title: '"What-If" Simulation',
    doctor: 'Pharmacotherapy & intervention titration: High-intensity Atorvastatin, ACE inhibitors, beta-blockers.',
    patient: 'Everyday lifestyle goals: 30-minute brisk walk, reduced sodium intake, taking daily prescription.',
  },
  {
    title: 'Export Output',
    doctor: 'Official Clinical Cardiology Diagnostic Report PDF with physician signature line.',
    patient: '"My Heart Health Passport" — simplified take-home action guide for family and caregivers.',
  },
];

export default function PersonaComparison({ onOpenSignIn }) {
  const [activeTab, setActiveTab] = useState('both'); // 'doctor', 'patient', 'both'

  return (
    <section id="persona-section" className="py-20 bg-slate-950/70 border-t border-slate-900 relative">
      <div className="container-custom">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 font-mono text-xs font-semibold uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>Dual-Persona Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
            Designed for <span className="text-cyan-400">Cardiologists</span> & Empowering <span className="text-red-400">Heart Patients</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A single platform with two synchronized perspectives. Clinicians get high-throughput diagnostic tools; patients get a compassionate, plain-language visual window into their cardiovascular health.
          </p>

          {/* Interactive Persona Selector Bar */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-900 border border-slate-800 mt-4">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'both'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'doctor'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-cyan-300" />
              <span>Doctor View Only</span>
            </button>
            <button
              onClick={() => setActiveTab('patient')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'patient'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-red-300" />
              <span>Patient View Only</span>
            </button>
          </div>
        </div>

        {/* Persona Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Doctor View Card */}
          {(activeTab === 'both' || activeTab === 'doctor') && (
            <div className={`p-8 rounded-3xl border transition-all ${
              activeTab === 'doctor' ? 'lg:col-span-2 max-w-4xl mx-auto' : ''
            } bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-cyan-500/30 shadow-2xl shadow-cyan-950/30 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display text-white">
                        🩺 Doctor View
                      </h3>
                      <p className="text-xs font-mono text-cyan-400">Clinical Decision Support Portal</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                    High Precision
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {COMPARISON_DIMENSIONS.map((dim, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">
                        {dim.title}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200">
                        {dim.doctor}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <button
                  onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/20"
                >
                  <span>Enter as Cardiologist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Patient View Card */}
          {(activeTab === 'both' || activeTab === 'patient') && (
            <div className={`p-8 rounded-3xl border transition-all ${
              activeTab === 'patient' ? 'lg:col-span-2 max-w-4xl mx-auto' : ''
            } bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-red-500/30 shadow-2xl shadow-red-950/30 flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-800/80 flex items-center justify-center text-red-400">
                      <Heart className="w-6 h-6 fill-red-500/20" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-display text-white">
                        👤 Patient View
                      </h3>
                      <p className="text-xs font-mono text-red-400">My Digital Heart Twin</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-red-950/80 border border-red-800 text-red-300">
                    Anxiety-Free
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {COMPARISON_DIMENSIONS.map((dim, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-red-400">
                        {dim.title}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200">
                        {dim.patient}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <button
                  onClick={() => onOpenSignIn && onOpenSignIn('patient')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
                >
                  <span>Enter as Heart Patient</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
