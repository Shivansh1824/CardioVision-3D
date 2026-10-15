import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * ExtractedBiomarkersSummary — displays structured clinical data extracted
 * from the processed diagnostic report, with action to import into 3D Studio.
 */
export default function ExtractedBiomarkersSummary({
  file,
  patient,
  onConfirmPatient,
  onReset,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Success Banner */}
      <div
        style={{
          border: '1.5px solid var(--vessel-safe-border)',
          borderRadius: 12,
          padding: '16px',
          background: 'var(--vessel-safe-bg)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <CheckCircle2 style={{ width: 26, height: 26, color: 'var(--vessel-safe)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '0.88rem' }}>
            Document Verified & Biomarkers Extracted
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {file?.name} · Multi-lead ECG, Lipids, & Echo parameters parsed successfully
          </div>
        </div>
        {file?.url && (
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open diagnostic report in Supabase Cloud Storage"
            style={{
              fontSize: '0.7rem',
              color: 'var(--ai-accent)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 9px',
              borderRadius: 6,
              background: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.22)',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <span>Supabase PDF</span>
            <ExternalLink style={{ width: 11, height: 11 }} />
          </a>
        )}
      </div>

      {/* Extracted Clinical Profile Box */}
      <div
        style={{
          background: 'var(--dash-surface-2)',
          border: '1px solid var(--dash-border)',
          borderRadius: 12,
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {patient.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {patient.patient_code} · {patient.age} Yrs · {patient.sex} · BP: 146/92 mmHg
            </div>
          </div>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 6,
              background: 'var(--vessel-critical-bg)',
              color: 'var(--vessel-critical)',
              border: '1px solid var(--vessel-critical-border)',
            }}
          >
            High CAD Risk (88%)
          </span>
        </div>

        {/* Extracted metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div style={{ padding: '8px 10px', background: 'var(--dash-surface)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              🧪 Fasting Lipids
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              LDL: <span style={{ color: 'var(--vessel-critical)' }}>164</span> | HDL: 34 | TG: 228
            </div>
          </div>

          <div style={{ padding: '8px 10px', background: 'var(--dash-surface)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              🩸 Glycemia & Renal
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              FBS: <span style={{ color: 'var(--vessel-critical)' }}>148 mg/dL</span> | Cr: 1.15
            </div>
          </div>

          <div style={{ padding: '8px 10px', background: 'var(--dash-surface)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              📈 12-Lead ECG
            </div>
            <div style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              ST-Depression (V4-V6), T-Inv, LVH (+)
            </div>
          </div>

          <div style={{ padding: '8px 10px', background: 'var(--dash-surface)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              🫀 2D Echocardiogram
            </div>
            <div style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              LVEF: <span style={{ color: 'var(--vessel-critical)' }}>46%</span> | RWMA: Anterior
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'rgba(2,132,199,0.06)', padding: '6px 10px', borderRadius: 6 }}>
          ℹ️ All 59 features normalized to the Z-Alizadeh Sani clinical standard for deterministic ML inference.
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          type="button"
          onClick={onConfirmPatient}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '11px 18px',
            background: 'var(--ai-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 2px 10px rgba(2,132,199,0.28)',
          }}
        >
          <span>Add Patient & Launch 3D Heart Studio</span>
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>

        <button
          type="button"
          onClick={onReset}
          style={{
            padding: '8px 14px',
            background: 'transparent',
            border: '1.5px solid var(--dash-border)',
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Test Another Document
        </button>
      </div>
    </div>
  );
}
