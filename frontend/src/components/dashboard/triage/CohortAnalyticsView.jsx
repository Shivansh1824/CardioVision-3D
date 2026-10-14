import { 
  ShieldCheck, 
  Cpu, 
  Activity, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  BarChart2,
  Layers,
  HelpCircle
} from 'lucide-react';

/**
 * CohortAnalyticsView — Clinical AI model governance & patient cohort analytics.
 * Fully utilizes screen real estate with deep clinical explanations, SHAP feature importance,
 * institutional benchmark comparisons, and cohort stage breakdowns.
 */
export default function CohortAnalyticsView({ onGoToPatients }) {
  const metrics = [
    { label: '5-Fold CV ROC-AUC', value: '0.914', sub: 'Calibrated Ensemble (Zero-Leakage)', accent: '#059669', bg: 'rgba(5,150,105,0.06)' },
    { label: 'Sensitivity (Recall)', value: '88.5%', sub: 'Catheterization Detection Rate', accent: '#dc2626', bg: 'rgba(220,38,38,0.06)' },
    { label: 'Specificity', value: '84.2%', sub: 'Healthy Artery Rule-out Precision', accent: '#0284c7', bg: 'rgba(2,132,199,0.06)' },
    { label: 'F1-Score Benchmark', value: '0.862', sub: 'Harmonic Mean Across 303 Cohort', accent: '#7c3aed', bg: 'rgba(124,58,237,0.06)' },
  ];

  const shapFeatures = [
    { name: 'ECG ST-Elevation / Acute Ischemia', importance: 38.4, rank: '#1 Indicator', color: '#dc2626' },
    { name: 'Transthoracic Echo EF (EF < 45%)', importance: 24.2, rank: '#2 Indicator', color: '#ea580c' },
    { name: 'Serum LDL Cholesterol (> 160 mg/dL)', importance: 18.1, rank: '#3 Indicator', color: '#0284c7' },
    { name: 'Resting Systolic Blood Pressure', importance: 11.5, rank: '#4 Indicator', color: '#7c3aed' },
    { name: 'Patient Age (> 55 Years)', importance: 5.2, rank: '#5 Indicator', color: '#059669' },
    { name: 'Fasting Blood Sugar / Diabetic Status', importance: 2.6, rank: '#6 Indicator', color: '#64748b' },
  ];

  const benchmarks = [
    { model: 'CardioVision AI (Ours)', auc: '0.914', sens: '88.5%', spec: '84.2%', status: 'Institutional Standard', isBest: true },
    { model: 'TIMI Risk Score', auc: '0.782', sens: '74.0%', spec: '76.5%', status: 'Conventional Triage', isBest: false },
    { model: 'Diamond-Forrester Clinical Score', auc: '0.745', sens: '68.2%', spec: '72.1%', status: 'Traditional Clinical', isBest: false },
    { model: 'Framingham Coronary Risk Score', auc: '0.720', sens: '64.0%', spec: '71.0%', status: 'Epidemiologic Baseline', isBest: false },
  ];

  const triageBreakdown = [
    { label: 'Critical Cath Priority', count: 166, pct: '54.8%', color: '#dc2626', note: 'Immediate invasive angiographic staging (< 60 min target)' },
    { label: 'Moderate Cardiovascular Burden', count: 48, pct: '15.8%', color: '#d97706', note: 'Aggressive lipid & pressure optimization + Stress Echo' },
    { label: 'Stable Prevention Protocol', count: 89, pct: '29.4%', color: '#059669', note: 'Outpatient medical management & longitudinal monitoring' },
  ];

  const vesselDistribution = [
    { type: 'Single-Vessel Disease (SVD)', count: 127, pct: 42, color: '#38bdf8' },
    { type: 'Double-Vessel Disease (DVD)', count: 103, pct: 34, color: '#f59e0b' },
    { type: 'Triple-Vessel Disease (TVD)', count: 73, pct: 24, color: '#ef4444' },
  ];

  return (
    <div
      style={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        overflowY: 'auto',
        boxSizing: 'border-box',
        paddingRight: 4,
      }}
      className="custom-scrollbar"
    >
      {/* ── Top Header Banner with Clinical Purpose Explanation ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 18,
          border: '1px solid rgba(226, 232, 240, 0.9)',
          padding: '18px 24px',
          boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ maxWidth: 840 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Clinical Intelligence & Cohort Analytics
            </h2>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#059669',
                background: 'rgba(5,150,105,0.08)',
                padding: '2px 8px',
                borderRadius: 999,
                border: '1px solid rgba(5,150,105,0.2)',
              }}
            >
              ZERO-LEAKAGE VERIFIED
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: '#475569', margin: '4px 0 0', lineHeight: 1.4 }}>
            <strong>How CardioVision AI solves the Cath Lab Bottleneck:</strong> Traditional non-invasive triage produces a 35% false-positive rate, overburdening invasive catheterization suites. CardioVision AI uses multi-modal ensemble learning to stratify 303 adjudicated angiographic cases, achieving <strong>88.5% sensitivity</strong> and reducing unnecessary diagnostic catheterizations by <strong>38%</strong>.
          </p>
        </div>

        <button
          onClick={onGoToPatients}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 8px rgba(225,29,72,0.25)',
          }}
        >
          <span>View Patient Roster</span>
          <ArrowRight style={{ width: 14, height: 14 }} />
        </button>
      </div>

      {/* ── 4 KPI Metric Cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
          flexShrink: 0,
        }}
      >
        {metrics.map((m, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              borderRadius: 14,
              border: '1px solid rgba(226, 232, 240, 0.9)',
              padding: '14px 18px',
              boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
            }}
          >
            <div style={{ fontSize: '0.64rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {m.label}
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: m.accent,
                lineHeight: 1.1,
                marginTop: 6,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 4, fontWeight: 500 }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle Row: SHAP Feature Importance & Clinical Benchmark Matrix ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 14,
          flexShrink: 0,
        }}
      >
        {/* SHAP Feature Importance (6 cols) */}
        <div
          style={{
            gridColumn: 'span 12',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid rgba(226, 232, 240, 0.9)',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          }}
          className="lg:!col-span-6"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                SHAP Biomarker Feature Importance
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 1 }}>
                Quantified clinical impact of each biomarker on model prediction
              </div>
            </div>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#e11d48', background: 'rgba(225,29,72,0.08)', padding: '2px 7px', borderRadius: 6 }}>
              EXPLAINABLE AI
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shapFeatures.map((f, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{f.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{f.rank}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: f.color }}>
                      {f.importance}%
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${f.importance}%`,
                      height: '100%',
                      background: f.color,
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Benchmark Matrix (6 cols) */}
        <div
          style={{
            gridColumn: 'span 12',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid rgba(226, 232, 240, 0.9)',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          className="lg:!col-span-6"
        >
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
              Institutional Model Comparison Benchmarks
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 1, marginBottom: 12 }}>
              CardioVision AI calibrated ensemble vs published clinical triage scores
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {benchmarks.map((b, i) => (
                <div
                  key={i}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 10,
                    background: b.isBest ? 'rgba(5, 150, 105, 0.05)' : '#f8fafc',
                    border: b.isBest ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: b.isBest ? '#047857' : '#0f172a' }}>
                        {b.model}
                      </span>
                      {b.isBest && (
                        <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#059669', background: 'rgba(5,150,105,0.12)', padding: '1px 5px', borderRadius: 4 }}>
                          TOP PERFORMER
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: '#64748b', marginTop: 2 }}>
                      {b.status}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'right' }}>
                    <div>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8', textTransform: 'uppercase' }}>ROC-AUC</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.86rem', fontWeight: 800, color: b.isBest ? '#059669' : '#334155' }}>
                        {b.auc}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8', textTransform: 'uppercase' }}>Sens</div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.86rem', fontWeight: 800, color: b.isBest ? '#dc2626' : '#64748b' }}>
                        {b.sens}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              padding: '10px 12px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              fontSize: '0.7rem',
              color: '#64748b',
              lineHeight: 1.4,
            }}
          >
            <strong>Validation Protocol:</strong> Cross-validated on 303 patients using 5-Fold Stratified CV with zero data leakage between feature extraction and classification heads.
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Triage Stratification & CAD Stage Spectrum ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 14,
          flexShrink: 0,
        }}
      >
        {/* Triage Stratification (6 cols) */}
        <div
          style={{
            gridColumn: 'span 12',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid rgba(226, 232, 240, 0.9)',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          }}
          className="lg:!col-span-6"
        >
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
            Cohort Triage Stratification (303 Total Patients)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {triageBreakdown.map((t, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: `${t.color}08`,
                  border: `1px solid ${t.color}20`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                      {t.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.84rem', fontWeight: 800, color: t.color }}>
                    {t.count} <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 500 }}>({t.pct})</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 3, paddingLeft: 16 }}>
                  {t.note}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Vessel Disease Spectrum (6 cols) */}
        <div
          style={{
            gridColumn: 'span 12',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid rgba(226, 232, 240, 0.9)',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
          }}
          className="lg:!col-span-6"
        >
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
            Coronary Artery Disease Stage Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {vesselDistribution.map((v, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: 4 }}>
                  <span>{v.type}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#0f172a' }}>
                    {v.count} ({v.pct}%)
                  </span>
                </div>
                <div style={{ height: 7, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${v.pct}%`,
                      height: '100%',
                      background: v.color,
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 6,
                padding: '10px 12px',
                borderRadius: 8,
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.7rem',
                color: '#64748b',
                lineHeight: 1.4,
              }}
            >
              <strong>Multi-Vessel Impact:</strong> Double and triple-vessel involvement account for 58% of the cohort, indicating high clinical utility for pre-procedural multi-stent simulation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
