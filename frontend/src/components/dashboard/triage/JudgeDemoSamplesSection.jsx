import { Sparkles, FileCheck2, ShieldAlert, ExternalLink, Cloud } from 'lucide-react';
import { SAMPLE_DOC_STORAGE_URLS } from '../../../services/clinicalDocumentStorageService';

/**
 * JudgeDemoSamplesSection — quick 1-click test cards for hackathon judging.
 * Provides instant parsing test and direct PDF inspection links for:
 * 1. Valid Cardiac Diagnostic Report
 * 2. Unrelated Dental Hygiene Invoice
 */
export default function JudgeDemoSamplesSection({ onSelectSample }) {
  return (
    <div
      style={{
        background: 'var(--dash-surface-2)',
        border: '1.5px solid var(--dash-border)',
        borderRadius: 12,
        padding: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles style={{ width: 15, height: 15, color: 'var(--ai-accent)' }} />
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}
          >
            Judge Demo Sample Documents
          </span>
        </div>
        <span
          style={{
            fontSize: '0.64rem',
            padding: '2px 6px',
            background: 'rgba(100,116,139,0.1)',
            color: 'var(--text-muted)',
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          1-Click Test
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Sample 1: Valid Cardiac Diagnostic Report */}
        <div
          style={{
            padding: '12px 14px',
            background: 'rgba(2, 132, 199, 0.04)',
            border: '1.5px solid rgba(2, 132, 199, 0.22)',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileCheck2 style={{ width: 18, height: 18, color: 'var(--ai-accent)', flexShrink: 0 }} />
              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Sample 1: Cardiac Diagnostic Report
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Valid · Blood Chemistry (LDL 164), 12-Lead ECG, Echo (EF 46%)
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'var(--vessel-safe-bg)',
                color: 'var(--vessel-safe)',
                border: '1px solid var(--vessel-safe-border)',
                flexShrink: 0,
              }}
            >
              Pass Expected
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <button
              type="button"
              onClick={() => onSelectSample('valid')}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '6px 12px',
                background: 'var(--ai-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
              }}
            >
              ⚡ Test Parsing
            </button>
            <a
              href={SAMPLE_DOC_STORAGE_URLS.valid}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Supabase Cloud Storage PDF"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                background: 'var(--dash-surface)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--dash-border)',
                borderRadius: 7,
                fontSize: '0.74rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Cloud style={{ width: 12, height: 12, color: 'var(--ai-accent)' }} />
              Supabase PDF
              <ExternalLink style={{ width: 11, height: 11 }} />
            </a>
          </div>
        </div>

        {/* Sample 2: Unrelated Dental Invoice */}
        <div
          style={{
            padding: '12px 14px',
            background: 'rgba(239, 68, 68, 0.04)',
            border: '1.5px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert style={{ width: 18, height: 18, color: 'var(--vessel-critical)', flexShrink: 0 }} />
              <div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Sample 2: Dental Hygiene Invoice
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Unrelated · Commercial dental invoice & routine periodontal cleaning
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'var(--vessel-critical-bg)',
                color: 'var(--vessel-critical)',
                border: '1px solid var(--vessel-critical-border)',
                flexShrink: 0,
              }}
            >
              Rejection Test
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <button
              type="button"
              onClick={() => onSelectSample('invalid')}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '6px 12px',
                background: 'var(--vessel-critical)',
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
              }}
            >
              ⚡ Test Negative Filter
            </button>
            <a
              href={SAMPLE_DOC_STORAGE_URLS.invalid}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Supabase Cloud Storage PDF"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                background: 'var(--dash-surface)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--dash-border)',
                borderRadius: 7,
                fontSize: '0.74rem',
                fontWeight: 600,
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Cloud style={{ width: 12, height: 12, color: 'var(--vessel-critical)' }} />
              Supabase PDF
              <ExternalLink style={{ width: 11, height: 11 }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
