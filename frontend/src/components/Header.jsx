import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

// ── CardioVision Logomark ─────────────────────────────────────────────
// A minimal ECG-heartbeat + vessel fork mark
function CVLogo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="url(#logo-bg)" />
      {/* Heart-rate waveform */}
      <polyline
        points="4,20 9,20 12,12 15,26 18,8 21,24 24,20 32,20"
        stroke="url(#logo-line)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Vessel fork dot */}
      <circle cx="18" cy="8" r="2.2" fill="#f43f5e" />
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1a0820" />
          <stop offset="100%" stopColor="#0e1630" />
        </linearGradient>
        <linearGradient id="logo-line" x1="4" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f43f5e" />
          <stop offset="60%"  stopColor="#fb7185" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Header({ onOpenSignIn, onScrollToSection }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goto = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else onScrollToSection?.(id);
  };

  const navItems = [
    { label: 'Vessel Explorer',  id: 'vessel-explorer' },
    { label: 'Personas',         id: 'persona-section' },
    { label: 'Workflow',         id: 'clinical-workflow' },
    { label: 'AI Accuracy',      id: 'model-metrics' },
    { label: 'Safety',           id: 'safety-disclaimer' },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5,8,16,0.92)' : 'rgba(5,8,16,0.72)',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.04)'}`,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
    >
      <div className="container-wide flex items-center justify-between h-16">

        {/* ── Brand ── */}
        <a href="#" className="flex items-center gap-3 no-underline group" style={{ textDecoration: 'none' }}>
          <CVLogo size={36} />
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-white leading-none">
                Cardio<span style={{
                  background: 'linear-gradient(135deg,#f43f5e,#fb7185)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Vision</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500 leading-none">3D</span>
            </div>
            <p className="font-mono text-[10px] text-slate-500 tracking-wider mt-0.5 leading-none">
              Digital Heart Twin
            </p>
          </div>
        </a>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map(item => (
            <button key={item.id} onClick={() => goto(item.id)} className="nav-item">
              {item.label}
            </button>
          ))}
        </nav>

        {/* ── CTAs ── */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            id="header-signin-btn"
            onClick={() => onOpenSignIn?.('doctor')}
            className="btn-glass"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Sign In
          </button>
          <button
            id="header-explore-btn"
            onClick={() => goto('vessel-explorer')}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Explore Twin
          </button>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(5,8,16,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        }} className="lg:hidden px-6 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => goto(item.id)}
              className="w-full text-left py-2.5 text-slate-300 text-sm font-medium hover:text-white transition-colors block"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-white/5 mt-2">
            <button onClick={() => { setMobileOpen(false); onOpenSignIn?.('doctor'); }} className="btn-glass w-full justify-center" style={{ padding: '10px 16px' }}>
              Sign In
            </button>
            <button onClick={() => goto('vessel-explorer')} className="btn-primary w-full justify-center" style={{ padding: '10px 16px' }}>
              Explore Twin
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
