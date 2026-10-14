import { ChevronRight } from 'lucide-react';

/**
 * PatientQueueItem — 2027 clinical triage card.
 * Left severity rail, clean biometric row, no excessive pill capsules.
 */
export default function PatientQueueItem({ patient, triageLevel, isSelected, onClick, ehrCount = 0 }) {
  const displayName = patient.name || patient.patient_code || 'Unknown Patient';
  const code = patient.patient_code || `PT-${String(patient.id).padStart(3, '0')}`;
  const age = patient.age ? `${patient.age}y` : '—';
  const rawSex = String(patient.sex || '').trim().toLowerCase();
  const sex = rawSex === 'fmale' || rawSex === 'female' || rawSex === 'f' ? 'F' : 'M';

  // Triage visual tokens (left border rail colour + label)
  const triage = {
    critical: { color: '#dc2626', bg: '#fef2f2', label: 'CRITICAL', barColor: '#ef4444' },
    moderate: { color: '#d97706', bg: '#fffbeb', label: 'MODERATE', barColor: '#f59e0b' },
    stable:   { color: '#059669', bg: '#ecfdf5', label: 'STABLE',   barColor: '#10b981' },
  }[triageLevel] || { color: '#64748b', bg: '#f8fafc', label: 'STABLE', barColor: '#94a3b8' };

  // Build a concise biometric summary row (max 3 items)
  const biometrics = [];
  biometrics.push({ key: 'BP', val: `${patient.bp || 140} mmHg`, flag: (patient.bp || 0) >= 140 });
  biometrics.push({ key: 'LDL', val: `${patient.ldl || 130} mg/dL`, flag: (patient.ldl || 0) >= 160 });
  if (patient.ef_tte && patient.ef_tte < 50) {
    biometrics.push({ key: 'EF', val: `${patient.ef_tte}%`, flag: patient.ef_tte < 45 });
  } else {
    biometrics.push({ key: 'FBS', val: `${patient.fbs || 95} mg/dL`, flag: (patient.fbs || 0) >= 126 });
  }

  // Critical signal flags (shown as small icon dots, not pills)
  const signals = [];
  if (patient.st_elevation > 0)      signals.push({ label: 'ST↑', color: '#dc2626' });
  if (patient.typical_chest_pain > 0) signals.push({ label: 'Angina', color: '#ea580c' });
  if (patient.current_smoker > 0)    signals.push({ label: 'Smoker', color: '#78716c' });

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        borderRadius: 14,
        background: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
        border: isSelected
          ? `1.5px solid ${triage.color}`
          : '1px solid rgba(226,232,240,0.8)',
        boxShadow: isSelected
          ? `0 0 0 3px ${triage.color}22, 0 6px 18px rgba(15,23,42,0.08)`
          : '0 1px 4px rgba(15,23,42,0.04)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        marginBottom: 8,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onMouseOver={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.1)';
          e.currentTarget.style.borderColor = 'rgba(203,213,225,0.9)';
        }
      }}
      onMouseOut={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.04)';
          e.currentTarget.style.borderColor = 'rgba(226,232,240,0.8)';
        }
      }}
    >
      {/* Left severity rail */}
      <div
        style={{
          width: 4,
          flexShrink: 0,
          background: triage.barColor,
          borderRadius: '14px 0 0 14px',
        }}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: '11px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          minWidth: 0,
        }}
      >
        {/* Severity indicator block */}
        <div
          style={{
            flexShrink: 0,
            width: 54,
            textAlign: 'center',
            padding: '5px 0',
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.55rem',
              fontWeight: 800,
              color: triage.color,
              letterSpacing: '0.08em',
              lineHeight: 1,
            }}
          >
            {triage.label}
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 36, background: 'rgba(226,232,240,0.8)', flexShrink: 0 }} />

        {/* Patient details */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: '#94a3b8',
                background: 'rgba(226,232,240,0.6)',
                padding: '1px 6px',
                borderRadius: 4,
                letterSpacing: '0.04em',
              }}
            >
              {code}
            </span>
            {ehrCount > 0 && (
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  background: 'rgba(14,165,233,0.1)',
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                {ehrCount} EHR
              </span>
            )}
          </div>

          {/* Biometric summary row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
              {age} · {sex}
            </span>
            {biometrics.map((b, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.04em' }}>
                  {b.key}
                </span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: b.flag ? '#dc2626' : '#334155',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {b.val}
                </span>
              </span>
            ))}
            {/* Signal dots */}
            {signals.map((s, i) => (
              <span
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: s.color,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right chevron */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingRight: 14,
          flexShrink: 0,
        }}
      >
        <ChevronRight
          style={{
            width: 16,
            height: 16,
            color: isSelected ? triage.color : '#94a3b8',
            transition: 'color 0.15s ease',
          }}
        />
      </div>
    </div>
  );
}
