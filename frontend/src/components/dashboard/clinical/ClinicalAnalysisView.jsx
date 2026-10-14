import { useState, useMemo } from 'react';
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
  Stethoscope
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

/**
 * Derives initial baseline vessel risks from patient clinical fields
 */
function deriveBaselineVessels(patient) {
  if (!patient) {
    return {
      lad: { probability: 0.85, is_blocked: true, status: 'Stenotic (>= 50%)' },
      lcx: { probability: 0.42, is_blocked: false, status: 'Moderate Plaque' },
      rca: { probability: 0.14, is_blocked: false, status: 'Normal / Patent' },
      cad: { probability: 0.88, is_blocked: true, status: 'Positive (CAD Confirmed)' },
    };
  }

  const hasStElev = Number(patient.st_elevation) > 0;
  const ldl = Number(patient.ldl) || 130;
  const bp = Number(patient.bp) || 130;

  let pLad = hasStElev ? 0.85 : (ldl > 140 ? 0.65 : 0.38);
  let pLcx = ldl > 150 ? 0.58 : (bp > 145 ? 0.45 : 0.25);
  let pRca = (patient.age > 60 && bp > 140) ? 0.52 : 0.18;

  const pCad = Math.min(0.96, Math.max(0.20, Math.max(pLad, pLcx, pRca) * 1.05));

  return {
    lad: { probability: pLad, is_blocked: pLad >= 0.50, status: pLad >= 0.50 ? 'Stenotic (>= 50%)' : 'Patent' },
    lcx: { probability: pLcx, is_blocked: pLcx >= 0.50, status: pLcx >= 0.50 ? 'Stenotic (>= 50%)' : 'Patent' },
    rca: { probability: pRca, is_blocked: pRca >= 0.50, status: pRca >= 0.50 ? 'Stenotic (>= 50%)' : 'Patent' },
    cad: { probability: pCad, is_blocked: pCad >= 0.50, status: pCad >= 0.50 ? 'Positive (CAD Confirmed)' : 'Normal Perfusion' },
  };
}

const FALLBACK_PATIENT = {
  id: 1,
  patient_code: 'PT-001',
  name: 'James Smith',
  age: 62,
  sex: 'Male',
  bp: 155,
  ldl: 165,
  ef_tte: 42,
  st_elevation: 1,
  typical_chest_pain: 1,
  fbs: 110,
  htn: 1,
  dm: 0,
  current_smoker: 1,
};

/**
 * ClinicalAnalysisView — Master 3D Vascular Studio & Decision Support Environment.
 * Fully unified single-screen workstation inspired by modern clinical design (Dribbble Healthlog).
 */
export default function ClinicalAnalysisView({
  patient,
  onBackToQueue,
  onSelectPatient,
}) {
  const activePatient = patient || FALLBACK_PATIENT;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── R1: Executive Clinical Patient Header (Translucent Glassmorphism) ─── */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.90)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1.5px solid var(--dash-border)',
          boxShadow: 'var(--dash-shadow-sm)',
          padding: '16px 22px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {/* Patient Profile & Clinical Diagnosis Overview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {/* Patient Avatar Badge */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.30rem',
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
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    background: '#e0f2fe',
                    padding: '2px 8px',
                    borderRadius: 6,
                    border: '1px solid #bae6fd',
                  }}
                >
                  {activePatient.patient_code}
                </span>
              )}

              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                {activePatient?.age ? `${activePatient.age}y` : '62y'} • {normalizedSex}
              </span>

              <RiskBadge level={triageCategory} size="sm" />

              <span
                style={{
                  fontSize: '0.70rem',
                  fontWeight: 800,
                  color: '#be123c',
                  background: '#ffe4e6',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid #fecdd3',
                }}
              >
                Stage: {vesselStage} ({blockedCount}/3 Occluded)
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 4,
                fontSize: '0.74rem',
                color: '#64748b',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 600, color: '#334155' }}>
                Longitudinal 3D Vascular Perfusion & Hemodynamic Studio
              </span>
              <span>•</span>
              <span>Primary Case Evaluation</span>
              <span>•</span>
              <span>
                Baseline BP: <strong style={{ color: '#0f172a' }}>{activePatient?.bp || 140} mmHg</strong>
              </span>
              <span>•</span>
              <span>
                Baseline LDL: <strong style={{ color: '#0f172a' }}>{activePatient?.ldl || 150} mg/dL</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onBackToQueue}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              color: '#334155',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f8fafc')}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Patient Roster</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPatientModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.28)',
              transition: 'all 0.15s ease',
            }}
          >
            <Users style={{ width: 14, height: 14 }} />
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

      {/* ─── Main Unified 3-Column Workstation (Left Vitals • Center 3D Heart • Right Treatment Suite) ─ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 16,
        }}
      >
        {/* Left Column (3 cols): Comprehensive Patient Biomarkers & Vitals */}
        <div style={{ gridColumn: 'span 12' }} className="lg:!col-span-3">
          <PatientBiomarkersPanel
            patient={activePatient}
            activeCadRisk={activeCadRisk}
            vesselStage={vesselStage}
            blockedCount={blockedCount}
          />
        </div>

        {/* Center Column (5 cols): 3D Heart Studio with 360° Rotation & Radial Compass Dial */}
        <div style={{ gridColumn: 'span 12', minHeight: 620 }} className="lg:!col-span-5">
          <HeartViewerPanel
            vessels={activeVessels}
            isSimulated={simulationState?.isSimulated}
            onResetSimulation={handleResetSimulation}
          />
        </div>

        {/* Right Column (4 cols): Unified SHAP AI Explainability + What-If Simulator + Committed EHR History */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
          className="lg:!col-span-4"
        >
          {/* Card 1: SHAP AI Explainability & Risk Attribution */}
          <ShapExplainerCard
            patient={activePatient}
            simulationState={simulationState}
          />

          {/* Card 2: "What-If" Therapeutic Simulator */}
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
          />

          {/* Card 3: Dedicated Committed EHR History Section */}
          <CommittedEhrSection
            patient={activePatient}
            refreshTrigger={refreshEhrTrigger}
            onOpenReportModal={(record) => {
              setSelectedReportRecord(record);
              setIsReportOpen(true);
            }}
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
