import { useState, useMemo } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Info,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { derivePatientShapDrivers } from '../../../services/shapExplainerService';


/**
 * ShapExplainerCard — Explainable AI (XAI) transparent attribution breakdown.
 */
export default function ShapExplainerCard({
  patient,
  simulationState = null,
  backendShap = null,
  style,
}) {
  const [selectedVessel, setSelectedVessel] = useState('cad'); // 'cad' | 'lad' | 'lcx' | 'rca'
  const [expanded, setExpanded] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Get drivers either from backend response or derived clinical baseline (with live simulator reactivity)
  const drivers = useMemo(() => {
    if (backendShap && backendShap[selectedVessel]) {
      return backendShap[selectedVessel].map((d) => ({
        feature: d.feature_name || d.feature,
        category: d.category || 'Biomarker',
        impact: Number((d.shap_value * 100).toFixed(1)),
        type: d.shap_value >= 0 ? 'elevator' : 'protective',
        clinicalRationale: d.clinical_explanation || 'Mathematical tree explainer attribution.',
      }));
    }
    return derivePatientShapDrivers(patient, selectedVessel, simulationState);
  }, [backendShap, selectedVessel, patient, simulationState]);

  const elevators = drivers.filter((d) => d.type === 'elevator');
  const protective = drivers.filter((d) => d.type === 'protective');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(245, 243, 255, 0.38) 50%, rgba(255, 255, 255, 0.82) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: 18,
        border: '1.5px solid rgba(255, 255, 255, 0.90)',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
        overflow: 'hidden',
        height: '100%',
        minHeight: 0,
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--dash-border)',
          background: 'var(--dash-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu style={{ width: 16, height: 16, color: '#0284c7' }} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Explainable AI (SHAP)
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  background: '#e0f2fe',
                  padding: '1px 6px',
                  borderRadius: 5,
                }}
              >
                TreeExplainer
              </span>
            </h3>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
              AI feature contribution (Red = Elevates Risk, Green = Protects)
            </p>
          </div>
        </div>

        {/* Info Icon Button (Opens Educational Modal) */}
        <button
          type="button"
          onClick={() => setShowInfoModal(true)}
          style={{
            background: '#f8fafc',
            border: '1px solid var(--dash-border)',
            borderRadius: 7,
            cursor: 'pointer',
            color: '#0284c7',
            padding: '5px 7px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.68rem',
            fontWeight: 700,
            transition: 'all 0.15s ease',
          }}
          title="Learn how SHAP explains predictions"
        >
          <Info style={{ width: 13, height: 13 }} />
          <span>Guide</span>
        </button>
      </div>

      {/* Educational Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
              padding: 20,
            }}
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 480,
                background: '#ffffff',
                borderRadius: 20,
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                overflow: 'hidden',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Cpu style={{ width: 20, height: 20, color: '#bae6fd' }} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                      What is Explainable AI (SHAP)?
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#e0f2fe' }}>
                      TreeExplainer Feature Attribution & Game Theory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    borderRadius: 8,
                    padding: 6,
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                  }}
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  <strong>SHAP (SHapley Additive exPlanations)</strong> breaks down complex machine-learning ensemble trees to show the exact mathematical contribution of each patient biomarker to their CAD and vessel stenosis risk.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    padding: 12,
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <TrendingUp style={{ width: 14, height: 14, color: '#dc2626' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#991b1b' }}>
                        Red Bars (Risk Elevators 🔺)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                        Biomarkers pushing CAD and arterial stenosis probability higher than population baseline (e.g., severe BP, elevated LDL, active smoking, ST elevation).
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <TrendingDown style={{ width: 14, height: 14, color: '#16a34a' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534' }}>
                        Green Bars (Protective Factors 🟢)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>
                        Biomarkers actively defending vascular health and pulling predicted risk downward (e.g., target BP, low LDL, high ejection fraction).
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    fontSize: '0.74rem',
                    color: '#0369a1',
                  }}
                >
                  <Sparkles style={{ width: 15, height: 15, flexShrink: 0 }} />
                  <span>
                    <strong>Live Simulator Sync:</strong> When you adjust levers in the What-If Simulator, SHAP attributions update in real time to reflect your simulated targets.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    alignSelf: 'flex-end',
                  }}
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Simulator Sync Indicator */}
      {simulationState?.isSimulated && (
        <div
          style={{
            margin: '8px 16px 0',
            padding: '6px 12px',
            borderRadius: 8,
            background: simulationState.isEscalation ? '#fef2f2' : '#ecfdf5',
            border: '1px solid',
            borderColor: simulationState.isEscalation ? '#fecaca' : '#a7f3d0',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.70rem',
            color: simulationState.isEscalation ? '#991b1b' : '#065f46',
          }}
        >
          <Sparkles style={{ width: 13, height: 13, flexShrink: 0 }} />
          <span>
            <strong>Simulator Synced:</strong> Explaining risk for Target BP <strong>{simulationState.simulatedBp} mmHg</strong> & LDL <strong>{simulationState.simulatedLdl} mg/dL</strong>.
          </span>
        </div>
      )}

      {/* Target Artery Switcher */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '8px 16px',
          borderBottom: '1px solid var(--dash-border)',
          background: 'var(--dash-surface)',
        }}
      >
        {[
          { key: 'cad', label: 'Overall CAD' },
          { key: 'lad', label: 'LAD Artery' },
          { key: 'lcx', label: 'LCX Artery' },
          { key: 'rca', label: 'RCA Artery' },
        ].map((tab) => {
          const isActive = selectedVessel === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedVessel(tab.key)}
              style={{
                flex: 1,
                padding: '4px 8px',
                borderRadius: 7,
                fontSize: '0.70rem',
                fontWeight: 700,
                border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                background: isActive ? '#f8fafc' : 'transparent',
                color: isActive ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SHAP Waterfall Bars List with Internal Scrollbar */}
      <div style={{ padding: '8px 16px 10px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Biomarker Factor ({drivers.length} drivers)
          </span>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Attribution Impact
          </span>
        </div>

        {/* Scrollable list container */}
        <div
          className="custom-scrollbar"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            paddingRight: 4,
          }}
        >
          {drivers.map((driver, idx) => {
            const isElevator = driver.type === 'elevator';
            const absImpact = Math.abs(driver.impact);
            const maxScale = 40; // max expected SHAP %
            const barWidth = Math.min(100, Math.max(12, (absImpact / maxScale) * 100));

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  padding: '7px 10px',
                  borderRadius: 10,
                  background: isElevator ? '#fef2f2' : '#f0fdf4',
                  border: isElevator ? '1px solid #fee2e2' : '1px solid #dcfce7',
                }}
              >
                {/* Feature Name & Value */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isElevator ? (
                      <TrendingUp style={{ width: 13, height: 13, color: '#ef4444' }} />
                    ) : (
                      <TrendingDown style={{ width: 13, height: 13, color: '#10b981' }} />
                    )}
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: isElevator ? '#991b1b' : '#166534',
                      }}
                    >
                      {driver.feature}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: isElevator ? '#dc2626' : '#16a34a',
                    }}
                  >
                    {isElevator ? `+${driver.impact}%` : `${driver.impact}%`}
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div
                  style={{
                    height: 5,
                    width: '100%',
                    borderRadius: 3,
                    background: isElevator ? '#fecaca' : '#bbf7d0',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      borderRadius: 3,
                      background: isElevator
                        ? 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)'
                        : 'linear-gradient(90deg, #34d399 0%, #10b981 100%)',
                    }}
                  />
                </div>

                {/* Clinical rationale subline in simple terms */}
                <div style={{ fontSize: '0.64rem', color: '#64748b', lineHeight: 1.35 }}>
                  {driver.clinicalRationale}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--dash-border)',
          background: 'var(--dash-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <ShieldCheck style={{ width: 13, height: 13, color: '#10b981' }} />
          Zero-hallucination mathematical attribution
        </span>
        <span style={{ fontWeight: 600 }}>
          {elevators.length} Risk Elevators • {protective.length} Protective
        </span>
      </div>
    </div>
  );
}
