import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Standard Medical Tests Collected',
    subtitle: 'ECG, Ultrasound & Blood Work',
    desc: 'Uses the routine tests you already take at the clinic: ECG heart rhythm, echocardiogram ultrasound of heart muscle movement, and standard cholesterol blood panels. Zero needles or invasive catheters needed.',
    tag: 'Non-Invasive',
    tagColor: 'text-sky-700 bg-sky-50 border-sky-200',
  },
  {
    step: '02',
    title: 'AI Evaluates Each Artery',
    subtitle: 'Under 30 Milliseconds',
    desc: 'The trained clinical algorithm cross-references your test markers to determine the individual blood flow health of your front (LAD), side (LCX), and right (RCA) coronary arteries.',
    tag: 'Rapid Analysis',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    step: '03',
    title: '3D Heart Twin Updates',
    subtitle: 'Clear Visual Color Coding',
    desc: 'Your personalized 3D heart shows how blood flows in real time: green where arteries are clear and unobstructed, amber for mild plaque, and red where narrowing needs clinical care.',
    tag: 'Intuitive 3D Twin',
    tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
  },
  {
    step: '04',
    title: 'Shared Doctor-Patient Care Plan',
    subtitle: 'Empowered Health Decisions',
    desc: 'Doctor and patient look at the same clear visual model together to plan next steps—whether simple daily habit changes, targeted medication, or advanced cardiology consultation.',
    tag: 'Actionable Outcome',
    tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
];

export default function ClinicalWorkflow() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.workflow-header',
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo(
        '.workflow-step-card',
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section id="clinical-workflow" ref={sectionRef} className="py-20 bg-slate-50/70 border-t border-slate-200 relative">
      <div className="container-custom">

        {/* Section Header */}
        <div className="workflow-header text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            <span className="font-mono text-xs font-bold tracking-widest text-rose-600 uppercase">
              Multi-Modal Methodology — How It Works
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            From Routine Medical Tests to a <span className="text-gradient-vivid">Living Heart Model</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            A clear 4-step pathway that turns medical numbers into an easy-to-understand 3D visual experience.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="workflow-steps-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKFLOW_STEPS.map((step, idx) => {
            return (
              <div
                key={idx}
                className="workflow-step-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Number & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-slate-300">
                      {step.step}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${step.tagColor}`}>
                      {step.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
                  <p className="text-xs font-semibold text-rose-600 mb-2">{step.subtitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
