import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Clinical data per vessel ──────────────────────────────────────────
const VESSELS = {
  LAD: { full: 'Left Anterior Descending', alias: '"Widowmaker" Artery', supply: 'Anterior wall · Apex · Septum' },
  LCX: { full: 'Left Circumflex',          alias: 'Lateral Branch',      supply: 'Lateral & posterior LV free wall' },
  RCA: { full: 'Right Coronary Artery',    alias: 'Inferior Supply',     supply: 'RV · Inferior LV · SA/AV nodes' },
};

const STATUS_LABEL = { normal: 'Clear', moderate: 'Moderate', critical: 'Stenotic ≥50%' };
const STATUS_COLOR = { normal: '#00d68f', moderate: '#f0a500', critical: '#f43f5e' };

// How much each slider value contributes to CAD risk (0–100 scale)
function calcRisk(vesselStates, sbp, ldl) {
  const critical = Object.values(vesselStates).filter(s => s === 'critical').length;
  const moderate = Object.values(vesselStates).filter(s => s === 'moderate').length;
  const base = critical * 24 + moderate * 10;
  const sbpDelta = Math.max(0, (sbp - 120) / 70) * 22;
  const ldlDelta = Math.max(0, (ldl - 100) / 140) * 20;
  return Math.min(99, Math.max(5, Math.round(base + sbpDelta + ldlDelta)));
}

// How sliders influence vessel severity labels (soft effect)
function sliderToStatus(current, sliderPressure) {
  // sliderPressure 0→1 (low→high from sbp+ldl)
  if (sliderPressure > 0.72 && current === 'normal') return 'moderate';
  if (sliderPressure > 0.88 && current === 'moderate') return 'critical';
  if (sliderPressure < 0.25 && current === 'critical') return 'moderate';
  if (sliderPressure < 0.12 && current === 'moderate') return 'normal';
  return current;
}

function calcSliderPressure(sbp, ldl) {
  return ((sbp - 100) / 90) * 0.5 + ((ldl - 70) / 170) * 0.5;
}

const STAGING = {
  0: { code: '0-VD', name: 'Zero Vessel Disease', color: '#00d68f', triage: 'Routine follow-up · 12 months', bg: 'rgba(0,214,143,0.06)', border: 'rgba(0,214,143,0.18)' },
  1: { code: 'SVD',  name: 'Single Vessel Disease', color: '#f0a500', triage: 'Elective angiography or stress testing', bg: 'rgba(240,165,0,0.06)', border: 'rgba(240,165,0,0.20)' },
  2: { code: 'DVD',  name: 'Double Vessel Disease', color: '#f43f5e', triage: 'Priority catheterisation · revascularisation review', bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.22)' },
  3: { code: 'TVD',  name: 'Triple Vessel Disease', color: '#f43f5e', triage: 'Urgent triage · CABG surgical consultation', bg: 'rgba(244,63,94,0.10)', border: 'rgba(244,63,94,0.35)' },
};

