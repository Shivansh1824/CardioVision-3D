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
  style,
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
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 253, 250, 0.40) 50%, rgba(255, 255, 255, 0.82) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: 18,
        border: '1.5px solid rgba(255, 255, 255, 0.90)',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
        overflow: 'hidden',
        height: '100%',
        minHeight: 0,
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, flex: 1 }}>
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
              flexShrink: 0,
              boxShadow: '0 2px 5px rgba(2, 132, 199, 0.08)',
            }}
          >
            <FileText style={{ width: 15, height: 15, color: '#0284c7' }} />
          </div>
          <div style={{ minWidth: 0, flex: 1, paddingRight: 6 }}>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.86rem',
                fontWeight: 800,
                color: '#0f172a',
                margin: 0,
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Committed EHR History & Records
            </h4>
            <span
              style={{
                fontSize: '0.64rem',
                color: '#64748b',
                display: 'block',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Verified clinical audit trail
            </span>
          </div>
        </div>

        {/* X Committed Badge (Strictly 1 Line, No Overlap) */}
        <span
          style={{
            fontSize: '0.64rem',
            fontWeight: 800,
            padding: '3px 9px',
            borderRadius: 6,
            background: records.length > 0 ? '#ecfdf5' : '#f8fafc',
            color: records.length > 0 ? '#047857' : '#475569',
            border: `1px solid ${records.length > 0 ? '#a7f3d0' : '#e2e8f0'}`,
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            flexShrink: 0,
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: records.length > 0 ? '#10b981' : '#94a3b8',
            }}
          />
          {records.length > 0 ? `${records.length} Committed` : '0 Committed'}
        </span>
      </div>

      {/* Body Content */}
      <div
        className="custom-scrollbar"
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          justifyContent: records.length === 0 ? 'center' : 'flex-start',
        }}
      >
        {loading ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b', fontSize: '0.74rem' }}>
            Fetching patient audit trail...
          </div>
        ) : records.length === 0 ? (
          /* Empty State Notice with Generous Padding & Space */
          <div
            style={{
              padding: '18px 20px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1.5px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 9,
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
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <FileText style={{ width: 17, height: 17 }} />
            </div>

            <div style={{ maxWidth: 440, width: '100%' }}>
              <p
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#334155',
                  margin: '0 0 6px',
                  lineHeight: 1.35,
                }}
              >
                You have not committed any treatment plan or report for this patient yet.
              </p>
              <p
                style={{
                  fontSize: '0.72rem',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Adjust physiological targets in the <strong>"What-If" Simulator</strong> above (Systolic BP, LDL Cholesterol, Smoking Cessation) and click <strong>"Commit to EHR"</strong> to create an immutable verified clinical record.
              </p>
            </div>
          </div>
        ) : (
          /* List of committed records with Smooth Scroll Effect */
          <div
            className="custom-scrollbar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              maxHeight: 250,
              overflowY: 'auto',
              paddingRight: 3,
            }}
          >
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
