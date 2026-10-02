/**
 * RealisticHeart3DViewer — Native WebGL 3D Heart Centerpiece
 * 
 * Features:
 * - Direct WebGL rendering with Three.js & React Three Fiber
 * - 3D Heart model centered with generous padding (never cut off, never eaten up)
 * - Minimal, elegant medical dots anchored to anatomical mesh surfaces (Human Heart & Beating Heart)
 * - UI/UX law compliant button cards (Fitts's Law, clear click affordance, distinct cards in grid)
 * - Dual terminology: easy, intuitive terms for patients + precise medical terms for clinicians
 * - Smooth 360° orbital rotation with GSAP cinematic camera targeting
 * - Simple mode switcher: "Human Heart" vs "Beating Heart"
 */

import React, { useState, useEffect, useLayoutEffect, useMemo, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap';
import { Layers, Activity, Heart } from 'lucide-react';
import { HEART_MODELS, ANATOMICAL_PINS, CARDIAC_CYCLE_PHASES } from '../services/heartModelService';
import HeartCalloutCard from './HeartCalloutCard';

/**
 * 3D Camera Orbit Presets for each anatomical landmark & cardiac cycle phase
 */
const CAMERA_PRESETS = {
  overview: { pos: [2.85, 0, 0.03], target: [0, 0, 0] },
  lad: { pos: [2.65, 0.12, 0.70], target: [0.03, 0.10, 0.10] },
  lcx: { pos: [1.85, 0.28, 2.10], target: [0.15, 0.15, 0.05] },
  rca: { pos: [2.20, 0.20, -1.80], target: [-0.15, 0.15, 0.05] },
  lv: { pos: [2.45, -0.45, 0.55], target: [0.05, -0.12, 0.10] },
  aorta: { pos: [2.30, 0.85, 0.18], target: [0.02, 0.22, 0.05] },
  beating_overview: { pos: [0, 0, 2.85], target: [0, 0, 0] },
  filling: { pos: [0.35, 0.35, 2.50], target: [0.10, 0.20, 0.05] },
  contraction: { pos: [0.05, 0.15, 2.55], target: [0.02, 0.10, 0.05] },
  ejection: { pos: [-0.20, 0.45, 2.50], target: [-0.05, 0.25, 0.05] },
  relaxation: { pos: [0.10, -0.25, 2.55], target: [0.02, -0.10, 0.05] },
};

/**
 * 3D Heart Mesh Geometry with auto-centering, dynamic vertex colors & surface-locked dots
 */
function HeartMesh({ modelConfig, activePin, onSelectPin, activePhase, onSelectPhase }) {
  const groupRef = useRef();
  const [pinsVisible, setPinsVisible] = useState(false);
  const { scene: rawScene, animations } = useGLTF(modelConfig.url, '/draco/');
  const scene = useMemo(() => SkeletonUtils.clone(rawScene), [rawScene]);
  const { actions, names } = useAnimations(animations, groupRef);

  // Auto-center precisely at (0, 0, 0) and animate organic bloom entrance
  useLayoutEffect(() => {
    if (!scene) return;

    if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      groupRef.current.updateMatrixWorld(true);
    }

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const targetScale = 1.55 / (maxDim || 1);

    // Initial appearance state: compact, gentle offset, slight tilt, transparent
    if (groupRef.current) {
      groupRef.current.scale.set(targetScale * 0.72, targetScale * 0.72, targetScale * 0.72);
      groupRef.current.position.set(
        -center.x * targetScale,
        -center.y * targetScale - 0.16,
        -center.z * targetScale
      );
      groupRef.current.rotation.y = -0.45;
    }

    // Prepare mesh materials for smooth fade-in
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.roughness = 0.42;
        child.material.metalness = 0.10;
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.geometry?.attributes?.color) {
          child.material.vertexColors = true;
        }
        child.material.needsUpdate = true;
      }
    });

    // 1. Smooth bloom scale-in
    gsap.to(groupRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 1.15,
      ease: 'power3.out',
    });

    // 2. Smooth vertical rise into centered resting equilibrium
    gsap.to(groupRef.current.position, {
      x: -center.x * targetScale,
      y: -center.y * targetScale,
      z: -center.z * targetScale,
      duration: 1.25,
      ease: 'power3.out',
    });

    // 3. Elegant rotational settling glide
    gsap.to(groupRef.current.rotation, {
      y: 0,
      duration: 1.35,
      ease: 'power3.out',
    });

    // 4. Material opacity fade-in
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        gsap.to(child.material, {
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          onComplete: () => {
            if (child.material && !child.material.vertexColors) {
              child.material.transparent = false;
            }
          },
        });
      }
    });

    // 5. Illuminate landmark surface pins gently after model arrives
    setPinsVisible(false);
    const pinTimer = setTimeout(() => {
      setPinsVisible(true);
    }, 550);

    return () => {
      clearTimeout(pinTimer);
      if (groupRef.current) {
        gsap.killTweensOf(groupRef.current.scale);
        gsap.killTweensOf(groupRef.current.position);
        gsap.killTweensOf(groupRef.current.rotation);
      }
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          gsap.killTweensOf(child.material);
        }
      });
    };
  }, [scene]);

  // Auto-play rhythmic contraction animation for beating model
  useEffect(() => {
    if (modelConfig.hasAnimation && names.length > 0) {
      const actionName = names[0];
      const action = actions[actionName];
      if (action) {
        action.reset().fadeIn(0.3).play();
        action.setEffectiveTimeScale(1.1);
      }
      return () => action?.fadeOut(0.2);
    }
  }, [actions, names, modelConfig.hasAnimation]);

  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />

        {/* 3D Medical Pinpoint Dots locked to heart surface (Human Heart) */}
        {modelConfig.id === 'realistic' && ANATOMICAL_PINS.map((pin) => {
          const isSelected = activePin?.id === pin.id;
          const dotColor = pin.color || '#e11d48';

          return (
            <group key={pin.id} position={pin.position}>
              <Html
                center={true}
                sprite={false}
                zIndexRange={isSelected ? [100, 50] : [40, 10]}
                style={{ pointerEvents: pinsVisible ? 'auto' : 'none', opacity: pinsVisible ? 1 : 0, transition: 'opacity 0.45s ease-out' }}
              >
                <button
                  type="button"
                  id={`pin-marker-${pin.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPin(pin);
                  }}
                  className="group relative flex items-center justify-center p-3 cursor-pointer focus:outline-none select-none"
                  aria-label={`Inspect ${pin.patientName}`}
                >
                  {isSelected && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-50"
                      style={{ background: dotColor }}
                    />
                  )}

                  <span
                    className="rounded-full transition-all duration-200 relative z-10 flex items-center justify-center"
                    style={{
                      width: isSelected ? 16 : 12,
                      height: isSelected ? 16 : 12,
                      background: dotColor,
                      border: '2px solid #ffffff',
                      boxShadow: isSelected
                        ? `0 0 0 4px ${dotColor}45, 0 0 14px ${dotColor}`
                        : '0 2px 8px rgba(0,0,0,0.4)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>

                  {!isSelected && (
                    <div
                      className="absolute left-full ml-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold whitespace-nowrap shadow-sm pointer-events-none transition-all duration-200 bg-white/95 text-slate-700 border-slate-200/90 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1"
                    >
                      {pin.code}
                    </div>
                  )}
                </button>
              </Html>
            </group>
          );
        })}
      </group>

      {/* 3D Medical Pinpoint Dots locked to beating cycle landmarks in normalized world space */}
      {modelConfig.id === 'beating' && (
        <group position={[0, 0, 0]}>
          {CARDIAC_CYCLE_PHASES.map((phase) => {
            const isSelected = activePhase?.id === phase.id;
            const dotColor = phase.color || '#0284c7';

            return (
              <group key={phase.id} position={phase.worldPosition || phase.position}>
                <Html
                  center={true}
                  sprite={false}
                  zIndexRange={isSelected ? [100, 50] : [40, 10]}
                  style={{ pointerEvents: pinsVisible ? 'auto' : 'none', opacity: pinsVisible ? 1 : 0, transition: 'opacity 0.45s ease-out' }}
                >
                  <button
                    type="button"
                    id={`phase-marker-${phase.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPhase(phase);
                    }}
                    className="group relative flex items-center justify-center p-3 cursor-pointer focus:outline-none select-none"
                    aria-label={`Inspect ${phase.patientName}`}
                  >
                    {isSelected && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-50"
                        style={{ background: dotColor }}
                      />
                    )}

                    <span
                      className="rounded-full transition-all duration-200 relative z-10 flex items-center justify-center"
                      style={{
                        width: isSelected ? 16 : 12,
                        height: isSelected ? 16 : 12,
                        background: dotColor,
                        border: '2px solid #ffffff',
                        boxShadow: isSelected
                          ? `0 0 0 4px ${dotColor}45, 0 0 14px ${dotColor}`
                          : '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>

                    {!isSelected && (
                      <div
                        className="absolute left-full ml-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold whitespace-nowrap shadow-sm pointer-events-none transition-all duration-200 bg-white/95 text-slate-700 border-slate-200/90 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1"
                      >
                        {phase.patientName}
                      </div>
                    )}
                  </button>
                </Html>
              </group>
            );
          })}
        </group>
      )}
    </>
  );
}

