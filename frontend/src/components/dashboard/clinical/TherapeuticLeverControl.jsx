/**
 * TherapeuticLeverControl — Dual manual number input + range slider for clinical levers.
 */
export default function TherapeuticLeverControl({
  label,
  unit,
  baseline,
  value,
  onChange,
  min = 50,
  max = 250,
  step = 1,
  inputMin = 40,
  inputMax = 300,
  isOptimal = false,
  benchmarks = [],
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {label} ({unit})
          </span>
          <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
            (Base: {baseline})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="number"
            min={inputMin}
            max={inputMax}
            step={step}
            value={value}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (!isNaN(val) && val >= inputMin && val <= inputMax) {
                onChange(val);
              }
            }}
            style={{
              width: 58,
              padding: '2px 5px',
              borderRadius: 6,
              border: '1.5px solid #cbd5e1',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: isOptimal ? '#059669' : '#d97706',
              background: isOptimal ? '#ecfdf5' : '#fffbeb',
              textAlign: 'center',
            }}
          />
          <span style={{ fontSize: '0.64rem', color: '#64748b' }}>{unit}</span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#059669', cursor: 'pointer', height: 4 }}
      />

      {benchmarks.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 2 }}>
          {benchmarks.map((b, idx) => (
            <span key={idx}>{b}</span>
          ))}
        </div>
      )}
    </div>
  );
}
