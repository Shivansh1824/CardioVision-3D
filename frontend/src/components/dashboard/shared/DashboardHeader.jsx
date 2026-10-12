import { LogOut, Home, Stethoscope, Bell } from 'lucide-react';
import BrandLogo from '../../BrandLogo';

/**
 * DashboardHeader — sticky top nav for the Doctor Clinical Suite.
 * Displays brand, role badge, notifications stub, user info, and sign-out.
 */
export default function DashboardHeader({ user, onSignOut, onBackToLanding, notifCount = 0 }) {
  const doctorName = user?.user_metadata?.full_name || 'Dr. Sarah Jenkins, MD';
  const doctorEmail = user?.email || 'doctor@hospital.org';
  const initials = doctorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--dash-border)',
        boxShadow: 'var(--dash-shadow-sm)',
      }}
    >
      <div
        style={{
          maxWidth: 1512,
          margin: '0 auto',
          padding: '0 20px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBackToLanding}
            title="Return to landing page"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <BrandLogo size={28} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
              }}
            >
              CardioVision <span style={{ color: 'var(--crimson-vital)' }}>AI</span>
            </span>
          </button>

          {/* Role badge — monospace engineering style, not pill */}
          <span
            style={{
              display: 'none',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--ai-accent)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'var(--ai-accent-bg)',
              border: '1px solid var(--ai-accent-border)',
              borderRadius: 6,
              padding: '3px 8px',
            }}
            className="dash-role-badge"
          >
            <Stethoscope style={{ width: 11, height: 11, display: 'inline', marginRight: 4 }} />
            Cardiologist Suite
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Back to site */}
          <button
            onClick={onBackToLanding}
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: 'var(--dash-surface-2)',
              border: '1px solid var(--dash-border)',
              borderRadius: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.18s var(--ease-expo)',
            }}
            className="dash-back-btn"
          >
            <Home style={{ width: 14, height: 14 }} />
            Public Site
          </button>

          {/* Notifications */}
          <button
            title="Notifications"
            aria-label="Notifications"
            style={{
              position: 'relative',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--dash-surface-2)',
              border: '1px solid var(--dash-border)',
              borderRadius: 10,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              transition: 'all 0.18s var(--ease-expo)',
            }}
          >
            <Bell style={{ width: 16, height: 16 }} />
            {notifCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  width: 14,
                  height: 14,
                  background: 'var(--crimson-vital)',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {notifCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: 'var(--dash-border)', margin: '0 4px' }} />

          {/* User chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.8rem',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(225,29,72,0.3)',
              }}
            >
              {initials}
            </div>
            <div
              style={{ lineHeight: 1.2 }}
              className="dash-user-info"
            >
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  maxWidth: 160,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {doctorName}
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'JetBrains Mono, monospace',
                  maxWidth: 160,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {doctorEmail}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            title="Sign Out"
            aria-label="Sign Out"
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--dash-surface-2)',
              border: '1px solid var(--dash-border)',
              borderRadius: 10,
              cursor: 'pointer',
              color: 'var(--text-muted)',
              transition: 'all 0.18s var(--ease-expo)',
            }}
          >
            <LogOut style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .dash-role-badge { display: inline-flex !important; align-items: center; }
          .dash-back-btn { display: inline-flex !important; }
        }
        @media (max-width: 768px) {
          .dash-user-info { display: none; }
        }
        header button:hover { opacity: 0.85; }
      `}</style>
    </header>
  );
}
