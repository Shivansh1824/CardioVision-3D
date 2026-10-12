import { ChevronRight } from 'lucide-react';
import RiskBadge from '../shared/RiskBadge';

/**
 * PatientQueueItem — single row in the triage queue list.
 * Props: patient (DB row), triageLevel, isSelected, onClick
 */
export default function PatientQueueItem({ patient, triageLevel, isSelected, onClick }) {
  const displayName = patient.name || patient.patient_code || 'Unknown Patient';
  const code = patient.patient_code;
  const age = patient.age ? `${patient.age}y` : '—';
  const sex = patient.sex || '—';

  // Derive initials for avatar
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PT';

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
        padding: '11px 13px',
        borderRadius: 14,
        border: isSelected
          ? '1.5px solid var(--ai-accent)'
          : '1.5px solid var(--dash-border)',
        background: isSelected
          ? 'var(--ai-accent-bg)'
          : 'var(--dash-surface)',
        cursor: 'pointer',
        transition: 'all 0.18s var(--ease-expo)',
        boxShadow: isSelected ? '0 0 0 3px rgba(2,132,199,0.12)' : 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Left: triage color strip */}
      <div
        style={{
          width: 3.5,
          height: 38,
          borderRadius: 3,
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

      {/* Patient Avatar Initials */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          flexShrink: 0,
          background: isSelected ? '#0284c7' : '#f1f5f9',
          color: isSelected ? '#ffffff' : '#334155',
          border: '1.5px solid',
          borderColor: isSelected ? '#0284c7' : 'var(--dash-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          transition: 'all 0.18s ease',
        }}
      >
        {initials}
      </div>

      {/* Center: info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: '0.84rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </span>
            {code && (
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  background: 'var(--dash-surface-2)',
                  padding: '1px 5px',
                  borderRadius: 4,
                  border: '1px solid var(--dash-border)',
                  flexShrink: 0,
                }}
              >
                {code}
              </span>
            )}
          </div>
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
              flexShrink: 0,
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
