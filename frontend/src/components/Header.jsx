import React, { useState } from 'react';
import { Activity, ShieldCheck, Heart, User, LogIn, Menu, X, Stethoscope } from 'lucide-react';

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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="container-custom flex items-center justify-between h-20">
        
        {/* Brand Logo & Hackathon Track Pill */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-3 text-white no-underline group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500 fill-red-500/30 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight text-white">
                  Cardio<span className="text-red-500">Vision</span>
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 border border-red-800/60 text-red-400 font-semibold">
                  3D
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase hidden sm:block">
                Digital Heart Twin • Track A
              </p>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 px-4 py-1.5 rounded-full backdrop-blur-md">
          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="nav-link cursor-pointer bg-transparent border-0"
          >
            Vessel Explorer
          </button>
          <button
            onClick={() => handleNavClick('persona-section')}
            className="nav-link cursor-pointer bg-transparent border-0"
          >
            Doctor vs. Patient
          </button>
          <button
            onClick={() => handleNavClick('clinical-workflow')}
            className="nav-link cursor-pointer bg-transparent border-0"
          >
            Clinical Workflow
          </button>
          <button
            onClick={() => handleNavClick('model-metrics')}
            className="nav-link cursor-pointer bg-transparent border-0"
          >
            AI Accuracy (0.912)
          </button>
          <button
            onClick={() => handleNavClick('safety-disclaimer')}
            className="nav-link cursor-pointer bg-transparent border-0"
          >
            Safety
          </button>
        </nav>

        {/* Action Buttons: Sign In + Launch CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="btn-secondary-glass text-sm flex items-center gap-2 group cursor-pointer"
            id="header-sign-in-btn"
          >
            <LogIn className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="btn-primary-glow text-sm cursor-pointer"
            id="header-launch-twin-btn"
          >
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Explore 3D Twin</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-xs text-red-300 font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-6 py-4 space-y-3">
          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="w-full text-left py-2 text-slate-300 text-sm hover:text-white"
          >
            Vessel Explorer (3D)
          </button>
          <button
            onClick={() => handleNavClick('persona-section')}
            className="w-full text-left py-2 text-slate-300 text-sm hover:text-white"
          >
            Doctor vs. Patient Persona
          </button>
          <button
            onClick={() => handleNavClick('clinical-workflow')}
            className="w-full text-left py-2 text-slate-300 text-sm hover:text-white"
          >
            Clinical Multimodal Workflow
          </button>
          <button
            onClick={() => handleNavClick('model-metrics')}
            className="w-full text-left py-2 text-slate-300 text-sm hover:text-white"
          >
            AI Accuracy & Validation
          </button>
          <button
            onClick={() => handleNavClick('safety-disclaimer')}
            className="w-full text-left py-2 text-slate-300 text-sm hover:text-white"
          >
            Clinical Safety Notice
          </button>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignIn && onOpenSignIn('doctor');
              }}
              className="btn-secondary-glass w-full justify-center text-sm"
            >
              Sign In to CardioVision
            </button>
            <button
              onClick={() => handleNavClick('vessel-explorer')}
              className="btn-primary-glow w-full justify-center text-sm"
            >
              Launch 3D Explorer
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
