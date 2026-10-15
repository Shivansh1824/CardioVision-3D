import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import DashboardSidebar from './shared/DashboardSidebar';
import DashboardTopBar from './shared/DashboardTopBar';
import PatientQueue from './triage/PatientQueue';
import PatientSummaryCard from './triage/PatientSummaryCard';
import PatientCardsGridView from './triage/PatientCardsGridView';
import EhrRegistryView from './triage/EhrRegistryView';
import CohortAnalyticsView from './triage/CohortAnalyticsView';
import AddPatientSheet from './triage/AddPatientSheet';
import ClinicalAnalysisView from './clinical/ClinicalAnalysisView';
import DoctorHomeView from './home/DoctorHomeView';

/**
 * DoctorDashboard — Modern clinical decision support portal with Left Sidebar Navigation.
 * Incorporates simplified, human-centered terminology:
 * - Home (Daily clinical briefing & 3D heart hero card)
 * - Patients (Active queue & triage)
 * - 3D Heart Studio (Interactive vascular & simulation)
 * - Medical Records (Visit history & EHR registry)
 * - Analytics (AI model accuracy & cohort distribution)
 */
import { getPatientById } from '../../services/patientDataService';

export default function DoctorDashboard({ user, onSignOut, onBackToLanding }) {
  // Navigation: 'home' | 'patients' | '3d-studio' | 'records' | 'analytics'
  const [activeNav, setActiveNav] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const match = hash.match(/tab=([a-z0-9-]+)/);
      if (match && ['home', 'patients', '3d-studio', 'records', 'analytics'].includes(match[1])) {
        return match[1];
      }
    }
    return 'home';
  });
  const [selectedPatient, setSelectedPatient] = useState(() => getPatientById(1));
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const viewContainerRef = useRef(null);

  const handleNavChange = (nav) => {
    setActiveNav(nav);
    if (typeof window !== 'undefined') {
      window.location.hash = `#dashboard?tab=${nav}`;
    }
  };

  useEffect(() => {
    if (!selectedPatient) setSelectedPatient(DEFAULT_DEMO_PATIENT);
  }, []);

  // GSAP entrance and screen transition animation on nav change: smooth zero-bounce fade
  useGSAP(() => {
    if (viewContainerRef.current) {
      gsap.fromTo(
        viewContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.24, ease: 'power1.out', clearProps: 'opacity' }
      );
    }
  }, { dependencies: [activeNav] });

  const handleSelectPatient = (patient) => setSelectedPatient(patient);

  const handleOpenClinical = (patient) => {
    if (patient) setSelectedPatient(patient);
    handleNavChange('3d-studio');
  };

  const handlePatientAdded = (newPatient) => {
    setSelectedPatient(newPatient);
    setIsAddSheetOpen(false);
  };

  // Section header meta for TopBar breadcrumb
  const sectionMeta = {
    home: {
      title: 'Home',
      subtitle: 'Daily Clinical Overview & Triage Briefing',
    },
    patients: {
      title: 'Patients',
      subtitle: 'Active clinical triage & telemetry queue · 303 cases',
    },
    '3d-studio': {
      title: '3D Heart Studio',
      subtitle: selectedPatient
        ? `Coronary vascular anatomy & hemodynamics · ${selectedPatient.name} (${selectedPatient.patient_code})`
        : 'Interactive 3D vascular reconstruction & stent simulator',
    },
    records: {
      title: 'Medical Records',
      subtitle: 'Longitudinal EHR visit history & committed intervention protocols',
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'Zero-leakage multi-modal AI model governance & ROC-AUC benchmarks',
    },
  }[activeNav] || { title: 'Home', subtitle: 'Clinical workstation' };

  return (
    <div
      className="bg-luminous-mesh text-slate-900"
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        fontFamily: 'var(--font-body)',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(226, 232, 240, 0.45);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.7);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.9);
        }
        @keyframes pulse-live-dot {
          0%, 100% { box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.25); }
          50% { box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1); }
        }
      `}</style>

      {/* ── Left Sidebar Navigation (Moodify / Epic standard) ── */}
      <DashboardSidebar
        activeNav={activeNav}
        onSelectNav={handleNavChange}
        user={user}
        onSignOut={onSignOut}
        onBackToLanding={onBackToLanding}
        patientCount={303}
      />

      {/* ── Main Canvas (TopBar + Dynamic Workstation) ── */}
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Workspace Top Bar */}
        <DashboardTopBar
          user={user}
          onSignOut={onSignOut}
          sectionTitle={sectionMeta.title}
          sectionSubtitle={sectionMeta.subtitle}
        />

        {/* Dynamic Section Content */}
        <main
          ref={viewContainerRef}
          style={{
            flex: 1,
            minHeight: 0,
            padding: activeNav === '3d-studio' ? '10px 18px 12px' : (activeNav === 'home' ? '0' : '14px 24px 16px'),
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeNav === 'home' && (
            <div
              key="view-home"
              style={{
                flex: 1,
                minHeight: 0,
                height: '100%',
                overflow: 'hidden',
                padding: '14px 24px 16px',
                boxSizing: 'border-box',
              }}
            >
              <DoctorHomeView
                user={user}
                onOpenPatient={(p) => {
                  if (p) setSelectedPatient(p);
                  handleNavChange('3d-studio');
                }}
                onGoToStudio={() => handleNavChange('3d-studio')}
                onGoToPatients={() => handleNavChange('patients')}
                onGoToRecords={() => handleNavChange('records')}
              />
            </div>
          )}

          {activeNav === 'patients' && (
            <div
              key="view-patients"
              style={{
                flex: 1,
                minHeight: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <PatientCardsGridView
                selectedId={selectedPatient?.id}
                onSelectPatient={handleSelectPatient}
                onOpenStudio={(patient) => {
                  if (patient) setSelectedPatient(patient);
                  handleNavChange('3d-studio');
                }}
                onAddPatient={() => setIsAddSheetOpen(true)}
              />
            </div>
          )}

          {activeNav === '3d-studio' && (
            <div key="view-studio" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <ClinicalAnalysisView
                patient={selectedPatient}
                onBackToQueue={() => handleNavChange('patients')}
                onSelectPatient={handleSelectPatient}
              />
            </div>
          )}

          {activeNav === 'records' && (
            <div key="view-records" style={{ flex: 1, minHeight: 0, height: '100%', overflow: 'hidden' }}>
              <EhrRegistryView
                onSelectPatientForAnalysis={(rec) => {
                  setSelectedPatient({
                    id: rec.patient_id,
                    patient_code: rec.patient_code,
                    name: rec.patient_name,
                    bp: rec.baseline_bp,
                    ldl: rec.baseline_ldl,
                  });
                  handleNavChange('3d-studio');
                }}
              />
            </div>
          )}

          {activeNav === 'analytics' && (
            <div key="view-analytics" style={{ flex: 1, minHeight: 0, height: '100%', overflow: 'hidden' }}>
              <CohortAnalyticsView onGoToPatients={() => handleNavChange('patients')} />
            </div>
          )}
        </main>
      </div>

      {/* Add Patient Sheet Modal */}
      <AddPatientSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onPatientAdded={handlePatientAdded}
      />
    </div>
  );
}
