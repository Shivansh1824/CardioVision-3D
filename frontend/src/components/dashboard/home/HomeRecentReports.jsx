import { useState, useEffect } from 'react';
import { FileText, ArrowRight, ExternalLink, Activity } from 'lucide-react';
import { getLocalRecords } from '../../../services/ehrStorageService';
import ClinicalReportModal from '../clinical/ClinicalReportModal';

/**
 * HomeRecentReports — Displays genuine committed patient treatment reports only.
 * - Strictly zero synthetic placeholders
 * - Clicking a genuine report opens the official ClinicalReportModal
 * - If no committed records exist, displays a clean clinical empty state
 */
export default function HomeRecentReports({ onGoToStudio, onGoToRecords }) {
  const [records, setRecords] = useState(() => {
    try {
      return getLocalRecords();
    } catch {
      return [];
    }
  });

  const [selectedRecordForPdf, setSelectedRecordForPdf] = useState(null);

  useEffect(() => {
    try {
      const all = getLocalRecords();
      setRecords(all);
    } catch (_) {}
  }, []);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 16,
        border: '1px solid rgba(226, 232, 240, 0.85)',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'rgba(2, 132, 199, 0.1)',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText size={15} />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              Committed Patient Reports
            </h3>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              {records.length} Verified EHR Plan{records.length === 1 ? '' : 's'}
            </div>
          </div>
        </div>

        {records.length > 0 && (
          <button
            onClick={onGoToRecords}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284c7',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: 0,
            }}
          >
            <span>All Records</span>
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* ── Content: Genuine records or Clean Empty State ── */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          paddingRight: 4,
        }}
      >
        {records.length === 0 ? (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              background: 'rgba(248, 250, 252, 0.6)',
              borderRadius: 10,
              border: '1px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <FileText size={28} color="#94a3b8" />
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              No Committed Reports Yet
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', maxWidth: 220, lineHeight: 1.4 }}>
              When you simulate therapies in 3D Heart Studio and click "Commit to EHR", permanent reports appear here.
            </p>
            <button
              onClick={onGoToStudio}
              style={{
                marginTop: 4,
                padding: '6px 12px',
                borderRadius: 7,
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 2px 6px rgba(225, 29, 72, 0.25)',
              }}
            >
              <span>Open 3D Studio</span>
              <ArrowRight size={11} />
            </button>
          </div>
        ) : (
          records.map((rec) => {
            const dateStr = rec.created_at
              ? new Date(rec.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Today';

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecordForPdf(rec)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 9,
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#0284c7';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(2, 132, 199, 0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                      {rec.patient_name}
                    </span>
                    <span style={{ fontSize: '0.64rem', color: '#64748b', background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>
                      {rec.patient_code}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: 2 }}>
                    {rec.plan_title || 'Therapeutic Protocol Committed'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                    {dateStr}
                  </span>
                  <ExternalLink size={13} color="#0284c7" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Official Branded Clinical PDF Report Modal ── */}
      {selectedRecordForPdf && (
        <ClinicalReportModal
          isOpen={!!selectedRecordForPdf}
          onClose={() => setSelectedRecordForPdf(null)}
          patient={{
            id: selectedRecordForPdf.patient_id,
            patient_code: selectedRecordForPdf.patient_code,
            name: selectedRecordForPdf.patient_name,
            bp: selectedRecordForPdf.baseline_bp,
            ldl: selectedRecordForPdf.baseline_ldl,
          }}
          simulationResult={{
            baseCad: selectedRecordForPdf.baseline_cad_risk,
            simCad: selectedRecordForPdf.simulated_cad_risk,
            relativeRiskReduction: selectedRecordForPdf.risk_reduction_pct,
          }}
          targetBp={selectedRecordForPdf.target_bp}
          targetLdl={selectedRecordForPdf.target_ldl}
          stopSmoking={selectedRecordForPdf.smoker_intervention}
        />
      )}
    </div>
  );
}
