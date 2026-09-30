import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Database, Cpu, Eye, Sliders } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: '01',
    Icon: Database,
    title: 'Multimodal Intake',
    sub: 'Non-invasive only',
    desc: '12-lead ECG waveforms, echo RWMA, and lipid biomarkers — no catheterisation required.',
    accent: '#00e5ff',
  },
  {
    n: '02',
    Icon: Cpu,
    title: 'AI Ensemble',
    sub: 'XGBoost · LightGBM · SHAP',
    desc: 'Calibrated soft-voting classifiers evaluate LAD, LCX, and RCA stenosis risk with local feature attribution in <30ms.',
    accent: '#00d68f',
  },
  {
    n: '03',
    Icon: Eye,
    title: '3D Heart Twin',
    sub: 'WebGL / React Three Fiber',
    desc: 'Abstract numbers become spatial anatomy. Coronary vessels pulse in real time, colour-coded by stenosis severity.',
    accent: '#f0a500',
  },
  {
    n: '04',
    Icon: Sliders,
    title: 'What-If Engine',
    sub: 'Real-time dynamic simulation',
    desc: 'Clinicians adjust pharmacotherapy. Patients simulate lifestyle changes. The 3D heart updates instantly.',
    accent: '#f43f5e',
  },
];

export default function ClinicalWorkflow() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from('.cw-header', {
      y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.cw-header', start: 'top 85%' },
    });
    gsap.from('.cw-step', {
      y: 36, autoAlpha: 0, duration: 0.65, stagger: 0.11, ease: 'power3.out',
      scrollTrigger: { trigger: '.cw-steps', start: 'top 78%' },
    });
  }, { scope: sectionRef });

  return (
    <section id="clinical-workflow" ref={sectionRef} className="section border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="container-wide">

        <div className="cw-header mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <div className="chip chip-info w-fit">How It Works</div>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
              From Raw Records<br />
              <span style={{
                background: 'linear-gradient(135deg, #fca5a5 0%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>to a Living Digital Twin</span>
            </h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed md:text-right">
            A seamless bridge between complex clinical diagnostics and intuitive visual understanding.
          </p>
        </div>

        {/* Horizontal step rail */}
        <div className="cw-steps relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-10 right-10 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)' }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step) => {
              const { Icon } = step;
              return (
                <div key={step.n} className="cw-step group relative">
                  {/* Step number — large, muted */}
                  <div className="text-7xl font-display font-extrabold leading-none mb-4 select-none transition-colors duration-300"
                    style={{ color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.06em' }}>
                    {step.n}
                  </div>

                  {/* Icon */}
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105"
                    style={{ background: step.accent + '14', border: `1px solid ${step.accent}28` }}>
                    <Icon className="w-5 h-5" style={{ color: step.accent }} />
                  </div>

                  <h3 className="text-base font-display font-bold text-white mb-0.5">{step.title}</h3>
                  <div className="font-mono text-[11px] mb-2.5" style={{ color: step.accent }}>{step.sub}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>

                  {/* Bottom accent line */}
                  <div className="mt-5 h-0.5 rounded-full w-8 transition-all duration-300 group-hover:w-16"
                    style={{ background: step.accent }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
