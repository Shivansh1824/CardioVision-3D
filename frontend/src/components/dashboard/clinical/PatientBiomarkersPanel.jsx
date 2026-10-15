import { useMemo } from 'react';
import { 
  Activity, 
  Heart, 
  Droplet, 
  Flame, 
  Wind, 
  AlertCircle,
  Zap,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

/**
 * PatientBiomarkersPanel — Clean, compact clinical vitals & risk factors panel.
 * Designed with streamlined cards, 1-line plain-English CAD explanation,
 * and an expanded risk factors checklist with ample breathing room.
 */
export default function PatientBiomarkersPanel({
  patient,
  activeCadRisk = 54,
  vesselStage = '0-VD',
  blockedCount = 0,
}) {
  const bp = Number(patient?.bp) || 155;
  const ldl = Number(patient?.ldl) || 165;
  const ef = Number(patient?.ef_tte) || 42;
  const fbs = Number(patient?.fbs) || 110;
  const pulseRate = Number(patient?.pr || patient?.pulse || patient?.heart_rate || patient?.hr) || 72;

  const isSmoker = Number(patient?.current_smoker) > 0;
  const hasStElev = Number(patient?.st_elevation) > 0;
  const hasAngina = Number(patient?.typical_chest_pain) > 0;
  const hasHtn = Number(patient?.htn) > 0 || bp >= 140;
  const hasDm = Number(patient?.dm) > 0 || fbs >= 126;

  // Pulse status
  const pulseStatus = pulseRate > 100 ? 'Elevated' : pulseRate < 60 ? 'Low' : 'Normal';

  // BP clinical status
  const bpStatus = useMemo(() => {
    if (bp >= 160) {
      return { label: 'Very High', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', normal: '90 – 120 mmHg' };
    }
    if (bp >= 140) {
      return { label: 'High (Stage 1)', color: '#d97706', bg: '#fffbeb', border: '#fde68a', normal: '90 – 120 mmHg' };
    }
    if (bp >= 120) {
      return { label: 'Elevated', color: '#d97706', bg: '#fffbeb', border: '#fde68a', normal: '90 – 120 mmHg' };
    }
    return { label: 'Healthy Normal', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', normal: '90 – 120 mmHg' };
  }, [bp]);

  // LDL Cholesterol status
  const ldlStatus = useMemo(() => {
    if (ldl >= 160) {
      return { label: 'Very High', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', normal: '< 100 mg/dL' };
    }
    if (ldl >= 130) {
      return { label: 'Borderline High', color: '#d97706', bg: '#fffbeb', border: '#fde68a', normal: '< 100 mg/dL' };
    }
    return { label: 'Healthy Normal', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', normal: '< 100 mg/dL' };
  }, [ldl]);

  // Heart Pumping Power (EF) status
  const efStatus = useMemo(() => {
    if (ef < 40) {
      return { label: 'Reduced Power', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', normal: '50% – 70%' };
    }
    if (ef < 50) {
      return { label: 'Mildly Reduced', color: '#d97706', bg: '#fffbeb', border: '#fde68a', normal: '50% – 70%' };
    }
    return { label: 'Healthy Normal', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', normal: '50% – 70%' };
  }, [ef]);

  // Fasting Blood Sugar (FBS) status
  const fbsStatus = useMemo(() => {
    if (fbs >= 126) {
      return { label: 'Diabetic Range', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', normal: '70 – 99 mg/dL' };
    }
    if (fbs >= 100) {
      return { label: 'Pre-Diabetic', color: '#d97706', bg: '#fffbeb', border: '#fde68a', normal: '70 – 99 mg/dL' };
    }
    return { label: 'Healthy Normal', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', normal: '70 – 99 mg/dL' };
  }, [fbs]);

  // Single-line simple English artery status
  const singleLineArteryStatus = useMemo(() => {
    if (blockedCount === 0) {
      return 'All 3 main arteries open without critical (≥50%) blockage.';
    }
    if (blockedCount === 1) {
      return '1 of 3 main coronary arteries has critical narrowing (≥50% blockage).';
    }
    return `${blockedCount} of 3 main coronary arteries have critical narrowing (≥50% blockage).`;
  }, [blockedCount]);

  // Count active risk factors
  const activeFactorsCount = [isSmoker, hasStElev, hasAngina, hasHtn, hasDm].filter(Boolean).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 18,
        border: '1.5px solid var(--dash-border)',
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
        padding: '13px 14px',
        minHeight: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.12)',
            }}
          >
            <Activity style={{ width: 15, height: 15, color: '#0284c7' }} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.86rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Patient Vitals & Biomarkers
            </h3>
            <span style={{ fontSize: '0.62rem', color: '#64748b' }}>
              Current Readings vs Healthy Target Ranges
            </span>
          </div>
        </div>

        {/* Live Sinus Dot with Dynamic Heart Rate */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px',
            borderRadius: 8,
            background: pulseStatus === 'Normal' ? '#ecfdf5' : '#fffbeb',
            border: `1px solid ${pulseStatus === 'Normal' ? '#a7f3d0' : '#fde68a'}`,
            fontSize: '0.66rem',
            fontWeight: 700,
            color: pulseStatus === 'Normal' ? '#047857' : '#b45309',
            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.08)',
          }}
          title={`Resting heart rate from patient clinical record (${pulseRate} bpm)`}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: pulseStatus === 'Normal' ? '#10b981' : '#f59e0b',
              animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <span>{pulseRate} bpm ({pulseStatus})</span>
        </div>
      </div>

      {/* Grid of Key Diagnostic Vitals (Improvised, Sleek & Compact) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
        {/* Blood Pressure Card */}
        <div
          style={{
            padding: '7px 9px',
            borderRadius: 11,
            background: bpStatus.bg,
            border: `1.5px solid ${bpStatus.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#334155' }}>
              Blood Pressure
            </span>
            <Activity style={{ width: 12, height: 12, color: bpStatus.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: '1.12rem', fontWeight: 900, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.1 }}>
                {bp}
              </span>
              <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 600 }}>mmHg</span>
            </div>
            <span
              style={{
                fontSize: '0.54rem',
                fontWeight: 700,
                color: bpStatus.color,
                background: '#ffffff',
                padding: '1.5px 5px',
                borderRadius: 4,
                border: `1px solid ${bpStatus.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {bpStatus.label}
            </span>
          </div>
          <span style={{ fontSize: '0.56rem', color: '#64748b', fontWeight: 500 }}>
            Target: <strong style={{ color: '#475569' }}>{bpStatus.normal}</strong>
          </span>
        </div>

        {/* Ejection Fraction (EF) Card */}
        <div
          style={{
            padding: '7px 9px',
            borderRadius: 11,
            background: efStatus.bg,
            border: `1.5px solid ${efStatus.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#334155' }}>
              Heart Pump (EF)
            </span>
            <Heart style={{ width: 12, height: 12, color: efStatus.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: '1.12rem', fontWeight: 900, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.1 }}>
                {ef}%
              </span>
              <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 600 }}>Echo</span>
            </div>
            <span
              style={{
                fontSize: '0.54rem',
                fontWeight: 700,
                color: efStatus.color,
                background: '#ffffff',
                padding: '1.5px 5px',
                borderRadius: 4,
                border: `1px solid ${efStatus.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {efStatus.label}
            </span>
          </div>
          <span style={{ fontSize: '0.56rem', color: '#64748b', fontWeight: 500 }}>
            Target: <strong style={{ color: '#475569' }}>{efStatus.normal}</strong>
          </span>
        </div>

        {/* LDL Cholesterol Card */}
        <div
          style={{
            padding: '7px 9px',
            borderRadius: 11,
            background: ldlStatus.bg,
            border: `1.5px solid ${ldlStatus.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#334155' }}>
              Bad Cholesterol (LDL)
            </span>
            <Droplet style={{ width: 12, height: 12, color: ldlStatus.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: '1.12rem', fontWeight: 900, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.1 }}>
                {ldl}
              </span>
              <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 600 }}>mg/dL</span>
            </div>
            <span
              style={{
                fontSize: '0.54rem',
                fontWeight: 700,
                color: ldlStatus.color,
                background: '#ffffff',
                padding: '1.5px 5px',
                borderRadius: 4,
                border: `1px solid ${ldlStatus.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {ldlStatus.label}
            </span>
          </div>
          <span style={{ fontSize: '0.56rem', color: '#64748b', fontWeight: 500 }}>
            Target: <strong style={{ color: '#475569' }}>{ldlStatus.normal}</strong>
          </span>
        </div>

        {/* Fasting Blood Sugar Card */}
        <div
          style={{
            padding: '7px 9px',
            borderRadius: 11,
            background: fbsStatus.bg,
            border: `1.5px solid ${fbsStatus.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: '#334155' }}>
              Blood Sugar (Fasting)
            </span>
            <Flame style={{ width: 12, height: 12, color: fbsStatus.color }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: '1.12rem', fontWeight: 900, color: '#0f172a', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.1 }}>
                {fbs}
              </span>
              <span style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 600 }}>mg/dL</span>
            </div>
            <span
              style={{
                fontSize: '0.54rem',
                fontWeight: 700,
                color: fbsStatus.color,
                background: '#ffffff',
                padding: '1.5px 5px',
                borderRadius: 4,
                border: `1px solid ${fbsStatus.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {fbsStatus.label}
            </span>
          </div>
          <span style={{ fontSize: '0.56rem', color: '#64748b', fontWeight: 500 }}>
            Target: <strong style={{ color: '#475569' }}>{fbsStatus.normal}</strong>
          </span>
        </div>
      </div>

      {/* CAD Diagnostic Burden Card (Compacted with 1-Line Plain English Summary) */}
      <div
        style={{
          padding: '9px 11px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          border: '1.5px solid #fecdd3',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          boxShadow: '0 2px 6px rgba(225, 29, 72, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#9f1239' }}>
            Predicted Heart Disease Risk (CAD)
          </span>
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              color: blockedCount > 0 ? '#be123c' : '#047857',
              background: '#ffffff',
              padding: '2px 6px',
              borderRadius: 5,
              border: `1px solid ${blockedCount > 0 ? '#fda4af' : '#a7f3d0'}`,
            }}
          >
            {blockedCount} of 3 Arteries Blocked
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: '1.38rem', fontWeight: 900, color: '#be123c', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
            {activeCadRisk}%
          </span>
          <span style={{ fontSize: '0.66rem', color: '#9f1239', fontWeight: 600 }}>
            Moderate CAD Probability (Healthy Target &lt; 20%)
          </span>
        </div>

        {/* Slim Progress Bar */}
        <div style={{ width: '100%', height: 5, borderRadius: 99, background: '#fecdd3', overflow: 'hidden' }}>
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

        {/* Compact 1-line simple English explanation */}
        <div style={{ fontSize: '0.64rem', color: '#9f1239', fontWeight: 600, lineHeight: 1.3 }}>
          <span style={{ fontWeight: 800, color: '#881337' }}>Artery Status: </span>
          <span>{singleLineArteryStatus}</span>
        </div>
      </div>

      {/* Expanded Key Patient Risk Factors Section with Ample Breathing Space */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.64rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#475569',
              letterSpacing: '0.04em',
            }}
          >
            Key Patient Risk Factors
          </span>
          <span
            style={{
              fontSize: '0.58rem',
              fontWeight: 700,
              color: activeFactorsCount > 1 ? '#be123c' : '#047857',
              background: activeFactorsCount > 1 ? '#fff1f2' : '#ecfdf5',
              padding: '1px 6px',
              borderRadius: 4,
              border: `1px solid ${activeFactorsCount > 1 ? '#fecaca' : '#a7f3d0'}`,
            }}
          >
            {activeFactorsCount} Detected
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Smoking Factor */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 9px',
              borderRadius: 8,
              background: isSmoker ? '#fff1f2' : '#f0fdf4',
              border: `1px solid ${isSmoker ? '#fecaca' : '#bbf7d0'}`,
              fontSize: '0.68rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Wind style={{ width: 13, height: 13, color: isSmoker ? '#dc2626' : '#16a34a' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>Smoking Status:</span>
            </div>
            <span style={{ fontWeight: 800, color: isSmoker ? '#dc2626' : '#16a34a' }}>
              {isSmoker ? 'Active Smoker (+14.5% Risk)' : 'Non-Smoker (Protected)'}
            </span>
          </div>

          {/* ST Elevation Factor */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 9px',
              borderRadius: 8,
              background: hasStElev ? '#fff1f2' : '#f0fdf4',
              border: `1px solid ${hasStElev ? '#fecaca' : '#bbf7d0'}`,
              fontSize: '0.68rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap style={{ width: 13, height: 13, color: hasStElev ? '#dc2626' : '#16a34a' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>ECG Leads V1-V4:</span>
            </div>
            <span style={{ fontWeight: 800, color: hasStElev ? '#dc2626' : '#16a34a' }}>
              {hasStElev ? 'ST-Elevation (Oxygen Shortage)' : 'Normal Perfusion'}
            </span>
          </div>

          {/* Chest Tightness / Angina Factor */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 9px',
              borderRadius: 8,
              background: hasAngina ? '#fffbeb' : '#f0fdf4',
              border: `1px solid ${hasAngina ? '#fde68a' : '#bbf7d0'}`,
              fontSize: '0.68rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle style={{ width: 13, height: 13, color: hasAngina ? '#d97706' : '#16a34a' }} />
              <span style={{ fontWeight: 600, color: '#334155' }}>Chest Tightness:</span>
            </div>
            <span style={{ fontWeight: 800, color: hasAngina ? '#d97706' : '#16a34a' }}>
              {hasAngina ? 'Exertional Angina Present' : 'No Chest Pain Reported'}
            </span>
          </div>

          {/* Hypertension History Factor (When present or indicated by BP) */}
          {hasHtn && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 9px',
                borderRadius: 8,
                background: '#fffbeb',
                border: '1px solid #fde68a',
                fontSize: '0.68rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity style={{ width: 13, height: 13, color: '#d97706' }} />
                <span style={{ fontWeight: 600, color: '#334155' }}>Vascular Pressure:</span>
              </div>
              <span style={{ fontWeight: 800, color: '#d97706' }}>
                Chronic Hypertension (Stage 1)
              </span>
            </div>
          )}

          {/* Diabetes Mellitus Factor (When present or indicated by FBS) */}
          {hasDm && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 9px',
                borderRadius: 8,
                background: '#fff1f2',
                border: '1px solid #fecaca',
                fontSize: '0.68rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flame style={{ width: 13, height: 13, color: '#dc2626' }} />
                <span style={{ fontWeight: 600, color: '#334155' }}>Metabolic Profile:</span>
              </div>
              <span style={{ fontWeight: 800, color: '#dc2626' }}>
                Diabetic Glucose Impairment
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
