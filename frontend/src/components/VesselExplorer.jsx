import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, Droplets, Cigarette, Flame } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VESSEL_DATA = {
  LAD: {
    code: 'LAD',
    name: 'Left Anterior Descending',
    role: 'The Front Pumping Artery',
    perfusion: 'Anterior left ventricular wall, septum, and apex.',
    clinicalImpact: 'Powers over 50% of the heart’s left ventricle pump. Narrowing here causes significant anterior ischemia and shortness of breath.',
    accentColor: '#e11d48',
    lightBorder: 'border-rose-300',
    lightBg: 'bg-rose-50/60',
  },
  LCX: {
    code: 'LCX',
    name: 'Left Circumflex Artery',
    role: 'The Lateral & Back Artery',
    perfusion: 'Lateral and posterolateral walls of the left ventricle.',
    clinicalImpact: 'Supplies blood to the side and rear cardiac muscle. Stenosis often produces exertional angina and lateral wall motion abnormality.',
    accentColor: '#0284c7',
    lightBorder: 'border-sky-300',
    lightBg: 'bg-sky-50/60',
  },
  RCA: {
    code: 'RCA',
    name: 'Right Coronary Artery',
    role: 'The Right & Electrical Rhythm Artery',
    perfusion: 'Right ventricle, inferior wall, and SA/AV pacemaker nodes.',
    clinicalImpact: 'Maintains healthy electrical pacing and rhythm. Severe blockage can trigger bradycardia, AV heart blocks, and inferior STEMI.',
    accentColor: '#d97706',
    lightBorder: 'border-amber-300',
    lightBg: 'bg-amber-50/60',
  },
};

const STAGES = {
  normal: {
    id: 'normal',
    label: 'Healthy (Clear & Open)',
    lumenPercent: 100,
    statusText: 'Optimal Flow (<50% Plaque)',
    color: '#059669',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    advice: 'Coronary lumen is open and unobstructed. Healthy cardiac perfusion maintained.',
  },
  moderate: {
    id: 'moderate',
    label: 'Mild Narrowing',
    lumenPercent: 50,
    statusText: 'Moderate Narrowing (50–69% Stenosis)',
    color: '#d97706',
    badge: 'bg-amber-50 text-amber-800 border-amber-300',
    advice: 'Partial atherosclerotic plaque buildup. Lifestyle adjustments, statins, and dietary changes recommended.',
  },
  critical: {
    id: 'critical',
    label: 'Critical Blockage',
    lumenPercent: 25,
    statusText: 'Severe Obstruction (≥70% Stenosis)',
    color: '#e11d48',
    badge: 'bg-rose-50 text-rose-800 border-rose-300',
    advice: 'Severe lumen narrowing critically restricting blood flow. Urgent cardiology evaluation and revascularization review required.',
  },
};

