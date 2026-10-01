import React from 'react';
import { Quote, Stethoscope, HeartHandshake, Award } from 'lucide-react';

const TESTIMONIALS = [
  {
    role: 'Interventional Cardiologist',
    name: 'Dr. Arthur Vance, MD, FACC',
    facility: 'St. Jude Heart & Vascular Institute',
    quote:
      'In pre-cath triage, CardioVision translates complex hemodynamic parameters into immediate anatomical context. Being able to demonstrate lesion severity to families before stent placement has dramatically reduced procedural consultation anxiety.',
    icon: Stethoscope,
    badge: 'Clinical Cath Lab Review'
  },
  {
    role: 'Cardiac Rehabilitation Nurse Specialist',
    name: 'Marcus Chen, RN, BSN',
    facility: 'University Medical Center',
    quote:
      'For our post-angioplasty patients, visual compliance is everything. When a patient visibly sees how uncontrolled HbA1c and systolic spikes directly restrict their left anterior descending lumen, lifestyle adherence doubles.',
    icon: HeartHandshake,
    badge: 'Secondary Prevention Lead'
  },
  {
    role: 'Post-MI Patient & Advocate',
    name: 'David R. (Age 54)',
    facility: 'Patient Experience Review',
    quote:
      'Hearing numbers like "90% occlusion in the RCA" sounded terrifying and abstract. When my doctor showed me the interactive vessel cross-section on CardioVision, I finally understood why blood pressure control was literally keeping my artery open.',
    icon: Award,
    badge: 'Verified Patient Outcome'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <Quote className="w-3.5 h-3.5 text-slate-500" />
            <span>Clinical Evidence & Provider Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Trusted in Cath Labs & Consultations
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
            Real feedback from practicing interventionalists, cardiac care coordinators, and patients on the diagnostic utility of interactive 3D hemodynamics.
          </p>
        </div>

        {/* Testimonial Cards Grid (Clean, balanced 3-column with realistic layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50/80 rounded-xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {item.badge}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{item.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80">
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-600 font-medium">{item.role}</p>
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
