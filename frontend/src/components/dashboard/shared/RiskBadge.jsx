/**
 * RiskBadge — compact triage severity indicator.
 * Variants: 'critical' | 'moderate' | 'stable'
 */
const CONFIG = {
  critical: {
    label: 'Critical',
    dot: '#e11d48',
    bg: 'var(--vessel-critical-bg)',
    color: '#9f1239',
    border: 'var(--vessel-critical-border)',
  },
  moderate: {
    label: 'Moderate',
    dot: '#d97706',
    bg: 'var(--vessel-moderate-bg)',
    color: '#92400e',
    border: 'var(--vessel-moderate-border)',
  },
  stable: {
    label: 'Stable',
    dot: '#059669',
    bg: 'var(--vessel-safe-bg)',
    color: '#065f46',
    border: 'var(--vessel-safe-border)',
  },
};

export default function RiskBadge({ level = 'stable', size = 'sm' }) {
  const cfg = CONFIG[level] ?? CONFIG.stable;
  const isLg = size === 'lg';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isLg ? 6 : 4,
        padding: isLg ? '4px 10px' : '2px 7px',
        borderRadius: 6,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: isLg ? '0.72rem' : '0.64rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Pulsing dot for critical */}
      <span
        style={{
          width: isLg ? 7 : 6,
          height: isLg ? 7 : 6,
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
          animation: level === 'critical' ? 'riskPulse 1.4s ease-in-out infinite' : 'none',
        }}
      />
      {cfg.label}
      <style>{`
        @keyframes riskPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
    </span>
  );
}
