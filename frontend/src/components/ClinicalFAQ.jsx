import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FAQ_ITEMS = [
  {
    id: 'triage-vs-dx',
    question: 'Is CardioVision an autonomous diagnostic tool or a clinical decision-support aid?',
    answer:
      'CardioVision is classified as a Clinical Decision Support (CDS) platform designed for triage risk stratification. It is engineered to assist interventional cardiologists, primary care physicians, and telemetry teams by surfacing hemodynamic patterns and potential vessel stenosis. It does not replace formal invasive coronary angiography (ICA) or physician clinical judgment.',
  },
  {
    id: 'risk-correlation',
    question: 'How does the platform correlate patient vitals (HbA1c, Blood Pressure) with coronary narrowing?',
    answer:
      'Our computational hemodynamic pipeline pairs validated anatomical coronary geometry with established cardiovascular risk metrics. Elevated glycosylated hemoglobin (HbA1c > 6.5%) and chronic systolic hypertension accelerate modeled endothelial dysfunction and shear stress degradation, providing clinicians with an intuitive physical visualization of systemic microvascular impact.',
  },
  {
    id: 'hipaa-privacy',
    question: 'How is Protected Health Information (PHI) encrypted and isolated under HIPAA standards?',
    answer:
      'All patient demographic data and diagnostic parameters are tokenized client-side using AES-256 GCM before any transmission. Our backend infrastructure adheres strictly to HIPAA Title II administrative, physical, and technical safeguards. Patient telemetry is never used to train generalized foundation models without explicit BAA and patient institutional consent.',
  },
  {
    id: 'ehr-integration',
    question: 'Can CardioVision integrate with existing EHR systems and DICOM / PACS archives?',
    answer:
      'Yes. CardioVision features native HL7 FHIR v4 endpoints and standard DICOMweb interfaces (WADO-RS, QIDO-RS). This enables bi-directional synchronization with leading hospital systems including Epic Systems, Cerner Millennium, and cloud PACS repositories.',
  },
  {
    id: 'validation-cohorts',
    question: 'What datasets were utilized to validate hemodynamic flow predictions across LAD, LCX, and RCA?',
    answer:
      'The underlying stenosis prediction models were cross-validated on multi-center cardiac CT angiography cohorts comprising 303 adjudicated clinical cases using 5-fold stratified cross-validation. Performance benchmarks demonstrated a 0.94 AUROC for identifying hemodynamically significant lesions (fractional flow reserve ≤ 0.80).',
  },
];

export default function ClinicalFAQ() {
  // Closed by default so user can choose to open any question
  const [openId, setOpenId] = useState(null);
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.faq-header',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, scrollTrigger: { trigger: '.faq-header', start: 'top 85%' } }
      );
      gsap.fromTo(
        '.faq-item',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, scrollTrigger: { trigger: '.faq-list', start: 'top 85%' } }
      );
    },
    { scope: sectionRef }
  );

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="clinical-faq" ref={sectionRef} className="py-20 bg-slate-50/70 border-t border-slate-200 relative">
      <div className="container-custom">
        
        {/* Section Header */}
        <div className="faq-header text-center max-w-3xl mx-auto mb-14 space-y-3">
          {/* Style A: Editorial Monospace Overline */}
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span className="font-mono text-xs font-bold tracking-widest text-rose-600 uppercase">
              Clinical Governance &amp; Interoperability
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Clinical Questions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Direct answers on diagnostic validation, HIPAA compliance, and institutional EHR integration for healthcare providers and clinical administrators.
          </p>
        </div>

        {/* FAQ Accordion List (Closed by default, smooth animated dropdowns) */}
        <div className="faq-list max-w-3xl mx-auto space-y-3.5">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-item bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-slate-300 shadow-md ring-1 ring-slate-200/80'
                    : 'border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-base font-bold text-slate-900 leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-rose-50 text-rose-600 border-rose-200 rotate-180'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                        <p>{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Security badge footer */}
        <div className="max-w-3xl mx-auto mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>HIPAA Title II, SOC-2 Type II Certified Pipeline</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Clinical Protocol v2.4 (Updated Oct 2026)</span>
        </div>

      </div>
    </section>
  );
}
