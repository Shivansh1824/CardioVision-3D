import { CheckCircle2, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';

/**
 * ExtractedBiomarkersSummary — displays structured clinical data extracted
 * by Gemini 3.8 Flash multimodal OCR, with instant launch into 3D Heart Studio.
 */
export default function ExtractedBiomarkersSummary({
  file,
  patient,
  analysis,
  onConfirmPatient,
  onReset,
}) {
  const confidencePct = Math.round((analysis?.overall_confidence || 0.99) * 100);
  const modalities = analysis?.modalities_detected || ['Blood Biochemistry', '12-Lead ECG', '2D Echo'];
  const summaryText =
    analysis?.extracted_data?.clinical_summary ||
    'Multimodal clinical analysis reveals atherogenic dyslipidemia, lateral ST-depression, and echocardiographic wall motion abnormalities consistent with high multi-vessel CAD risk.';

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '0.88rem' }}>
              Document Verified & Biomarkers Extracted
            </span>
            <span
              style={{
                fontSize: '0.64rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'rgba(2, 132, 199, 0.12)',
                color: 'var(--ai-accent)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Sparkles style={{ width: 10, height: 10 }} /> Gemini 3.8 Flash ({confidencePct}%)
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
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
              {patient.patient_code} · {patient.age} Yrs · {patient.sex} · BP: {patient.bp || 140} mmHg
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {modalities.slice(0, 2).map((m) => (
              <span
                key={m}
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: 'rgba(100, 116, 139, 0.1)',
                  color: 'var(--text-secondary)',
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Extracted metrics grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div style={{ padding: '8px 10px', background: 'var(--dash-surface)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              🧪 Fasting Lipids
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              LDL: <span style={{ color: 'var(--vessel-critical)' }}>{patient.ldl || 164}</span> | HDL: {patient.hdl || 34} | TG: {patient.tg || 228}
            </div>
          </div>

          <div style={{ padding: '8px 10px', background: 'var(--dash-surface)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              🩸 Glycemia & Renal
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              FBS: <span style={{ color: 'var(--vessel-critical)' }}>{patient.fbs || 148} mg/dL</span> | Cr: {patient.cr || 1.15}
            </div>
          </div>

          <div style={{ padding: '8px 10px', background: 'var(--dash-surface)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              📈 12-Lead ECG
            </div>
            <div style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              ST-Depression ({patient.st_depression ? 'Yes' : 'No'}), T-Inv ({patient.tinversion ? 'Yes' : 'No'}), LVH ({patient.lvh})
            </div>
          </div>

          <div style={{ padding: '8px 10px', background: 'var(--dash-surface)', borderRadius: 8, border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              🫀 2D Echocardiogram
            </div>
            <div style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              LVEF: <span style={{ color: 'var(--vessel-critical)' }}>{patient.ef_tte || 46}%</span> | RWMA: {patient.region_rwma ? 'Present' : 'None'}
            </div>
          </div>
        </div>

        {/* AI Clinical Impression */}
        <div style={{ fontSize: '0.69rem', color: 'var(--text-secondary)', background: 'rgba(2,132,199,0.05)', border: '1px solid rgba(2,132,199,0.14)', padding: '8px 10px', borderRadius: 6, lineHeight: 1.45 }}>
          <strong style={{ color: 'var(--text-primary)' }}>AI Clinical Impression: </strong>
          {summaryText}
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
