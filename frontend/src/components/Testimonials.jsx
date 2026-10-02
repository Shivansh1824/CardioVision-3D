import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Stethoscope, HeartHandshake, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    role: 'Interventional Cardiologist',
    name: 'Dr. Arthur Vance, MD, FACC',
    facility: 'St. Jude Heart & Vascular Institute',
    quote:
      'In pre-cath triage, CardioVision translates complex hemodynamic parameters into immediate anatomical context. Being able to demonstrate lesion severity to families before stent placement has dramatically reduced procedural consultation anxiety.',
    icon: Stethoscope,
    tag: 'Clinical Cath Lab Review',
    tagColor: 'text-sky-700 bg-sky-50 border-sky-200',
  },
  {
    role: 'Cardiac Rehabilitation Nurse Specialist',
    name: 'Marcus Chen, RN, BSN',
    facility: 'University Medical Center',
    quote:
      'For our post-angioplasty patients, visual compliance is everything. When a patient visibly sees how uncontrolled HbA1c and systolic spikes directly restrict their left anterior descending lumen, lifestyle adherence doubles.',
    icon: HeartHandshake,
    tag: 'Secondary Prevention Lead',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    role: 'Post-MI Patient & Advocate',
    name: 'David R. (Age 54)',
    facility: 'Patient Experience Review',
    quote:
      'Hearing numbers like "90% occlusion in the RCA" sounded terrifying and abstract. When my doctor showed me the interactive vessel cross-section on CardioVision, I finally understood why blood pressure control was literally keeping my artery open.',
    icon: Award,
    tag: 'Verified Patient Outcome',
    tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.testimonials-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
      gsap.fromTo(
        '.testimonial-card',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 bg-white border-t border-slate-200 relative">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="testimonials-header text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            <span className="font-mono text-xs font-bold tracking-widest text-rose-600 uppercase">
              Clinical Evidence — Provider Reviews
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Trusted in Cath Labs &amp; Consultations
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Real feedback from practicing interventionalists, cardiac care coordinators, and patients on the diagnostic utility of interactive 3D hemodynamics.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="testimonial-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-rose-600">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-rose-600 font-semibold">{item.role}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.facility}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
