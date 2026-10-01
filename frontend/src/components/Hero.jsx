import React, { useState } from 'react';
import HeroConceptA from './HeroConceptA';
import HeroConceptOriginal from './HeroConceptOriginal';

// Available concepts
const CONCEPTS = [
  { id: 'a',        label: 'Hero',              sublabel: '3D Anatomical Twin' },
  { id: 'original', label: 'Original 2D',       sublabel: 'SVG 2D' },
];

export default function Hero(props) {
  const [active, setActive] = useState('a');

  return (
    <>
      {/* ── Design Switcher — dev-only toggle bar ── */}
      <div
        style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(226,232,240,0.15)',
          borderRadius: 99, padding: '6px 10px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        }}
        aria-label="Hero concept switcher"
      >
        <span
          style={{
            fontFamily: 'monospace', fontSize: 9, fontWeight: 700,
            color: 'rgba(148,163,184,0.7)', letterSpacing: '0.15em',
            textTransform: 'uppercase', paddingRight: 6,
          }}
        >
          View
        </span>
        {CONCEPTS.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            style={{
              fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
              padding: '4px 12px', borderRadius: 99, border: 'none', cursor: 'pointer',
              background: active === c.id ? '#e11d48' : 'transparent',
              color: active === c.id ? '#fff' : 'rgba(148,163,184,0.75)',
              transition: 'all 0.2s',
              letterSpacing: '0.05em',
            }}
            title={c.sublabel}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Render active hero ── */}
      {active === 'a'        && <HeroConceptA {...props} />}
      {active === 'original' && <HeroConceptOriginal {...props} />}
    </>
  );
}
