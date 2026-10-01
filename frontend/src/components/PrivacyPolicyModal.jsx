import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-base font-bold text-slate-900">
                Privacy Policy & HIPAA Compliance Notice
              </h3>
              <p className="text-xs text-slate-500">Effective Date: October 1, 2026 | Document Rev 3.2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 leading-relaxed">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              1. Protection of Protected Health Information (PHI)
            </h4>
            <p>
              CardioVision AI operates in strict compliance with the Health Insurance Portability and Accountability Act (HIPAA) of 1996 and HITECH standards. All biometric data, telemetry metrics (HbA1c, blood pressure, lipid panels), and anatomical scans uploaded to our servers undergo immediate client-side tokenization and AES-256 GCM encryption.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
              <FileText className="w-4 h-4 text-slate-700" />
              2. Zero-Model Training Guarantee on Identifiable Data
            </h4>
            <p>
              Under no circumstances is patient-identifiable data used to train, fine-tune, or calibrate public AI foundation models. De-identified clinical telemetry may only be processed for continuous algorithmic QA within a zero-data-retention, encrypted sandbox, strictly adhering to formal Business Associate Agreements (BAA).
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              3. Clinical Decision Support (CDS) Governance & Terms
            </h4>
            <p>
              CardioVision is engineered as an auxiliary clinical decision-support and patient communication aid. The interactive 3D vessel views and hemodynamic stenosis estimations provide indicative physiological modeling and do not constitute an autonomous medical diagnosis or a substitute for expert cardiology evaluation.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              4. Patient Rights & Data Sovereignty
            </h4>
            <p>
              Patients and hospital organizations retain complete sovereignty over their clinical telemetry. You may request irrevocable data purging, audit access logs, or export full DICOM session histories at any point through your designated clinical portal administrator.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">SOC-2 Type II Certified</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
