import { useState, useEffect } from 'react';
import { 
  History, 
  RotateCcw, 
  Download, 
  CheckCircle2, 
  Calendar, 
  User, 
  ArrowRight, 
  TrendingDown, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { getPatientEhrRecords } from '../../../services/ehrStorageService';

/**
 * EhrHistoryComparison — Longitudinal patient record viewer & comparison panel.
 * Displays past committed physician encounters, side-by-side metric deltas, and 3D replay actions.
 */
export default function EhrHistoryComparison({
  patient,
  currentSimulation,
  onReplaySimulation,
  onExportPdf,
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!patient?.id) return;
      setLoading(true);
      const data = await getPatientEhrRecords(patient.id);
      setRecords(data);
      setLoading(false);
    }
    load();
  }, [patient?.id]);

  const origBp = Number(patient?.bp) || 155;
  const origLdl = Number(patient?.ldl) || 165;
  const origCad = 96;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <History style={{ width: 17, height: 17, color: '#0284c7' }} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Longitudinal EHR History & Comparison
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  background: '#e0f2fe',
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                {records.length} Visits Logged
              </span>
            </h3>
            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0 }}>
              Chronological electronic health record audit trail for {patient?.name || 'this patient'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Longitudinal Delta Comparison Table */}
        {records.length > 0 || currentSimulation?.isSimulated ? (
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#64748b',
                letterSpacing: '0.04em',
                marginBottom: 8,
              }}
            >
              Multi-Visit Progress Comparison
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.74rem',
                  textAlign: 'left',
                }}
              >
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#475569' }}>Metric</th>
                    <th style={{ padding: '8px 10px', fontWeight: 700, color: '#dc2626' }}>Baseline (Intake)</th>
                    {records.map((r, i) => (
                      <th key={r.id} style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                        Visit #{r.visit_number || i + 1}
                      </th>
                    ))}
                    {currentSimulation?.isSimulated && (
                      <th style={{ padding: '8px 10px', fontWeight: 700, color: '#059669', background: '#ecfdf5' }}>
                        Today's Plan (Live)
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {/* Row: BP */}
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#334155' }}>Systolic BP</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700 }}>{origBp} mmHg</td>
                    {records.map((r) => (
                      <td key={r.id} style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                        {r.target_bp} mmHg
                      </td>
                    ))}
                    {currentSimulation?.isSimulated && (
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 800, color: '#059669', background: '#ecfdf5' }}>
                        {currentSimulation.simulatedBp} mmHg
                      </td>
                    )}
                  </tr>

                  {/* Row: LDL */}
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#334155' }}>LDL Cholesterol</td>
                    <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700 }}>{origLdl} mg/dL</td>
                    {records.map((r) => (
                      <td key={r.id} style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700, color: '#0284c7' }}>
                        {r.target_ldl} mg/dL
                      </td>
                    ))}
                    {currentSimulation?.isSimulated && (
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 800, color: '#059669', background: '#ecfdf5' }}>
                        {currentSimulation.simulatedLdl} mg/dL
                      </td>
                    )}
                  </tr>

                  {/* Row: CAD Risk */}
                  <tr style={{ background: '#fafafa', borderBottom: '1.5px solid #e2e8f0' }}>
                    <td style={{ padding: '9px 10px', fontWeight: 700, color: '#0f172a' }}>Predicted CAD Risk</td>
                    <td style={{ padding: '9px 10px', fontFamily: 'monospace', fontWeight: 800, color: '#dc2626' }}>
                      {origCad}%
                    </td>
                    {records.map((r) => (
                      <td key={r.id} style={{ padding: '9px 10px', fontFamily: 'monospace', fontWeight: 800, color: '#0284c7' }}>
                        {r.simulated_cad_risk}% (-{r.risk_reduction_pct}%)
                      </td>
                    ))}
                    {currentSimulation?.isSimulated && (
                      <td style={{ padding: '9px 10px', fontFamily: 'monospace', fontWeight: 900, color: '#059669', background: '#ecfdf5' }}>
                        {currentSimulation.simulatedCad}% (-{currentSimulation.relativeReduction}%)
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '24px 20px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px dashed #cbd5e1',
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
              No Committed Encounters Yet
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
              Baseline values on record: BP <strong>{origBp} mmHg</strong> • LDL <strong>{origLdl} mg/dL</strong>.<br />
              Adjust target sliders in the <strong>"What-If Simulator"</strong> tab and click <strong>"Commit to EHR"</strong> to save your first clinical consultation.
            </div>
          </div>
        )}

        {/* Chronological Visit Cards */}
        {records.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#64748b',
                letterSpacing: '0.04em',
                marginBottom: 8,
              }}
            >
              Past Physician Encounters
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {records.map((record, index) => {
                const dateStr = new Date(record.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={record.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            background: '#e2e8f0',
                            padding: '2px 7px',
                            borderRadius: 4,
                          }}
                        >
                          Visit #{record.visit_number || records.length - index}
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                          {record.visit_type || record.plan_title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {dateStr}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, fontSize: '0.72rem', color: '#475569' }}>
                        <span>Target BP: <strong>{record.target_bp} mmHg</strong></span>
                        <span>•</span>
                        <span>Target LDL: <strong>{record.target_ldl} mg/dL</strong></span>
                        <span>•</span>
                        <span>CAD Risk: <strong style={{ color: '#059669' }}>{record.simulated_cad_risk}% (-{record.risk_reduction_pct}%)</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {onReplaySimulation && (
                        <button
                          type="button"
                          onClick={() => onReplaySimulation(record)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <RotateCcw style={{ width: 12, height: 12 }} />
                          <span>Replay in 3D</span>
                        </button>
                      )}

                      {onExportPdf && (
                        <button
                          type="button"
                          onClick={() => onExportPdf(record)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '6px 10px',
                            borderRadius: 6,
                            border: '1px solid #0284c7',
                            background: '#f0f9ff',
                            color: '#0284c7',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <FileText style={{ width: 12, height: 12 }} />
                          <span>Report PDF</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
