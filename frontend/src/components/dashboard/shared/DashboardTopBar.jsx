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
        </div>
        <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '2px 0 0', fontWeight: 500 }}>
          {sectionSubtitle}
        </p>
      </div>

      {/* ── Right: Date Lockup ── */}
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
      </div>
    </header>
  );
}
