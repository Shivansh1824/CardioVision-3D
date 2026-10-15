import { useState, useRef, useEffect, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getAllPatients, getTriageCounts } from '../../../services/patientDataService';

/**
 * HomePriorityQueue — Compact, half-height patient queue with smooth continuous scroll.
 * Directly wired to authentic database-backed ML predictions and clinical triage tiers.
 */
export default function HomePriorityQueue({ onOpenPatient, onGoToPatients }) {
  const [activeTab, setActiveTab] = useState('critical'); // 'critical' | 'moderate' | 'stable'
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for newly committed EHR plans
  useEffect(() => {
    const handleUpdate = () => setRefreshKey((k) => k + 1);
    window.addEventListener('cv_activity_updated', handleUpdate);
    return () => window.removeEventListener('cv_activity_updated', handleUpdate);
  }, []);

  const triageCounts = useMemo(() => getTriageCounts(), [refreshKey]);
  const currentList = useMemo(() => getAllPatients({ filterTier: activeTab }), [activeTab, refreshKey]);

  const scrollContainerRef = useRef(null);
  const tabRefs = useRef({});
  const indicatorRef = useRef(null);

  // GSAP Smooth Scrolling with momentum getter animation
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let targetScroll = el.scrollTop;
    const maxScroll = () => Math.max(0, el.scrollHeight - el.clientHeight);

    const onScroll = () => {
      if (!gsap.isTweening(el)) {
        targetScroll = el.scrollTop;
      }
    };

    const onWheel = (e) => {
      if (el.scrollHeight <= el.clientHeight) return;
      e.preventDefault();
      const delta = e.deltaY;
      targetScroll = Math.max(0, Math.min(maxScroll(), targetScroll + delta * 0.85));

      gsap.to(el, {
        scrollTop: targetScroll,
        duration: 0.28,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Initialize indicator pill position on mount
  useEffect(() => {
    const activeBtn = tabRefs.current[activeTab];
    if (activeBtn && indicatorRef.current) {
      gsap.set(indicatorRef.current, {
        x: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, []);

  // GSAP Smooth Sliding Tab Indicator Animation
  useGSAP(() => {
    const activeBtn = tabRefs.current[activeTab];
    if (activeBtn && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.26,
        ease: 'power2.out',
      });
    }
  }, { dependencies: [activeTab] });

  // GSAP Tab Switch Transition: Silky smooth opening animation for incoming patients
  useGSAP(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      const rows = scrollContainerRef.current.querySelectorAll('.queue-item-row');
      if (rows && rows.length > 0) {
        const visibleRows = Array.from(rows).slice(0, 8);
        gsap.fromTo(
          visibleRows,
          { opacity: 0, x: 10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.28,
            stagger: 0.025,
            ease: 'power1.out',
            clearProps: 'transform,opacity',
          }
        );
      }
    }
  }, { dependencies: [activeTab] });

  const tabs = [
    { id: 'critical', label: 'Critical', count: triageCounts.critical, accent: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)' },
    { id: 'moderate', label: 'Moderate', count: triageCounts.moderate, accent: '#d97706', bg: 'rgba(217, 119, 6, 0.1)' },
    { id: 'stable', label: 'Stable', count: triageCounts.stable, accent: '#059669', bg: 'rgba(5, 150, 105, 0.1)' },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.62) 0%, rgba(255, 241, 242, 0.35) 50%, rgba(255, 255, 255, 0.60) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px -2px rgba(225, 29, 72, 0.04), 0 1px 0 1px rgba(255, 255, 255, 0.95) inset',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Header with 3 Filter Buttons ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 10,
          flexShrink: 0,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Patient Triage Cohort
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
            Select tier to scroll through all active cohort cases
          </p>
        </div>

        {/* 3 Triage Buttons with Smooth GSAP Sliding Indicator */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 3,
            background: 'rgba(241, 245, 249, 0.85)',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Animated GSAP sliding pill */}
          <div
            ref={indicatorRef}
            style={{
              position: 'absolute',
              top: 3,
              left: 0,
              height: 'calc(100% - 6px)',
              background: '#ffffff',
              borderRadius: 6,
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[tab.id] = el)}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? tab.accent : '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    padding: '1px 5px',
                    borderRadius: 4,
                    background: isActive ? tab.bg : 'rgba(15, 23, 42, 0.06)',
                    color: isActive ? tab.accent : '#94a3b8',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 700,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Continuous Scrollable List for All Patients in Active Tab ── */}
      <div
        ref={scrollContainerRef}
        className="custom-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          paddingRight: 4,
        }}
      >
        {currentList.map((p, idx) => (
          <div
            key={p.id}
            className="queue-item-row"
            style={{
              padding: '9px 12px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.78)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.boxShadow = '0 3px 10px rgba(15, 23, 42, 0.04)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Identity & Biomarkers */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: activeTab === 'critical' ? 'rgba(225, 29, 72, 0.1)' : activeTab === 'moderate' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(5, 150, 105, 0.1)',
                  color: activeTab === 'critical' ? '#e11d48' : activeTab === 'moderate' ? '#d97706' : '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  fontFamily: 'JetBrains Mono, monospace',
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                  <span style={{ fontSize: '0.64rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', background: '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>
                    {p.patient_code}
                  </span>
                  <span style={{ fontSize: '0.66rem', color: '#94a3b8' }}>
                    {p.age}y {p.sex}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>BP {p.bp} · EF {p.ef_tte}%</span>
                  <span style={{ color: activeTab === 'critical' ? '#e11d48' : '#0284c7', fontWeight: 600 }}>
                    {p.vessel}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk & Review Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                {p.has_committed_plan ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', textDecoration: 'line-through', fontFamily: 'JetBrains Mono, monospace' }}>
                        {p.cad_risk_pct}%
                      </span>
                      <span style={{ fontSize: '0.84rem', fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', color: '#059669' }}>
                        {p.projected_cad_risk}%
                      </span>
                    </div>
                    <div style={{ fontSize: '0.58rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                      <CheckCircle2 style={{ width: 9, height: 9 }} />
                      <span>Plan Active</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 900,
                        fontFamily: 'JetBrains Mono, monospace',
                        color: activeTab === 'critical' ? '#e11d48' : activeTab === 'moderate' ? '#d97706' : '#059669',
                      }}
                    >
                      {p.cad_risk_pct}%
                    </span>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
                      {activeTab === 'critical' ? 'CAD Risk' : 'Risk Index'}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => onOpenPatient?.(p)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 7,
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(2, 132, 199, 0.35)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(2, 132, 199, 0.25)';
                }}
              >
                <span>Review</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer Status & All Roster Link ── */}
      <div
        style={{
          marginTop: 6,
          paddingTop: 6,
          borderTop: '1px solid rgba(226, 232, 240, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
          Showing all {currentList.length} {activeTab} cases · Scroll to explore
        </span>
        <button
          onClick={onGoToPatients}
          style={{
            background: 'none',
            border: 'none',
            color: '#e11d48',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 0,
          }}
        >
          <span>View All 303 In Roster</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}
