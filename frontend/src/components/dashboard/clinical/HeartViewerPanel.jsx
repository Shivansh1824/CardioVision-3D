import { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import gsap from 'gsap';
import { RotateCcw, Activity } from 'lucide-react';
import { HEART_MODELS } from '../../../services/heartModelService';
import ClinicalHeartMesh from './ClinicalHeartMesh';

/**
 * 3D Camera Orbit Presets for each clinical focus point
 */
const CAMERA_PRESETS = {
  overview: { pos: [0, 0.05, 3.10], target: [0, 0, 0] },
  lad: { pos: [0.65, 0.05, 2.50], target: [0.04, -0.06, 0.20] },
  lcx: { pos: [2.10, 0.20, 1.60], target: [0.24, 0.08, 0.12] },
  rca: { pos: [-2.00, 0.15, 1.80], target: [-0.20, 0.02, 0.18] },
  beating_overview: { pos: [0, 0.06, 3.05], target: [0, 0.06, 0] },
};

/**
 * Fallback loader inside Canvas
 */
function CanvasFallback() {
  return (
    <Html center>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1.5px solid var(--dash-border)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid #e2e8f0',
            borderTopColor: '#ef4444',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
          Calibrating 3D Anatomical Geometry...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

/**
 * HeartViewerPanel — The centerpiece 3D inspection module for clinical decision support.
 */
export default function HeartViewerPanel({
  vessels = {
    lad: { probability: 0.85, is_blocked: true, status: 'Stenotic (>= 50%)' },
    lcx: { probability: 0.42, is_blocked: false, status: 'Moderate Plaque' },
    rca: { probability: 0.14, is_blocked: false, status: 'Normal / Patent' },
  },
  isSimulated = false,
  onResetSimulation,
  style,
}) {
  const [activeVessel, setActiveVessel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const controlsRef = useRef();

  const currentModel = HEART_MODELS.realistic;
  const handleLoaded = useCallback(() => setIsLoading(false), []);

  // Silky smooth camera glide using GSAP
  const glideCameraTo = (presetKey, onDone) => {
    if (!controlsRef.current) return;
    const preset = CAMERA_PRESETS[presetKey] || CAMERA_PRESETS.overview;
    const cam = controlsRef.current.object;
    const target = controlsRef.current.target;

    // Pause auto-rotation during focused camera moves so it doesn't fight the tween
    setIsAutoRotating(false);

    gsap.killTweensOf(cam.position);
    gsap.killTweensOf(target);

    gsap.to(cam.position, {
      x: preset.pos[0],
      y: preset.pos[1],
      z: preset.pos[2],
      duration: 1.15,
      ease: 'power3.inOut',
      onUpdate: () => controlsRef.current?.update(),
      onComplete: () => {
        onDone?.();
      },
    });

    gsap.to(target, {
      x: preset.target[0],
      y: preset.target[1],
      z: preset.target[2],
      duration: 1.15,
      ease: 'power3.inOut',
      onUpdate: () => controlsRef.current?.update(),
    });
  };

  const handleSelectVessel = (vesselId) => {
    if (activeVessel === vesselId) {
      handleResetCamera();
    } else {
      setActiveVessel(vesselId);
      glideCameraTo(vesselId);
    }
  };

  const handleResetCamera = () => {
    setActiveVessel(null);
    glideCameraTo('overview', () => {
      setIsAutoRotating(true);
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(240, 249, 255, 0.35) 50%, rgba(248, 250, 252, 0.80) 100%)',
        backdropFilter: 'blur(16px)',
        borderRadius: 18,
        border: '1.5px solid rgba(255, 255, 255, 0.90)',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Top Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          zIndex: 20,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Left: Anatomical Heart Title Badge */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '7px 14px',
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#0f172a',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }} />
          <span>Human Heart (Coronary Anatomy)</span>
        </div>

        {/* Right: Simulation Alert or Reset Camera */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>

          <button
            type="button"
            onClick={handleResetCamera}
            title="Reset 360° Orbit View"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              color: '#334155',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
            }}
          >
            <RotateCcw style={{ width: 12, height: 12, color: '#64748b' }} />
            <span>Reset Camera</span>
          </button>
        </div>
      </div>



      {/* 3D WebGL Canvas Centerpiece */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <Canvas
          camera={{ position: [3.05, 0.10, 0.12], fov: 40, near: 0.1, far: 100 }}
          style={{ width: '100%', height: '100%', cursor: 'grab' }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.25} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} />
          <directionalLight position={[-5, -4, -4]} intensity={0.7} color="#94a3b8" />
          <pointLight position={[0, 3, 2]} intensity={0.9} color="#ffffff" />

          <Suspense fallback={<CanvasFallback />}>
            <ClinicalHeartMesh
              modelConfig={currentModel}
              vessels={vessels}
              activeVessel={activeVessel}
              onSelectVessel={handleSelectVessel}
              onLoaded={handleLoaded}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            minDistance={1.4}
            maxDistance={4.8}
            rotateSpeed={0.8}
            dampingFactor={0.08}
            autoRotate={isAutoRotating}
            autoRotateSpeed={0.85}
            makeDefault
          />
        </Canvas>
      </div>

      {/* Sleek 1-Line Bottom Focus Pill Strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          gap: 8,
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 6px',
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <span style={{ fontSize: '0.60rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', paddingLeft: 4, paddingRight: 2 }}>
            Focus:
          </span>
          {[
            { id: 'lad', label: 'LAD', risk: vessels?.lad },
            { id: 'lcx', label: 'LCX', risk: vessels?.lcx },
            { id: 'rca', label: 'RCA', risk: vessels?.rca },
          ].map(({ id, label, risk }) => {
            const isSelected = activeVessel === id;
            const prob = risk?.probability ?? 0.5;
            const isBlocked = risk?.is_blocked ?? prob >= 0.5;
            const badgeColor = isBlocked || prob >= 0.5 ? '#ef4444' : prob >= 0.35 ? '#f59e0b' : '#10b981';

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelectVessel(id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isSelected ? `1.5px solid ${badgeColor}` : '1px solid transparent',
                  background: isSelected ? `${badgeColor}15` : 'transparent',
                  color: isSelected ? badgeColor : '#334155',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: badgeColor }} />
                <span>{label}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.64rem', fontWeight: 800 }}>
                  {Math.round(prob * 100)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Rotation / Zoom Hint */}
        <div
          style={{
            pointerEvents: 'auto',
            padding: '3px 8px',
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.80)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
            fontSize: '0.62rem',
            color: '#64748b',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            whiteSpace: 'nowrap',
          }}
        >
          <Activity style={{ width: 11, height: 11, color: '#0284c7' }} />
          <span>Drag to orbit • Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
}
