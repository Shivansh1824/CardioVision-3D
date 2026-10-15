import { useState } from 'react';
import { Zap, RefreshCw, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

const DOCTOR_PRESETS = [
  {
    name: 'Dr. Sarah Jenkins, MD',
    email: 'dr.jenkins@cardiovision-eval.org',
    role: 'Chief Interventional Cardiologist',
    hospital: 'Mount Sinai Heart Institute',
    badge: 'Cath Lab Lead',
  },
  {
    name: 'Dr. Shivansh Rana, MD',
    email: 'dr.shivansh@cardiovision-eval.org',
    role: 'Lead Cardiovascular AI Fellow',
    hospital: 'Johns Hopkins Medicine',
    badge: 'AI Fellow',
  },
  {
    name: 'Dr. Marcus Vance, MD',
    email: 'dr.vance@cardiovision-eval.org',
    role: 'Director of Coronary Hemodynamics',
    hospital: 'Cleveland Clinic Heart Center',
    badge: 'Hemodynamics',
  },
  {
    name: 'Dr. Elena Rostova, MD',
    email: 'dr.rostova@cardiovision-eval.org',
    role: 'Senior Invasive Cardiologist',
    hospital: 'Stanford Cardiovascular Health',
    badge: 'Invasive Surgery',
  },
];

const RANDOM_FIRST_NAMES = ['David', 'Aisha', 'Michael', 'Priya', 'Alexander', 'Sophia', 'Carlos', 'Mei-Ling'];
const RANDOM_LAST_NAMES = ['Thornton', 'Nair', 'Kovacs', 'Kaufman', 'Al-Mansoor', 'O\'Connor', 'Tanaka', 'Morales'];
const RANDOM_HOSPITALS = [
  'Mount Sinai Heart Institute',
  'Massachusetts General Hospital',
  'Mayo Clinic Cardiovascular Center',
  'Cedars-Sinai Heart Institute',
  'Northwestern Memorial Hospital'
];

/**
 * JudgeFastLoginCard — Hackathon Judge & Evaluator Fast Access Card.
 * Allows 1-click instant login or autofill for video demos and project evaluation.
 */
export default function JudgeFastLoginCard({ onFastLogin, onAutofill, isLoading }) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customProfile, setCustomProfile] = useState(null);
  const [justCopied, setJustCopied] = useState(false);

  const activeProfile = customProfile || DOCTOR_PRESETS[selectedPresetIndex];

  const handleGenerateRandom = () => {
    const fName = RANDOM_FIRST_NAMES[Math.floor(Math.random() * RANDOM_FIRST_NAMES.length)];
    const lName = RANDOM_LAST_NAMES[Math.floor(Math.random() * RANDOM_LAST_NAMES.length)];
    const hospital = RANDOM_HOSPITALS[Math.floor(Math.random() * RANDOM_HOSPITALS.length)];
    const randomCode = Math.floor(100 + Math.random() * 900);
    const doctorName = `Dr. ${fName} ${lName}, MD`;
    const doctorEmail = `dr.${fName.toLowerCase()}.${lName.toLowerCase()}${randomCode}@cardiovision-eval.org`;

    const randomProfile = {
      name: doctorName,
      email: doctorEmail,
      role: 'Staff Interventional Cardiologist',
      hospital: hospital,
      badge: 'Evaluator Guest',
    };

    setCustomProfile(randomProfile);
  };

  const handleInstantSignIn = () => {
    if (onFastLogin) {
      onFastLogin(activeProfile);
    }
  };

  const handleAutofillCredentials = () => {
    if (onAutofill) {
      onAutofill(activeProfile);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(240, 253, 250, 0.95) 100%)',
        border: '1.5px solid rgba(56, 189, 248, 0.4)',
        borderRadius: 18,
        padding: '16px 18px',
        marginBottom: 20,
        boxShadow: '0 4px 16px -2px rgba(2, 132, 199, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="judge-fast-login-card"
    >
      {/* Top Header Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Zap style={{ width: 13, height: 13 }} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#0369a1',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Hackathon Judge &amp; Evaluator Access
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateRandom}
          title="Generate a fresh random doctor identity"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.68rem',
            fontWeight: 700,
            color: '#0284c7',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '3px 8px',
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <RefreshCw style={{ width: 11, height: 11 }} />
          <span>Randomize</span>
        </button>
      </div>

      {/* Preset Doctors Selector Chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 12 }}>
        {DOCTOR_PRESETS.map((p, idx) => {
          const isSelected = !customProfile && selectedPresetIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCustomProfile(null);
                setSelectedPresetIndex(idx);
              }}
              style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '4px 9px',
                borderRadius: 999,
                border: isSelected ? '1px solid #0284c7' : '1px solid rgba(203, 213, 225, 0.8)',
                background: isSelected ? '#0284c7' : 'rgba(255, 255, 255, 0.85)',
                color: isSelected ? '#ffffff' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {p.name.split(',')[0]}
            </button>
          );
        })}
      </div>

      {/* Active Profile Info Preview */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          padding: '10px 12px',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
              {activeProfile.name}
            </span>
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                color: '#0284c7',
                background: 'rgba(2, 132, 199, 0.08)',
                padding: '1px 6px',
                borderRadius: 999,
              }}
            >
              {activeProfile.badge}
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {activeProfile.email} • {activeProfile.hospital}
          </div>
        </div>
        <ShieldCheck style={{ width: 18, height: 18, color: '#059669', flexShrink: 0, marginLeft: 8 }} />
      </div>

      {/* Action Buttons: 1-Click Fast Sign-In & Autofill */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          type="button"
          onClick={handleInstantSignIn}
          disabled={isLoading}
          id="judge-instant-signin-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '9px 12px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          <Zap style={{ width: 14, height: 14 }} />
          <span>1-Click Fast Sign In</span>
        </button>

        <button
          type="button"
          onClick={handleAutofillCredentials}
          disabled={isLoading}
          id="judge-autofill-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '9px 12px',
            borderRadius: 10,
            background: justCopied ? '#ecfdf5' : '#ffffff',
            color: justCopied ? '#059669' : '#334155',
            border: justCopied ? '1px solid #10b981' : '1px solid #cbd5e1',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {justCopied ? (
            <>
              <CheckCircle2 style={{ width: 14, height: 14, color: '#059669' }} />
              <span>Credentials Filled!</span>
            </>
          ) : (
            <>
              <UserCheck style={{ width: 14, height: 14, color: '#64748b' }} />
              <span>Auto-Fill Form</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