/**
 * WebGL Canvas Loading Fallback
 */
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center select-none">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-rose-500/30 border-t-rose-600 animate-spin" />
          <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
        </div>
        <p className="font-mono text-[11px] font-semibold text-slate-500 tracking-wider">
          Rendering 3D Cardiac Anatomy...
        </p>
      </div>
    </Html>
  );
}

/**
 * Main 3D Heart Centerpiece
 */
export default function RealisticHeart3DViewer() {
  const [selectedModel, setSelectedModel] = useState('realistic');
  const [activePin, setActivePin] = useState(null);
  const [activePhase, setActivePhase] = useState(null);

  const controlsRef = useRef();
  const stageRef = useRef(null);

  const currentModelConfig = HEART_MODELS[selectedModel];

  // Smooth cinematic camera orbit with GSAP
  const animateCameraTo = (presetKey, duration = 0.85) => {
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
      duration,
      ease: 'power2.out',
      onUpdate: () => controlsRef.current?.update(),
    });

    gsap.to(target, {
      x: preset.target[0],
      y: preset.target[1],
      z: preset.target[2],
      duration,
      ease: 'power2.out',
      onUpdate: () => controlsRef.current?.update(),
    });
  };

  // Toggle anatomical pin: rotate camera & open/close right-side modal
  const handleTogglePin = (pin) => {
    if (activePin?.id === pin.id) {
      setActivePin(null);
      animateCameraTo('overview');
    } else {
      setActivePin(pin);
      animateCameraTo(pin.id);
    }
  };

  // Toggle cardiac cycle phase in beating mode
  const handleTogglePhase = (phase) => {
    if (activePhase?.id === phase.id) {
      setActivePhase(null);
      animateCameraTo('beating_overview');
    } else {
      setActivePhase(phase);
      animateCameraTo(phase.id);
    }
  };

  // Reset camera view and state with smooth transition when switching models
  useEffect(() => {
    setActivePin(null);
    setActivePhase(null);
    if (selectedModel === 'realistic') {
      animateCameraTo('overview', 0.95);
    } else {
      animateCameraTo('beating_overview', 0.95);
    }
  }, [selectedModel]);

  const isModalActive = Boolean(activePin || activePhase);

  return (
    <div
      ref={stageRef}
      className="relative w-full max-w-[760px] flex flex-col items-center select-none overflow-visible"
    >
      
      {/* ── Top Model Switcher: Human Heart vs Beating Heart ── */}
      <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xs mb-2 z-30">
        <button
          type="button"
          onClick={() => setSelectedModel('realistic')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            selectedModel === 'realistic'
              ? 'bg-rose-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Human Heart</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedModel('beating')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            selectedModel === 'beating'
              ? 'bg-rose-600 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Beating Heart</span>
        </button>
      </div>

      {/* ── 3D Stage (Dynamic shift leftward when modal is open to balance composition) ── */}
      <div className="relative w-full h-[470px] sm:h-[510px] flex items-center justify-center overflow-visible">
        
        {/* Soft volumetric depth glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: selectedModel === 'beating'
              ? 'radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.14) 0%, rgba(56,189,248,0.08) 50%, transparent 72%)'
              : 'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.10) 0%, rgba(56,189,248,0.06) 50%, transparent 72%)',
          }}
        />

        {/* 3D WebGL Canvas with smooth shift on modal open */}
        <motion.div
          animate={{ x: isModalActive ? -95 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full overflow-visible"
        >
          <Canvas
            camera={{ position: [2.85, 0, 0.03], fov: 40 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            style={{ overflow: 'visible' }}
            className="w-full h-full overflow-visible cursor-grab active:cursor-grabbing"
            onClick={() => {
              if (selectedModel === 'realistic') {
                setActivePin(null);
                animateCameraTo('overview');
              } else {
                setActivePhase(null);
                animateCameraTo('beating_overview');
              }
            }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 5, 4]} intensity={2.2} color="#fff1f2" />
            <directionalLight position={[-4, 2, -2]} intensity={1.4} color="#e0f2fe" />
            <directionalLight position={[0, -4, 3]} intensity={0.9} color="#ffe4e6" />

            <OrbitControls
              ref={controlsRef}
              enableZoom={false}
              enableDamping={true}
              dampingFactor={0.06}
              maxPolarAngle={Math.PI - 0.1}
              minPolarAngle={0.1}
            />

            <Suspense fallback={<Loader />}>
              <HeartMesh
                key={selectedModel}
                modelConfig={currentModelConfig}
                activePin={activePin}
                onSelectPin={handleTogglePin}
                activePhase={activePhase}
                onSelectPhase={handleTogglePhase}
              />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* ── Right-Side Clinical Explanation Modal ── */}
        <AnimatePresence>
          <HeartCalloutCard
            selectedModel={selectedModel}
            activePin={activePin}
            activePhase={activePhase}
            onClose={() => {
              if (selectedModel === 'realistic') {
                setActivePin(null);
                animateCameraTo('overview');
              } else {
                setActivePhase(null);
                animateCameraTo('beating_overview');
              }
            }}
          />
        </AnimatePresence>

      </div>

      {/* ── Bottom Selector Dock: UI/UX Law Compliant Button Cards ── */}
      {selectedModel === 'realistic' ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full max-w-[720px] mt-2 z-30 px-2">
          {ANATOMICAL_PINS.map((pin) => {
            const isCurrent = activePin?.id === pin.id;
            return (
              <button
                key={pin.id}
                type="button"
                id={`dock-pin-${pin.id}`}
                onClick={() => handleTogglePin(pin)}
                className={`flex items-center gap-2 p-2 sm:px-2.5 sm:py-2 rounded-xl border text-left transition-all duration-200 cursor-pointer shadow-xs select-none ${
                  isCurrent
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-slate-900/10 scale-[1.02]'
                    : 'bg-white/95 border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform ${isCurrent ? 'scale-125 animate-pulse' : ''}`}
                  style={{ background: pin.color }}
                />
                <div className="flex flex-col min-w-0">
                  <span className={`font-mono text-xs font-bold leading-tight truncate ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                    {pin.code}
                  </span>
                  <span className={`text-[10px] leading-tight truncate ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                    {pin.patientName}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-[720px] mt-2 z-30 px-2">
          {CARDIAC_CYCLE_PHASES.map((phase) => {
            const isCurrent = activePhase?.id === phase.id;
            return (
              <button
                key={phase.id}
                type="button"
                id={`dock-phase-${phase.id}`}
                onClick={() => handleTogglePhase(phase)}
                className={`flex items-center gap-2 p-2 sm:px-2.5 sm:py-2 rounded-xl border text-left transition-all duration-200 cursor-pointer shadow-xs select-none ${
                  isCurrent
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md ring-2 ring-slate-900/10 scale-[1.02]'
                    : 'bg-white/95 border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-sm hover:-translate-y-0.5'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform ${isCurrent ? 'scale-125 animate-pulse' : ''}`}
                  style={{ background: phase.color }}
                />
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-bold leading-tight truncate ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                    {phase.patientName}
                  </span>
                  <span className={`text-[10px] leading-tight truncate font-mono ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                    {phase.doctorTerm}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Bottom Footnote ── */}
      <p className="font-mono text-[10px] text-slate-400 tracking-wider mt-2.5 text-center">
        Click any landmark below to orbit camera 360° · Click again to close modal
      </p>

    </div>
  );
}


