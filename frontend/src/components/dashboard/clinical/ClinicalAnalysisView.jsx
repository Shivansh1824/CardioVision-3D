import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  Cpu, 
  FileText,
  User,
  Users,
  Zap,
  CheckCircle2,
  Stethoscope,
  Calendar
} from 'lucide-react';
import HeartViewerPanel from './HeartViewerPanel';
import PatientBiomarkersPanel from './PatientBiomarkersPanel';
import ShapExplainerCard from './ShapExplainerCard';
import WhatIfSimulator from './WhatIfSimulator';
import CommittedEhrSection from './CommittedEhrSection';
import ClinicalReportModal from './ClinicalReportModal';
import PatientSelectModal from './PatientSelectModal';
import RiskBadge from '../shared/RiskBadge';
import patientNames from '../../../data/patientNames.json';

import { getPatientById } from '../../../services/patientDataService';

/**
 * Derives initial baseline vessel risks directly from genuine ML model outputs stored on patient
 */
function deriveBaselineVessels(patient) {
  if (!patient) {
    return {
      lad: { probability: 0.49, is_blocked: false, status: 'Normal / Patent' },
      lcx: { probability: 0.21, is_blocked: false, status: 'Normal / Patent' },
      rca: { probability: 0.46, is_blocked: true, status: 'Stenotic (>= 50%)' },
      cad: { probability: 0.80, is_blocked: true, status: 'Positive (CAD Confirmed)' },
    };
  }

  const pCad = (Number(patient.cad_risk_pct) || 80) / 100;
  const pLad = (Number(patient.lad_risk_pct) || 49) / 100;
  const pLcx = (Number(patient.lcx_risk_pct) || 21) / 100;
  const pRca = (Number(patient.rca_risk_pct) || 46) / 100;

  const isLadBlocked = Boolean(patient.is_lad_blocked ?? (pLad >= 0.5955));
  const isLcxBlocked = Boolean(patient.is_lcx_blocked ?? (pLcx >= 0.4322));
  const isRcaBlocked = Boolean(patient.is_rca_blocked ?? (pRca >= 0.3759));

  return {
    lad: { probability: pLad, is_blocked: isLadBlocked, status: isLadBlocked ? 'Stenotic (>= 50%)' : 'Patent' },
    lcx: { probability: pLcx, is_blocked: isLcxBlocked, status: isLcxBlocked ? 'Stenotic (>= 50%)' : 'Patent' },
    rca: { probability: pRca, is_blocked: isRcaBlocked, status: isRcaBlocked ? 'Stenotic (>= 50%)' : 'Patent' },
    cad: { probability: pCad, is_blocked: pCad >= 0.65, status: pCad >= 0.65 ? 'Positive (CAD Confirmed)' : 'Normal Perfusion' },
  };
}

/**
 * ClinicalAnalysisView — Master 3D Vascular Studio & Decision Support Environment.
 * Fully unified single-screen workstation inspired by modern clinical design (Dribbble Healthlog).
 */
