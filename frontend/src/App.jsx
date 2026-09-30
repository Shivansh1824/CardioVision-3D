import React, { useState } from 'react';
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
  // Shared state for the 3 coronary vessels across 3D Heart & Explorer
  // Initial state demonstrates multi-vessel differential glow:
  // LAD = moderate (amber), LCX = normal (emerald), RCA = critical (crimson)
  const [vesselStates, setVesselStates] = useState({
    LAD: 'moderate',
    LCX: 'normal',
    RCA: 'critical',
  });

  const [selectedArtery, setSelectedArtery] = useState('LAD');

  // Sign In modal state
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInRole, setSignInRole] = useState('doctor');

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body selection:bg-red-500/30 selection:text-red-200">
      
      {/* Top Sticky Navigation Header */}
      <Header
        onOpenSignIn={handleOpenSignIn}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section with Interactive 3D Heart Canvas & Proof Metrics */}
        <Hero
          onOpenSignIn={handleOpenSignIn}
          onScrollToSection={handleScrollToSection}
          vesselStates={vesselStates}
          onSelectArtery={setSelectedArtery}
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

        {/* 4-Step Clinical Workflow: Multimodal Diagnostic Intake to 3D Twin */}
        <ClinicalWorkflow />

        {/* 5-Fold Cross-Validated AI Accuracy & Benchmarks */}
        <MetricsSection />

        {/* Ethical Medical Notice & Safety Disclaimer */}
        <SafetyDisclaimer />
      </main>

      {/* Footer */}
      <Footer
        onOpenSignIn={handleOpenSignIn}
        onScrollToSection={handleScrollToSection}
      />

      {/* Sign In / Role Selection Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        initialRole={signInRole}
      />

    </div>
  );
}
