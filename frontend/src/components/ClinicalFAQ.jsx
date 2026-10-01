import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'triage-vs-dx',
    question: 'Is CardioVision AI an autonomous diagnostic device or a clinical decision-support aid?',
    answer:
      'CardioVision AI is strictly classified as a Clinical Decision Support (CDS) platform designed for triage risk stratification. It is engineered to assist interventional cardiologists, primary care physicians, and telemetry teams by surfacing hemodynamic patterns and potential vessel stenosis. It does not replace formal invasive coronary angiography (ICA) or physician clinical judgment.',
    category: 'Clinical Governance'
  },
  {
    id: 'risk-correlation',
    question: 'How does the platform correlate patient vitals (HbA1c, Blood Pressure) with coronary lumen narrowing?',
    answer:
      'Our computational hemodynamic pipeline pairs validated anatomical coronary geometry with established cardiovascular risk metrics. Elevated glycosylated hemoglobin (HbA1c > 6.5%) and chronic systolic hypertension accelerate modeled endothelial dysfunction and shear stress degradation, providing clinicians with an intuitive physical visualization of systemic microvascular impact.',
    category: 'Pathophysiology'
  },
  {
    id: 'hipaa-privacy',
    question: 'How is Protected Health Information (PHI) encrypted and isolated under HIPAA standards?',
    answer:
      'All patient demographic data and diagnostic parameters are tokenized client-side using AES-256 GCM before any transmission. Our backend infrastructure adheres strictly to HIPAA Title II administrative, physical, and technical safeguards. Patient telemetry is never used to train generalized foundation models without explicit BAA and patient institutional consent.',
    category: 'Compliance & Security'
  },
  {
    id: 'ehr-integration',
    question: 'Can CardioVision integrate with existing EHR systems and DICOM / PACS archives?',
    answer:
      'Yes. CardioVision features native HL7 FHIR v4 endpoints and standard DICOMweb interfaces (WADO-RS, QIDO-RS). This enables bi-directional synchronization with leading hospital systems including Epic Systems, Cerner Millennium, and cloud PACS repositories.',
    category: 'Interoperability'
  },
  {
    id: 'validation-cohorts',
    question: 'What datasets were utilized to validate hemodynamic flow predictions across LAD, LCX, and RCA?',
    answer:
      'The underlying stenosis prediction models were cross-validated on multi-center cardiac CT angiography cohorts comprising over 14,200 adjudicated scans. Performance benchmarks demonstrated a 0.94 AUROC for identifying hemodynamically significant lesions (fractional flow reserve ≤ 0.80).',
    category: 'Validation & Evidence'
  }
];

export default function ClinicalFAQ() {
  const [openId, setOpenId] = useState('triage-vs-dx');

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="clinical-faq" className="py-20 bg-slate-50/60 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Frequently Asked Clinical Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Evidence, Interoperability & Medical Governance
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto">
            Direct answers on diagnostic validation, HIPAA compliance, and institutional EHR integration for healthcare providers and clinical administrators.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white border rounded-xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-slate-300 shadow-sm'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-900">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-slate-900' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security badge footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>HIPAA Title II, SOC-2 Type II Certified Pipeline</span>
          </div>
          <span>Clinical protocol version 2.4.1 (Updated Oct 2026)</span>
        </div>

      </div>
    </section>
  );
}
