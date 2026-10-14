import { useMemo } from 'react';
import { Sunrise, Sun, Moon, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

/**
 * HomeBanner — Clean, high-grade physician briefing banner.
 * - Headline: "{Greeting}, Dr. Shivansh Rana" (warm, direct, zero redundancy)
 * - Subtitle: Single-line plain English briefing
 * - Compact, sober telemetry stat pills (Total: 303, Critical: 166, Stable: 89)
 */
export default function HomeBanner({ 
  user,
  totalPatients = 303,
  criticalPatients = 166,
  stablePatients = 89,
  onGoToPatients
}) {
  const rawName = user?.user_metadata?.full_name || 'Dr. Shivansh Rana';
  const cleanName = rawName.replace(/^(dr\.?|doctor)\s+/i, '').trim();
  const doctorTitle = cleanName ? `Dr. ${cleanName}` : 'Dr. Shivansh Rana';

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', icon: Sunrise };
    if (hour < 18) return { text: 'Good afternoon', icon: Sun };
    return { text: 'Good evening', icon: Moon };
  }, []);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(248, 250, 252, 0.45) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.03), 0 1px 0 1px rgba(255, 255, 255, 0.95) inset',
        padding: '13px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      {/* ── Left Welcoming Heading & Subheading ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 280 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: '1.38rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
          }}
        >
          {greeting.text}, {doctorTitle}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '0.86rem',
            color: '#64748b',
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          CardioVision AI is ready to help you review heart patients, track critical alerts, and guide treatments.
        </p>
      </div>

      {/* ── Right Compact Sober Stat Badges ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {/* Total Patients */}
        <button
          onClick={onGoToPatients}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.95)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.03)';
          }}
        >
          <Users size={13} color="#0284c7" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total:</span>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#0f172a',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {totalPatients}
            </span>
          </div>
        </button>

        {/* Critical Attention Cases */}
        <button
          onClick={onGoToPatients}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(254, 242, 242, 0.85)',
            border: '1px solid rgba(254, 205, 211, 0.9)',
            boxShadow: '0 1px 2px rgba(225, 29, 72, 0.03)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#f43f5e';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(225, 29, 72, 0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(254, 205, 211, 0.9)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(225, 29, 72, 0.03)';
          }}
        >
          <AlertTriangle size={13} color="#e11d48" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: '0.72rem', color: '#be123c', fontWeight: 600 }}>Critical:</span>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#e11d48',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {criticalPatients}
            </span>
          </div>
        </button>

        {/* Stable Cases */}
        <button
          onClick={onGoToPatients}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(240, 253, 244, 0.85)',
            border: '1px solid rgba(187, 247, 208, 0.9)',
            boxShadow: '0 1px 2px rgba(5, 150, 105, 0.03)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(5, 150, 105, 0.08)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(187, 247, 208, 0.9)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(5, 150, 105, 0.03)';
          }}
        >
          <CheckCircle2 size={13} color="#059669" />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>Stable:</span>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#059669',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {stablePatients}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