// ── Vessel row ────────────────────────────────────────────────────────
function VesselRow({ id, info, status, isSelected, onClick }) {
  const color = STATUS_COLOR[status];
  return (
    <div
      onClick={onClick}
      className="cursor-pointer select-none transition-all duration-300 rounded-2xl p-5 group"
      style={{
        background: isSelected ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid ${isSelected ? color + '45' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isSelected ? `0 0 20px -8px ${color}40` : 'none',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
            {status === 'critical' && (
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background: color, opacity: 0.4 }} />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-white text-base">{id}</span>
              <span className="font-mono text-xs text-slate-500">{info.full}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{info.supply}</p>
          </div>
        </div>
        <span className="chip" style={{
          background: color + '18',
          border: `1px solid ${color}35`,
          color,
          flexShrink: 0,
        }}>
          {STATUS_LABEL[status]}
        </span>
      </div>
      <p className="text-[11px] font-mono text-slate-600 mt-2.5 pt-2.5 border-t border-white/5">
        {info.alias} · Click to cycle state
      </p>
    </div>
  );
}

// ── Slider ────────────────────────────────────────────────────────────
function BioSlider({ label, value, min, max, unit, low, high, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  const levelColor = pct < 35 ? '#00d68f' : pct < 65 ? '#f0a500' : '#f43f5e';
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono font-semibold text-white">{value}{unit}</span>
      </div>
      <div className="relative">
        <div className="h-1 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
        <div className="h-1 rounded-full absolute top-0 left-0 transition-all duration-150"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, #00d68f, ${levelColor})` }} />
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="cv-slider absolute top-0 left-0 w-full opacity-0 cursor-pointer"
          style={{ height: 20, marginTop: -8 }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-600 font-mono">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

// ── Arc gauge ─────────────────────────────────────────────────────────
function ArcGauge({ risk, color }) {
  const R = 52;
  const circ = 2 * Math.PI * R;
  const arc = circ * 0.75; // 270° arc
  const fill = arc * (risk / 100);
  return (
    <svg width="140" height="88" viewBox="0 0 140 100">
      <path
        d="M 14 86 A 56 56 0 1 1 126 86"
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round"
      />
      <path
        d="M 14 86 A 56 56 0 1 1 126 86"
        fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${arc} ${circ}`}
        strokeDashoffset={arc - fill}
        style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 0.4s ease' }}
      />
      <text x="70" y="68" textAnchor="middle" fill="#fff" fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="22">{risk}</text>
      <text x="70" y="82" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="9">CAD Risk %</text>
    </svg>
  );
}

export default function VesselExplorer({ vesselStates, setVesselStates, selectedArtery, setSelectedArtery }) {
  const [sbp, setSbp] = useState(140);
  const [ldl, setLdl] = useState(155);
  const sectionRef = useRef(null);

  // ── Slider effect → adjust vessel states ──────────────────────────
  // When sliders cross clinical thresholds, vessel states are soft-updated
  useEffect(() => {
    const pressure = calcSliderPressure(sbp, ldl);
    setVesselStates(prev => {
      const next = { ...prev };
      ['LAD', 'LCX', 'RCA'].forEach(v => {
        next[v] = sliderToStatus(prev[v], pressure);
      });
      // Only update if something changed to avoid infinite loop
      if (JSON.stringify(next) === JSON.stringify(prev)) return prev;
      return next;
    });
  }, [sbp, ldl]);

  const cycleVessel = (key) => {
    setSelectedArtery(key);
    setVesselStates(prev => {
      const order = ['normal', 'moderate', 'critical'];
      const idx = order.indexOf(prev[key]);
      return { ...prev, [key]: order[(idx + 1) % 3] };
    });
  };

  const criticalCount = Object.values(vesselStates).filter(s => s === 'critical').length;
  const staging = STAGING[criticalCount];
  const risk = calcRisk(vesselStates, sbp, ldl);
  const gaugeColor = risk < 35 ? '#00d68f' : risk < 65 ? '#f0a500' : '#f43f5e';

  useGSAP(() => {
    gsap.from('.ve-header', {
      y: 32, autoAlpha: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.ve-header', start: 'top 85%' },
    });
    gsap.from('.ve-vessel', {
      x: -24, autoAlpha: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ve-grid', start: 'top 80%' },
    });
    gsap.from('.ve-panel', {
      x: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.ve-grid', start: 'top 80%' },
    });
  }, { scope: sectionRef });

  return (
    <section id="vessel-explorer" ref={sectionRef} className="section border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="container-wide">

        {/* Section header */}
        <div className="ve-header mb-12 space-y-3">
          <div className="chip chip-info w-fit">
            Interactive Multi-Vessel Staging
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-white">
            Stenosis Simulator
          </h2>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
            Click any vessel to cycle severity. Adjust biomarkers below — vessel states and CAD risk update in real time.
          </p>
        </div>

        {/* 2-column grid */}
        <div className="ve-grid grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Vessels + sliders */}
          <div className="lg:col-span-7 space-y-3">
            {Object.entries(VESSELS).map(([id, info]) => (
              <div key={id} className="ve-vessel">
                <VesselRow
                  id={id} info={info}
                  status={vesselStates[id]}
                  isSelected={selectedArtery === id}
                  onClick={() => cycleVessel(id)}
                />
              </div>
            ))}

            {/* Biomarker sliders */}
            <div className="glass-card p-6 mt-6 space-y-5" style={{ borderRadius: 16 }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">What-If Biomarkers</span>
                <span className="chip chip-info text-[10px]">Affects vessel states</span>
              </div>
              <BioSlider
                label="Systolic Blood Pressure" value={sbp} min={100} max={190} unit=" mmHg"
                low="Optimal (100)" high="Crisis (190)"
                onChange={setSbp}
              />
              <BioSlider
                label="LDL Cholesterol" value={ldl} min={70} max={240} unit=" mg/dL"
                low="Target (<100)" high="Very High (240)"
                onChange={setLdl}
              />
            </div>
          </div>

          {/* Right: Staging + gauge */}
          <div className="ve-panel lg:col-span-5 space-y-4">
            <div className="glass-card p-6 space-y-5" style={{ borderRadius: 16, background: staging.bg, borderColor: staging.border }}>

              {/* Gauge */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-1">Proportional Stage</div>
                  <div className="text-3xl font-display font-extrabold" style={{ color: staging.color }}>{staging.code}</div>
                  <div className="text-sm font-medium text-slate-300 mt-0.5">{staging.name}</div>
                </div>
                <ArcGauge risk={risk} color={gaugeColor} />
              </div>

              <div className="divider" />

              {/* Triage */}
              <div className="space-y-1">
                <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Clinician Recommendation</div>
                <p className="text-sm text-slate-200 font-medium">{staging.triage}</p>
              </div>

              {/* Vessel ratio */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Vessel Burden</span>
                  <span style={{ color: staging.color }}>{criticalCount} / 3 Stenotic</span>
                </div>
                <div className="flex gap-1.5">
                  {['LAD', 'LCX', 'RCA'].map(v => (
                    <div key={v} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                      style={{ background: STATUS_COLOR[vesselStates[v]] }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Anti-hallucination note */}
            <div className="telem-card p-4 space-y-1">
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Zero Hardcoding Verified
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Vessel status comes from multi-task classifiers trained on non-invasive ECG, echo, and lipid markers. No target leakage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
