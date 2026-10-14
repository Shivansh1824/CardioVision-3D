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
  CheckCircle2
} from 'lucide-react';
import HeartViewerPanel from './HeartViewerPanel';
import ShapExplainerCard from './ShapExplainerCard';
import WhatIfSimulator from './WhatIfSimulator';
import EhrHistoryComparison from './EhrHistoryComparison';
import ClinicalReportModal from './ClinicalReportModal';
import PatientSelectModal from './PatientSelectModal';
import RiskBadge from '../shared/RiskBadge';
import VesselStatusBar from '../shared/VesselStatusBar';
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
  const ef = Number(patient.ef_tte) || 50;

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

  const [activeTab, setActiveTab] = useState('what-if'); // 'what-if' | 'shap' | 'ehr'
  const [simulationState, setSimulationState] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ─── Top Clinical Header & Patient Selector ──────────────────── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 18,
          border: '1px solid rgba(226, 232, 240, 0.9)',
          boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          padding: '14px 22px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 14,
        }}
      >
        {/* Back button & patient info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onBackToQueue}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} />
            <span>Patients</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {displayName}
              </h2>
              {patient?.patient_code && (
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    background: '#f1f5f9',
                    padding: '2px 7px',
                    borderRadius: 5,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {patient.patient_code}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>•</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                {patient?.age ? `${patient.age}y` : '62y'} {normalizedSex}
              </span>
              <RiskBadge level={triageCategory} size="sm" />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 3,
                fontSize: '0.72rem',
                color: '#64748b',
              }}
            >
              <span>BP: <strong style={{ color: '#0f172a' }}>{patient?.bp || 140} mmHg</strong></span>
              <span>•</span>
              <span>LDL: <strong style={{ color: '#0f172a' }}>{patient?.ldl || 150} mg/dL</strong></span>
              <span>•</span>
              <span>EF: <strong style={{ color: '#0f172a' }}>{patient?.ef_tte || 48}%</strong></span>
              <span>•</span>
              <span>Stage: <strong style={{ color: '#0f172a' }}>{vesselStage} ({blockedCount}/3 Occluded)</strong></span>
            </div>
          </div>
        </div>

        {/* Switch Patient Modal Trigger Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => setIsPatientModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 8px rgba(225,29,72,0.25)',
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
        currentPatientId={patient?.id}
      />


      {/* ─── Main 2-Column Split: Center 3D Heart vs Right Decision Tools ─ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 20,
        }}
      >
        {/* Left/Center Column: 3D Anatomical Heart Inspector (7 cols) */}
        <div style={{ gridColumn: 'span 12', height: 640 }} className="lg:!col-span-7">
          <HeartViewerPanel
            vessels={activeVessels}
            isSimulated={simulationState?.isSimulated}
            onResetSimulation={handleResetSimulation}
          />
        </div>

        {/* Right Column: Tabbed What-If Simulator & SHAP Card (5 cols) */}
        <div
          style={{
            gridColumn: 'span 12',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
          className="lg:!col-span-5"
        >
          {/* Tab Navigation Pill Bar */}
          <div
            style={{
              display: 'flex',
              padding: 4,
              borderRadius: 14,
              background: 'var(--dash-surface-2)',
              border: '1px solid var(--dash-border)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('what-if')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 12px',
                borderRadius: 10,
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'what-if' ? 'var(--dash-surface)' : 'transparent',
                color: activeTab === 'what-if' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: activeTab === 'what-if' ? 'var(--dash-shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Sliders style={{ width: 14, height: 14, color: activeTab === 'what-if' ? '#059669' : undefined }} />
              <span>What-If Simulator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shap')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 10px',
                borderRadius: 10,
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'shap' ? 'var(--dash-surface)' : 'transparent',
                color: activeTab === 'shap' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: activeTab === 'shap' ? 'var(--dash-shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Cpu style={{ width: 14, height: 14, color: activeTab === 'shap' ? '#0284c7' : undefined }} />
              <span>SHAP Explainability</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ehr')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '8px 10px',
                borderRadius: 10,
                fontSize: '0.76rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'ehr' ? 'var(--dash-surface)' : 'transparent',
                color: activeTab === 'ehr' ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: activeTab === 'ehr' ? 'var(--dash-shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <FileText style={{ width: 14, height: 14, color: activeTab === 'ehr' ? '#0f172a' : undefined }} />
              <span>EHR History</span>
            </button>
          </div>

          {/* Active Tool Card */}
          {activeTab === 'what-if' && (
            <WhatIfSimulator
              patient={activePatient}
              onSimulationChange={setSimulationState}
              onResetSimulation={handleResetSimulation}
              onOpenReport={() => setIsReportOpen(true)}
              onPlanCommitted={() => {
                // Keep simulated state active
              }}
            />
          )}

          {activeTab === 'shap' && (
            <ShapExplainerCard
              patient={activePatient}
              simulationState={simulationState}
            />
          )}

          {activeTab === 'ehr' && (
            <EhrHistoryComparison
              patient={activePatient}
              currentSimulation={simulationState}
              onReplaySimulation={(record) => {
                setActiveTab('what-if');
              }}
              onExportPdf={() => {
                setIsReportOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* ── Official Branded Clinical PDF Report Modal ── */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        patient={activePatient}
        simulationResult={simulationState}
        targetBp={simulationState?.simulatedBp || activePatient?.bp || 140}
        targetLdl={simulationState?.simulatedLdl || activePatient?.ldl || 150}
        stopSmoking={simulationState?.simulatedSmoker === 0}
      />

      {/* ─── Printable Hospital Cardiology Summary (Visible in Print Mode) ─ */}
      <div id="printable-clinical-summary" className="print-only">
        <div style={{ padding: 32, fontFamily: 'sans-serif', color: '#0f172a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>CardioVision 3D • Cardiology Clinical Report</h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                AI-Assisted Multi-Vessel Stenosis Diagnostic & Treatment Plan
              </p>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12 }}>
              <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong>Patient:</strong> {displayName}</div>
              <div><strong>Case ID:</strong> {patient?.patient_code || 'PT-001'}</div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ border: '1px solid #cbd5e1', padding: 16, borderRadius: 8 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>Patient Biomarkers</h3>
              <p style={{ margin: '4px 0', fontSize: 12 }}>Age / Sex: {patient?.age}y / {normalizedSex}</p>
              <p style={{ margin: '4px 0', fontSize: 12 }}>Blood Pressure: {patient?.bp} mmHg</p>
              <p style={{ margin: '4px 0', fontSize: 12 }}>LDL Cholesterol: {patient?.ldl} mg/dL</p>
              <p style={{ margin: '4px 0', fontSize: 12 }}>Echocardiogram EF: {patient?.ef_tte}%</p>
            </div>

            <div style={{ border: '1px solid #cbd5e1', padding: 16, borderRadius: 8 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>Coronary Stenosis Evaluation</h3>
              <p style={{ margin: '4px 0', fontSize: 12 }}>Overall CAD Risk: {activeCadRisk}%</p>
              <p style={{ margin: '4px 0', fontSize: 12 }}>LAD Artery: {Math.round(activeVessels.lad.probability * 100)}% ({activeVessels.lad.status})</p>
              <p style={{ margin: '4px 0', fontSize: 12 }}>LCX Artery: {Math.round(activeVessels.lcx.probability * 100)}% ({activeVessels.lcx.status})</p>
              <p style={{ margin: '4px 0', fontSize: 12 }}>RCA Artery: {Math.round(activeVessels.rca.probability * 100)}% ({activeVessels.rca.status})</p>
            </div>
          </div>

          <div style={{ marginTop: 32, padding: 16, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 6px', fontSize: 12, color: '#334155' }}>Clinical Safety Disclaimer (Hackathon Rule 5)</h4>
            <p style={{ margin: 0, fontSize: 10, color: '#64748b', lineHeight: 1.5 }}>
              CardioVision 3D is an artificial intelligence-driven research and clinical decision support prototype developed for educational and screening assistance during the Multimodal AI Hackathon 2026. Predictions and 3D visual risk mappings do NOT constitute definitive medical diagnoses and are not a substitute for formal clinical diagnostic imaging (such as invasive coronary angiography) or direct consultation with a qualified board-certified cardiologist.
            </p>
          </div>

          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: 200, borderTop: '1px solid #0f172a', paddingTop: 8, fontSize: 11 }}>
              Attending Cardiologist Signature
            </div>
            <div style={{ width: 140, borderTop: '1px solid #0f172a', paddingTop: 8, fontSize: 11, textAlign: 'right' }}>
              Hospital Stamp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
