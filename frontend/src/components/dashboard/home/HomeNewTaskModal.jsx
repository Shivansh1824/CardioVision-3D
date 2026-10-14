import { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Search, X, Check } from 'lucide-react';
import patientNames from '../../../data/patientNames.json';

// Complete 303 Patient Cohort Registry
export const ALL_303_PATIENTS = Array.from({ length: 303 }, (_, i) => {
  const num = i + 1;
  const code = `PT-${String(num).padStart(3, '0')}`;
  const name = patientNames[code] || patientNames[String(num)] || `Patient ${code}`;
  const tier = num <= 166 ? 'critical' : num <= 214 ? 'moderate' : 'stable';
  return { id: num, code, name, tier };
});

const QUICK_ACTIONS = [
  'Simulate Stent in 3D',
  'Adjudicate LAD Stenosis',
  'Review Angiography',
  'Evaluate Plaque Burden',
  'Follow-up Echo TTE',
];

/**
 * HomeNewTaskModal — Global portaled modal to create a clinical task across all 303 patients.
 * Uses createPortal(..., document.body) to prevent getting trapped inside CSS-contained cards.
 */
export default function HomeNewTaskModal({ isOpen, onClose, onAddTask }) {
  const [taskText, setTaskText] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(ALL_303_PATIENTS[0]);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'critical' | 'moderate' | 'stable'

  const modalRef = useRef(null);

  // GSAP Smooth Modal Entrance Animation (Zero Bounce)
  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out', clearProps: 'transform' }
      );
    }
  }, { dependencies: [isOpen] });

  // Filter 303 patients by search & tier
  const filteredPatients = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ALL_303_PATIENTS.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      const matchesTier = tierFilter === 'all' || p.tier === tierFilter;
      return matchesSearch && matchesTier;
    });
  }, [search, tierFilter]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    onAddTask({
      id: `td-${Date.now()}`,
      task: taskText.trim(),
      patientCode: selectedPatient.code,
      patientName: selectedPatient.name,
      tier: selectedPatient.tier,
      done: false, // strictly starts as pending
      createdAt: new Date().toISOString(),
    });

    setTaskText('');
    onClose();
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        boxSizing: 'border-box',
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.35)',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'var(--font-display)',
              }}
            >
              Create Clinical Action Task
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
              Assign to-do actions across all 303 triage cohort patients
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: 6,
              padding: 5,
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '16px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Task Description Input */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: 5,
              }}
            >
              Clinical Task Description
            </label>
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="e.g., Adjudicate LAD bifurcation stent or order TTE..."
              autoFocus
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {/* Quick Action Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => setTaskText(action)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.66rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#0284c7';
                    e.currentTarget.style.color = '#0284c7';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  + {action}
                </button>
              ))}
            </div>
          </div>

          {/* Target Patient Selector (All 303 Patients) */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
                Select Patient (All 303 Cases)
              </label>
              <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 600 }}>
                Selected: {selectedPatient.name} ({selectedPatient.code})
              </span>
            </div>

            {/* Search & Filter Bar */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 7,
                  padding: '5px 10px',
                }}
              >
                <Search size={13} color="#94a3b8" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or code (e.g. James, PT-042)..."
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.74rem',
                    color: '#0f172a',
                    width: '100%',
                  }}
                />
              </div>

              {/* Tier Filter Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: 2,
                  background: '#f1f5f9',
                  padding: 2,
                  borderRadius: 7,
                  border: '1px solid #e2e8f0',
                }}
              >
                {['all', 'critical', 'moderate', 'stable'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTierFilter(t)}
                    style={{
                      padding: '3px 7px',
                      borderRadius: 5,
                      border: 'none',
                      background: tierFilter === t ? '#ffffff' : 'transparent',
                      color: tierFilter === t ? '#0f172a' : '#64748b',
                      fontSize: '0.64rem',
                      fontWeight: tierFilter === t ? 700 : 500,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable 303 Patient Picker List */}
            <div
              className="custom-scrollbar"
              style={{
                maxHeight: 180,
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: 4,
              }}
            >
              {filteredPatients.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                  No patients matched "{search}"
                </div>
              ) : (
                filteredPatients.map((p) => {
                  const isSelected = selectedPatient.code === p.code;
                  const badgeColor = 
                    p.tier === 'critical' ? '#e11d48' :
                    p.tier === 'moderate' ? '#d97706' : '#059669';
                  const badgeBg = 
                    p.tier === 'critical' ? 'rgba(225, 29, 72, 0.1)' :
                    p.tier === 'moderate' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(5, 150, 105, 0.1)';

                  return (
                    <div
                      key={p.code}
                      onClick={() => setSelectedPatient(p)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                        border: isSelected ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#0f172a',
                          }}
                        >
                          {p.code}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#334155', fontWeight: 600 }}>
                          {p.name}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: badgeBg,
                          color: badgeColor,
                          textTransform: 'capitalize',
                        }}
                      >
                        {p.tier}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #f1f5f9',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 14px',
              borderRadius: 7,
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#475569',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!taskText.trim()}
            style={{
              padding: '7px 16px',
              borderRadius: 7,
              background: taskText.trim() ? '#0f172a' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: taskText.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
          >
            Add Action Item
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
