import { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  TrendingDown, 
  ShieldAlert, 
  ExternalLink,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getPatientEhrRecords } from '../../../services/ehrStorageService';

/**
 * CommittedEhrSection — Shows patient EHR history.
 * If nothing has been committed yet, explicitly informs the physician with clear instructions.
 * If records exist, displays each committed encounter card which can be clicked to view details.
 */
export default function CommittedEhrSection({
  patient,
  onOpenReportModal,
  onReplayRecord,
  refreshTrigger = 0,
}) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecords() {
      if (!patient?.id) return;
      setLoading(true);
      try {
        const data = await getPatientEhrRecords(patient.id);
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('[CommittedEhrSection] Failed to load EHR records:', err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, [patient?.id, refreshTrigger]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        border: '1.5px solid var(--dash-border)',
        boxShadow: 'var(--dash-shadow-sm)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileText style={{ width: 15, height: 15, color: '#0284c7' }} />
          </div>
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.86rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
              }}
            >
              Committed EHR History & Records
            </h4>
            <span style={{ fontSize: '0.66rem', color: '#64748b' }}>
              Physician-committed treatment plans & verification audit trail
            </span>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.66rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: 6,
            background: records.length > 0 ? '#ecfdf5' : '#f1f5f9',
            color: records.length > 0 ? '#047857' : '#64748b',
            border: `1px solid ${records.length > 0 ? '#a7f3d0' : '#e2e8f0'}`,
          }}
        >
          {records.length > 0 ? `${records.length} Committed` : '0 Committed'}
        </span>
      </div>

      {/* Body Content */}
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '0.74rem' }}>
            Fetching patient audit trail...
          </div>
        ) : records.length === 0 ? (
          /* Empty State Notice */
          <div
            style={{
              padding: '16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1.5px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <FileText style={{ width: 18, height: 18 }} />
            </div>

            <div>
              <p
                style={{
                  fontSize: '0.80rem',
                  fontWeight: 800,
                  color: '#334155',
                  margin: '0 0 4px',
                }}
              >
                You have not committed any treatment plan or report for this patient yet.
              </p>
              <p
                style={{
                  fontSize: '0.70rem',
                  color: '#64748b',
                  margin: 0,
                  maxWidth: 420,
                  lineHeight: 1.45,
                }}
              >
                Adjust physiological targets in the <strong>"What-If" Simulator</strong> above (Systolic BP, LDL Cholesterol, Smoking Cessation) and click <strong>"Commit to EHR"</strong> to create an immutable verified clinical record.
              </p>
            </div>
          </div>
        ) : (
          /* List of committed records */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {records.map((record, index) => {
              const dateStr = record.created_at
                ? new Date(record.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent Session';

              const rrr = record.relative_risk_reduction != null
                ? Math.round(record.relative_risk_reduction)
                : 43;

              return (
                <div
                  key={record.id || index}
                  onClick={() => onOpenReportModal?.(record)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(56, 189, 248, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(15,23,42,0.04)';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: '0.70rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          background: '#f1f5f9',
                          padding: '2px 7px',
                          borderRadius: 5,
                        }}
                      >
                        Visit #{record.visit_number || records.length - index}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock style={{ width: 11, height: 11 }} />
                        {dateStr}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', color: '#334155' }}>
                      <span>BP Target: <strong>{record.target_bp || 120} mmHg</strong></span>
                      <span>•</span>
                      <span>LDL Target: <strong>{record.target_ldl || 70} mg/dL</strong></span>
                      <span>•</span>
                      <span>Smoking: <strong>{record.stop_smoking ? 'Cessation' : 'Active'}</strong></span>
                    </div>
                  </div>

                  {/* Right badge & action arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 8px',
                        borderRadius: 8,
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        color: '#047857',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}
                    >
                      <TrendingDown style={{ width: 13, height: 13 }} />
                      <span>-{rrr}% Risk</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: '0.70rem',
                        fontWeight: 700,
                        color: '#0284c7',
                      }}
                    >
                      <span>View</span>
                      <ChevronRight style={{ width: 13, height: 13 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
