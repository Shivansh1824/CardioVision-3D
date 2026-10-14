import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import gsap from 'gsap';
import { 
  RotateCcw, 
  Activity, 
  Zap, 
  Plus, 
  Minus, 
  Play, 
  Pause,
  Compass
} from 'lucide-react';
import { HEART_MODELS } from '../../../services/heartModelService';
import ClinicalHeartMesh from './ClinicalHeartMesh';

/**
 * 3D Camera Orbit Presets for each clinical focus point
 */
const CAMERA_PRESETS = {
  overview: { pos: [2.85, 0.05, 0.10], target: [0, 0, 0] },
  lad: { pos: [1.45, 0.28, 2.25], target: [0.06, 0.22, 0.16] },
  lcx: { pos: [1.85, 0.28, 2.10], target: [0.15, 0.15, 0.05] },
  rca: { pos: [2.20, 0.20, -1.80], target: [-0.15, 0.15, 0.05] },
  beating_overview: { pos: [0, 0, 2.85], target: [0, 0, 0] },
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
}) {
  const [modelType, setModelType] = useState('realistic'); // 'realistic' | 'beating'
  const [activeVessel, setActiveVessel] = useState('lad');
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const controlsRef = useRef();

  const currentModel = HEART_MODELS[modelType];

  // Camera smooth glide using GSAP
  const glideCameraTo = (presetKey) => {
    if (!controlsRef.current) return;
    const preset = CAMERA_PRESETS[presetKey] || CAMERA_PRESETS.overview;
    const cam = controlsRef.current.object;
    const target = controlsRef.current.target;

    gsap.killTweensOf(cam.position);
    gsap.killTweensOf(target);

    gsap.to(cam.position, {
      x: preset.pos[0],
      y: preset.pos[1],
      z: preset.pos[2],
      duration: 0.85,
      ease: 'power2.out',
      onUpdate: () => controlsRef.current?.update(),
    });

    gsap.to(target, {
      x: preset.target[0],
      y: preset.target[1],
      z: preset.target[2],
      duration: 0.85,
      ease: 'power2.out',
      onUpdate: () => controlsRef.current?.update(),
    });
  };

  const handleSelectVessel = (vesselId) => {
    setActiveVessel(vesselId);
    glideCameraTo(vesselId);
  };

  const handleResetCamera = () => {
    setActiveVessel(null);
    glideCameraTo(modelType === 'realistic' ? 'overview' : 'beating_overview');
  };

  const handleZoomIn = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    gsap.to(cam.position, {
      x: cam.position.x * 0.82,
      y: cam.position.y * 0.82,
      z: cam.position.z * 0.82,
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => controlsRef.current?.update(),
    });
  };

  const handleZoomOut = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    gsap.to(cam.position, {
      x: cam.position.x * 1.2,
      y: cam.position.y * 1.2,
      z: cam.position.z * 1.2,
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => controlsRef.current?.update(),
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 520,
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: 24,
        border: '1.5px solid var(--dash-border)',
        boxShadow: 'var(--dash-shadow-sm)',
        overflow: 'hidden',
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
        {/* Left: Model switcher */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 4,
            borderRadius: 14,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setModelType('realistic');
              handleResetCamera();
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 10,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: modelType === 'realistic' ? '#0f172a' : 'transparent',
              color: modelType === 'realistic' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease',
            }}
          >
            Human Heart
          </button>
          <button
            type="button"
            onClick={() => {
              setModelType('beating');
              handleResetCamera();
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 10,
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: 'none',
              background: modelType === 'beating' ? '#0f172a' : 'transparent',
              color: modelType === 'beating' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease',
            }}
          >
            Internal Chambers
          </button>
        </div>

        {/* Right: Simulation Alert or Reset Camera */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {isSimulated && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 12,
                background: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                color: '#065f46',
                fontSize: '0.72rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
              }}
            >
              <Zap style={{ width: 13, height: 13, color: '#10b981' }} />
              <span>Simulated Therapeutic State</span>
              {onResetSimulation && (
                <button
                  type="button"
                  onClick={onResetSimulation}
                  style={{
                    marginLeft: 4,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#047857',
                    textDecoration: 'underline',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          )}

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

      {/* Floating Vertical Tool Bar (Dribbble Healthlog Style: +, -, Rotate, Reset) */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 16,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: 5,
          borderRadius: 14,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(226, 232, 240, 0.85)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
        }}
      >
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+)"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#334155',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Plus style={{ width: 15, height: 15 }} />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#334155',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Minus style={{ width: 15, height: 15 }} />
        </button>

        <div style={{ height: 1, background: '#e2e8f0', margin: '2px 4px' }} />

        <button
          type="button"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause 360° Auto-Rotation' : 'Resume 360° Auto-Rotation'}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: 'none',
            background: isAutoRotating ? '#eff6ff' : 'transparent',
            color: isAutoRotating ? '#0284c7' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            if (!isAutoRotating) e.currentTarget.style.background = '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            if (!isAutoRotating) e.currentTarget.style.background = 'transparent';
          }}
        >
          {isAutoRotating ? (
            <Pause style={{ width: 13, height: 13 }} />
          ) : (
            <Play style={{ width: 13, height: 13, marginLeft: 1 }} />
          )}
        </button>
      </div>

      {/* Radial 360° Calibration Dial Ring beneath the 3D Heart (Dribbble Healthlog style) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16%',
          left: '50%',
          transform: 'translateX(-50%) perspective(600px) rotateX(70deg)',
          width: 330,
          height: 330,
          borderRadius: '50%',
          border: '1.5px dashed rgba(56, 189, 248, 0.4)',
          boxShadow: '0 0 35px rgba(56, 189, 248, 0.12), inset 0 0 25px rgba(56, 189, 248, 0.08)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 250,
            height: 250,
            borderRadius: '50%',
            border: '1px solid rgba(148, 163, 184, 0.28)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: isAutoRotating ? 'spin 35s linear infinite' : 'none',
          }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <span
              key={deg}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 9,
                height: 1.5,
                background: 'rgba(56, 189, 248, 0.65)',
                transformOrigin: '0 0',
                transform: `rotate(${deg}deg) translate(155px, -50%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas Centerpiece */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <Canvas
          camera={{ position: [2.85, 0.05, 0.10], fov: 38, near: 0.1, far: 100 }}
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
              onLoaded={() => setIsLoading(false)}
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

      {/* Bottom HUD: 1-Click Artery Focus Buttons & Live Blockage Ratio */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(16px)',
            borderRadius: 16,
            border: '1px solid rgba(226, 232, 240, 0.85)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Quick Glide Camera Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginRight: 4,
              }}
            >
              Focus:
            </span>

            {[
              { id: 'lad', label: 'LAD Artery', risk: vessels?.lad },
              { id: 'lcx', label: 'LCX Artery', risk: vessels?.lcx },
              { id: 'rca', label: 'RCA Artery', risk: vessels?.rca },
            ].map(({ id, label, risk }) => {
              const isSelected = activeVessel === id;
              const prob = risk?.probability ?? 0.5;
              const isBlocked = risk?.is_blocked ?? prob >= 0.5;

              const badgeColor = isBlocked || prob >= 0.5
                ? '#ef4444'
                : prob >= 0.35
                ? '#f59e0b'
                : '#10b981';

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectVessel(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 10,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isSelected ? `1.5px solid ${badgeColor}` : '1px solid #e2e8f0',
                    background: isSelected ? `${badgeColor}12` : '#ffffff',
                    color: isSelected ? badgeColor : '#334155',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: badgeColor,
                    }}
                  />
                  <span>{label}</span>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                    }}
                  >
                    {Math.round(prob * 100)}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick HUD Tip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.72rem',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            <Activity style={{ width: 13, height: 13, color: '#38bdf8' }} />
            <span>Drag to rotate • Scroll to zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