export default function VesselExplorer({
  vesselStates,
  setVesselStates,
  selectedArtery = 'LAD',
  setSelectedArtery = () => {},
}) {
  const containerRef = useRef(null);

  // Interactive Clinical Risk Factors
  const [systolicBP, setSystolicBP] = useState(130);
  const [bloodSugarA1c, setBloodSugarA1c] = useState(6.2);
  const [isSmoker, setIsSmoker] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        '.vessel-module',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: '.vessel-module', start: 'top 85%' } }
      );
    },
    { scope: containerRef }
  );

  const activeVessel = VESSEL_DATA[selectedArtery] || VESSEL_DATA.LAD;
  const currentStageKey = vesselStates[selectedArtery] || 'normal';
  const currentStage = STAGES[currentStageKey] || STAGES.normal;

  const handleStageSelect = (stageKey) => {
    setVesselStates((prev) => ({
      ...prev,
      [selectedArtery]: stageKey,
    }));
  };

  // Calculate composite clinical risk score based on sliders
  const calculatedRiskScore = Math.min(
    96,
    Math.max(
      12,
      Math.round(
        (currentStageKey === 'critical' ? 55 : currentStageKey === 'moderate' ? 30 : 10) +
          ((systolicBP - 110) / 50) * 20 +
          ((bloodSugarA1c - 5.0) / 4.0) * 15 +
          (isSmoker ? 14 : 0)
      )
    )
  );

  return (
    <section id="vessel-explorer" ref={containerRef} className="py-20 bg-slate-50/70 border-t border-slate-200 relative">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          {/* Style A: Editorial Monospace Overline */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span className="font-mono text-xs font-bold tracking-widest text-rose-600 uppercase">
              Interactive Coronary Anatomy
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            How the Three Main Heart Arteries Work
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Select an artery below to inspect its anatomical role, simulate narrowing stages, and see how blood pressure, blood sugar, and smoking directly impact arterial blood flow.
          </p>
        </div>

        {/* Unified, Connected Module: Tabbed Header + Inspection Pane */}
        <div className="vessel-module rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Top Integrated Artery Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/80">
            {Object.values(VESSEL_DATA).map((vessel) => {
              const isSelected = selectedArtery === vessel.code;
              const vStateKey = vesselStates[vessel.code] || 'normal';
              const vStage = STAGES[vStateKey];

              return (
                <button
                  key={vessel.code}
                  onClick={() => setSelectedArtery(vessel.code)}
                  className={`p-4 sm:p-5 text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-white border-b-2 border-rose-600 shadow-2xs'
                      : 'hover:bg-slate-100/70 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {vessel.code}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: vStage.color }}
                      title={vStage.label}
                    />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                    {vessel.name}
                  </h3>
                  <p className="text-xs text-slate-500 hidden sm:block truncate mt-0.5">
                    {vessel.role}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Unified Body: Detailed Inspection + Artery Lumen & Risk Factor Simulation */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Vessel Anatomy & 3 Explicit Flow Stages */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-display font-bold text-xl text-slate-900">
                      {activeVessel.name} ({activeVessel.code})
                    </span>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {activeVessel.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong>Blood Supply Territory:</strong> {activeVessel.perfusion}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    <strong>Clinical Significance:</strong> {activeVessel.clinicalImpact}
                  </p>
                </div>

                {/* 3 Explicit Flow State Selector Pills */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Flow State for {activeVessel.code}:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {Object.values(STAGES).map((stg) => {
                      const isCurrent = currentStageKey === stg.id;
                      return (
                        <button
                          key={stg.id}
                          onClick={() => handleStageSelect(stg.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-white border-slate-800 shadow-xs ring-1 ring-slate-800'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 mb-1">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: stg.color }}
                            />
                            <span>{stg.label}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 block leading-tight">
                            {stg.id === 'normal' && '100% open flow'}
                            {stg.id === 'moderate' && '50% plaque layer'}
                            {stg.id === 'critical' && '≥70% blockage'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Current Flow Condition Callout */}
                <div className={`p-4 rounded-2xl border ${currentStage.badge}`}>
                  <div className="font-bold text-xs flex items-center justify-between mb-1">
                    <span>Active Status: {currentStage.statusText}</span>
                    <span className="text-[11px] font-mono">{currentStage.lumenPercent}% Open Lumen</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentStage.advice}
                  </p>
                </div>

                {/* Clinical Biomarker & Lifestyle Risk Factor Controls */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Interactive Risk Drivers (Smoking, Sugar &amp; Blood Pressure):
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Systolic BP Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Systolic Blood Pressure</span>
                        <span className="font-mono font-bold text-slate-900">{systolicBP} mmHg</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="180"
                        step="2"
                        value={systolicBP}
                        onChange={(e) => setSystolicBP(Number(e.target.value))}
                        className="custom-slider w-full"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {systolicBP < 120 ? 'Optimal' : systolicBP < 140 ? 'Pre-Hypertension' : 'Hypertension (Endothelial Strain)'}
                      </span>
                    </div>

                    {/* Blood Sugar (HbA1c) Slider */}
                    <div>
                      <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                        <span>Blood Sugar (HbA1c)</span>
                        <span className="font-mono font-bold text-slate-900">{bloodSugarA1c}%</span>
                      </div>
                      <input
                        type="range"
                        min="4.8"
                        max="10.0"
                        step="0.1"
                        value={bloodSugarA1c}
                        onChange={(e) => setBloodSugarA1c(Number(e.target.value))}
                        className="custom-slider w-full"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {bloodSugarA1c < 5.7 ? 'Normal' : bloodSugarA1c < 6.5 ? 'Pre-Diabetes' : 'Elevated Plaque Deposition'}
                      </span>
                    </div>
                  </div>

                  {/* Smoking Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Cigarette className="w-4 h-4 text-slate-600" />
                      <span className="font-medium text-slate-800">Cigarette Smoking History:</span>
                    </div>
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
                      <button
                        onClick={() => setIsSmoker(false)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                          !isSmoker ? 'bg-slate-900 text-white' : 'text-slate-600'
                        }`}
                      >
                        Non-Smoker
                      </button>
                      <button
                        onClick={() => setIsSmoker(true)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                          isSmoker ? 'bg-rose-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        Active Smoker
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Artery Lumen Cross-Section Visualizer */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-5">
                  {activeVessel.code} Artery Cross-Section
                </span>

                {/* Artery Lumen SVG Diagram */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-md">
                    {/* Outer Muscular Artery Wall (Adventitia / Media) */}
                    <circle cx="80" cy="80" r="74" fill="#be123c" stroke="#881337" strokeWidth="4" />
                    <circle cx="80" cy="80" r="64" fill="#9f1239" />

                    {/* Endothelium / Plaque layer */}
                    {currentStageKey === 'normal' && (
                      /* Clear open lumen */
                      <circle cx="80" cy="80" r="56" fill="#e11d48" />
                    )}

                    {currentStageKey === 'moderate' && (
                      /* Crescent Atherosclerotic Plaque (Yellow Lipid Core) */
                      <>
                        <circle cx="80" cy="80" r="56" fill="#f59e0b" />
                        <circle cx="92" cy="80" r="38" fill="#e11d48" />
                      </>
                    )}

                    {currentStageKey === 'critical' && (
                      /* Heavy calcified plaque narrowing lumen to pinhole */
                      <>
                        <circle cx="80" cy="80" r="56" fill="#d97706" />
                        <path
                          d="M80 26 C120 30 134 80 120 120 C100 134 60 134 40 110 C26 70 40 30 80 26 Z"
                          fill="#b45309"
                        />
                        <circle cx="88" cy="82" r="18" fill="#be123c" />
                      </>
                    )}

                    {/* Flowing Red Blood Cells */}
                    <circle cx="88" cy="82" r="4" fill="#ffffff" opacity="0.9" />
                    {currentStageKey !== 'critical' && (
                      <>
                        <circle cx="75" cy="74" r="3.5" fill="#ffffff" opacity="0.8" />
                        <circle cx="94" cy="92" r="3.5" fill="#ffffff" opacity="0.8" />
                      </>
                    )}
                  </svg>
                </div>

                {/* Lumen Statistics */}
                <div className="mt-5 w-full space-y-2">
                  <div className="flex items-center justify-between text-xs px-2 text-slate-600">
                    <span>Patent Bloodway Diameter:</span>
                    <strong className="text-slate-900 font-mono">
                      {currentStageKey === 'normal' ? '3.8 mm (100%)' : currentStageKey === 'moderate' ? '2.1 mm (50%)' : '0.9 mm (22%)'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-xs px-2 text-slate-600">
                    <span>Estimated CAD Risk Score:</span>
                    <strong className={`font-mono font-bold ${calculatedRiskScore > 65 ? 'text-rose-600' : calculatedRiskScore > 35 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {calculatedRiskScore}% Probability
                    </strong>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                    {isSmoker
                      ? '⚠️ Smoking causes oxidative stress and accelerates plaque adherence to arterial walls.'
                      : systolicBP > 140
                      ? 'Elevated blood pressure damages delicate endothelial cell junctions.'
                      : 'Healthy vascular tone with normal laminar blood velocity.'}
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
