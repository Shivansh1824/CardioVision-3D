import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MODELS = [
  {
    vessel: 'CAD', label: 'Binary Disease',
    auc: 0.912, auc_str: '0.912',
    color: '#00d68f',
    note: 'Primary target. Calibrated XGBoost + LightGBM ensemble with sigmoid calibration.',
  },
  {
    vessel: 'LAD', label: 'L. Ant. Descending',
    auc: 0.844, auc_str: '0.844',
    color: '#00e5ff',
    note: 'Predicts anterior wall ischemia without invasive catheterisation.',
  },
  {
    vessel: 'LCX', label: 'L. Circumflex',
    auc: 0.731, auc_str: '0.731',
    color: '#f0a500',
    note: 'Detects lateral perfusion deficit through ECG and echo markers.',
  },
  {
    vessel: 'RCA', label: 'Right Coronary',
    auc: 0.721, auc_str: '0.721',
    color: '#f43f5e',
    note: 'Flags inferior hypoperfusion and RV involvement.',
  },
];

// ── Compact arc per model ─────────────────────────────────────────────
function SmallArc({ auc, color }) {
  const R = 34;
  const arc = 2 * Math.PI * R * 0.75;
  const fill = arc * auc;
  return (
    <svg width="88" height="56" viewBox="0 0 88 60">
      <path d="M 8 54 A 36 36 0 1 1 80 54"
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 8 54 A 36 36 0 1 1 80 54"
        fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        strokeDasharray={`${arc} ${2 * Math.PI * R}`}
        strokeDashoffset={arc - fill}
        style={{ filter: `drop-shadow(0 0 5px ${color}99)`, transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

export default function MetricsSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from('.ms-header', {
      y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.ms-header', start: 'top 85%' },
    });
    // Stagger the model rows
    gsap.from('.ms-row', {
      x: -28, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ms-table', start: 'top 78%' },
    });
    // Animate AUC arcs
    gsap.from('.ms-arc path:last-child', {
      strokeDashoffset: (i, el) => parseFloat(el.getAttribute('stroke-dasharray')),
      duration: 1.2, stagger: 0.12, ease: 'power2.out',
      scrollTrigger: { trigger: '.ms-table', start: 'top 75%' },
    });
  }, { scope: sectionRef });

  return (
    <section id="model-metrics" ref={sectionRef} className="section border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="container-wide">

        <div className="ms-header mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <div className="chip chip-info w-fit">Rigorous Clinical Validation</div>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
              5-Fold Cross-Validated<br />
              <span style={{
                background: 'linear-gradient(135deg, #a5f3fc, #00e5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Model Accuracy</span>
            </h2>
          </div>
          <div className="telem-card px-4 py-3 flex items-center gap-3 self-start">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono text-xs text-slate-300">
              Avg inference latency <strong className="text-white">&lt;25ms</strong>
            </span>
          </div>
        </div>

        {/* Metric table — horizontal rows, not cards */}
        <div className="ms-table space-y-3">
          {MODELS.map((m) => (
            <div key={m.vessel} className="ms-row group glass-card px-6 py-5 flex flex-wrap sm:flex-nowrap items-center gap-5 hover:scale-[1.005] transition-transform duration-300" style={{ borderRadius: 16 }}>

              {/* Arc gauge */}
              <div className="ms-arc flex-shrink-0">
                <SmallArc auc={m.auc} color={m.color} />
              </div>

              {/* AUC number + vessel */}
              <div className="flex-shrink-0 min-w-[90px]">
                <div className="metric-num text-3xl font-bold" style={{ color: m.color, letterSpacing: '-0.04em' }}>
                  {m.auc_str}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">ROC-AUC</div>
              </div>

              {/* Vessel name */}
              <div className="flex-shrink-0 min-w-[130px]">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg text-white">{m.vessel}</span>
                  <span className="font-mono text-[10px] text-slate-500">{m.label}</span>
                </div>
                <div className="mt-1 h-0.5 rounded-full w-6" style={{ background: m.color }} />
              </div>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed flex-1">{m.note}</p>

              {/* Status */}
              <div className="flex-shrink-0 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[10px] text-slate-500">Calibrated</span>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance strip */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 px-2">
          {[
            'Strict anti-leakage compliance',
            'Cath / LAD / LCX / RCA excluded from features',
            'Zero Data Leakage · 100% Pytest verified',
          ].map(item => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-xs text-slate-500 font-mono">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
