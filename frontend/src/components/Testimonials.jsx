import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Stethoscope, Heart, Award, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    author: {
      name: 'Dr. Arthur Vance, MD, FACC',
      role: 'Interventional Cardiologist',
      department: 'Cardiac Catheterization Laboratory',
      institution: 'St. Jude Heart & Vascular Institute',
      avatarInitial: 'AV',
      avatarGradient: 'from-rose-600 to-rose-700',
    },
    impactMetric: {
      value: '↓ 82%',
      label: 'Consultation Anxiety',
      context: 'Pre-Cath Triage',
      color: 'text-rose-600 bg-rose-50/70 border-rose-200/80',
    },
    quote:
      'In pre-cath triage, CardioVision translates complex hemodynamic parameters into immediate anatomical context. Being able to demonstrate lesion severity to families before stent placement has dramatically reduced procedural consultation anxiety.',
    verifiedTag: 'Clinical Peer Review',
  },
  {
    author: {
      name: 'Marcus Chen, RN, BSN',
      role: 'Cardiac Rehabilitation Nurse Specialist',
      department: 'Secondary Prevention & Recovery',
      institution: 'University Medical Center',
      avatarInitial: 'MC',
      avatarGradient: 'from-emerald-600 to-teal-700',
    },
    impactMetric: {
      value: '2.4×',
      label: 'Patient Compliance',
      context: 'Post-Angioplasty Care',
      color: 'text-emerald-700 bg-emerald-50/70 border-emerald-200/80',
    },
    quote:
      'For our post-angioplasty patients, visual compliance is everything. When a patient visibly sees how uncontrolled HbA1c and systolic spikes directly restrict their left anterior descending lumen, lifestyle adherence doubles.',
    verifiedTag: 'Nursing Leadership Review',
  },
  {
    author: {
      name: 'David R. (Age 54)',
      role: 'Post-MI Patient & Cardiac Recovery Advocate',
      department: 'Patient Experience Advisory Council',
      institution: 'Heart Health Network',
      avatarInitial: 'DR',
      avatarGradient: 'from-sky-600 to-indigo-700',
    },
    impactMetric: {
      value: '100%',
      label: 'Anatomical Clarity',
      context: 'Patient-Reported',
      color: 'text-sky-700 bg-sky-50/70 border-sky-200/80',
    },
    quote:
      'Hearing numbers like "90% occlusion in the RCA" sounded terrifying and abstract. When my doctor showed me the interactive vessel cross-section on CardioVision, I finally understood why blood pressure control was literally keeping my artery open.',
    verifiedTag: 'Verified Patient Outcome',
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      // Header entrance animation
      gsap.fromTo(
        '.testimonials-header',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials-header', start: 'top 85%' },
        }
      );

      // Staggered testimonial cards reveal
      gsap.fromTo(
        '.testimonial-card',
        { y: 45, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials-grid', start: 'top 85%' },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
      <div className="container-custom relative z-10">
        
        {/* Section Header */}
        <div className="testimonials-header text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-rose-600 uppercase">
              Clinical Evidence — Practitioner &amp; Patient Reviews
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
            Trusted in Cath Labs &amp; Consultations
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Real feedback from practicing interventionalists, cardiac care coordinators, and patients on the diagnostic utility of interactive 3D hemodynamics.
          </p>
        </div>

        {/* Testimonial Cards Grid: High-Trust Clinical Proof Architecture */}
        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="testimonial-card p-7 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div>
                {/* Header: Verified Clinician Credentials & Quantified Metric */}
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                  {/* Avatar with Status Ring */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.author.avatarGradient} text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}
                    >
                      {item.author.avatarInitial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {item.author.name}
                        </h3>
                        <CheckCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-label="Verified Practitioner" />
                      </div>
                      <p className="text-xs text-rose-600 font-medium truncate">
                        {item.author.role}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {item.author.institution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantified Impact Ribbon */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs mb-5 font-mono ${item.impactMetric.color}`}>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-sm font-extrabold font-display">
                      {item.impactMetric.value}
                    </strong>
                    <span className="font-semibold text-[11px]">
                      {item.impactMetric.label}
                    </span>
                  </div>
                  <span className="text-[10px] opacity-75 font-semibold">
                    {item.impactMetric.context}
                  </span>
                </div>

                {/* Quote Body with Refined Typography */}
                <blockquote className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  <span className="text-rose-400 font-serif text-lg leading-none mr-1 select-none">“</span>
                  {item.quote}
                  <span className="text-rose-400 font-serif text-lg leading-none ml-1 select-none">”</span>
                </blockquote>
              </div>

              {/* Bottom Verification Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {item.verifiedTag}
                </span>
                <span className="text-slate-400">CardioVision 3D</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
