import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';

gsap.registerPlugin(ScrollTrigger);
import Hero from './components/Hero';
import VesselExplorer from './components/VesselExplorer';
import PersonaComparison from './components/PersonaComparison';
import ClinicalWorkflow from './components/ClinicalWorkflow';
import MetricsSection from './components/MetricsSection';
import Testimonials from './components/Testimonials';
import ClinicalFAQ from './components/ClinicalFAQ';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import Footer from './components/Footer';
import SignInModal from './components/SignInModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import ErrorBoundary from './components/ErrorBoundary';

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

  // Privacy Policy modal state
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Initialize Lenis smooth scrolling synchronized with GSAP ScrollTrigger (60fps standard)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Notify ScrollTrigger on every Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    // Smooth frame pacing (prevent lag spikes from dropped frames)
    gsap.ticker.lagSmoothing(500, 33);

    // Refresh ScrollTrigger positions after fonts and 3D canvases settle
    const refreshST = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', refreshST);
    window.addEventListener('load', refreshST);
    const initialSyncTimer = setTimeout(refreshST, 500);

    return () => {
      window.removeEventListener('resize', refreshST);
      window.removeEventListener('load', refreshST);
      clearTimeout(initialSyncTimer);
      gsap.ticker.remove(tickerCallback);
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
    <div className="min-h-screen bg-luminous-mesh text-slate-900 flex flex-col font-body selection:bg-rose-500/20 selection:text-rose-900">
      
      {/* Top Sticky Navigation Header */}
      <Header
        onOpenSignIn={handleOpenSignIn}
        onScrollToSection={handleScrollToSection}
        onOpenPolicy={() => setPrivacyOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section with Anatomical Heart Visualizer & Proof Metrics */}
        <ErrorBoundary>
          <Hero
            onOpenSignIn={handleOpenSignIn}
            onScrollToSection={handleScrollToSection}
            vesselStates={vesselStates}
            selectedArtery={selectedArtery}
            onSelectArtery={setSelectedArtery}
          />
        </ErrorBoundary>

        {/* Live Multi-Vessel Staging & What-If Simulator */}
        <ErrorBoundary>
          <VesselExplorer
            vesselStates={vesselStates}
            setVesselStates={setVesselStates}
            selectedArtery={selectedArtery}
            setSelectedArtery={setSelectedArtery}
          />
        </ErrorBoundary>

        {/* Dual Persona Architecture (Doctor View vs Patient View) */}
        <PersonaComparison
          onOpenSignIn={handleOpenSignIn}
        />

        {/* 4-Step Clinical Workflow */}
        <ClinicalWorkflow />

        {/* 5-Fold Cross-Validated AI Accuracy & Benchmarks */}
        <MetricsSection />

        {/* Peer Reviews & Clinical Testimonials */}
        <Testimonials />

        {/* Evidence & Clinical Governance FAQ */}
        <ClinicalFAQ />

        {/* Ethical Medical Notice & Safety Disclaimer */}
        <SafetyDisclaimer />
      </main>

      {/* Footer */}
      <Footer
        onOpenSignIn={handleOpenSignIn}
        onScrollToSection={handleScrollToSection}
        onOpenPrivacy={() => setPrivacyOpen(true)}
      />

      {/* Sign In / Role Selection Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        initialRole={signInRole}
      />

      {/* Privacy Policy & HIPAA Compliance Modal */}
      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />

    </div>
  );
}
