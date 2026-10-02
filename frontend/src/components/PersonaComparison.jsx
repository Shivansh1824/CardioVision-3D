import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function PersonaComparison({ onOpenSignIn }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      // Doctor section staggered entrance
      gsap.fromTo(
        '.doctor-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: '.doctor-block', start: 'top 85%' } }
      );
      gsap.fromTo(
        '.doctor-card',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.doctor-cards-grid', start: 'top 85%' } }
      );

      // Patient section staggered entrance
      gsap.fromTo(
        '.patient-header',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: '.patient-block', start: 'top 85%' } }
      );
      gsap.fromTo(
        '.patient-card',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.patient-cards-grid', start: 'top 85%' } }
      );
    },
    { scope: sectionRef }
  );

  return (
    <div ref={sectionRef} className="space-y-0">
      
      {/* ============================================================
          SECTION 1: FOR CARDIOLOGISTS & CLINICIANS (Dedicated)
          ============================================================ */}
      <section id="doctor-section" className="py-20 bg-slate-50/80 border-t border-slate-200">
        <div className="container-custom">
          
          <div className="doctor-block">
            {/* Header */}
            <div className="doctor-header max-w-3xl mb-12">
              {/* Style 1: Editorial Monospace Overline */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
                <span className="font-mono text-xs font-bold tracking-widest text-sky-700 uppercase">
                  Clinical Practice — Multi-Vessel Triage
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                How CardioVision Accelerates Daily Cardiology Practice
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
                Designed to reduce diagnostic guesswork, triage multi-vessel risk objectively, and help clinical teams make confident catheterization decisions in seconds.
              </p>
            </div>

            {/* 4 Doctor Workflow Cards */}
            <div className="doctor-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Rapid Pre-Cath Triage',
                  desc: 'Quickly flags patients who genuinely need urgent invasive catheterization versus those who can be safely managed with outpatient medical therapy.',
                  tag: 'Triage Efficiency',
                },
                {
                  title: 'Objective 3-Vessel Assessment',
                  desc: 'Evaluates LAD, LCX, and RCA individually in seconds, giving physicians an immediate anatomical breakdown of regional coronary risk.',
                  tag: 'Anatomical Precision',
                },
                {
                  title: 'Clear Risk Drivers',
                  desc: 'Directly shows which specific clinical markers (ECG wave changes, wall motion readings, lipid levels) drove the assessment rating.',
                  tag: 'Zero Black-Box Guessing',
                },
                {
                  title: 'Instant Clinical Summary',
                  desc: 'Generates a clean diagnostic summary with coronary findings ready for medical charts, referral letters, and multidisciplinary reviews.',
                  tag: 'EMR Ready',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="doctor-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 inline-block mb-3">
                      {card.tag}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{card.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="mt-8 flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200">
              <div className="text-xs text-slate-600">
                <strong>Clinician Portal:</strong> Review patient cohorts, check vessel risk scores, and download diagnostic summaries.
              </div>
              <button
                onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
                className="btn-primary-vibrant text-xs py-2 px-4 cursor-pointer"
              >
                <span>Doctor Portal Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 2: FOR HEART PATIENTS & FAMILIES (Dedicated)
          ============================================================ */}
      <section id="patient-section" className="py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          
          <div className="patient-block">
            {/* Header */}
            <div className="patient-header max-w-3xl mb-12">
              {/* Style A: Editorial Monospace Overline */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span className="font-mono text-xs font-bold tracking-widest text-rose-600 uppercase">
                  Patient Empowerment — Health Literacy
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                How CardioVision Gives Heart Patients Clarity &amp; Peace of Mind
              </h2>
              <p className="mt-3 text-slate-600 text-base sm:text-lg leading-relaxed">
                Replacing anxiety and complex medical terms with clear visual understanding. See your heart arteries, understand your diagnosis, and know what steps help you live better.
              </p>
            </div>

            {/* 4 Patient Benefit Cards */}
            <div className="patient-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'See Your Heart in 3D',
                  desc: 'Instead of staring at a page of numbers you cannot understand, see a clear 3D model showing where your heart is healthy and where it needs care.',
                  tag: 'Clear Visuals',
                },
                {
                  title: 'Plain-English Explanations',
                  desc: 'Every finding is translated into everyday words: "Your front artery has mild narrowing," so you always feel confident about your health.',
                  tag: 'No Jargon',
                },
                {
                  title: 'Understand What Helps',
                  desc: 'See how simple everyday actions—like taking a 30-minute daily walk, reducing salt, or taking prescribed medicine—keep your arteries healthy.',
                  tag: 'Actionable Steps',
                },
                {
                  title: 'Share with Family & Caregivers',
                  desc: 'Download an easy-to-understand summary you can show your loved ones, so everyone understands your recovery plan together.',
                  tag: 'Family Peace of Mind',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="patient-card p-6 rounded-2xl bg-rose-50/40 border border-rose-100 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md border border-rose-200 inline-block mb-3">
                      {card.tag}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{card.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="mt-8 flex items-center justify-between p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
              <div className="text-xs text-slate-700">
                <strong>Patient Heart Portal:</strong> View your personalized 3D heart, check healthy lifestyle tips, and download your heart guide.
              </div>
              <button
                onClick={() => onOpenSignIn && onOpenSignIn('patient')}
                className="btn-secondary-glass text-xs py-2 px-4 cursor-pointer"
              >
                <span>Patient Portal Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
