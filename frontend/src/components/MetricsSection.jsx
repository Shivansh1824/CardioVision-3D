import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Award, Zap, HelpCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const METRIC_CARDS = [
  {
    title: 'Overall Heart Disease Detection',
    score: '91.2%',
    percent: 91.2,
    artery: 'Overall CAD Diagnosis',
    color: 'text-emerald-700',
    barColor: '#059669',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    explanation: 'Accurately determines whether a patient has coronary heart disease using routine non-invasive test markers.',
  },
  {
    title: 'Front Artery (LAD) Detection',
    score: '84.4%',
    percent: 84.4,
    artery: 'Left Anterior Descending',
    color: 'text-rose-700',
    barColor: '#e11d48',
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
    explanation: 'High accuracy in identifying narrowing in the heart’s most critical front pumping vessel without invasive procedures.',
  },
  {
    title: 'Side Artery (LCX) Detection',
    score: '73.1%',
    percent: 73.1,
    artery: 'Left Circumflex Artery',
    color: 'text-sky-700',
    barColor: '#0284c7',
    badge: 'bg-sky-50 text-sky-800 border-sky-200',
    explanation: 'Detects blood flow restrictions on the lateral side of the heart using combined ECG rhythms and ultrasound data.',
  },
  {
    title: 'Right Artery (RCA) Detection',
    score: '72.1%',
    percent: 72.1,
    artery: 'Right Coronary Artery',
    color: 'text-amber-700',
    barColor: '#d97706',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    explanation: 'Correctly spots reduced blood supply in the vessel that powers the heart’s electrical pacemaker nodes.',
  },
];

export default function MetricsSection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.metrics-header',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: '.metrics-header', start: 'top 85%' } }
      );

      gsap.fromTo(
        '.metric-card',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, scrollTrigger: { trigger: '.metrics-grid', start: 'top 85%' } }
      );

      gsap.fromTo(
        '.auc-bar-fill',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 1.0,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.metrics-grid', start: 'top 85%' },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section id="model-metrics" ref={sectionRef} className="py-20 bg-white border-t border-slate-200 relative">
      <div className="container-custom">

        {/* Section Header */}
        <div className="metrics-header max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tested on Real Patients</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Clinical AI Accuracy: What 5-Fold Validation Means
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            We don’t just test our models once. The AI was tested on 5 completely separate patient groups who were never seen during training, ensuring reliable real-world performance for new patients.
          </p>
        </div>

        {/* Plain-English Explanation Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-rose-600 shadow-2xs flex-shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Why 5-Fold Testing Guarantees Real-World Reliability
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Think of it like testing a student across 5 completely different exam papers. The patient database was divided into 5 independent slices. The model learned on 4 slices, and was graded on the 5th slice it had never seen before. This confirms the AI performs accurately on real humans, not just memorized textbook cases.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRIC_CARDS.map((card, i) => (
            <div
              key={i}
              className="metric-card p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border inline-block mb-3 ${card.badge}`}>
                  {card.artery}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-4">{card.title}</h3>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-4xl font-extrabold font-display tracking-tight ${card.color}`}>
                    {card.score}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Accuracy</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-4 border border-slate-200/60">
                  <div
                    className="auc-bar-fill h-full rounded-full"
                    style={{ width: `${card.percent}%`, background: card.barColor }}
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{card.explanation}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Verified Cross-Validation</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
