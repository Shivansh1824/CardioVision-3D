import { useState, useEffect, useRef } from 'react';
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
import SectionScrollSpy from './components/SectionScrollSpy';
import SignInModal from './components/SignInModal';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import ErrorBoundary from './components/ErrorBoundary';

import AuthPortalView from './components/AuthPortalView';
import DoctorDashboard from './components/dashboard/DoctorDashboard';
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

  const [currentUser, setCurrentUser] = useState(null);

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

  // Sync hash navigation (#portal-signin, #login, #dashboard, access_token)
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (
        hash.startsWith('#dashboard') || 
        hash.includes('access_token') || 
        hash.includes('refresh_token')
      ) {
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

  // Optimistic Backend Pre-Warming: Silently wakes up Render in the background
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://cardiovision-3d.onrender.com';
    try {
      fetch(`${apiUrl}/`, { method: 'GET', mode: 'cors' }).catch(() => {});
    } catch {}
  }, []);

  // Supabase Auth State Listener for Google OAuth and Email Session persistence
  useEffect(() => {
    if (!supabase) return;

    // Check initial existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        setCurrentView('dashboard');
        window.history.replaceState(null, '', '#dashboard');
      }
    });

    // Listen for sign-in events (including Google OAuth redirects)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') && session?.user) {
        setCurrentUser(session.user);
        setCurrentView('dashboard');
        window.history.replaceState(null, '', '#dashboard');
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

  const lenisRef = useRef(null);

  // Initialize Lenis smooth scrolling synchronized with GSAP ScrollTrigger (60fps standard)
  useEffect(() => {
    if (currentView === 'auth' || currentView === 'dashboard') return;

    const lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    // Notify ScrollTrigger on every Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    // Disable lagSmoothing so GSAP and Lenis RAF tick in perfect 1:1 hardware frame sync
    gsap.ticker.lagSmoothing(0);

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
      lenisRef.current = null;
    };
  }, [currentView]);

  const handleOpenSignIn = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://cardiovision-3d.onrender.com';
    try { fetch(`${apiUrl}/`, { method: 'GET', mode: 'cors' }).catch(() => {}); } catch {}
    setSignInRole('doctor');
    setCurrentView('auth');
    window.history.pushState({ view: 'auth' }, '', '#portal-signin');
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

  const handleSignInSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('cardiovision_role', 'doctor');
    } catch {}
    setCurrentView('dashboard');
    window.history.pushState({ view: 'dashboard' }, '', '#dashboard');
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
    const targetSelector = '#' + sectionId;
    if (currentView !== 'landing') {
      handleBackToLanding();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(el, { duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Render Doctor Clinical Suite when authenticated
  if (currentView === 'dashboard') {
    return (
      <ErrorBoundary>
        <DoctorDashboard
          user={currentUser}
          onSignOut={handleSignOut}
          onBackToLanding={handleBackToLanding}
        />
      </ErrorBoundary>
    );
  }

  if (currentView === 'auth') {
    return (
      <AuthPortalView
        onBack={handleBackToLanding}
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
      />

      {/* Right-Side Floating Section Indicator Rail (Desktop) */}
      <SectionScrollSpy onScrollToSection={handleScrollToSection} />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section with Anatomical Heart Visualizer & Proof Metrics */}
        <ErrorBoundary>
          <Hero
            onOpenSignIn={handleOpenSignIn}
            onScrollToSection={handleScrollToSection}
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
