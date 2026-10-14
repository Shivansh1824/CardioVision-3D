import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { supabase } from '../../../services/supabaseClient';
import { getAllCommittedEhrRecords } from '../../../services/ehrStorageService';
import PatientQueueItem from './PatientQueueItem';
import patientNames from '../../../data/patientNames.json';

const CACHE_KEY = 'cvq_patients_v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const ITEMS_PER_PAGE = 8;

/** Derive triage level from clinical biomarkers */
function getTriageLevel(p) {
  if (p.st_elevation > 0 || p.typical_chest_pain > 0) return 'critical';
  if (p.bp > 140 || p.ldl > 160 || (p.ef_tte && p.ef_tte < 45)) return 'moderate';
  return 'stable';
}

function getBaselinePatients() {
  const list = [];
  for (let i = 1; i <= 303; i++) {
    const code = `PT-${String(i).padStart(3, '0')}`;
    const name = patientNames[code] || patientNames[String(i)] || `Patient ${code}`;
    const isCritical = i <= 166;
    const isModerate = i > 166 && i <= 214;
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
      fbs: 95 + (i % 40),
      htn: isCritical || isModerate ? 1 : 0,
      dm: i % 4 === 0 ? 1 : 0,
      current_smoker: i % 3 === 0 ? 1 : 0,
    });
  }
  return list;
}

