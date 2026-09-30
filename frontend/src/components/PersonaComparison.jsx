import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Activity, FileText, Shield, Heart, Sliders, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const DOCTOR = [
  { Icon: Brain,    label: 'SHAP Attribution',     desc: 'Log-odds waterfall plots, marginal risk per biomarker, feature importance ranking.' },
  { Icon: Activity, label: 'Multi-Vessel Staging',  desc: 'Proportional 0–3 vessel disease classification with SVD/DVD/TVD triage codes.' },
  { Icon: FileText, label: 'Clinical PDF Report',   desc: 'Official cardiology diagnostic PDF with physician signature line.' },
  { Icon: Shield,   label: 'Zero-Leakage Pipeline', desc: 'Calibrated XGBoost + LightGBM ensemble · 0.912 AUC · UCI #411.' },
];

const PATIENT = [
  { Icon: Heart,    label: 'My Heart Twin',        desc: '"Your front artery shows high alert" — plain English, zero jargon.' },
  { Icon: Activity, label: 'Top 3 Risk Drivers',   desc: 'Simple prioritised list of what matters most for your heart health.' },
  { Icon: Sliders,  label: '"What-If" Lifestyle',  desc: 'See how a 30-minute walk or cutting salt changes your risk in real time.' },
  { Icon: FileText, label: 'Heart Passport',        desc: 'A take-home summary designed for family members and caregivers.' },
];

function FeatureItem({ Icon, label, desc, accent }) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300"
        style={{ background: accent + '15', border: `1px solid ${accent}25` }}>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-xs text-slate-500 leading-relaxed mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function PersonaPanel({ role, features, accent, tagline, onCTA, ctaLabel }) {
  return (
    <div className="persona-panel glass-card p-8 md:p-10 space-y-8" style={{ borderRadius: 24 }}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="chip w-fit" style={{ background: accent + '12', border: `1px solid ${accent}30`, color: accent }}>
            {role}
          </div>
          <h3 className="text-2xl font-display font-extrabold text-white mt-2">{tagline}</h3>
        </div>
        <div className="h-px sm:h-auto sm:w-px flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <button
          onClick={onCTA}
          className="flex items-center gap-2 self-start sm:self-center group/btn cursor-pointer text-sm font-medium transition-colors whitespace-nowrap"
          style={{ color: accent, background: 'none', border: 'none', padding: 0 }}
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {features.map((f, i) => (
          <FeatureItem key={i} Icon={f.Icon} label={f.label} desc={f.desc} accent={accent} />
        ))}
      </div>
    </div>
  );
}

export default function PersonaComparison({ onOpenSignIn }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from('.pc-header', {
      y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.pc-header', start: 'top 85%' },
    });
    gsap.from('.persona-panel', {
      y: 40, autoAlpha: 0, duration: 0.75, stagger: 0.18, ease: 'power3.out',
      scrollTrigger: { trigger: '.pc-panels', start: 'top 80%' },
    });
  }, { scope: sectionRef });

  return (
    <section id="persona-section" ref={sectionRef} className="section border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="container-wide">

        <div className="pc-header mb-12 space-y-3">
          <div className="chip chip-info w-fit">Dual-Persona Experience</div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
            Built for Cardiologists<br />
            <span style={{
              background: 'linear-gradient(135deg, #fca5a5, #f43f5e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              and Heart Patients.
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-xl leading-relaxed">
            One synchronised platform. Two completely different, purpose-built experiences.
          </p>
        </div>

        <div className="pc-panels space-y-5">
          <PersonaPanel
            role="Doctor View — Clinical Decision Support"
            tagline="Precision-grade analytics for the cardiologist"
            features={DOCTOR}
            accent="#00e5ff"
            onCTA={() => onOpenSignIn?.('doctor')}
            ctaLabel="Enter as Cardiologist"
          />
          <PersonaPanel
            role="Patient View — My Heart Twin"
            tagline="Clear, calm, human-first heart intelligence"
            features={PATIENT}
            accent="#f43f5e"
            onCTA={() => onOpenSignIn?.('patient')}
            ctaLabel="Enter as Heart Patient"
          />
        </div>
      </div>
    </section>
  );
}
