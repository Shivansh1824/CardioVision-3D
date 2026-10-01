import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, AlertTriangle, AlertCircle, Heart, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VESSEL_DETAILS = {
  LAD: {
    name: 'Left Anterior Descending (LAD)',
    commonName: 'The Front Artery',
    job: 'Supplies blood to the front wall and main pumping chamber (left ventricle) of the heart.',
    location: 'Runs down the front groove of the heart toward the bottom tip (apex).',
    whyItMatters: 'It is the most critical artery for your heart’s pumping power.',
    color: '#e11d48',
    lightBg: 'bg-rose-50',
    borderColor: 'border-rose-200',
  },
  LCX: {
    name: 'Left Circumflex (LCX)',
    commonName: 'The Side & Back Artery',
    job: 'Supplies oxygen-rich blood to the outer side and back walls of your heart muscle.',
    location: 'Curves around the left side of the heart like a belt.',
    whyItMatters: 'Keeps the side and back muscles nourished so the heart contracts evenly.',
    color: '#0284c7',
    lightBg: 'bg-sky-50',
    borderColor: 'border-sky-200',
  },
  RCA: {
    name: 'Right Coronary Artery (RCA)',
    commonName: 'The Right & Rhythm Artery',
    job: 'Supplies blood to the right side of the heart and the natural electrical pacemaker nodes.',
    location: 'Loops down the right side and underneath the heart.',
    whyItMatters: 'Maintains healthy heart rhythm and powers the blood supply to the lungs.',
    color: '#d97706',
    lightBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
};

export default function VesselExplorer({
  vesselStates,
  setVesselStates,
  selectedArtery,
  setSelectedArtery,
}) {
  const explorerRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.vessel-intro',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: { trigger: '.vessel-intro', start: 'top 85%' },
        }
      );
      gsap.fromTo(
        '.vessel-card',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: { trigger: '.vessel-cards-grid', start: 'top 85%' },
        }
      );
    },
    { scope: explorerRef }
  );

  const toggleSeverity = (vessel) => {
    const current = vesselStates[vessel];
    const next = current === 'normal' ? 'moderate' : current === 'moderate' ? 'critical' : 'normal';
    setVesselStates((prev) => ({ ...prev, [vessel]: next }));
  };

  const getStatusBadge = (state) => {
    if (state === 'normal') {
      return {
        label: 'Clear & Open',
        icon: CheckCircle2,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        desc: 'Blood flows smoothly without obstruction.',
      };
    }
    if (state === 'moderate') {
      return {
        label: 'Mild Narrowing',
        icon: AlertTriangle,
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        desc: 'Partial plaque buildup. Lifestyle adjustments recommended.',
      };
    }
    return {
      label: 'Significant Narrowing',
      icon: AlertCircle,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      desc: 'Blood flow is notably restricted. Needs clinical attention.',
    };
  };

  const activeVessel = VESSEL_DETAILS[selectedArtery];
  const activeStatus = getStatusBadge(vesselStates[selectedArtery]);

  return (
    <section id="vessel-explorer" ref={explorerRef} className="py-20 bg-white/70 border-t border-slate-200/80 relative">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="vessel-intro max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/70 border border-rose-200 text-rose-800 text-xs font-semibold uppercase mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Coronary Artery Guide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            How the Three Main Heart Arteries Work
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
            Your heart relies on three primary blood vessels to stay alive and pumping. Select an artery below to see what it does, where it is located, and how narrowing affects your health.
          </p>
        </div>

        {/* 3 Interactive Artery Cards */}
        <div className="vessel-cards-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {Object.entries(VESSEL_DETAILS).map(([key, item]) => {
            const state = vesselStates[key];
            const badge = getStatusBadge(state);
            const isSelected = selectedArtery === key;
            const Icon = badge.icon;

            return (
              <div
                key={key}
                onClick={() => setSelectedArtery(key)}
                className={`vessel-card p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                  isSelected
                    ? 'bg-white border-rose-500 shadow-md scale-[1.01]'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {key}
                  </span>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h3>
                <p className="text-xs font-medium text-slate-500 mb-3">{item.commonName}</p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.job}</p>

                {/* Artery Flow Status Toggle */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Simulate condition:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSeverity(key);
                    }}
                    className="font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors"
                  >
                    Change Flow State
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Spotlight on Selected Artery */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                <span>Selected: {activeVessel.name}</span>
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900">
                {activeVessel.commonName} — Role &amp; Clinical Importance
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Anatomical Pathway:</strong> {activeVessel.location}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong>Why It Matters:</strong> {activeVessel.whyItMatters}
              </p>
              <div className={`p-4 rounded-xl border ${activeStatus.color} mt-2`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <activeStatus.icon className="w-4 h-4" />
                  <span>Current State: {activeStatus.label}</span>
                </div>
                <p className="text-xs mt-1 text-slate-700">{activeStatus.desc}</p>
              </div>
            </div>

            {/* Artery Lumen Cross-Section Visualizer */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Artery Cross-Section Bloodway
              </span>
              
              <div className="relative w-36 h-36 rounded-full border-4 border-slate-300 flex items-center justify-center bg-rose-900 shadow-inner">
                {/* Plaque buildup visualization */}
                {vesselStates[selectedArtery] === 'normal' && (
                  <div className="w-28 h-28 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-bold">
                    100% Open Flow
                  </div>
                )}
                {vesselStates[selectedArtery] === 'moderate' && (
                  <div className="relative w-28 h-28 rounded-full bg-amber-400 p-3 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center text-white text-[11px] font-bold text-center">
                      Narrowed
                    </div>
                  </div>
                )}
                {vesselStates[selectedArtery] === 'critical' && (
                  <div className="relative w-28 h-28 rounded-full bg-amber-500 p-6 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-[9px] font-bold text-center">
                      Blocked
                    </div>
                  </div>
                )}
              </div>

              <span className="text-xs text-slate-600 text-center mt-4">
                {vesselStates[selectedArtery] === 'normal' && 'Healthy artery wall with zero restricting plaque.'}
                {vesselStates[selectedArtery] === 'moderate' && 'Partial plaque narrowing diameter by approximately 50%.'}
                {vesselStates[selectedArtery] === 'critical' && 'Severe obstruction (>70%) restricting vital blood flow.'}
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
