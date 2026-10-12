/**
 * VesselStatusBar — compact LAD / LCX / RCA horizontal indicator.
 * Shows vessel name + risk % + color-coded fill bar.
 * Accepts: vessels = { LAD: 85.1, LCX: 42.3, RCA: 14.2 }
 */

const VESSEL_META = {
  LAD: { label: 'LAD', long: 'Left Anterior Descending' },
  LCX: { label: 'LCX', long: 'Left Circumflex' },
  RCA: { label: 'RCA', long: 'Right Coronary' },
};

function getVesselStyle(pct) {
  if (pct >= 50) return { fill: '#e11d48', track: '#ffe4e6', text: '#9f1239' };
  if (pct >= 35) return { fill: '#d97706', track: '#fef3c7', text: '#92400e' };
  return { fill: '#059669', track: '#d1fae5', text: '#065f46' };
}

function VesselBar({ name, pct }) {
  const meta = VESSEL_META[name] ?? { label: name, long: name };
  const style = getVesselStyle(pct ?? 0);
  const displayPct = pct ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            letterSpacing: '0.04em',
          }}
        >
          {meta.label}
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: '0.7rem',
            color: style.text,
          }}
        >
          {displayPct.toFixed(1)}%
        </span>
      </div>
      {/* Track */}
      <div
        style={{
          width: '100%',
          height: 5,
          borderRadius: 3,
          background: style.track,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(displayPct, 100)}%`,
            height: '100%',
            borderRadius: 3,
            background: style.fill,
            transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
}

export default function VesselStatusBar({ vessels = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {['LAD', 'LCX', 'RCA'].map((name) => (
        <VesselBar key={name} name={name} pct={vessels[name]} />
      ))}
    </div>
  );
}
