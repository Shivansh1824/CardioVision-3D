import React, { useState } from 'react';
import { Activity, LogIn, Menu, X, Sparkles } from 'lucide-react';

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
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-950/70 border-b border-white/10 transition-all">
      <div className="container-custom flex items-center justify-between h-20">
        
        {/* Brand Logo: CardioVision (Modern & Animated) */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-3.5 text-white no-underline group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-violet-600 to-cyan-400 p-0.5 shadow-xl shadow-rose-500/25 group-hover:scale-105 group-hover:shadow-rose-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950/90 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-transparent to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-6 h-6 text-rose-500 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.4" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-rose-100 transition-colors">
                  Cardio<span className="text-gradient-vivid">Vision</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider">
                Digital Heart Twin & Decision AI
              </p>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/50 border border-white/10 px-5 py-2 rounded-full backdrop-blur-xl shadow-lg">
          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="nav-link cursor-pointer bg-transparent border-0 text-sm hover:text-white"
          >
            Vessel Explorer
          </button>
          <button
            onClick={() => handleNavClick('persona-section')}
            className="nav-link cursor-pointer bg-transparent border-0 text-sm hover:text-white"
          >
            Doctor vs. Patient
          </button>
          <button
            onClick={() => handleNavClick('clinical-workflow')}
            className="nav-link cursor-pointer bg-transparent border-0 text-sm hover:text-white"
          >
            Clinical Workflow
          </button>
          <button
            onClick={() => handleNavClick('model-metrics')}
            className="nav-link cursor-pointer bg-transparent border-0 text-sm hover:text-white"
          >
            AI Accuracy (0.912)
          </button>
          <button
            onClick={() => handleNavClick('safety-disclaimer')}
            className="nav-link cursor-pointer bg-transparent border-0 text-sm hover:text-white"
          >
            Safety
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="btn-secondary-glass text-sm flex items-center gap-2 group cursor-pointer"
            id="header-sign-in-btn"
          >
            <LogIn className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="btn-primary-vibrant text-sm cursor-pointer"
            id="header-launch-twin-btn"
          >
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Explore Twin</span>
          </button>
        </div>

        {/* Mobile Menu Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
            className="px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-700/60 text-xs text-rose-200 font-semibold"
          >
            Sign In
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-2xl px-6 py-5 space-y-3">
          <button
            onClick={() => handleNavClick('vessel-explorer')}
            className="w-full text-left py-2.5 text-slate-200 text-sm font-medium"
          >
            Vessel Explorer
          </button>
          <button
            onClick={() => handleNavClick('persona-section')}
            className="w-full text-left py-2.5 text-slate-200 text-sm font-medium"
          >
            Doctor vs. Patient View
          </button>
          <button
            onClick={() => handleNavClick('clinical-workflow')}
            className="w-full text-left py-2.5 text-slate-200 text-sm font-medium"
          >
            Clinical Multimodal Workflow
          </button>
          <button
            onClick={() => handleNavClick('model-metrics')}
            className="w-full text-left py-2.5 text-slate-200 text-sm font-medium"
          >
            AI Accuracy & Validation
          </button>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
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
              className="btn-primary-vibrant w-full justify-center text-sm"
            >
              Explore Digital Twin
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
