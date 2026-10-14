import { useState, useMemo } from 'react';
import { Search, X, User, Heart, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import patientNames from '../../../data/patientNames.json';

/**
 * PatientSelectModal — In-Studio Patient Switcher Modal.
 * Allows instant search and filtering of all 303 cohort patients
 * into Critical, Medium (Moderate), and Okay (Stable) categories.
 */
export default function PatientSelectModal({
  isOpen,
  onClose,
  onSelectPatient,
  currentPatientId,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all'); // 'all' | 'critical' | 'moderate' | 'stable'

  // Generate deterministic 303 patients with clinical categorization
  const patientRoster = useMemo(() => {
    const list = [];
    for (let i = 1; i <= 303; i++) {
      const code = `PT-${String(i).padStart(3, '0')}`;
      const name = patientNames[code] || patientNames[String(i)] || `Patient ${code}`;
      const isCritical = i <= 166;
      const isModerate = i > 166 && i <= 214;
      const triage = isCritical ? 'critical' : isModerate ? 'moderate' : 'stable';
      list.push({
        id: i,
        patient_code: code,
        name,
        age: 48 + ((i * 7) % 35),
        sex: i % 3 === 0 ? 'Female' : 'Male',
        bp: isCritical ? 148 + (i % 25) : isModerate ? 138 + (i % 15) : 118 + (i % 12),
        ldl: isCritical ? 162 + (i % 38) : isModerate ? 135 + (i % 20) : 95 + (i % 25),
        ef_tte: isCritical ? 38 + (i % 10) : isModerate ? 48 + (i % 8) : 58 + (i % 10),
        st_elevation: isCritical ? 1 : 0,
        typical_chest_pain: isCritical ? 1 : (i % 2 === 0 ? 1 : 0),
        triage,
      });
    }
    return list;
  }, []);

  const counts = useMemo(() => {
    return {
      all: 303,
      critical: 166,
      moderate: 48,
      stable: 89,
    };
  }, []);

  const filtered = useMemo(() => {
    return patientRoster.filter((p) => {
      if (category !== 'all' && p.triage !== category) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.patient_code.toLowerCase().includes(q) ||
          String(p.age).includes(q)
        );
      }
      return true;
    });
  }, [patientRoster, category, search]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '82vh',
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid rgba(226, 232, 240, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modal-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modal-pop {
            from { opacity: 0; transform: scale(0.96) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* ── Modal Header ── */}
        <div
          style={{
            padding: '18px 24px 14px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Select Patient for 3D Studio
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
              Choose a cohort patient to simulate real-time vascular anatomy & stent geometry
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* ── Search & Filter Tabs ── */}
        <div style={{ padding: '14px 24px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
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
              placeholder="Search by name, MRN code, or age..."
              style={{
                width: '100%',
                padding: '8px 14px 8px 36px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                fontSize: '0.82rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Filter Pills: Critical, Medium, Okay */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { key: 'all', label: 'All Patients', count: counts.all, color: '#475569' },
              { key: 'critical', label: 'Critical', count: counts.critical, color: '#dc2626' },
              { key: 'moderate', label: 'Medium', count: counts.moderate, color: '#d97706' },
              { key: 'stable', label: 'Okay / Stable', count: counts.stable, color: '#059669' },
            ].map((tab) => {
              const active = category === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setCategory(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 12px',
                    borderRadius: 8,
                    border: active ? `1px solid ${tab.color}40` : '1px solid #e2e8f0',
                    background: active ? `${tab.color}12` : '#ffffff',
                    color: active ? tab.color : '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      background: active ? `${tab.color}20` : '#f1f5f9',
                      color: active ? tab.color : '#94a3b8',
                      padding: '1px 5px',
                      borderRadius: 4,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Patient List ── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 24px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
          className="custom-scrollbar"
        >
          {filtered.slice(0, 50).map((patient) => {
            const isSelected = currentPatientId === patient.id;
            const badgeColor =
              patient.triage === 'critical'
                ? '#dc2626'
                : patient.triage === 'moderate'
                ? '#d97706'
                : '#059669';

            return (
              <div
                key={patient.id}
                onClick={() => {
                  onSelectPatient(patient);
                  onClose();
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: isSelected ? 'rgba(225, 29, 72, 0.05)' : '#ffffff',
                  border: isSelected
                    ? '1.5px solid #e11d48'
                    : '1px solid rgba(226, 232, 240, 0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.85)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: badgeColor,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                        {patient.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.64rem',
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '1px 5px',
                          borderRadius: 4,
                        }}
                      >
                        {patient.patient_code}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                      {patient.age}y · {patient.sex} · BP {patient.bp} · LDL {patient.ldl} · EF {patient.ef_tte}%
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      color: badgeColor,
                      background: `${badgeColor}12`,
                      padding: '2px 8px',
                      borderRadius: 999,
                      textTransform: 'uppercase',
                    }}
                  >
                    {patient.triage === 'moderate' ? 'Medium' : patient.triage}
                  </span>
                  {isSelected && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e11d48' }}>
                      Active
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
