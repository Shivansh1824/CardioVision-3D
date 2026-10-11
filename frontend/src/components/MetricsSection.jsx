import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Zap, HelpCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const METRIC_CARDS = [
  {
    step: '01',
    title: 'Overall Heart Disease',
    subtitle: 'Global Coronary Artery Disease (CAD)',
    tag: 'Primary CAD',
    tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
    score: '91.2%',
    color: 'text-emerald-700',
    subtitleColor: 'text-emerald-700',
    highlight: 'Reliably detects heart disease before invasive angiography',
    explanation: 'Accurately confirms whether a patient has coronary blockages using routine clinic markers alone—avoiding unnecessary hospitalizations.',
    benchmark: 'Tested on 5 blind patient groups',
  },
  {
    step: '02',
    title: 'Front Artery (LAD)',
    subtitle: 'Left Anterior Descending Vessel',
    tag: 'Critical Artery',
    tagColor: 'bg-rose-50 text-rose-800 border-rose-200/90',
    score: '84.4%',
    color: 'text-rose-700',
    subtitleColor: 'text-rose-700',
    highlight: 'Catches critical blockages in the main pumping vessel',
    explanation: 'Identifies narrowing in the most vital coronary artery that supplies over 50% of the left ventricle with zero needles or catheters.',
    benchmark: 'Validated on 303 clinical records',
  },
  {
    step: '03',
    title: 'Side Artery (LCX)',
    subtitle: 'Left Circumflex Coronary Artery',
    tag: 'Lateral Wall',
    tagColor: 'bg-sky-50 text-sky-800 border-sky-200/90',
    score: '73.1%',
    color: 'text-sky-700',
    subtitleColor: 'text-sky-700',
    highlight: 'Screens reduced lateral blood flow from ECG data',
    explanation: 'Spots subtle lateral circulation restrictions using combined heart rhythm waves and routine ultrasound measurements.',
    benchmark: 'Zero synthetic data leakage',
  },
  {
    step: '04',
    title: 'Right Artery (RCA)',
    subtitle: 'Right Coronary Pacemaker Vessel',
    tag: 'Rhythm Node',
    tagColor: 'bg-amber-50 text-amber-800 border-amber-200/90',
    score: '72.1%',
    color: 'text-amber-700',
    subtitleColor: 'text-amber-700',
    highlight: 'Flags narrowing feeding electrical heart nodes',
    explanation: 'Detects restricted blood supply to the heart’s natural pacemaker nodes responsible for maintaining steady electrical rhythm.',
    benchmark: 'Cross-validated 5-fold split',
  },
];

export default function MetricsSection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.metrics-header',
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        }
      );

      gsap.fromTo(
        '.metric-card',
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.metrics-grid', start: 'top 85%', once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section id="model-metrics" ref={sectionRef} className="py-24 lg:py-28 bg-slate-50/70 border-t border-slate-200/90 relative">
      <div className="container-custom">

        {/* Section Header */}
        <div className="metrics-header max-w-3xl mb-12 sm:mb-14 space-y-3">
          {/* Style 1: Editorial Monospace Overline */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/90 font-mono text-xs font-bold tracking-widest text-emerald-700 uppercase shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Empirical Validation — 5-Fold Stratified
            </span>
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

        {/* 4 Cards Grid — Clean Clinical Clarity */}
        <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {METRIC_CARDS.map((card, i) => (
            <div
              key={i}
              className="metric-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Top Bar with Number & Clinical Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-slate-300">
                    {card.step}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${card.tagColor}`}>
                    {card.tag}
                  </span>
                </div>

                {/* Primary Metric Hero Display */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-extrabold font-display tracking-tight ${card.color}`}>
                      {card.score}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Accuracy</span>
                  </div>
                </div>

                {/* Artery Title & Plain Subtitle */}
                <h3 className="text-base font-bold text-slate-900 mb-0.5">{card.title}</h3>
                <p className={`text-xs font-semibold ${card.subtitleColor} mb-3.5`}>
                  {card.subtitle}
                </p>

                {/* Plain-English Takeaway Callout */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3.5">
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {card.highlight}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{card.explanation}</p>
              </div>

              {/* Bottom Metadata Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{card.benchmark}</span>
                <span className="font-mono text-[11px] text-slate-400">0{i + 1} / 04</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
