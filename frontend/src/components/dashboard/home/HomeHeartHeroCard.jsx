import { ArrowRight, Sparkles } from 'lucide-react';
import HomeHeartCanvas from './HomeHeartCanvas';

/**
 * HomeHeartHeroCard — Centerpiece 3D heart card.
 * - Displays zoomed-in interactive 3D heart model
 * - Matches the exact height of HomePriorityQueue
 * - 72 BPM badge removed
 * - Browse All Patients button removed
 * - Single high-impact crimson "Launch 3D Vascular Studio" action
 */
export default function HomeHeartHeroCard({ onGoToStudio }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.58) 0%, rgba(254, 226, 226, 0.38) 45%, rgba(255, 255, 255, 0.62) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px -2px rgba(225, 29, 72, 0.06), 0 1px 0 1px rgba(255, 255, 255, 0.95) inset',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Top Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          marginBottom: 4,
          zIndex: 2,
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
            3D Coronary Studio
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#64748b' }}>
            Interactive 3D vascular morphology & real-time stent simulation
          </p>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(225, 29, 72, 0.08)',
            border: '1px solid rgba(225, 29, 72, 0.2)',
            color: '#e11d48',
            fontSize: '0.68rem',
            fontWeight: 700,
          }}
        >
          <Sparkles size={11} />
          <span>Real-Time 3D</span>
        </div>
      </div>

      {/* ── Zoomed-in 3D Heart Canvas ── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HomeHeartCanvas />
      </div>

      {/* ── Bottom Single Action Bar ── */}
      <div
        style={{
          flexShrink: 0,
          marginTop: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 2,
        }}
      >
        <button
          onClick={onGoToStudio}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '11px 18px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 4px 14px rgba(225, 29, 72, 0.28)',
            letterSpacing: '-0.01em',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(225, 29, 72, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(225, 29, 72, 0.28)';
          }}
        >
          <span>Launch 3D Vascular Studio</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
