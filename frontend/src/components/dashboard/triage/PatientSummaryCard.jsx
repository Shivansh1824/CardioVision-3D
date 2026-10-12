import { Activity, ArrowRight, Heart } from 'lucide-react';
import RiskBadge from '../shared/RiskBadge';
import patientNames from '../../../data/patientNames.json';

/**
 * PatientSummaryCard — right-panel quick summary shown after selecting a patient
 * from the queue, before entering Clinical Analysis View.
 */
export default function PatientSummaryCard({ patient, triageLevel, onOpenClinical }) {
  if (!patient) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 32,
          textAlign: 'center',
          background: 'var(--dash-surface)',
          borderRadius: 20,
          border: '1.5px dashed var(--dash-border)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'var(--dash-surface-2)',
            border: '1.5px solid var(--dash-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Heart style={{ width: 24, height: 24, color: 'var(--text-muted)' }} />
        </div>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              margin: '0 0 4px',
            }}
          >
            Select a patient
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Choose from the queue to view their clinical summary and open the 3D analysis.
          </p>
        </div>
      </div>
    );
  }

  const displayName = patient.name || (patient.patient_code ? patientNames[patient.patient_code] : null) || patient.patient_code || 'Selected Patient';
  const rawSex = String(patient.sex || '').trim().toLowerCase();
  const normalizedSex = (rawSex === 'fmale' || rawSex === 'female' || rawSex === 'f') ? 'Female' : (rawSex ? 'Male' : '—');
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PT';

  const vitals = [
    { label: 'Age', value: patient.age ? `${patient.age} yrs` : '—' },
    { label: 'Sex', value: normalizedSex },
    { label: 'BP', value: patient.bp ? `${patient.bp} mmHg` : '—' },
    { label: 'LDL', value: patient.ldl ? `${patient.ldl} mg/dL` : '—' },
    { label: 'EF', value: patient.ef_tte ? `${patient.ef_tte}%` : '—' },
    { label: 'FBS', value: patient.fbs ? `${patient.fbs} mg/dL` : '—' },
  ];

  const flags = [
    patient.dm && 'Diabetes',
    patient.htn && 'Hypertension',
    patient.current_smoker && 'Active Smoker',
    patient.typical_chest_pain && 'Chest Pain',
    patient.st_elevation && 'ST-Elevation',
  ].filter(Boolean);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--dash-surface)',
        borderRadius: 20,
        border: '1.5px solid var(--dash-border)',
        boxShadow: 'var(--dash-shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Top band — patient ID + triage */}
      <div
        style={{
          padding: '18px 20px 14px',
          borderBottom: '1px solid var(--dash-border)',
          background: 'var(--dash-surface-2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.92rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(2,132,199,0.25)',
              }}
            >
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Case {patient.patient_code || 'PT-001'}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.18rem',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {displayName}
              </h3>
            </div>
          </div>
          <RiskBadge level={triageLevel} size="lg" />
        </div>

        {/* Clinical flags */}
        {flags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {flags.map((flag) => (
              <span
                key={flag}
                style={{
                  padding: '2px 8px',
                  borderRadius: 5,
                  background: 'rgba(225,29,72,0.06)',
                  border: '1px solid rgba(225,29,72,0.15)',
                  color: '#9f1239',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {flag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Vitals grid */}
      <div style={{ padding: '16px 20px', flex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            marginBottom: 20,
          }}
        >
          {vitals.map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: 'var(--dash-surface-2)',
                border: '1px solid var(--dash-border)',
                borderRadius: 10,
                padding: '10px 12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 3,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Info note */}
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--ai-accent-bg)',
            border: '1px solid var(--ai-accent-border)',
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.75rem',
              color: 'var(--ai-accent)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Activity style={{ width: 13, height: 13, flexShrink: 0 }} />
            <span>
              Open Clinical Analysis to run the AI prediction, view the 3D heart, and simulate
              treatment outcomes.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          padding: '0 20px 20px',
        }}
      >
        <button
          onClick={onOpenClinical}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '13px 20px',
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(225,29,72,0.3)',
            transition: 'all 0.2s var(--ease-expo)',
            letterSpacing: '-0.01em',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(225,29,72,0.42)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(225,29,72,0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Heart style={{ width: 17, height: 17 }} />
          Open Clinical Analysis
          <ArrowRight style={{ width: 15, height: 15 }} />
        </button>
      </div>
    </div>
  );
}