export default function PatientQueue({ selectedId, onSelectPatient, onAddPatient }) {
  const [patients, setPatients] = useState(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { data } = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (_) {}
    return getBaselinePatients();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'moderate' | 'stable'
  const [currentPage, setCurrentPage] = useState(1);
  const [ehrCountMap, setEhrCountMap] = useState({});

  async function fetchFromSupabase() {
    if (!supabase) throw new Error('Supabase not configured');
    let { data, error: fetchErr } = await supabase
      .from('patients')
      .select('id, patient_code, name, age, sex, bp, ldl, ef_tte, st_elevation, typical_chest_pain, fbs, htn, dm, current_smoker')
      .order('id', { ascending: true });

    if (fetchErr?.message?.includes('name')) {
      const fallback = await supabase
        .from('patients')
        .select('id, patient_code, age, sex, bp, ldl, ef_tte, st_elevation, typical_chest_pain, fbs, htn, dm, current_smoker')
        .order('id', { ascending: true });
      data = fallback.data;
      fetchErr = fallback.error;
    }
    if (fetchErr) throw fetchErr;
    return (data && data.length > 0) ? data : getBaselinePatients();
  }

  // Load with SWR pattern
  useEffect(() => {
    async function load() {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const { data, ts } = JSON.parse(raw);
          if (Array.isArray(data) && data.length > 0) {
            setPatients(data);
            setLoading(false);
            if (Date.now() - ts < CACHE_TTL) return;
          }
        }
      } catch (_) {}

      try {
        const fresh = await fetchFromSupabase();
        setPatients(fresh);
        setLoading(false);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fresh, ts: Date.now() }));
      } catch (err) {
        const baseline = getBaselinePatients();
        setPatients(baseline);
        setLoading(false);
      }

      // Load committed EHR counts
      try {
        const ehrRecords = await getAllCommittedEhrRecords();
        const countsMap = {};
        ehrRecords.forEach((r) => {
          countsMap[r.patient_id] = (countsMap[r.patient_id] || 0) + 1;
        });
        setEhrCountMap(countsMap);
      } catch (_) {}
    }
    load();
  }, []);

  // Compute counts & filtered list
  const resolvedList = useMemo(() => {
    return patients.map((p) => {
      const resolvedName =
        p.name ||
        patientNames[p.patient_code] ||
        patientNames[String(p.id)] ||
        `Patient ${p.patient_code || p.id}`;
      const rawSex = String(p.sex || '').trim().toLowerCase();
      const normalizedSex =
        rawSex === 'fmale' || rawSex === 'female' || rawSex === 'f' ? 'Female' : 'Male';
      return {
        ...p,
        name: resolvedName,
        sex: normalizedSex,
        _triage: getTriageLevel(p),
      };
    });
  }, [patients]);

  const counts = useMemo(() => {
    let critical = 0;
    let moderate = 0;
    let stable = 0;
    resolvedList.forEach((p) => {
      if (p._triage === 'critical') critical++;
      else if (p._triage === 'moderate') moderate++;
      else stable++;
    });
    return { all: resolvedList.length, critical, moderate, stable };
  }, [resolvedList]);

  const filteredPatients = useMemo(() => {
    return resolvedList.filter((p) => {
      if (filter !== 'all' && p._triage !== filter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          p.name?.toLowerCase().includes(q) ||
          p.patient_code?.toLowerCase().includes(q) ||
          String(p.age).includes(q) ||
          p.sex?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [resolvedList, filter, search]);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 18,
        border: '1px solid rgba(226,232,240,0.85)',
        boxShadow: '0 2px 12px rgba(15,23,42,0.04), 0 0 0 1px rgba(255,255,255,0.8) inset',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Top Header & Actions ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Active Patients
          </h2>
          <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '2px 0 0' }}>
            Triage cohort prioritized by urgency, ischemia indicators, and stenosis risk
          </p>
        </div>

        <button
          onClick={onAddPatient}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            boxShadow: '0 2px 8px rgba(225,29,72,0.25)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(225,29,72,0.35)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(225,29,72,0.25)';
          }}
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span>New Patient Intake</span>
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Search
          style={{
            position: 'absolute',
            left: 14,
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
          placeholder="Filter by patient name, MRN code, or demographics..."
          style={{
            width: '100%',
            padding: '8px 14px 8px 38px',
            borderRadius: 8,
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            fontSize: '0.8rem',
            color: '#0f172a',
            outline: 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#0284c7';
            e.target.style.boxShadow = '0 0 0 3px rgba(2, 132, 199, 0.1)';
            e.target.style.background = '#ffffff';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#cbd5e1';
            e.target.style.boxShadow = 'none';
            e.target.style.background = '#f8fafc';
          }}
        />
      </div>

      {/* ── Clinical Category Tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '2px',
          background: 'rgba(241,245,249,0.7)',
          borderRadius: 8,
          overflowX: 'auto',
          alignSelf: 'flex-start',
          flexShrink: 0,
        }}
      >
        {[
          { key: 'all', label: 'All', count: counts.all, accent: '#0f172a' },
          { key: 'critical', label: 'Critical', count: counts.critical, accent: '#dc2626' },
          { key: 'moderate', label: 'Moderate', count: counts.moderate, accent: '#d97706' },
          { key: 'stable', label: 'Stable', count: counts.stable, accent: '#059669' },
        ].map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 6,
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? tab.accent : '#64748b',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: 4,
                  background: isActive ? `${tab.accent}15` : 'rgba(15,23,42,0.06)',
                  color: isActive ? tab.accent : '#94a3b8',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── List Content (Smooth continuous scroll, all patients directly accessible) ── */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {loading ? (
          <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
            Loading patient telemetry from registry...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div
            style={{
              padding: '30px 20px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px dashed #cbd5e1',
            }}
          >
            <AlertCircle style={{ width: 26, height: 26, color: '#94a3b8', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
              No patients match filter criteria
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
              Try searching a different name, MRN code, or reset the filter tab.
            </div>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientQueueItem
              key={patient.id}
              patient={patient}
              triageLevel={patient._triage}
              isSelected={selectedId === patient.id}
              onClick={() => onSelectPatient(patient)}
              ehrCount={ehrCountMap[patient.id] || 0}
            />
          ))
        )}
      </div>

      {/* ── Continuous Scroll Counter Footer ── */}
      <div
        style={{
          paddingTop: 8,
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: '#64748b',
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        <span>
          Showing all <strong>{filteredPatients.length}</strong> patients
        </span>
        <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
          Smooth scroll enabled · Direct select
        </span>
      </div>
    </div>
  );
}
