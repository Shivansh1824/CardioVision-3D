import { useMemo } from 'react';
import { 
  Activity, 
  Heart, 
  Droplet, 
  Flame, 
  Wind, 
  ShieldAlert, 
  ShieldCheck, 
  AlertCircle,
  Zap
} from 'lucide-react';

/**
 * PatientBiomarkersPanel — Comprehensive clinical biomarkers and hemodynamics panel.
 * Displays all key cardiovascular biomarkers in high-contrast, translucent glass cards
 * inspired by modern clinical decision workstations (Dribbble Healthlog reference).
 */
export default function PatientBiomarkersPanel({
  patient,
  activeCadRisk = 88,
  vesselStage = '0-VD',
  blockedCount = 0,
}) {
  const bp = Number(patient?.bp) || 155;
  const ldl = Number(patient?.ldl) || 165;
  const ef = Number(patient?.ef_tte) || 42;
  const fbs = Number(patient?.fbs) || 110;
  const isSmoker = Number(patient?.current_smoker) > 0;
  const hasStElev = Number(patient?.st_elevation) > 0;
  const hasAngina = Number(patient?.typical_chest_pain) > 0;
  const hasHtn = Number(patient?.htn) > 0;

  // BP clinical status
  const bpStatus = useMemo(() => {
    if (bp >= 160) return { label: 'Stage 2 HTN', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
    if (bp >= 140) return { label: 'Stage 1 HTN', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    if (bp >= 120) return { label: 'Elevated', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    return { label: 'Optimal', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
  }, [bp]);

  // LDL status
  const ldlStatus = useMemo(() => {
    if (ldl >= 160) return { label: 'Severe High', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
    if (ldl >= 130) return { label: 'Borderline', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    return { label: 'Optimal (<100)', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
  }, [ldl]);

  // EF status
  const efStatus = useMemo(() => {
    if (ef < 40) return { label: 'Reduced EF', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
    if (ef < 50) return { label: 'Mild-Mod Dysfunction', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    return { label: 'Preserved EF (>50%)', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
  }, [ef]);

  // Blood sugar status
  const fbsStatus = useMemo(() => {
    if (fbs >= 126) return { label: 'Diabetic Range', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
    if (fbs >= 100) return { label: 'Pre-Diabetic', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    return { label: 'Normal (<100)', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
  }, [fbs]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        border: '1.5px solid var(--dash-border)',
        boxShadow: 'var(--dash-shadow-sm)',
        padding: '18px 16px',
        height: '100%',
        minHeight: 520,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity style={{ width: 17, height: 17, color: '#0284c7' }} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.90rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Patient Biomarkers
            </h3>
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
              Hemodynamics & Laboratory Profile
            </span>
          </div>
        </div>

        {/* Live Sinus Dot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px',
            borderRadius: 8,
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: '#047857',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10b981',
              animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <span>Sinus 72 bpm</span>
        </div>
      </div>

      {/* Grid of Key Diagnostic Vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* Blood Pressure Card */}
        <div
          style={{
            padding: '12px 12px',
            borderRadius: 14,
            background: '#ffffff',
            border: `1.5px solid ${bpStatus.border}`,
            boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Systolic BP
            </span>
            <Activity style={{ width: 13, height: 13, color: bpStatus.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontSize: '1.22rem', fontWeight: 900, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace' }}>
              {bp}
            </span>
            <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>mmHg</span>
          </div>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              color: bpStatus.color,
              background: bpStatus.bg,
              padding: '2px 6px',
              borderRadius: 6,
              alignSelf: 'flex-start',
              marginTop: 2,
            }}
          >
            {bpStatus.label}
          </span>
        </div>

        {/* Ejection Fraction (EF) Card */}
        <div
          style={{
            padding: '12px 12px',
            borderRadius: 14,
            background: '#ffffff',
            border: `1.5px solid ${efStatus.border}`,
            boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              EF (Echo)
            </span>
            <Heart style={{ width: 13, height: 13, color: efStatus.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontSize: '1.22rem', fontWeight: 900, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace' }}>
              {ef}%
            </span>
            <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>TTE</span>
          </div>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              color: efStatus.color,
              background: efStatus.bg,
              padding: '2px 6px',
              borderRadius: 6,
              alignSelf: 'flex-start',
              marginTop: 2,
            }}
          >
            {efStatus.label}
          </span>
        </div>

        {/* LDL Cholesterol Card */}
        <div
          style={{
            padding: '12px 12px',
            borderRadius: 14,
            background: '#ffffff',
            border: `1.5px solid ${ldlStatus.border}`,
            boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Serum LDL
            </span>
            <Droplet style={{ width: 13, height: 13, color: ldlStatus.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontSize: '1.22rem', fontWeight: 900, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace' }}>
              {ldl}
            </span>
            <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>mg/dL</span>
          </div>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              color: ldlStatus.color,
              background: ldlStatus.bg,
              padding: '2px 6px',
              borderRadius: 6,
              alignSelf: 'flex-start',
              marginTop: 2,
            }}
          >
            {ldlStatus.label}
          </span>
        </div>

        {/* Fasting Blood Sugar Card */}
        <div
          style={{
            padding: '12px 12px',
            borderRadius: 14,
            background: '#ffffff',
            border: `1.5px solid ${fbsStatus.border}`,
            boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Fasting Glucose
            </span>
            <Flame style={{ width: 13, height: 13, color: fbsStatus.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontSize: '1.22rem', fontWeight: 900, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace' }}>
              {fbs}
            </span>
            <span style={{ fontSize: '0.66rem', color: '#64748b', fontWeight: 600 }}>mg/dL</span>
          </div>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              color: fbsStatus.color,
              background: fbsStatus.bg,
              padding: '2px 6px',
              borderRadius: 6,
              alignSelf: 'flex-start',
              marginTop: 2,
            }}
          >
            {fbsStatus.label}
          </span>
        </div>
      </div>

      {/* CAD Diagnostic Burden Card */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 14,
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          border: '1.5px solid #fecdd3',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.70rem', fontWeight: 800, color: '#9f1239' }}>
            Predicted CAD Burden
          </span>
          <span
            style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              color: '#be123c',
              background: '#ffffff',
              padding: '2px 7px',
              borderRadius: 6,
              border: '1px solid #fda4af',
            }}
          >
            Stage: {vesselStage} ({blockedCount}/3 Occluded)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#be123c', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
            {activeCadRisk}%
          </span>
          <span style={{ fontSize: '0.72rem', color: '#9f1239', fontWeight: 600 }}>
            Probability of Significant Stenosis
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: 6, borderRadius: 99, background: '#fecdd3', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(100, Math.max(5, activeCadRisk))}%`,
              height: '100%',
              borderRadius: 99,
              background: activeCadRisk >= 70 ? '#dc2626' : (activeCadRisk >= 50 ? '#d97706' : '#059669'),
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Clinical Risk Factors Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto' }}>
        <span
          style={{
            fontSize: '0.66rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#64748b',
            letterSpacing: '0.05em',
          }}
        >
          Clinical Flags & History
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Smoking */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              borderRadius: 8,
              background: isSmoker ? '#fff1f2' : '#f8fafc',
              border: `1px solid ${isSmoker ? '#fecaca' : '#e2e8f0'}`,
              fontSize: '0.72rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wind style={{ width: 13, height: 13, color: isSmoker ? '#dc2626' : '#64748b' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>Tobacco Use</span>
            </div>
            <span style={{ fontWeight: 700, color: isSmoker ? '#dc2626' : '#059669' }}>
              {isSmoker ? 'Active Smoker (+14.5% risk)' : 'Non-Smoker'}
            </span>
          </div>

          {/* ST Elevation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              borderRadius: 8,
              background: hasStElev ? '#fff1f2' : '#f8fafc',
              border: `1px solid ${hasStElev ? '#fecaca' : '#e2e8f0'}`,
              fontSize: '0.72rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap style={{ width: 13, height: 13, color: hasStElev ? '#dc2626' : '#64748b' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>ECG Leads V1-V4</span>
            </div>
            <span style={{ fontWeight: 700, color: hasStElev ? '#dc2626' : '#059669' }}>
              {hasStElev ? 'ST-Elevation (+)' : 'Normal Perfusion'}
            </span>
          </div>

          {/* Chest Pain / Angina */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              borderRadius: 8,
              background: hasAngina ? '#fffbeb' : '#f8fafc',
              border: `1px solid ${hasAngina ? '#fde68a' : '#e2e8f0'}`,
              fontSize: '0.72rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle style={{ width: 13, height: 13, color: hasAngina ? '#d97706' : '#64748b' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>Exertional Angina</span>
            </div>
            <span style={{ fontWeight: 700, color: hasAngina ? '#d97706' : '#059669' }}>
              {hasAngina ? 'Typical Angina (+)' : 'Atypical / Absent'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
