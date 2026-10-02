import React, { useState } from 'react';
import { LogIn, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header({ onOpenSignIn, onScrollToSection, onOpenPolicy }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
      {/* Header Container: Left-aligned brand with adjacent nav, balanced actions on the right */}
      <div className="max-w-[1512px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2.5 no-underline group shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-600 p-1.5 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-white"
              >
                <path d="M21 6V14M25 6V13M29 7V14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M17 14C17 9.5 21 8 26 8C31 8 34 11 34 16C34 18 33 20 31 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M14 20C9.5 21 7 26 8.5 32C10.5 40 22 44 26 44C30 44 41 38 41 28C41 21 36 17 31 17C27 17 24 19 23 21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors whitespace-nowrap">
              CardioVision <span className="text-rose-600">AI</span>
            </span>
          </a>
        </div>

        {/* Center: Primary Navigation Centered */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 border border-slate-200/80 px-3 py-1 rounded-full shadow-2xs">
          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1"
          >
            Artery Explorer
          </button>
          <button
            onClick={() => handleNavClick('doctor-section')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1"
          >
            Doctors
          </button>
          <button
            onClick={() => handleNavClick('patient-section')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1"
          >
            Patients
          </button>
          <button
            onClick={() => handleNavClick('clinical-workflow')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1"
          >
            Workflow
          </button>
          <button
            onClick={() => handleNavClick('clinical-faq')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1"
          >
            FAQ
          </button>
          <button
            onClick={() => handleNavClick('model-metrics')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1"
          >
            Accuracy
          </button>
        </nav>

        {/* Right Side: Proportional Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="btn-secondary-glass text-xs py-1.5 px-3.5 cursor-pointer"
            id="header-sign-in-btn"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-600" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="btn-primary-vibrant text-xs py-1.5 px-4 cursor-pointer"
            id="header-launch-twin-btn"
          >
            <span>Explore Arteries</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold"
          >
            Sign In
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white px-5 py-4 space-y-2">
          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            Artery Explorer
          </button>
          <button
            onClick={() => handleNavClick('doctor-section')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            For Doctors
          </button>
          <button
            onClick={() => handleNavClick('patient-section')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            For Patients
          </button>
          <button
            onClick={() => handleNavClick('clinical-workflow')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            Clinical Workflow
          </button>
          <button
            onClick={() => handleNavClick('clinical-faq')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            Clinical FAQ
          </button>
          <button
            onClick={() => handleNavClick('model-metrics')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            AI Accuracy
          </button>
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn && onOpenSignIn('doctor');
              }}
              className="btn-secondary-glass w-full justify-center text-xs py-2"
            >
              Sign In to Portal
            </button>
            <button
              onClick={() => handleNavClick('vessel-explorer')}
              className="btn-primary-vibrant w-full justify-center text-xs py-2"
            >
              Explore Coronary Arteries
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
