import { Calendar, Radio, Sparkles } from 'lucide-react';

/**
 * DashboardTopBar — Top context bar in the main workspace.
 * Displays active section breadcrumbs and real-time clinical station telemetry.
 * (Doctor profile chip moved to bottom of sidebar per clinical workspace architecture)
 */
export default function DashboardTopBar({
  sectionTitle = 'Home',
  sectionSubtitle = 'Daily Clinical Overview & Triage Cockpit',
}) {
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header
      style={{
        height: 64,
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.55)',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* ── Left: Breadcrumb / Section Context ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {sectionTitle}
          </h1>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.58rem',
              fontWeight: 700,
              color: '#059669',
              background: 'rgba(5, 150, 105, 0.08)',
              padding: '2px 7px',
              borderRadius: 4,
              border: '1px solid rgba(5, 150, 105, 0.2)',
              letterSpacing: '0.04em',
            }}
          >
            CATH LAB LIVE
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
          {sectionSubtitle}
        </p>
      </div>

      {/* ── Right: Real-Time Telemetry & Date Lockup (Dribbble style) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Date Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            borderRadius: 10,
            fontSize: '0.74rem',
            fontWeight: 600,
            color: '#334155',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
          }}
        >
          <Calendar style={{ width: 13, height: 13, color: '#64748b' }} />
          <span>{currentDate}</span>
        </div>

        {/* Cath Lab Station Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: 'rgba(5, 150, 105, 0.06)',
            border: '1px solid rgba(5, 150, 105, 0.22)',
            borderRadius: 10,
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#047857',
            letterSpacing: '0.01em',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#059669',
              boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.25)',
              animation: 'pulse-live-dot 2s infinite ease-in-out',
            }}
          />
          <span>Station 4 · Active</span>
        </div>
      </div>
    </header>
  );
}
