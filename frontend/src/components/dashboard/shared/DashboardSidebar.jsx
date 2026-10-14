import { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  FileText, 
  BarChart3, 
  LogOut, 
  ChevronDown, 
  User, 
  Camera, 
  Check, 
  Pencil, 
  ArrowLeft, 
  Trash2,
  Activity
} from 'lucide-react';
import BrandLogo from '../../BrandLogo';

function formatDoctorName(raw) {
  if (!raw || !raw.trim()) return 'Dr. Shivansh Rana';
  const trimmed = raw.trim();
  if (/^dr\.?\s+/i.test(trimmed)) {
    return trimmed;
  }
  return `Dr. ${trimmed}`;
}

/**
 * DashboardSidebar — Modern Left Sidebar Navigation (Moodify / Epic inspired standard).
 * Features simple human labels:
 * - Home (Daily overview, briefing & 3D heart)
 * - Patients (Active roster & triage)
 * - 3D Heart Studio (Interactive vascular & simulation)
 * - Medical Records (Committed plans & visit history)
 * - Analytics (AI model accuracy & cohort distribution)
 * 
 * Bottom: Integrated Doctor Profile Chip with upward flyout & sign out.
 */
export default function DashboardSidebar({
  activeNav,
  onSelectNav,
  user,
  onSignOut,
  onBackToLanding,
  patientCount = 303,
}) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      sub: 'Daily Briefing & Studio',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: '#059669',
    },
    {
      id: 'patients',
      label: 'Patients',
      sub: 'Patient Roster & Triage',
      icon: Users,
      badge: String(patientCount),
      badgeColor: '#0f172a',
    },
    {
      id: '3d-studio',
      label: '3D Heart Studio',
      sub: 'Anatomy & Simulation',
      icon: Heart,
      badge: '3D',
      badgeColor: '#dc2626',
    },
    {
      id: 'records',
      label: 'Medical Records',
      sub: 'EHR Visit History',
      icon: FileText,
      badge: null,
      badgeColor: null,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      sub: 'AI Model & Cohort',
      icon: BarChart3,
      badge: '0.914',
      badgeColor: '#059669',
    },
  ];

  // Doctor Profile State
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

  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNameInput, setEditNameInput] = useState(doctorName);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const isExpanded = isHovered || flyoutOpen;

  const flyoutRef = useRef(null);
  const chipRef = useRef(null);
  const fileInputRef = useRef(null);

  const initials = doctorName
    .replace(/^dr\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'SR';

  useEffect(() => {
    if (!flyoutOpen) return;
    function handleOutside(e) {
      if (
        flyoutRef.current && !flyoutRef.current.contains(e.target) &&
        chipRef.current && !chipRef.current.contains(e.target)
      ) {
        setFlyoutOpen(false);
        setIsEditing(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [flyoutOpen]);

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
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: 72,
        height: '100%',
        position: 'relative',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      <style>{`
        @keyframes sidebarTextIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <aside
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: isExpanded ? 256 : 72,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: isExpanded ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: isExpanded
            ? '8px 0 32px -4px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.85)'
            : 'none',
          transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), background 0.24s ease, box-shadow 0.28s ease',
          boxSizing: 'border-box',
          overflow: isExpanded ? 'visible' : 'hidden',
          zIndex: 50,
        }}
      >
        {/* ── Top Brand Lockup (Matches Landing Page) ── */}
        <div
          style={{
            height: 64,
            padding: isExpanded ? '0 20px' : '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            borderBottom: '1px solid rgba(226, 232, 240, 0.55)',
            flexShrink: 0,
            transition: 'padding 0.24s ease',
          }}
        >
          <button
            onClick={onBackToLanding}
            title={!isExpanded ? 'CardioVision AI · Back to Landing Page' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              minWidth: 0,
              width: '100%',
              justifyContent: isExpanded ? 'flex-start' : 'center',
            }}
          >
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: isExpanded ? 'auto' : 72 }}>
              <BrandLogo size={30} />
            </div>
            {isExpanded && (
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.12rem',
                  letterSpacing: '-0.025em',
                  color: '#0f172a',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  animation: 'sidebarTextIn 0.22s ease',
                }}
              >
                CardioVision <span style={{ color: '#e11d48' }}>AI</span>
              </span>
            )}
          </button>
        </div>

        {/* ── Navigation Links (Smooth hover & active transitions) ── */}
        <div
          style={{
            flex: 1,
            padding: isExpanded ? '16px 12px' : '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            overflowY: 'auto',
            transition: 'padding 0.24s ease',
          }}
        >
          <div
            style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              color: '#94a3b8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: isExpanded ? '4px 10px 8px' : '0',
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            Clinical Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                title={!isExpanded ? `${item.label} · ${item.sub}` : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isExpanded ? 'space-between' : 'center',
                  gap: 10,
                  padding: isExpanded ? '9px 12px' : '10px 0',
                  borderRadius: 12,
                  border: 'none',
                  background: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 4px 14px rgba(15, 23, 42, 0.14)' : 'none',
                  position: 'relative',
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, justifyContent: isExpanded ? 'flex-start' : 'center', width: isExpanded ? 'auto' : '100%' }}>
                  <Icon
                    style={{
                      width: 18,
                      height: 18,
                      color: isActive ? '#38bdf8' : '#64748b',
                      flexShrink: 0,
                      transition: 'transform 0.2s ease',
                    }}
                  />
                  {isExpanded && (
                    <div style={{ lineHeight: 1.2, minWidth: 0, animation: 'sidebarTextIn 0.22s ease' }}>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: isActive ? 700 : 600,
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: '0.64rem',
                          color: isActive ? 'rgba(255,255,255,0.65)' : '#94a3b8',
                          fontWeight: 500,
                          marginTop: 1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.sub}
                      </div>
                    </div>
                  )}
                </div>

                {isExpanded && item.badge && (
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 5,
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.06)',
                      color: isActive ? '#ffffff' : item.badgeColor,
                      flexShrink: 0,
                      animation: 'sidebarTextIn 0.22s ease',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Bottom Section: Integrated Doctor Profile Chip with Upward Flyout ── */}
        <div
          style={{
            padding: isExpanded ? '12px' : '12px 8px',
            borderTop: '1px solid rgba(226, 232, 240, 0.65)',
            position: 'relative',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            transition: 'padding 0.24s ease',
          }}
        >
          <button
            ref={chipRef}
            onClick={() => {
              setFlyoutOpen(!flyoutOpen);
              if (!flyoutOpen) {
                setEditNameInput(doctorName);
                setIsEditing(false);
              }
            }}
            title={!isExpanded ? `${doctorName} · Attending Cardiologist` : undefined}
            aria-expanded={flyoutOpen}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isExpanded ? 'space-between' : 'center',
              gap: 10,
              background: flyoutOpen ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              border: flyoutOpen ? '1px solid #cbd5e1' : '1px solid rgba(226, 232, 240, 0.9)',
              borderRadius: 12,
              padding: isExpanded ? '6px 10px 6px 8px' : '6px',
              cursor: 'pointer',
              transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: flyoutOpen
                ? '0 0 0 3px rgba(225, 29, 72, 0.08), 0 4px 12px rgba(15, 23, 42, 0.06)'
                : '0 1px 3px rgba(15, 23, 42, 0.04)',
              boxSizing: 'border-box',
            }}
            onMouseOver={(e) => {
              if (!flyoutOpen) {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }
            }}
            onMouseOut={(e) => {
              if (!flyoutOpen) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, justifyContent: isExpanded ? 'flex-start' : 'center', width: isExpanded ? 'auto' : '100%' }}>
              {/* Avatar Circle */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: doctorAvatar
                    ? 'none'
                    : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.74rem',
                  fontWeight: 700,
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

              {/* Doctor Info Text */}
              {isExpanded && (
                <div style={{ textAlign: 'left', lineHeight: 1.25, minWidth: 0, animation: 'sidebarTextIn 0.22s ease' }}>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {doctorName}
                  </div>
                  <div
                    style={{
                      fontSize: '0.64rem',
                      color: '#64748b',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Attending Cardiologist
                  </div>
                </div>
              )}
            </div>

            {isExpanded && (
              <ChevronDown
                style={{
                  width: 14,
                  height: 14,
                  color: '#94a3b8',
                  transform: flyoutOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.18s ease',
                  flexShrink: 0,
                }}
              />
            )}
          </button>

        {/* ── Upward Flyout Modal ── */}
        {flyoutOpen && (
          <div
            ref={flyoutRef}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              left: 12,
              right: 12,
              zIndex: 100,
              background: '#ffffff',
              border: '1px solid rgba(226, 232, 240, 0.95)',
              borderRadius: 16,
              boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.18), 0 4px 12px rgba(15, 23, 42, 0.06)',
              overflow: 'hidden',
              animation: 'flyout-up 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <style>{`
              @keyframes flyout-up {
                from { opacity: 0; transform: translateY(6px) scale(0.98); }
                to   { opacity: 1; transform: translateY(0)   scale(1); }
              }
            `}</style>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />

            {!isEditing ? (
              <>
                <div style={{ padding: '16px 16px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
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
                          fontSize: '0.86rem',
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
                          fontSize: '0.7rem',
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

                  {/* Cath Lab Station status badge */}
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
                      }}
                    >
                      Cath Lab Station 4 · Active
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
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'none',
                      border: 'none',
                      color: '#0f172a',
                      fontSize: '0.78rem',
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
                      <span>Edit Physician Profile</span>
                    </div>
                    <Pencil style={{ width: 12, height: 12, color: '#94a3b8' }} />
                  </button>
                </div>

                <div style={{ height: 1, background: '#f1f5f9', margin: '2px 0' }} />

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
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'none',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#fef2f2')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <LogOut style={{ width: 14, height: 14 }} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
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
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    Edit Profile
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    background: '#f8fafc',
                    borderRadius: 10,
                    border: '1px solid #f1f5f9',
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: doctorAvatar
                        ? 'none'
                        : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      overflow: 'hidden',
                      flexShrink: 0,
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
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        padding: '4px 8px',
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
                          fontSize: '0.65rem',
                          color: '#dc2626',
                          background: 'none',
                          border: 'none',
                          padding: '1px 0',
                          cursor: 'pointer',
                          width: 'fit-content',
                        }}
                      >
                        <Trash2 style={{ width: 11, height: 11 }} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveProfile}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: 5,
                    }}
                  >
                    Physician Name
                  </label>
                  <input
                    type="text"
                    value={editNameInput}
                    onChange={(e) => setEditNameInput(e.target.value)}
                    placeholder="Dr. Full Name"
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 8,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: 12,
                    }}
                  />

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{
                        flex: 1,
                        padding: '7px',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        color: '#64748b',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1.2,
                        padding: '7px',
                        borderRadius: 8,
                        border: 'none',
                        background: saveFeedback ? '#059669' : '#0f172a',
                        color: '#ffffff',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                      }}
                    >
                      {saveFeedback ? (
                        <>
                          <Check style={{ width: 12, height: 12 }} />
                          <span>Saved</span>
                        </>
                      ) : (
                        <span>Save</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  </div>
);
}
