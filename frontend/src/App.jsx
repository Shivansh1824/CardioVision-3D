import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Header from './components/Header';
import Hero from './components/Hero';
import VesselExplorer from './components/VesselExplorer';
import PersonaComparison from './components/PersonaComparison';
import ClinicalWorkflow from './components/ClinicalWorkflow';
import MetricsSection from './components/MetricsSection';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';

export default function App() {
  // Shared state for the 3 coronary vessels across Anatomical Heart & Explorer
  const [vesselStates, setVesselStates] = useState({
    LAD: 'moderate',
    LCX: 'normal',
    RCA: 'critical',
  });

  const [selectedArtery, setSelectedArtery] = useState('LAD');

  // Sign In modal state
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInRole, setSignInRole] = useState('doctor');

  // Initialize Lenis smooth scrolling (Modern Immersive standard)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  const handleOpenSignIn = (role = 'doctor') => {
    setSignInRole(role);
    setSignInOpen(true);
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-clinical-void text-slate-100 flex flex-col font-body selection:bg-rose-500/30 selection:text-rose-200">
      
      {/* Top Sticky Navigation Header */}
      <Header
        onOpenSignIn={handleOpenSignIn}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section with Anatomical Heart Visualizer & Proof Metrics */}
        <Hero
          onOpenSignIn={handleOpenSignIn}
          onScrollToSection={handleScrollToSection}
          vesselStates={vesselStates}
          onSelectArtery={(key) => {
            setSelectedArtery(key);
          }}
        />

        {/* Live Multi-Vessel Staging & What-If Simulator */}
        <VesselExplorer
          vesselStates={vesselStates}
          setVesselStates={setVesselStates}
          selectedArtery={selectedArtery}
          setSelectedArtery={setSelectedArtery}
        />

        {/* Dual Persona Architecture (Doctor View vs Patient View) */}
        <PersonaComparison
          onOpenSignIn={handleOpenSignIn}
        />

        {/* 4-Step Clinical Workflow */}
        <ClinicalWorkflow />

        {/* 5-Fold Cross-Validated AI Accuracy & Benchmarks */}
        <MetricsSection />

        {/* Ethical Medical Notice & Safety Disclaimer */}
        <SafetyDisclaimer />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sign In / Role Selection Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        initialRole={signInRole}
      />

    </div>
  );
}
