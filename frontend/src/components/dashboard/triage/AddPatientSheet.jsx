import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AddPatientSheet — slide-over panel for adding a new patient.
 * Upload button is wired for file selection; OCR edge function will be connected later.
 * Supported document types match the Supabase patients table schema.
 */

const SUPPORTED_DOCS = [
  {
    icon: '🧪',
    title: 'Blood Biochemistry / Lipid Profile',
    fields: 'LDL, HDL, TG, FBS, Creatinine, CBC values',
  },
  {
    icon: '📈',
    title: '12-Lead ECG Report',
    fields: 'ST-Elevation, ST-Depression, T-Inversion, Q-Wave, LVH, BBB',
  },
  {
    icon: '🫀',
    title: '2D Echocardiogram (TTE) Report',
    fields: 'EF%, RWMA regions, VHD grade',
  },
];

export default function AddPatientSheet({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | processing | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  function handleFileSelect(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setUploadState('uploading');
    setErrorMsg('');

    // Simulate upload progress → then OCR processing placeholder
    // Real OCR edge function call will replace this timeout in a future step
    setTimeout(() => {
      setUploadState('processing');
      setTimeout(() => {
        // Placeholder: in future, check edge function response here
        // If doc type unrecognized → setUploadState('error'), setErrorMsg(...)
        setUploadState('done');
      }, 1800);
    }, 900);
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (fileInputRef.current) fileInputRef.current.files = e.dataTransfer.files;
    handleFileSelect({ target: { files: e.dataTransfer.files } });
  }

  function resetUpload() {
    setFile(null);
    setUploadState('idle');
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sheetVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 340, damping: 34 } },
    exit: { x: '100%', transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,0.28)',
              zIndex: 60,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: 480,
              background: 'var(--dash-surface)',
              zIndex: 70,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 40px rgba(15,23,42,0.12)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid var(--dash-border)',
                background: 'var(--dash-surface-2)',
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.05rem',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    margin: 0,
                  }}
                >
                  Add New Patient
                </h2>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    margin: '2px 0 0',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Upload a diagnostic report to auto-extract patient data
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width: 34,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--dash-surface)',
                  border: '1.5px solid var(--dash-border)',
                  borderRadius: 9,
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <X style={{ width: 15, height: 15 }} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

              {/* Supported document types */}
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  marginBottom: 10,
                }}
              >
                Supported report types
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {SUPPORTED_DOCS.map((doc) => (
                  <div
                    key={doc.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '10px 14px',
                      background: 'var(--dash-surface-2)',
                      border: '1px solid var(--dash-border)',
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>{doc.icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-display)',
                          marginBottom: 2,
                        }}
                      >
                        {doc.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.69rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {doc.fields}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload zone */}
              {uploadState === 'idle' && (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--dash-border-strong)',
                    borderRadius: 14,
                    padding: '36px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--dash-surface-2)',
                    transition: 'all 0.18s var(--ease-expo)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--ai-accent)';
                    e.currentTarget.style.background = 'var(--ai-accent-bg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--dash-border-strong)';
                    e.currentTarget.style.background = 'var(--dash-surface-2)';
                  }}
                >
                  <Upload
                    style={{
                      width: 32,
                      height: 32,
                      color: 'var(--ai-accent)',
                      margin: '0 auto 12px',
                      display: 'block',
                    }}
                  />
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      margin: '0 0 4px',
                    }}
                  >
                    Drop your report here
                  </p>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-body)',
                      margin: '0 0 16px',
                    }}
                  >
                    PDF, JPG, or PNG · Max 10 MB
                  </p>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 18px',
                      background: 'var(--ai-accent)',
                      color: '#fff',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    <Upload style={{ width: 13, height: 13 }} />
                    Choose File
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    aria-label="Upload diagnostic report"
                  />
                </div>
              )}

              {/* Uploading state */}
              {uploadState === 'uploading' && (
                <div
                  style={{
                    border: '1.5px solid var(--ai-accent-border)',
                    borderRadius: 14,
                    padding: '28px 24px',
                    textAlign: 'center',
                    background: 'var(--ai-accent-bg)',
                  }}
                >
                  <FileText style={{ width: 28, height: 28, color: 'var(--ai-accent)', margin: '0 auto 10px', display: 'block' }} />
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 6px', fontSize: '0.88rem' }}>
                    {file?.name}
                  </p>
                  <p style={{ fontSize: '0.73rem', color: 'var(--ai-accent)', fontFamily: 'var(--font-body)', margin: '0 0 14px' }}>
                    Uploading…
                  </p>
                  <div style={{ height: 4, background: 'rgba(2,132,199,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--ai-accent)', borderRadius: 2, animation: 'uploadBar 0.9s ease-out forwards' }} />
                  </div>
                  <style>{`@keyframes uploadBar { from { width: 0% } to { width: 100% } }`}</style>
                </div>
              )}

              {/* Processing OCR state */}
              {uploadState === 'processing' && (
                <div
                  style={{
                    border: '1.5px solid rgba(217,119,6,0.2)',
                    borderRadius: 14,
                    padding: '28px 24px',
                    textAlign: 'center',
                    background: 'var(--vessel-moderate-bg)',
                  }}
                >
                  <Loader2
                    style={{
                      width: 28,
                      height: 28,
                      color: 'var(--vessel-moderate)',
                      margin: '0 auto 10px',
                      display: 'block',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 4px', fontSize: '0.88rem' }}>
                    Analyzing document…
                  </p>
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: 0 }}>
                    OCR extraction in progress — this takes a few seconds
                  </p>
                  <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
                </div>
              )}

              {/* Done state */}
              {uploadState === 'done' && (
                <div
                  style={{
                    border: '1.5px solid var(--vessel-safe-border)',
                    borderRadius: 14,
                    padding: '28px 24px',
                    textAlign: 'center',
                    background: 'var(--vessel-safe-bg)',
                  }}
                >
                  <CheckCircle2 style={{ width: 28, height: 28, color: 'var(--vessel-safe)', margin: '0 auto 10px', display: 'block' }} />
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 4px', fontSize: '0.88rem' }}>
                    Document processed
                  </p>
                  <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', margin: '0 0 14px' }}>
                    Fields will be pre-filled once OCR edge function is connected.
                  </p>
                  <button
                    onClick={resetUpload}
                    style={{
                      padding: '6px 14px',
                      background: 'var(--dash-surface)',
                      border: '1.5px solid var(--dash-border)',
                      borderRadius: 8,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    Upload another
                  </button>
                </div>
              )}

              {/* Error state — wrong document */}
              {uploadState === 'error' && (
                <div
                  style={{
                    border: '1.5px solid var(--vessel-critical-border)',
                    borderRadius: 14,
                    padding: '28px 24px',
                    textAlign: 'center',
                    background: 'var(--vessel-critical-bg)',
                  }}
                >
                  <AlertCircle style={{ width: 28, height: 28, color: 'var(--vessel-critical)', margin: '0 auto 10px', display: 'block' }} />
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: '0 0 6px', fontSize: '0.88rem' }}>
                    Wrong document type
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', margin: '0 0 14px', lineHeight: 1.5 }}>
                    {errorMsg || 'You have uploaded a wrong document. Please upload a Blood Biochemistry Report, 12-Lead ECG Report, or 2D Echocardiogram Report.'}
                  </p>
                  <button
                    onClick={resetUpload}
                    style={{
                      padding: '7px 16px',
                      background: 'var(--vessel-critical)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--dash-border)',
                background: 'var(--dash-surface-2)',
              }}
            >
              <p
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'center',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                OCR-driven intake · Doctor review required before saving ·{' '}
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>HIPAA-aligned</span>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
