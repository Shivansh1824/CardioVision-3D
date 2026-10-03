import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header';

gsap.registerPlugin(ScrollTrigger);
import Hero from './components/HeroConceptA';
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

import AuthPortalView from './components/AuthPortalView';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
import PatientDashboard from './components/dashboard/PatientDashboard';
import { supabase } from './services/supabaseClient';

// Clean up malformed double-hash if OAuth redirected with #dashboard#access_token
if (typeof window !== 'undefined' && window.location.hash.includes('#dashboard#access_token=')) {
  window.location.hash = window.location.hash.replace('#dashboard#', '#');
}

export default function App() {
  // Navigation view state ('landing' | 'auth' | 'dashboard') initialized from URL hash
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (
        hash.startsWith('#dashboard') || 
        hash.includes('access_token') || 
        hash.includes('refresh_token')
      ) {
        return 'dashboard';
      }
      if (hash.startsWith('#portal-signin') || hash === '#login') return 'auth';
      return 'landing';
    }
    return 'landing';
  });

  const [authRole, setAuthRole] = useState(() => {
    try {
      return localStorage.getItem('cardiovision_role') || 'doctor';
    } catch {
      return 'doctor';
    }
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('patient')) {
      return 'patient';
    }
    try {
      return localStorage.getItem('cardiovision_role') || 'doctor';
    } catch {
      return 'doctor';
    }
  });

  // Shared state for the 3 coronary vessels across Anatomical Heart & Explorer
  const [vesselStates, setVesselStates] = useState({
    LAD: 'moderate',
    LCX: 'normal',
    RCA: 'critical',
  });

  const [selectedArtery, setSelectedArtery] = useState('LAD');

  // Sign In modal state (retained for backward compatibility)
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInRole, setSignInRole] = useState('doctor');

  // Privacy Policy modal state
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Sync hash navigation (#portal-signin, #login, #dashboard, #dashboard-patient, access_token)
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (
        hash.startsWith('#dashboard') || 
        hash.includes('access_token') || 
        hash.includes('refresh_token')
      ) {
        if (hash.includes('patient') || localStorage.getItem('cardiovision_role') === 'patient') {
          setUserRole('patient');
        } else {
          setUserRole('doctor');
        }
        setCurrentView('dashboard');
      } else if (hash.startsWith('#portal-signin') || hash === '#login') {
        setCurrentView('auth');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handleHashSync);
    window.addEventListener('hashchange', handleHashSync);

    return () => {
      window.removeEventListener('popstate', handleHashSync);
      window.removeEventListener('hashchange', handleHashSync);
    };
  }, []);

  // Supabase Auth State Listener for Google OAuth and Email Session persistence
  useEffect(() => {
    if (!supabase) return;

    // Check initial existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        const resolvedRole = localStorage.getItem('cardiovision_role') || session.user.user_metadata?.role || 'doctor';
        setUserRole(resolvedRole);
        setCurrentView('dashboard');
        window.history.replaceState(null, '', resolvedRole === 'patient' ? '#dashboard-patient' : '#dashboard');
      }
    });

    // Listen for sign-in events (including Google OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') && session?.user) {
        setCurrentUser(session.user);
        const resolvedRole = localStorage.getItem('cardiovision_role') || session.user.user_metadata?.role || 'doctor';
        setUserRole(resolvedRole);
        setCurrentView('dashboard');
        window.history.replaceState(null, '', resolvedRole === 'patient' ? '#dashboard-patient' : '#dashboard');
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentView('landing');
        try {
          localStorage.removeItem('cardiovision_role');
        } catch {}
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Initialize Lenis smooth scrolling synchronized with GSAP ScrollTrigger (60fps standard)
  useEffect(() => {
    if (currentView === 'auth' || currentView === 'dashboard') return;

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
  }, [currentView]);

  const handleOpenSignIn = (role = 'doctor') => {
    setAuthRole(role);
    setSignInRole(role);
    setCurrentView('auth');
    window.history.pushState({ view: 'auth', role }, '', '#portal-signin');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    if (window.location.hash === '#portal-signin' || window.location.hash === '#login' || window.location.hash === '#dashboard') {
      window.history.pushState(null, '', window.location.pathname);
    }
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  const handleSignInSuccess = (user, role) => {
    setCurrentUser(user);
    const targetRole = role || user?.user_metadata?.role || userRole || 'doctor';
    setUserRole(targetRole);
    try {
      localStorage.setItem('cardiovision_role', targetRole);
    } catch {}
    setCurrentView('dashboard');
    window.history.pushState({ view: 'dashboard', role: targetRole }, '', '#dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSignOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setCurrentUser(null);
    try {
      localStorage.removeItem('cardiovision_role');
    } catch {}
    setCurrentView('landing');
    window.history.pushState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleScrollToSection = (sectionId) => {
    if (currentView !== 'landing') {
      handleBackToLanding();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render Doctor or Patient Dashboard when authenticated
  if (currentView === 'dashboard') {
    if (userRole === 'patient') {
      return (
        <PatientDashboard
          user={currentUser}
          onSignOut={handleSignOut}
          onBackToLanding={handleBackToLanding}
        />
      );
    }
    return (
      <DoctorDashboard
        user={currentUser}
        onSignOut={handleSignOut}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthPortalView
        onBack={handleBackToLanding}
        initialRole={authRole}
        onSignInSuccess={handleSignInSuccess}
      />
    );
  }

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
