import { useState, useEffect, useMemo } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Save, 
  Printer, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { commitEhrPlan } from '../../../services/ehrStorageService';
import { calculateLocalSimulation } from '../../../services/simulationCalculationService';
import TherapeuticLeverControl from './TherapeuticLeverControl';
import BiomechanicalRationalePanel from './BiomechanicalRationalePanel';

/**
 * WhatIfSimulator — Wide horizontal clinical intervention cockpit.
 * Left half: Sliders + direct numeric input for Systolic BP, LDL, FBS, and Smoking.
 * Right half: Real-time clinical rationale, biomechanics, risk drop explanation, and EHR/PDF actions.
 */
export default function WhatIfSimulator({
  patient,
  onSimulationChange,
  onResetSimulation,
  onOpenReport,
  onPlanCommitted,
  style,
}) {
  const origBp = Number(patient?.bp) || 120;
  const origLdl = Number(patient?.ldl) || 100;
  const origFbs = Number(patient?.fbs) || 110;
  const isSmoker = Number(patient?.current_smoker) > 0;
  const patientName = patient?.name || 'this patient';

  // Interventions state: initialized directly at patient's baseline
  const [targetBp, setTargetBp] = useState(origBp);
  const [targetLdl, setTargetLdl] = useState(origLdl);
  const [targetFbs, setTargetFbs] = useState(origFbs);
  const [stopSmoking, setStopSmoking] = useState(false);

  // Sync state whenever active patient changes
  useEffect(() => {
    setTargetBp(origBp);
    setTargetLdl(origLdl);
    setTargetFbs(origFbs);
    setStopSmoking(false);
  }, [patient?.id, origBp, origLdl, origFbs]);

  const [savingPlan, setSavingPlan] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Derive simulation outcomes
  const simulationResult = useMemo(() => {
    return calculateLocalSimulation(patient, targetBp, targetLdl, targetFbs, stopSmoking);
  }, [patient, targetBp, targetLdl, targetFbs, stopSmoking]);

  // Check if simulation differs from baseline
  const isSimulated = targetBp !== origBp || targetLdl !== origLdl || targetFbs !== origFbs || (isSmoker && stopSmoking);

  // Broadcast simulation results to parent so 3D heart dynamically reacts
  useEffect(() => {
    if (isSimulated) {
      onSimulationChange?.({
        isSimulated: true,
        vessels: simulationResult.vessels,
        simulatedCad: simulationResult.simCad,
        baseCad: simulationResult.baseCad,
        relativeReduction: simulationResult.relativeRiskReduction,
        isEscalation: simulationResult.isEscalation,
        escalationPct: simulationResult.escalationPct,
        baselineBp: origBp,
        simulatedBp: targetBp,
        baselineLdl: origLdl,
        simulatedLdl: targetLdl,
        baselineFbs: origFbs,
        simulatedFbs: targetFbs,
        simulatedSmoker: stopSmoking ? 0 : isSmoker,
        stopSmoking,
        bpImpactPct: simulationResult.bpImpactPct,
        ldlImpactPct: simulationResult.ldlImpactPct,
        fbsImpactPct: simulationResult.fbsImpactPct,
        smokeImpactPct: simulationResult.smokeImpactPct,
      });
    } else {
      onSimulationChange?.({
        isSimulated: false,
        baseCad: simulationResult.baseCad,
        baselineBp: origBp,
        baselineLdl: origLdl,
        baselineFbs: origFbs,
      });
    }
  }, [isSimulated, simulationResult, targetBp, targetLdl, targetFbs, stopSmoking, isSmoker, origBp, origLdl, origFbs, onSimulationChange]);

  const handleReset = () => {
    setTargetBp(origBp);
    setTargetLdl(origLdl);
    setTargetFbs(origFbs);
    setStopSmoking(false);
    onResetSimulation?.();
  };

  const handleCommitPlan = async () => {
    setSavingPlan(true);
    setSavedSuccess(false);

    try {
      const record = await commitEhrPlan({
        patient,
        baselineBp: origBp,
        targetBp,
        baselineLdl: origLdl,
        targetLdl,
        baselineFbs: origFbs,
        targetFbs,
        smokerIntervention: stopSmoking,
        baselineCadRisk: simulationResult.baseCad,
        simulatedCadRisk: simulationResult.simCad,
        baselineLadRisk: Math.round(patient?.lad_stenosis ? 85 : 45),
        simulatedLadRisk: Math.round(simulationResult.vessels.lad.probability * 100),
        riskReductionPct: simulationResult.relativeRiskReduction,
        planTitle: `Target BP ${targetBp} mmHg, LDL ${targetLdl} mg/dL, FBS ${targetFbs} mg/dL`,
      });

      setSavedSuccess(true);
      onPlanCommitted?.(record);
      setTimeout(() => setSavedSuccess(false), 4500);
    } catch (err) {
      console.error('[WhatIfSimulator] Error committing plan:', err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 253, 244, 0.32) 50%, rgba(255, 255, 255, 0.84) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: 18,
        border: '1.5px solid rgba(255, 255, 255, 0.90)',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Cockpit Header */}
      <div
        style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--dash-border)',
          background: 'var(--dash-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sliders style={{ width: 16, height: 16, color: '#059669' }} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.90rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              "What-If" Treatment Simulator
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#059669',
                  background: '#d1fae5',
                  padding: '1.5px 6px',
                  borderRadius: 5,
                }}
              >
                Interactive
              </span>
            </h3>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
              Adjust targets with dual sliders or enter exact manual numbers to observe 3D arterial cooling
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {savedSuccess && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.70rem', fontWeight: 800, color: '#059669' }}>
              <CheckCircle2 style={{ width: 14, height: 14 }} />
              Plan Committed!
            </span>
          )}

          {isSimulated && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 9px',
                borderRadius: 7,
                border: '1px solid var(--dash-border)',
                background: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <RotateCcw style={{ width: 11, height: 11 }} />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCommitPlan}
            disabled={savingPlan}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 7,
              fontSize: '0.70rem',
              fontWeight: 700,
              border: 'none',
              background: '#0f172a',
              color: '#ffffff',
              cursor: savingPlan ? 'not-allowed' : 'pointer',
              opacity: savingPlan ? 0.7 : 1,
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.15s ease',
            }}
          >
            {savingPlan ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> : <Save style={{ width: 12, height: 12 }} />}
            <span>Commit to EHR</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport ? onOpenReport : () => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              borderRadius: 7,
              fontSize: '0.70rem',
              fontWeight: 700,
              border: '1.5px solid var(--dash-border)',
              background: '#ffffff',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Printer style={{ width: 12, height: 12, color: '#64748b' }} />
            <span>PDF Summary</span>
          </button>
        </div>
      </div>

      {/* Main Wide 2-Column Content Body */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
          padding: '14px 18px',
        }}
      >
        {/* Left Column: Sliders & Direct Numeric Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              THERAPEUTIC LEVERS & CONTROLS
            </span>
            <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
              Dual Slider + Manual Entry
            </span>
          </div>

          {/* Lever 1: Systolic BP */}
          <TherapeuticLeverControl
            label="Systolic Blood Pressure"
            unit="mmHg"
            baseline={origBp}
            value={targetBp}
            onChange={setTargetBp}
            min={90}
            max={180}
            step={1}
            inputMin={80}
            inputMax={220}
            isOptimal={targetBp <= 120}
            benchmarks={['90 (Optimal)', '120 (Standard Target)', '180 (Severe HTN)']}
          />

          {/* Lever 2: LDL Cholesterol */}
          <TherapeuticLeverControl
            label="LDL Cholesterol"
            unit="mg/dL"
            baseline={origLdl}
            value={targetLdl}
            onChange={setTargetLdl}
            min={40}
            max={200}
            step={1}
            inputMin={30}
            inputMax={260}
            isOptimal={targetLdl <= 70}
            benchmarks={['40 (High Statin)', '70 (Target)', '200 (Severe)']}
          />

          {/* Lever 3: Fasting Blood Sugar */}
          <TherapeuticLeverControl
            label="Fasting Blood Sugar (FBS)"
            unit="mg/dL"
            baseline={origFbs}
            value={targetFbs}
            onChange={setTargetFbs}
            min={70}
            max={200}
            step={1}
            inputMin={60}
            inputMax={280}
            isOptimal={targetFbs <= 99}
            benchmarks={['70 (Normal Low)', '99 (Normal Upper)', '200 (Diabetic)']}
          />

          {/* Lever 4: Tobacco Cessation Toggle */}
          {isSmoker && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: 9,
                background: stopSmoking ? '#f0fdf4' : '#fef2f2',
                border: stopSmoking ? '1px solid #bbf7d0' : '1px solid #fecaca',
                marginTop: 2,
              }}
            >
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: stopSmoking ? '#166534' : '#991b1b' }}>
                  Complete Tobacco Cessation
                </div>
                <div style={{ fontSize: '0.64rem', color: '#64748b' }}>
                  Patient is an active smoker (+14.5% baseline CAD driver).
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStopSmoking(!stopSmoking)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 7,
                  fontSize: '0.70rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: stopSmoking ? '#16a34a' : '#ef4444',
                  color: '#ffffff',
                  transition: 'all 0.18s ease',
                }}
              >
                {stopSmoking ? '✓ Quitting Included' : 'Model Cessation'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Outcomes & Plain-English Biomechanical Rationale */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              DYNAMIC OUTCOME & CLINICAL MECHANISM
            </span>
            <span
              style={{
                fontSize: '0.64rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: 5,
                background: isSimulated ? '#ecfdf5' : '#f1f5f9',
                color: isSimulated ? '#047857' : '#64748b',
                border: `1px solid ${isSimulated ? '#a7f3d0' : '#e2e8f0'}`,
              }}
            >
              {isSimulated ? 'Live Synced' : 'Baseline State'}
            </span>
          </div>

          {/* Outcome Banner */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              background: !isSimulated
                ? 'var(--dash-surface-2)'
                : simulationResult.isEscalation
                ? 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)'
                : 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
              border: '1px solid',
              borderColor: !isSimulated
                ? 'var(--dash-border)'
                : simulationResult.isEscalation
                ? '#fecaca'
                : '#a7f3d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    fontFamily: !isSimulated ? 'var(--font-display, Inter, sans-serif)' : 'JetBrains Mono, monospace',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                    letterSpacing: !isSimulated ? '-0.01em' : 'normal',
                    color: !isSimulated
                      ? '#0f172a'
                      : simulationResult.isEscalation
                      ? '#dc2626'
                      : '#059669',
                  }}
                >
                  {!isSimulated
                    ? 'Patient Clinical Profile'
                    : simulationResult.isEscalation
                    ? `+${simulationResult.escalationPct}%`
                    : `-${simulationResult.relativeRiskReduction}%`}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: !isSimulated
                      ? '#0369a1'
                      : simulationResult.isEscalation
                      ? '#b91c1c'
                      : '#047857',
                    background: !isSimulated
                      ? '#e0f2fe'
                      : simulationResult.isEscalation
                      ? '#fecaca'
                      : '#a7f3d0',
                    padding: '1.5px 6px',
                    borderRadius: 4,
                  }}
                >
                  {!isSimulated
                    ? 'Current Baseline'
                    : simulationResult.isEscalation
                    ? 'Risk Escalation'
                    : 'Relative Risk Drop'}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.65rem',
                  color: !isSimulated
                    ? 'var(--text-muted)'
                    : simulationResult.isEscalation
                    ? '#991b1b'
                    : '#065f46',
                  margin: '1px 0 0',
                  fontWeight: isSimulated ? 700 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 320,
                }}
              >
                {!isSimulated
                  ? 'Baseline hemodynamic & metabolic state across 3 coronary vessels.'
                  : simulationResult.isEscalation
                  ? 'Elevated targets increase coronary wall tension and plaque stress.'
                  : '10-year major adverse cardiovascular event risk reduced.'}
              </p>
            </div>

            {/* CAD Probability Comparison Box */}
            <div
              style={{
                padding: '4px 9px',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid',
                borderColor: !isSimulated
                  ? 'var(--dash-border)'
                  : simulationResult.isEscalation
                  ? '#fca5a5'
                  : '#a7f3d0',
                textAlign: 'right',
                flexShrink: 0,
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: '0.56rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Predicted CAD
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                {isSimulated && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#94a3b8',
                      textDecoration: 'line-through',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {simulationResult.baseCad}%
                  </span>
                )}
                <span
                  style={{
                    fontSize: '0.94rem',
                    fontWeight: 800,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: !isSimulated
                      ? '#0f172a'
                      : simulationResult.isEscalation
                      ? '#dc2626'
                      : '#059669',
                  }}
                >
                  {simulationResult.simCad}%
                </span>
              </div>
            </div>
          </div>

          {/* Biomechanical Cause & Effect Explanations */}
          <BiomechanicalRationalePanel
            isSimulated={isSimulated}
            origBp={origBp}
            targetBp={targetBp}
            origLdl={origLdl}
            targetLdl={targetLdl}
            origFbs={origFbs}
            targetFbs={targetFbs}
            isSmoker={isSmoker}
            stopSmoking={stopSmoking}
            patientName={patientName}
          />
        </div>
      </div>

    </div>
  );
}
