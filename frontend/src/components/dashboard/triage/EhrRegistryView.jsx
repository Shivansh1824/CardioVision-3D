import { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  TrendingDown, 
  ArrowRight, 
  Search, 
  Activity, 
  Printer, 
  CheckCircle2, 
  User,
  ShieldCheck
} from 'lucide-react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { getAllCommittedEhrRecords, getLocalRecords, clearLocalEhrRecords } from '../../../services/ehrStorageService';
import ClinicalReportModal from '../clinical/ClinicalReportModal';

/**
 * EhrRegistryView — Main dashboard view for all committed hospital EHR plans.
 * Allows attending cardiologists to audit past prescriptions, track longitudinal progress,
 * and reprint clinical reports.
 */
export default function EhrRegistryView({ onSelectPatientForAnalysis }) {
  const [records, setRecords] = useState(() => {
    try {
      return getLocalRecords();
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRecordForPdf, setSelectedRecordForPdf] = useState(null);

  const loadRecords = async () => {
    try {
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([]), 1500));
      const fetchPromise = getAllCommittedEhrRecords();
      const all = await Promise.race([fetchPromise, timeoutPromise]);
      setRecords(Array.isArray(all) ? all : []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleClearLocalCache = async () => {
    clearLocalEhrRecords();
    await loadRecords();
  };

  const filteredRecords = records.filter((r) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      r.patient_name?.toLowerCase().includes(q) ||
      r.patient_code?.toLowerCase().includes(q) ||
      r.plan_title?.toLowerCase().includes(q) ||
      r.doctor_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Header & Search ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: 16,
        }}
      >
        <div>
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
            Hospital Electronic Health Records (EHR) Registry
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0' }}>
            Archived cardiovascular encounters, committed "What-If" treatment plans, and longitudinal outcomes
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 15,
                height: 15,
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records by patient or MRN..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: '0.78rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={loadRecords}
            title="Refresh EHR Records from Database"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#334155',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#94a3b8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
          >
            <RotateCcw style={{ width: 13, height: 13 }} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* ── Table / Cards List (Smooth internal scroll) ── */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 4,
        }}
      >
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
            Loading hospital electronic health records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px dashed #cbd5e1',
              color: '#64748b',
            }}
          >
            <FileText style={{ width: 36, height: 36, color: '#cbd5e1', margin: '0 auto 10px' }} />
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
              No Committed EHR Records Found
            </div>
            <div style={{ fontSize: '0.78rem', marginTop: 4 }}>
              When an attending cardiologist tests treatment scenarios in the 3D Simulator and clicks "Commit to EHR", permanent timestamped visit files will appear here.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredRecords.map((record) => {
              const dateStr = new Date(record.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={record.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.03)';
                  }}
                >
                  {/* Left: Patient Details & Visit Type */}
                  <div style={{ minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 800,
                          color: '#0f172a',
                        }}
                      >
                        {record.patient_name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#475569',
                          background: '#f1f5f9',
                          padding: '1px 6px',
                          borderRadius: 4,
                          border: '1px solid #cbd5e1',
                        }}
                      >
                        {record.patient_code}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#0284c7',
                          background: '#e0f2fe',
                          padding: '1px 7px',
                          borderRadius: 4,
                        }}
                      >
                        Visit #{record.visit_number || 1}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: 4 }}>
                      {record.visit_type || record.plan_title}
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
                      Logged by {record.doctor_name || 'Dr. Shivansh Rana, MD'} • {dateStr}
                    </div>
                  </div>

                  {/* Center: Vitals & Outcomes Delta */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 20,
                      background: '#f8fafc',
                      padding: '8px 16px',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                        BP INTERVENTION
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                        {record.baseline_bp} ➔ <span style={{ color: '#059669' }}>{record.target_bp}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                        LDL CHOLESTEROL
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                        {record.baseline_ldl} ➔ <span style={{ color: '#059669' }}>{record.target_ldl}</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>
                        CAD RISK TRAJECTORY
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>
                        {record.baseline_cad_risk}% ➔ {record.simulated_cad_risk}% (-{record.risk_reduction_pct}%)
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => setSelectedRecordForPdf(record)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '7px 12px',
                        borderRadius: 8,
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#334155',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#94a3b8';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#ffffff';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                    >
                      <FileText style={{ width: 13, height: 13, color: '#0284c7' }} />
                      <span>Export PDF</span>
                    </button>

                    <button
                      onClick={() => onSelectPatientForAnalysis?.(record)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 14px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 6px rgba(225,29,72,0.25)',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(225,29,72,0.35)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 2px 6px rgba(225,29,72,0.25)';
                      }}
                    >
                      <span>Open 3D Analysis</span>
                      <ArrowRight style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Modal */}
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
