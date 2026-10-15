import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { id: 'hero-section', label: 'Heart 3D & Overview' },
  { id: 'vessel-explorer', label: 'Coronary Artery Simulator' },
  { id: 'doctor-section', label: 'Clinician Triage' },
  { id: 'clinical-workflow', label: '4-Step Clinical Workflow' },
  { id: 'model-metrics', label: 'AI Accuracy & Validation' },
  { id: 'testimonials', label: 'Cath Lab Reviews' },
  { id: 'clinical-faq', label: 'Governance & FAQ' },
];

export default function SectionScrollSpy({ onScrollToSection }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const indicatorRef = useRef(null);
  const buttonRefs = useRef([]);

  // GSAP ScrollTrigger to track active section with zero lag
  useGSAP(
    () => {
      const triggers = SECTIONS.map((sec, idx) => {
        const el = document.getElementById(sec.id);
        if (!el) return null;

        return ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) {
              setActiveIndex(idx);
            }
          },
        });
      });

      // Special top boundary listener
      const topTrigger = ScrollTrigger.create({
        start: 0,
        end: 150,
        onToggle: (self) => {
          if (self.isActive) setActiveIndex(0);
        },
      });

      return () => {
        triggers.forEach((st) => st?.kill());
        topTrigger.kill();
      };
    },
    { scope: containerRef }
  );

  // GSAP Smooth Sliding Animation: Glides the indicator pill to the active dot
  useGSAP(
    () => {
      const targetBtn = buttonRefs.current[activeIndex];
      const indicator = indicatorRef.current;
      if (!targetBtn || !indicator) return;

      const targetY = targetBtn.offsetTop + (targetBtn.offsetHeight - 20) / 2;

      gsap.to(indicator, {
        y: targetY,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    },
    { dependencies: [activeIndex], scope: containerRef }
  );

  const handleClick = (sec, idx) => {
    setActiveIndex(idx);
    if (onScrollToSection) {
      onScrollToSection(sec.id);
    } else {
      const el = document.getElementById(sec.id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={containerRef}
      aria-label="Section Navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center py-4 px-2 rounded-full bg-white/20 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(15,23,42,0.08)] ring-1 ring-slate-900/5 transition-all duration-300 hover:bg-white/30"
    >
      <div className="relative flex flex-col items-center gap-2.5">
        {/* GSAP Fluid Sliding Scroller Pill */}
        <div
          ref={indicatorRef}
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 w-1.5 h-5 rounded-full bg-gradient-to-b from-rose-500 to-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.65)] ring-2 ring-rose-200/60 pointer-events-none z-10"
          style={{ top: 0 }}
        />

        {/* Section Target Buttons & Fixed Guide Dots */}
        {SECTIONS.map((sec, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={sec.id}
              ref={(el) => (buttonRefs.current[idx] = el)}
              onClick={() => handleClick(sec, idx)}
              className="group relative flex items-center justify-center w-6 h-6 cursor-pointer bg-transparent border-0 select-none transition-transform"
              aria-label={`Jump to ${sec.label}`}
              aria-current={isActive ? 'true' : 'false'}
            >
              {/* Minimal Guide Dot (fades slightly when covered by sliding indicator) */}
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-1.5 h-1.5 opacity-0'
                    : 'w-1.5 h-1.5 bg-slate-400/40 group-hover:bg-slate-700 group-hover:scale-125'
                }`}
              />

              {/* Frosted Dark Glass Tooltip on Left */}
              <span className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white text-[11px] font-semibold whitespace-nowrap shadow-xl flex items-center gap-2 z-50">
                <span className="font-mono text-[9px] font-bold text-rose-400">
                  0{idx + 1}
                </span>
                <span className="text-slate-100">{sec.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
