import React, { useState } from 'react';
import { LogIn, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header({ onOpenSignIn, onScrollToSection }) {
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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 transition-all shadow-xs">
      <div className="container-custom flex items-center justify-between h-18">
        
        {/* Brand Logo: Clean Anatomical Vector + Single-line 'CardioVision AI' to the far left */}
        <div className="flex items-center">
          <a href="#" className="flex items-center gap-2.5 no-underline group">
            {/* Clinical Anatomical Heart Vector Emblem */}
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-md shadow-rose-500/25 p-1.5 transition-transform duration-200 group-hover:scale-105">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-white"
              >
                {/* Aortic Arch & Brachiocephalic Stems */}
                <path
                  d="M21 6V14M25 6V13M29 7V14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M17 14C17 9.5 21 8 26 8C31 8 34 11 34 16C34 18 33 20 31 22"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                {/* Pulmonary Trunk */}
                <path
                  d="M14 16C14 13 18 12 21 15L23 20"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                {/* Muscular Ventricle & Atrium Contour */}
                <path
                  d="M14 20C9.5 21 7 26 8.5 32C10.5 40 22 44 26 44C30 44 41 38 41 28C41 21 36 17 31 17C27 17 24 19 23 21"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Coronary Artery Sulcus Trace */}
                <path
                  d="M24 21C24 27 20 34 17 38"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                <path
                  d="M21 28L25 31"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            </div>

            {/* Brand text strictly in one line, no subtitle, no red dot */}
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
              CardioVision <span className="text-rose-600">AI</span>
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links — Centered, Single Line, Concise */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 px-3 py-1.5 rounded-full shadow-2xs">
          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Vessel Explorer
          </button>
          <button
            onClick={() => handleNavClick('doctor-section')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Doctor View
          </button>
          <button
            onClick={() => handleNavClick('patient-section')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Patient View
          </button>
          <button
            onClick={() => handleNavClick('clinical-workflow')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Clinical Steps
          </button>
          <button
            onClick={() => handleNavClick('model-metrics')}
            className="nav-link cursor-pointer bg-transparent border-0 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            AI Accuracy
          </button>
        </nav>

        {/* Action Buttons — Sleek, Refined Proportions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="btn-secondary-glass text-xs py-2 px-4 cursor-pointer"
            id="header-sign-in-btn"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-600" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="btn-primary-vibrant text-xs py-2 px-4.5 cursor-pointer"
            id="header-launch-twin-btn"
          >
            <span>Explore Vessels</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold"
          >
            Sign In
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-6 py-4 space-y-2">
          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            Vessel Explorer
          </button>
          <button
            onClick={() => handleNavClick('doctor-section')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            Doctor View
          </button>
          <button
            onClick={() => handleNavClick('patient-section')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            Patient View
          </button>
          <button
            onClick={() => handleNavClick('clinical-workflow')}
            className="w-full text-left py-2 text-slate-800 text-sm font-medium"
          >
            Clinical Steps
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
              Sign In to CardioVision
            </button>
            <button
              onClick={() => handleNavClick('vessel-explorer')}
              className="btn-primary-vibrant w-full justify-center text-xs py-2"
            >
              Explore Coronary Vessels
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
