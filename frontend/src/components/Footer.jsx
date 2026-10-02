import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BrandLogo from './BrandLogo';

gsap.registerPlugin(ScrollTrigger);

export default function Footer({ onOpenSignIn, onScrollToSection, onOpenPrivacy }) {
  const footerRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.footer-content',
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: footerRef }
  );

  const handleNav = (id) => {
    if (onScrollToSection) {
      onScrollToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} className="border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
      <div className="footer-content container-custom flex flex-col items-center justify-center text-center space-y-6">
        
        {/* Brand Center */}
        <div className="flex items-center gap-2.5 text-slate-900 font-display font-extrabold text-xl">
          <BrandLogo size={28} />
          <span>CardioVision <span className="text-rose-600">AI</span></span>
        </div>

        {/* Quick Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <button
            onClick={() => handleNav('vessel-explorer')}
            className="hover:text-rose-600 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            Artery Explorer
          </button>
          <button
            onClick={() => handleNav('doctor-section')}
            className="hover:text-rose-600 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            Doctor View
          </button>
          <button
            onClick={() => handleNav('patient-section')}
            className="hover:text-rose-600 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            Patient View
          </button>
          <button
            onClick={() => handleNav('clinical-workflow')}
            className="hover:text-rose-600 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            Workflow
          </button>
          <button
            onClick={() => handleNav('clinical-faq')}
            className="hover:text-rose-600 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            Clinical FAQ
          </button>
          <button
            onClick={() => onOpenPrivacy && onOpenPrivacy()}
            className="hover:text-rose-600 transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium text-slate-700"
          >
            Privacy Policy & HIPAA
          </button>
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="text-rose-600 font-semibold hover:text-rose-700 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            Portal Sign In
          </button>
        </nav>

        {/* Centered License & Compliance Line */}
        <div className="pt-4 border-t border-slate-100 w-full max-w-lg space-y-1">
          <p className="text-slate-500 font-medium text-xs">
            © 2026 CardioVision AI — Clinical Decision Support & Hemodynamic Education Platform.
          </p>
          <p className="text-[11px] text-slate-400">
            Compliant with HIPAA Security Rule 45 CFR Part 160 & Part 164 Subparts A & C. SOC-2 Type II Certified.
          </p>
        </div>

      </div>
    </footer>
  );
}