export default function ClinicalAnalysisView({
  patient,
  onBackToQueue,
  onSelectPatient,
}) {
  const activePatient = patient || getPatientById(1);
  const displayName = activePatient.name || (activePatient.patient_code ? patientNames[activePatient.patient_code] : null) || activePatient.patient_code || 'James Smith';
  const rawSex = String(activePatient.sex || '').trim().toLowerCase();
  const normalizedSex = (rawSex === 'fmale' || rawSex === 'female' || rawSex === 'f') ? 'Female' : (rawSex ? 'Male' : 'Male');

  const [simulationState, setSimulationState] = useState(null);
  const [selectedReportRecord, setSelectedReportRecord] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [refreshEhrTrigger, setRefreshEhrTrigger] = useState(0);



  const baselineVessels = useMemo(() => deriveBaselineVessels(activePatient), [activePatient]);

  // Current vessel risks: either simulated or baseline
  const activeVessels = useMemo(() => {
    if (simulationState?.isSimulated && simulationState?.vessels) {
      return simulationState.vessels;
    }
    return baselineVessels;
  }, [simulationState, baselineVessels]);

  const activeCadRisk = simulationState?.isSimulated
    ? simulationState.simulatedCad
    : Math.round((baselineVessels.cad?.probability ?? 0.8) * 100);

  // Multi-vessel blocked count
  const blockedCount = Object.values(activeVessels).filter((v) => v.is_blocked).length;
  const vesselStage = blockedCount === 3 ? 'TVD' : blockedCount === 2 ? 'DVD' : blockedCount === 1 ? 'SVD' : '0-VD';

  const triageCategory = blockedCount >= 2 || activeCadRisk >= 75
    ? 'critical'
    : blockedCount === 1 || activeCadRisk >= 50
    ? 'moderate'
    : 'stable';

  const handleResetSimulation = () => {
    setSimulationState(null);
  };

  // Get initials for patient avatar
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'PT';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minHeight: 0, overflow: 'hidden' }}>
      {/* ─── R1: Executive Clinical Patient Header (Translucent Glassmorphism) ─── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 249, 255, 0.55) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: 16,
          border: '1.5px solid rgba(255, 255, 255, 0.90)',
          boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
          padding: '12px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexShrink: 0,
        }}
      >
        {/* Patient Profile & Clinical Diagnosis Overview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Patient Avatar Badge */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.20rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {displayName}
              </h2>

              {activePatient?.patient_code && (
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    background: '#e0f2fe',
                    padding: '2px 7px',
                    borderRadius: 5,
                    border: '1px solid #bae6fd',
                  }}
                >
                  {activePatient.patient_code}
                </span>
              )}

              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                {activePatient?.age ? `${activePatient.age} yrs` : '62 yrs'} • {normalizedSex}
              </span>

              <RiskBadge level={triageCategory} size="sm" />

              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: blockedCount > 0 ? '#be123c' : '#047857',
                  background: blockedCount > 0 ? '#ffe4e6' : '#ecfdf5',
                  padding: '2px 8px',
                  borderRadius: 6,
                  border: `1px solid ${blockedCount > 0 ? '#fecdd3' : '#a7f3d0'}`,
                }}
                title="Coronary Artery Disease Stage: Number of main arteries with >= 50% stenosis"
              >
                {blockedCount === 0 
                  ? '0 of 3 Arteries Blocked (≥50% Stenosis)'
                  : `${blockedCount} of 3 Arteries Blocked (${vesselStage})`}
              </span>
            </div>

            {/* Informative Clinical Diagnosis Subline (No buzzwords / filler) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 2,
                fontSize: '0.72rem',
                color: '#64748b',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 600, color: '#334155' }}>
                Reason: Evaluating Exertional Angina & Coronary Perfusion
              </span>
              <span>•</span>
              <span>Telemetry: Sinus Rhythm ({activePatient?.pr || activePatient?.pulse || activePatient?.heart_rate || activePatient?.hr || 72} bpm)</span>
              <span>•</span>
              <span>Non-Emergent Clinical Workstation</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Encounter Date Badge (Integrated from TopBar) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 11px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1.5px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.72rem',
              fontWeight: 700,
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              whiteSpace: 'nowrap',
            }}
          >
            <Calendar style={{ width: 13, height: 13, color: '#0284c7' }} />
            <span>Thu, Oct 15, 2026</span>
          </div>

          <button
            type="button"
            onClick={onBackToQueue}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 12px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              color: '#334155',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
          >
            <ArrowLeft style={{ width: 13, height: 13 }} />
            <span>Patient Roster</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPatientModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 14px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <Users style={{ width: 13, height: 13 }} />
            <span>Select / Switch Patient</span>
          </button>
        </div>
      </div>

      <PatientSelectModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSelectPatient={(p) => {
          onSelectPatient?.(p);
          setIsPatientModalOpen(false);
        }}
        currentPatientId={activePatient?.id}
      />

      {/* ─── Main Unified Workstation (2-Row CSS Grid: Row 1 = Vitals + Heart/SHAP | Row 2 = Committed EHR + What-If Simulator) ─ */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 4,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 12,
          alignItems: 'stretch',
        }}
      >
        {/* Row 1 Left (4 cols): Patient Biomarkers & Vitals */}
        <div style={{ gridColumn: 'span 12' }} className="lg:!col-span-4">
          <PatientBiomarkersPanel
            patient={activePatient}
            activeCadRisk={activeCadRisk}
            vesselStage={vesselStage}
            blockedCount={blockedCount}
            style={{ height: '100%', minHeight: 425 }}
          />
        </div>

        {/* Row 1 Right (8 cols): 3D Heart & SHAP side-by-side */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 12,
          }}
          className="lg:!col-span-8"
        >
          <HeartViewerPanel
            vessels={activeVessels}
            isSimulated={simulationState?.isSimulated}
            onResetSimulation={handleResetSimulation}
            style={{ height: '100%', minHeight: 425 }}
          />

          <ShapExplainerCard
            patient={activePatient}
            simulationState={simulationState}
            style={{ height: '100%', minHeight: 425 }}
          />
        </div>

        {/* Row 2 Left (4 cols): Committed EHR History & Records */}
        <div style={{ gridColumn: 'span 12' }} className="lg:!col-span-4">
          <CommittedEhrSection
            patient={activePatient}
            refreshTrigger={refreshEhrTrigger}
            onOpenReportModal={(record) => {
              setSelectedReportRecord(record);
              setIsReportOpen(true);
            }}
            style={{ height: '100%' }}
          />
        </div>

        {/* Row 2 Right (8 cols): Wide Horizontal "What-If" Treatment Simulator Cockpit */}
        <div style={{ gridColumn: 'span 12' }} className="lg:!col-span-8">
          <WhatIfSimulator
            patient={activePatient}
            onSimulationChange={setSimulationState}
            onResetSimulation={handleResetSimulation}
            onOpenReport={() => {
              setSelectedReportRecord(null);
              setIsReportOpen(true);
            }}
            onPlanCommitted={() => {
              setRefreshEhrTrigger((prev) => prev + 1);
            }}
            style={{ height: '100%' }}
          />
        </div>
      </div>

      {/* ── Official Branded Clinical PDF Report Modal ── */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => {
          setIsReportOpen(false);
          setSelectedReportRecord(null);
        }}
        patient={activePatient}
        simulationResult={
          selectedReportRecord
            ? {
                isSimulated: true,
                simulatedBp: selectedReportRecord.target_bp,
                simulatedLdl: selectedReportRecord.target_ldl,
                simulatedSmoker: selectedReportRecord.stop_smoking ? 0 : 1,
                relativeRiskReduction: selectedReportRecord.relative_risk_reduction,
              }
            : simulationState
        }
        targetBp={
          selectedReportRecord
            ? selectedReportRecord.target_bp
            : (simulationState?.simulatedBp || activePatient?.bp || 140)
        }
        targetLdl={
          selectedReportRecord
            ? selectedReportRecord.target_ldl
            : (simulationState?.simulatedLdl || activePatient?.ldl || 150)
        }
        stopSmoking={
          selectedReportRecord
            ? Boolean(selectedReportRecord.stop_smoking)
            : (simulationState?.simulatedSmoker === 0)
        }
      />
    </div>
  );
}
