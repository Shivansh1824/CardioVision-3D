import { ChevronRight } from 'lucide-react';
import RiskBadge from '../shared/RiskBadge';

/**
 * PatientQueueItem — single row in the triage queue list.
 * Props: patient (DB row), triageLevel, isSelected, onClick
 */
export default function PatientQueueItem({ patient, triageLevel, isSelected, onClick }) {
  const name = patient.patient_code ?? 'Unknown';
  const age = patient.age ? `${patient.age}y` : '—';
  const sex = patient.sex ? (patient.sex.toLowerCase().startsWith('m') ? 'M' : 'F') : '—';

  // Key clinical signal to display as subtitle
  const signal = (() => {
    if (patient.st_elevation > 0) return 'ST-Elevation detected';
    if (patient.typical_chest_pain > 0) return 'Typical chest pain';
    if (patient.ldl > 160) return `LDL ${patient.ldl} mg/dL`;
    if (patient.bp > 140) return `BP ${patient.bp} mmHg`;
    if (patient.ef_tte < 45) return `EF ${patient.ef_tte}%`;
    return 'Routine evaluation';
  })();

  return (
    <button
      onClick={onClick}
      aria-pressed={isSelected}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '12px 14px',
        borderRadius: 12,
        border: isSelected
          ? '1.5px solid var(--ai-accent)'
          : '1.5px solid var(--dash-border)',
        background: isSelected
          ? 'var(--ai-accent-bg)'
          : 'var(--dash-surface)',
        cursor: 'pointer',
        transition: 'all 0.18s var(--ease-expo)',
        boxShadow: isSelected ? '0 0 0 3px rgba(2,132,199,0.1)' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Left: triage color strip */}
      <div
        style={{
          width: 3,
          height: 36,
          borderRadius: 2,
          flexShrink: 0,
          background:
            triageLevel === 'critical'
              ? 'var(--vessel-critical)'
              : triageLevel === 'moderate'
              ? 'var(--vessel-moderate)'
              : 'var(--vessel-safe)',
          transition: 'background 0.3s',
        }}
      />

      {/* Center: info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
            }}
          >
            {name}
          </span>
          <RiskBadge level={triageLevel} />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {age} · {sex}
          </span>
          <span style={{ color: 'var(--dash-border-strong)', fontSize: '0.6rem' }}>|</span>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {signal}
          </span>
        </div>
      </div>

      {/* Right: chevron */}
      <ChevronRight
        style={{
          width: 14,
          height: 14,
          color: isSelected ? 'var(--ai-accent)' : 'var(--text-muted)',
          flexShrink: 0,
          transition: 'color 0.18s',
        }}
      />
    </button>
  );
}
