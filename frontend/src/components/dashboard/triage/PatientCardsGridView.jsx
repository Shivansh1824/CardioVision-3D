import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Heart, 
  CheckCircle2, 
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../../services/supabaseClient';
import { getAllCommittedEhrRecords } from '../../../services/ehrStorageService';
import { getAllPatients, getTriageCounts } from '../../../services/patientDataService';

export default function PatientCardsGridView({
  selectedId,
  onSelectPatient,
  onOpenStudio,
  onAddPatient,
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'critical' | 'moderate' | 'stable'
  const [searchQuery, setSearchQuery] = useState('');
  const [ehrCountMap, setEhrCountMap] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync EHR counts & update on commit
  useEffect(() => {
    async function loadEhr() {
      try {
        const ehrRecords = await getAllCommittedEhrRecords();
        const counts = {};
        ehrRecords.forEach((r) => {
          counts[r.patient_id] = (counts[r.patient_id] || 0) + 1;
        });
        setEhrCountMap(counts);
      } catch (_) {}
    }
    loadEhr();

    const handleUpdate = () => {
      setRefreshKey((k) => k + 1);
      loadEhr();
    };
    window.addEventListener('cv_activity_updated', handleUpdate);
    return () => window.removeEventListener('cv_activity_updated', handleUpdate);
  }, []);

  const counts = useMemo(() => getTriageCounts(), [refreshKey]);

  // Strict clinical priority sorting: Critical -> Moderate -> Stable, then CAD risk % descending
  const filteredPatients = useMemo(() => {
    return getAllPatients({ filterTier: activeFilter, searchQuery });
  }, [activeFilter, searchQuery, refreshKey]);

  const filterTabs = [
    { id: 'all', label: 'All Patients', count: counts.all, color: '#0f172a', bg: '#f1f5f9' },
    { id: 'critical', label: 'Critical', count: counts.critical, color: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)' },
    { id: 'moderate', label: 'Moderate', count: counts.moderate, color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
    { id: 'stable', label: 'Stable', count: counts.stable, color: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        gap: 12,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Top Bar Control Panel (Search, Filters, Action) ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(248, 250, 252, 0.45) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 1px 0 1px rgba(255, 255, 255, 0.95) inset',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          flexShrink: 0,
        }}
      >
        {/* Left: Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: isSelected
                    ? `1.5px solid ${tab.color}`
                    : '1px solid rgba(226, 232, 240, 0.9)',
                  background: isSelected ? tab.color : 'rgba(255, 255, 255, 0.85)',
                  color: isSelected ? '#ffffff' : '#334155',
                  fontSize: '0.74rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(15, 23, 42, 0.12)' : 'none',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.64rem',
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: isSelected ? 'rgba(255, 255, 255, 0.25)' : tab.bg,
                    color: isSelected ? '#ffffff' : tab.color,
                    fontWeight: 800,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search Box & New Patient Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 320px', justifyContent: 'flex-end' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 280,
            }}
          >
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="Search by name, PT code, vessel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 30px',
                borderRadius: 8,
                border: '1px solid rgba(203, 213, 225, 0.9)',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.74rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0284c7';
                e.target.style.boxShadow = '0 0 0 2px rgba(2, 132, 199, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(203, 213, 225, 0.9)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {onAddPatient && (
            <button
              onClick={onAddPatient}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '7px 12px',
                borderRadius: 8,
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              }}
            >
              <Plus size={13} />
              <span>Add Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Cards Grid Container ── */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 4,
          boxSizing: 'border-box',
        }}
      >
        {filteredPatients.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16,
              border: '1px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              margin: '20px 0',
            }}
          >
            <User size={36} color="#94a3b8" />
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>
              No patients found
            </div>
            <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>
              No active cohort patients matched "{searchQuery}" under the selected {activeFilter} filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: 12,
              paddingBottom: 16,
            }}
          >
            {filteredPatients.map((p) => {
              const isCritical = p._triage === 'critical';
              const isModerate = p._triage === 'moderate';
              const tierColor = isCritical ? '#e11d48' : isModerate ? '#d97706' : '#059669';
              const ehrCount = ehrCountMap[p.id] || 0;
              const isSelected = selectedId === p.id;

              return (
                <div
                  key={p.id}
                  style={{
                    background: isCritical
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(254, 242, 242, 0.50) 100%)'
                      : isModerate
                      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(254, 243, 199, 0.40) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(240, 253, 244, 0.40) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: 14,
                    border: isSelected ? '2px solid #0f172a' : '1px solid rgba(255, 255, 255, 0.85)',
                    padding: '14px 16px',
                    boxShadow: '0 2px 10px -2px rgba(15, 23, 42, 0.04), 0 1px 0 1px rgba(255, 255, 255, 0.9) inset',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 10,
                    transition: 'all 0.16s ease',
                    position: 'relative',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px -2px rgba(15, 23, 42, 0.08), 0 1px 0 1px rgba(255, 255, 255, 0.95) inset';
                    e.currentTarget.style.borderColor = tierColor;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 10px -2px rgba(15, 23, 42, 0.04), 0 1px 0 1px rgba(255, 255, 255, 0.9) inset';
                    e.currentTarget.style.borderColor = isSelected ? '#0f172a' : 'rgba(255, 255, 255, 0.85)';
                  }}
                >
                  {/* Card Header: Patient Identity & Triage Pill */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: isCritical
                              ? 'rgba(225, 29, 72, 0.12)'
                              : isModerate
                              ? 'rgba(217, 119, 6, 0.12)'
                              : 'rgba(5, 150, 105, 0.12)',
                            color: tierColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            fontFamily: 'JetBrains Mono, monospace',
                            flexShrink: 0,
                          }}
                        >
                          #{String(p.id).padStart(3, '0')}
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.86rem',
                              fontWeight: 800,
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.2,
                            }}
                          >
                            {p.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                            <span
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '0.62rem',
                                color: '#64748b',
                                background: 'rgba(15, 23, 42, 0.05)',
                                padding: '1px 5px',
                                borderRadius: 4,
                                fontWeight: 600,
                              }}
                            >
                              {p.patient_code}
                            </span>
                            <span style={{ fontSize: '0.66rem', color: '#64748b' }}>
                              {p.age}y · {p.sex}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Triage Badge */}
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          padding: '2px 7px',
                          borderRadius: 6,
                          background: isCritical ? '#e11d48' : isModerate ? '#d97706' : '#059669',
                          color: '#ffffff',
                          flexShrink: 0,
                          boxShadow: isCritical ? '0 2px 6px rgba(225, 29, 72, 0.3)' : 'none',
                        }}
                      >
                        {isCritical ? 'CRITICAL' : isModerate ? 'MODERATE' : 'STABLE'}
                      </span>
                    </div>

                    {/* Vascular Diagnosis & Lesion */}
                    <div
                      style={{
                        marginTop: 10,
                        padding: '6px 8px',
                        borderRadius: 7,
                        background: 'rgba(255, 255, 255, 0.75)',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '0.68rem',
                        color: isCritical ? '#be123c' : '#334155',
                        fontWeight: 600,
                      }}
                    >
                      <Heart size={12} color={tierColor} style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.vessel}
                      </span>
                    </div>

                    {/* Biomarker Micro-Strip */}
                    <div
                      style={{
                        marginTop: 8,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 6,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          padding: '4px 6px',
                          borderRadius: 6,
                          background: 'rgba(255, 255, 255, 0.65)',
                          border: '1px solid rgba(226, 232, 240, 0.7)',
                        }}
                      >
                        <div style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 600 }}>BP (mmHg)</div>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: p.bp > 140 ? '#e11d48' : '#0f172a' }}>
                          {p.bp}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '4px 6px',
                          borderRadius: 6,
                          background: 'rgba(255, 255, 255, 0.65)',
                          border: '1px solid rgba(226, 232, 240, 0.7)',
                        }}
                      >
                        <div style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 600 }}>EF (TTE)</div>
                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: p.ef_tte < 45 ? '#e11d48' : '#0f172a' }}>
                          {p.ef_tte}%
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '4px 6px',
                          borderRadius: 6,
                          background: 'rgba(255, 255, 255, 0.65)',
                          border: '1px solid rgba(226, 232, 240, 0.7)',
                        }}
                      >
                        <div style={{ fontSize: '0.58rem', color: '#64748b', fontWeight: 600 }}>CAD Risk</div>
                        {p.has_committed_plan ? (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                            <span style={{ fontSize: '0.62rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              {p.cad_risk_pct}%
                            </span>
                            <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#059669' }}>
                              {p.projected_cad_risk}%
                            </span>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: tierColor }}>
                            {p.cad_risk_pct}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Committed EHR Tag if available */}
                    {ehrCount > 0 && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: '0.64rem',
                          color: '#0284c7',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <CheckCircle2 size={11} />
                        <span>{ehrCount} Verified EHR Plan{ehrCount > 1 ? 's' : ''} on Record</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: 3D Studio Launch Button */}
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => {
                        onSelectPatient?.(p);
                        onOpenStudio?.(p);
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: isCritical
                          ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
                          : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: isCritical
                          ? '0 2px 6px rgba(225, 29, 72, 0.25)'
                          : '0 2px 6px rgba(15, 23, 42, 0.15)',
                        transition: 'opacity 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.opacity = '0.92')}
                      onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      <Sparkles size={11} />
                      <span>Launch 3D Studio</span>
                      <ArrowRight size={11} />
                    </button>
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
