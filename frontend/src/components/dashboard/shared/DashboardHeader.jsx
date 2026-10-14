import { useEffect, useRef, useState } from 'react';
import { LogOut, ChevronDown, User, Camera, Check, Pencil, ArrowLeft, Trash2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import BrandLogo from '../../BrandLogo';

/**
 * Formats a doctor's name ensuring the salutation 'Dr.' is always present.
 */
function formatDoctorName(raw) {
  if (!raw || !raw.trim()) return 'Dr. Shivansh Rana';
  const trimmed = raw.trim();
  if (/^dr\.?\s+/i.test(trimmed)) {
    return trimmed;
  }
  return `Dr. ${trimmed}`;
}

/**
 * DashboardHeader — Clinical top navigation. 2027 modern standard.
 * - Clean brand identity with no redundant tagline.
 * - Removed live patient count pill for minimal, airy hierarchy.
 * - Single intentional Sign Out inside the native physician profile flyout.
 * - Seamless physician profile chip with editable Dr. name & photo upload.
 */
export default function DashboardHeader({ user, onSignOut, onBackToLanding }) {
  // Load persisted custom profile from localStorage if available
  const savedProfile = (() => {
    try {
      const raw = localStorage.getItem('cardiovision_doctor_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const defaultRawName = user?.user_metadata?.full_name || 'Shivansh Rana';
  const [doctorName, setDoctorName] = useState(() => {
    if (savedProfile?.name) return formatDoctorName(savedProfile.name);
    return formatDoctorName(defaultRawName);
  });
  const [doctorAvatar, setDoctorAvatar] = useState(() => savedProfile?.avatar || null);
  const doctorEmail = user?.email || 's.rana@cardiovision.ai';

  // Flyout and editing states
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNameInput, setEditNameInput] = useState(doctorName);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const headerRef = useRef(null);
  const flyoutRef = useRef(null);
  const avatarRef = useRef(null);
  const fileInputRef = useRef(null);

  // Compute monogram initials from Dr. name
  const initials = doctorName
    .replace(/^dr\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'SR';

  // GSAP entrance — header slides and fades in on mount
  useGSAP(() => {
    gsap.fromTo(headerRef.current,
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, { scope: headerRef });

  // Close flyout when clicking outside
  useEffect(() => {
    if (!flyoutOpen) return;
    function handleOutside(e) {
      if (
        flyoutRef.current && !flyoutRef.current.contains(e.target) &&
        avatarRef.current && !avatarRef.current.contains(e.target)
      ) {
        setFlyoutOpen(false);
        setIsEditing(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [flyoutOpen]);

  // Handle avatar image upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('Please choose an image file under 4MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (typeof base64 === 'string') {
        setDoctorAvatar(base64);
        try {
          const current = JSON.parse(localStorage.getItem('cardiovision_doctor_profile') || '{}');
          localStorage.setItem('cardiovision_doctor_profile', JSON.stringify({ ...current, avatar: base64 }));
        } catch (err) {
          console.warn('Storage save error:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setDoctorAvatar(null);
    try {
      const current = JSON.parse(localStorage.getItem('cardiovision_doctor_profile') || '{}');
      delete current.avatar;
      localStorage.setItem('cardiovision_doctor_profile', JSON.stringify(current));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
  };

  // Handle saving new name
  const handleSaveProfile = (e) => {
    e?.preventDefault();
    const formatted = formatDoctorName(editNameInput);
    setDoctorName(formatted);
    try {
      const current = JSON.parse(localStorage.getItem('cardiovision_doctor_profile') || '{}');
      localStorage.setItem('cardiovision_doctor_profile', JSON.stringify({ ...current, name: formatted }));
    } catch (err) {
      console.warn('Storage save error:', err);
    }
    setSaveFeedback(true);
    setTimeout(() => {
      setSaveFeedback(false);
      setIsEditing(false);
    }, 600);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-white/45 backdrop-blur-xl border-b border-slate-200/50 transition-all shadow-2xs supports-backdrop-filter:bg-white/35"
    >
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* ── Left: Brand identity (Exact match to hero header) ── */}
        <button
          onClick={onBackToLanding}
          title="Back to landing"
          className="flex items-center gap-2.5 text-left group cursor-pointer bg-transparent border-0 p-0 shrink-0"
        >
          <BrandLogo size={32} />
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors whitespace-nowrap">
            CardioVision <span className="text-rose-600">AI</span>
          </span>
        </button>

        {/* ── Right: Integrated Physician Profile Chip ── */}
        <div style={{ position: 'relative' }}>
          <button
            ref={avatarRef}
            onClick={() => {
              setFlyoutOpen(!flyoutOpen);
              if (!flyoutOpen) {
                setEditNameInput(doctorName);
                setIsEditing(false);
              }
            }}
            aria-expanded={flyoutOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: flyoutOpen ? '#ffffff' : 'rgba(248, 250, 252, 0.75)',
              border: flyoutOpen
                ? '1px solid #cbd5e1'
                : '1px solid rgba(226, 232, 240, 0.9)',
              borderRadius: 12,
              padding: '5px 12px 5px 6px',
              cursor: 'pointer',
              transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: flyoutOpen
                ? '0 0 0 3px rgba(220, 38, 38, 0.08), 0 4px 12px rgba(15, 23, 42, 0.06)'
                : '0 1px 2px rgba(15, 23, 42, 0.04)',
            }}
            onMouseOver={(e) => {
              if (!flyoutOpen) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.05)';
              }
            }}
            onMouseOut={(e) => {
              if (!flyoutOpen) {
                e.currentTarget.style.background = 'rgba(248, 250, 252, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(15, 23, 42, 0.04)';
              }
            }}
          >
            {/* Avatar Circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: doctorAvatar
                  ? 'none'
                  : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2), 0 1px 2px rgba(15,23,42,0.1)',
              }}
            >
              {doctorAvatar ? (
                <img
                  src={doctorAvatar}
                  alt={doctorName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                initials
              )}
            </div>

            {/* Doctor Identity Text */}
            <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.01em',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {doctorName}
              </div>
              <div
                style={{
                  fontSize: '0.67rem',
                  color: '#64748b',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>Attending Cardiologist</span>
              </div>
            </div>

            {/* Subtle Chevron */}
            <ChevronDown
              style={{
                width: 14,
                height: 14,
                color: '#94a3b8',
                transform: flyoutOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                marginLeft: 2,
                flexShrink: 0,
              }}
            />
          </button>

          {/* ── Physician Profile & Session Dropdown ── */}
          {flyoutOpen && (
            <div
              ref={flyoutRef}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                zIndex: 200,
                width: 300,
                background: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                borderRadius: 16,
                boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.14), 0 4px 12px rgba(15, 23, 42, 0.04)',
                overflow: 'hidden',
                animation: 'flyout-drop 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <style>{`
                @keyframes flyout-drop {
                  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                  to   { opacity: 1; transform: translateY(0)   scale(1); }
                }
              `}</style>

              {/* Hidden file input for photo upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />

              {!isEditing ? (
                /* ── Mode A: Doctor Identity View ── */
                <>
                  <div style={{ padding: '18px 18px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          position: 'relative',
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: doctorAvatar
                            ? 'none'
                            : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '2px solid #ffffff',
                          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
                        }}
                      >
                        {doctorAvatar ? (
                          <img
                            src={doctorAvatar}
                            alt={doctorName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {doctorName}
                        </div>
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: '#64748b',
                            marginTop: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {doctorEmail}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        background: '#f8fafc',
                        borderRadius: 8,
                        border: '1px solid #f1f5f9',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.67rem',
                          fontWeight: 600,
                          color: '#475569',
                          letterSpacing: '0.01em',
                        }}
                      >
                        Cardiovascular Medicine · Attending
                      </span>
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#059669',
                          boxShadow: '0 0 0 2px rgba(5, 150, 105, 0.2)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Profile Edit Trigger */}
                  <div style={{ padding: '0 8px 6px' }}>
                    <button
                      onClick={() => {
                        setEditNameInput(doctorName);
                        setIsEditing(true);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '9px 12px',
                        borderRadius: 8,
                        background: 'none',
                        border: 'none',
                        color: '#0f172a',
                        fontSize: '0.79rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User style={{ width: 14, height: 14, color: '#64748b' }} />
                        <span>Profile & Physician Settings</span>
                      </div>
                      <Pencil style={{ width: 12, height: 12, color: '#94a3b8' }} />
                    </button>
                  </div>

                  <div style={{ height: 1, background: '#f1f5f9', margin: '2px 0' }} />

                  {/* Sign Out Button */}
                  <div style={{ padding: '6px 8px 8px' }}>
                    <button
                      onClick={() => {
                        setFlyoutOpen(false);
                        onSignOut?.();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '9px 12px',
                        borderRadius: 8,
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        fontSize: '0.79rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOut style={{ width: 14, height: 14 }} />
                      <span>Sign Out of Session</span>
                    </button>
                  </div>
                </>
              ) : (
                /* ── Mode B: Edit Profile (Name & Photo) ── */
                <div style={{ padding: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 4,
                        cursor: 'pointer',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 6,
                      }}
                      title="Back"
                    >
                      <ArrowLeft style={{ width: 15, height: 15 }} />
                    </button>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                      Edit Physician Profile
                    </span>
                  </div>

                  {/* Photo Edit Controls */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      background: '#f8fafc',
                      borderRadius: 10,
                      border: '1px solid #f1f5f9',
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: doctorAvatar
                          ? 'none'
                          : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '2px solid #ffffff',
                        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.1)',
                      }}
                    >
                      {doctorAvatar ? (
                        <img
                          src={doctorAvatar}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          padding: '4px 10px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          width: 'fit-content',
                        }}
                      >
                        <Camera style={{ width: 12, height: 12, color: '#64748b' }} />
                        <span>Change Photo</span>
                      </button>

                      {doctorAvatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.67rem',
                            fontWeight: 500,
                            color: '#dc2626',
                            background: 'none',
                            border: 'none',
                            padding: '2px 0',
                            cursor: 'pointer',
                            width: 'fit-content',
                          }}
                        >
                          <Trash2 style={{ width: 11, height: 11 }} />
                          <span>Remove photo</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Name Edit Form */}
                  <form onSubmit={handleSaveProfile}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#475569',
                        marginBottom: 6,
                        letterSpacing: '0.01em',
                      }}
                    >
                      Physician Name
                    </label>
                    <div style={{ position: 'relative', marginBottom: 14 }}>
                      <input
                        type="text"
                        value={editNameInput}
                        onChange={(e) => setEditNameInput(e.target.value)}
                        placeholder="Dr. Full Name"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#dc2626')}
                        onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                      />
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.64rem',
                          color: '#94a3b8',
                          marginTop: 4,
                        }}
                      >
                        *Salutation 'Dr.' will automatically be preserved
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                          background: '#ffffff',
                          color: '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          flex: 1.3,
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: 'none',
                          background: saveFeedback ? '#059669' : '#0f172a',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          transition: 'background 0.2s ease',
                        }}
                      >
                        {saveFeedback ? (
                          <>
                            <Check style={{ width: 13, height: 13 }} />
                            <span>Saved</span>
                          </>
                        ) : (
                          <span>Save Changes</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
