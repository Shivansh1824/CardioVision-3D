import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import DashboardSidebar from './shared/DashboardSidebar';
import DashboardTopBar from './shared/DashboardTopBar';
import PatientQueue from './triage/PatientQueue';
import PatientSummaryCard from './triage/PatientSummaryCard';
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
const DEFAULT_DEMO_PATIENT = {
  id: 1,
  patient_code: 'PT-001',
  name: 'James Smith',
  age: 62,
  sex: 'Male',
  bp: 155,
  ldl: 165,
  ef_tte: 42,
  st_elevation: 1,
  typical_chest_pain: 1,
  fbs: 110,
  htn: 1,
  dm: 0,
  current_smoker: 1,
};

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
  const [selectedPatient, setSelectedPatient] = useState(DEFAULT_DEMO_PATIENT);
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
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.65);
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
            padding: activeNav === '3d-studio' ? '12px 20px 16px' : (activeNav === 'home' ? '0' : '14px 24px 16px'),
            overflow: activeNav === '3d-studio' ? 'auto' : (activeNav === 'home' ? 'hidden' : 'hidden'),
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
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: 14,
                flex: 1,
                minHeight: 0,
                height: '100%',
              }}
            >
              <div
                style={{
                  gridColumn: 'span 12',
                  height: '100%',
                  minHeight: 0,
                  overflow: 'hidden',
                }}
                className="lg:!col-span-7"
              >
                <PatientQueue
                  selectedId={selectedPatient?.id}
                  onSelectPatient={handleSelectPatient}
                  onAddPatient={() => setIsAddSheetOpen(true)}
                />
              </div>
              <div
                style={{
                  gridColumn: 'span 12',
                  height: '100%',
                  minHeight: 0,
                  overflow: 'hidden',
                }}
                className="lg:!col-span-5"
              >
                <PatientSummaryCard
                  patient={selectedPatient}
                  triageLevel={
                    selectedPatient?.st_elevation > 0 || selectedPatient?.typical_chest_pain > 0
                      ? 'critical'
                      : selectedPatient?.bp > 140 || selectedPatient?.ldl > 160
                      ? 'moderate'
                      : 'stable'
                  }
                  onOpenClinical={handleOpenClinical}
                />
              </div>
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
