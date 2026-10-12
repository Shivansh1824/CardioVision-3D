import { useState, useEffect, useRef } from 'react';
import { Search, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { supabase } from '../../../services/supabaseClient';
import PatientQueueItem from './PatientQueueItem';

/** Derive triage level from clinical biomarkers in the patients table */
function getTriageLevel(p) {
  if (p.st_elevation > 0 || p.typical_chest_pain > 0) return 'critical';
  if (p.bp > 140 || p.ldl > 160 || (p.ef_tte && p.ef_tte < 45)) return 'moderate';
  return 'stable';
}

const FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'critical', label: '🔴 Critical' },
  { key: 'moderate', label: '🟡 Moderate' },
  { key: 'stable', label: '🟢 Stable' },
];

/** Skeleton placeholder rows while loading */
function QueueSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            height: 62,
            borderRadius: 12,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: `shimmer 1.4s ease-in-out ${i * 0.1}s infinite`,
            border: '1.5px solid var(--dash-border)',
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function PatientQueue({ selectedId, onSelectPatient, onAddPatient }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const listRef = useRef(null);

  // Fetch 303 patients from Supabase
  useEffect(() => {
    async function fetchPatients() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchErr } = await supabase
          .from('patients')
          .select(
            'id, patient_code, age, sex, bp, ldl, ef_tte, st_elevation, typical_chest_pain, fbs, htn, dm, current_smoker'
          )
          .order('patient_code', { ascending: true });

        if (fetchErr) throw fetchErr;
        setPatients(data ?? []);
      } catch (err) {
        setError('Could not load patient records. Check your connection.');
        console.error('[PatientQueue] Supabase fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  // GSAP stagger entrance when list items mount
  useGSAP(() => {
    if (!loading && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-queue-item]');
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { y: 10, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
        );
      }
    }
  }, [loading]);

  // Derived list: apply search + filter
  const displayed = patients
    .map((p) => ({ ...p, _triage: getTriageLevel(p) }))
    .filter((p) => {
      if (filter !== 'all' && p._triage !== filter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          p.patient_code?.toLowerCase().includes(q) ||
          String(p.age).includes(q) ||
          p.sex?.toLowerCase().includes(q)
        );
      }
      return true;
    });

  // Summary counts
  const counts = patients.reduce(
    (acc, p) => {
      acc[getTriageLevel(p)]++;
      return acc;
    },
    { critical: 0, moderate: 0, stable: 0 }
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 0,
      }}
    >
      {/* ── Header ── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              Patient Queue
            </h2>
            {!loading && (
              <p
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'JetBrains Mono, monospace',
                  marginTop: 2,
                }}
              >
                {counts.critical} critical · {counts.moderate} moderate · {counts.stable} stable
              </p>
            )}
          </div>

          <button
            onClick={onAddPatient}
            aria-label="Add new patient"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '7px 13px',
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 9,
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(225,29,72,0.28)',
              transition: 'all 0.18s var(--ease-expo)',
              whiteSpace: 'nowrap',
            }}
          >
            <Plus style={{ width: 14, height: 14 }} />
            Add Patient
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            position: 'relative',
            marginBottom: 10,
          }}
        >
          <Search
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 14,
              height: 14,
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Search by ID, age, sex…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px 8px 32px',
              border: '1.5px solid var(--dash-border)',
              borderRadius: 9,
              fontSize: '0.8rem',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-primary)',
              background: 'var(--dash-surface)',
              outline: 'none',
              transition: 'border-color 0.18s',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--ai-accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--dash-border)')}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingBottom: 14 }}>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: '1.5px solid',
                borderColor: filter === opt.key ? 'var(--ai-accent)' : 'var(--dash-border)',
                background: filter === opt.key ? 'var(--ai-accent-bg)' : 'var(--dash-surface)',
                color: filter === opt.key ? 'var(--ai-accent)' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div
          style={{
            height: 1,
            background: 'var(--dash-border)',
            marginLeft: -20,
            marginRight: -20,
          }}
        />
      </div>

      {/* ── List ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
        }}
        ref={listRef}
      >
        {loading && <QueueSkeleton />}

        {error && !loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '32px 16px',
              textAlign: 'center',
            }}
          >
            <AlertTriangle style={{ width: 28, height: 28, color: 'var(--vessel-moderate)' }} />
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 14px',
                background: 'var(--dash-surface-2)',
                border: '1.5px solid var(--dash-border)',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              <RefreshCw style={{ width: 12, height: 12 }} />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && displayed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 16px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              No patients match your search.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          displayed.map((p) => (
            <div key={p.id} data-queue-item="true">
              <PatientQueueItem
                patient={p}
                triageLevel={p._triage}
                isSelected={selectedId === p.id}
                onClick={() => onSelectPatient(p, p._triage)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
