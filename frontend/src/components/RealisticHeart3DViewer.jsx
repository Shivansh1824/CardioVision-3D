/**
 * RealisticHeart3DViewer — Native WebGL 3D Heart Centerpiece
 * 
 * Features:
 * - Direct WebGL rendering with Three.js & React Three Fiber (No card box, no border, no video)
 * - 3D Heart model permanently centered with generous padding (never cut off, never eaten up)
 * - Minimal, elegant medical dots anchored 100% to the anatomical mesh surface
 * - Connected dotted reference line & clinical modal anchored directly to the 3D pin
 * - Seamless animation: when the model rotates or beats, the dot, line, and modal move together
 * - Smooth 360° orbital rotation (Zoom strictly disabled)
 * - Seamless switching between Realistic Anatomy and Beating Cycle with automatic camera reset
 */

import React, { useState, useEffect, useLayoutEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';
import { Layers, Activity, Heart, X, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { HEART_MODELS, ANATOMICAL_PINS, CARDIAC_CYCLE_PHASES } from '../services/heartModelService';

/**
 * 3D Camera Orbit Presets for each anatomical landmark
 */
const CAMERA_PRESETS = {
  overview: { pos: [2.85, 0, 0.03], target: [0, 0, 0] },
  lad: { pos: [2.65, 0.12, 0.70], target: [0.03, 0.10, 0.10] },
  lcx: { pos: [1.85, 0.28, 2.10], target: [0.15, 0.15, 0.05] },
  rca: { pos: [2.20, 0.20, -1.80], target: [-0.15, 0.15, 0.05] },
  lv: { pos: [2.45, -0.45, 0.55], target: [0.05, -0.12, 0.10] },
  aorta: { pos: [2.30, 0.85, 0.18], target: [0.02, 0.22, 0.05] },
  beating_overview: { pos: [0, 0, 2.85], target: [0, 0, 0] },
  beating_ejection: { pos: [0.4, -0.2, 2.6], target: [0, -0.1, 0] },
  beating_filling: { pos: [-0.3, 0.2, 2.6], target: [0, 0.1, 0] },
};

/**
 * 3D Heart Mesh Geometry with auto-centering, dynamic vertex colors & surface-locked dots
 */
function HeartMesh({ modelConfig, activePin, onSelectPin }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(modelConfig.url, '/draco/');
  const { actions, names } = useAnimations(animations, groupRef);

  // Auto-center precisely at (0, 0, 0) and scale to match reference height with generous padding
  useLayoutEffect(() => {
    if (!scene) return;

    if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.updateMatrixWorld(true);
    }

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const targetScale = 1.55 / (maxDim || 1);

    if (groupRef.current) {
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
      groupRef.current.position.set(
        -center.x * targetScale,
        -center.y * targetScale,
        -center.z * targetScale
      );
    }

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.geometry?.attributes?.color) {
          child.material.vertexColors = true;
        }
        if (child.material) {
          child.material.roughness = 0.42;
          child.material.metalness = 0.10;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // Auto-play rhythmic contraction animation for beating model
  useEffect(() => {
    if (modelConfig.hasAnimation && names.length > 0) {
      const actionName = names[0];
      const action = actions[actionName];
      if (action) {
        action.reset().fadeIn(0.3).play();
        action.setEffectiveTimeScale(1.1); // Natural 72 BPM resting cardiac rhythm
      }
      return () => action?.fadeOut(0.2);
    }
  }, [actions, names, modelConfig.hasAnimation]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} />

      {/* 3D Medical Pinpoint Dots locked to heart surface (Realistic Anatomy) */}
      {modelConfig.id === 'realistic' && ANATOMICAL_PINS.map((pin) => {
        const isSelected = activePin?.id === pin.id;
        const dotColor = pin.color || '#e11d48';

        return (
          <group key={pin.id} position={pin.position}>
            <Html
              center={true}
              sprite={false}
              zIndexRange={isSelected ? [100, 50] : [40, 10]}
              style={{ pointerEvents: 'auto' }}
            >
              <button
                type="button"
                id={`pin-marker-${pin.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPin(pin);
                }}
                className="group relative flex items-center justify-center p-3 cursor-pointer focus:outline-none select-none"
                aria-label={`Inspect ${pin.name}`}
              >
                {/* Pulsating radar ring when active */}
                {isSelected && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-50"
                    style={{ background: dotColor }}
                  />
                )}

                {/* Minimal Medical Dot */}
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

                {/* Landmark Code Pill on Hover (when not selected) */}
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
 * Guided 5-option selector dock, cinematic GSAP camera orbit, right-side modal, and beating cycle mechanics
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
      const targetPreset = phase.id === 'ejection' ? 'beating_ejection' : phase.id === 'filling' ? 'beating_filling' : 'beating_overview';
      animateCameraTo(targetPreset);
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
      
      {/* ── Top Model Switcher: Realistic Anatomy vs Beating Cycle ── */}
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
          <span>Realistic Anatomy</span>
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
          <span>Beating Cycle</span>
        </button>
      </div>

      {/* ── 3D Stage (Dynamic shift leftward when modal is open to balance composition) ── */}
      <div className="relative w-full h-[520px] sm:h-[560px] flex items-center justify-center overflow-visible">
        
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
            {/* Medical Studio Lighting */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 5, 4]} intensity={2.2} color="#fff1f2" />
            <directionalLight position={[-4, 2, -2]} intensity={1.4} color="#e0f2fe" />
            <directionalLight position={[0, -4, 3]} intensity={0.9} color="#ffe4e6" />

            {/* Orbit Controls with zoom strictly disabled */}
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
              />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* ── Right-Side Clinical Explanation Modal (Opens on Click, Toggles on Re-Click) ── */}
        <AnimatePresence>
          {selectedModel === 'realistic' && activePin && (
            <motion.div
              key={activePin.id}
              initial={{ opacity: 0, x: 30, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-left w-[280px] sm:w-[310px]"
              style={{
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                    style={{ background: activePin.color }}
                  />
                  <span className="font-mono text-xs font-bold text-slate-900">
                    [{activePin.code}]
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                    {activePin.shortName || activePin.tag}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivePin(null);
                    animateCameraTo('overview');
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close callout"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Landmark Full Name */}
              <h4 className="font-display text-xs sm:text-sm font-bold text-slate-900 leading-tight mb-2">
                {activePin.name}
              </h4>

              {/* Hemodynamic Flow Section */}
              <div className="mb-2 bg-sky-50/70 rounded-xl p-2.5 border border-sky-100/90">
                <div className="flex items-center gap-1.5 mb-1 text-sky-800">
                  <Activity className="w-3 h-3 text-sky-600 shrink-0" />
                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
                    Hemodynamic Flow
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
                  {activePin.patientExpl}
                </p>
              </div>

              {/* Clinical Pathology Section */}
              <div className="bg-rose-50/70 rounded-xl p-2.5 border border-rose-100/90">
                <div className="flex items-center gap-1.5 mb-1 text-rose-800">
                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
                    Clinical Pathology
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
                  {activePin.pathology}
                </p>
              </div>

              {/* Territory Note */}
              {activePin.bloodTerritory && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 text-[9px] font-mono text-slate-400">
                  Territory: {activePin.bloodTerritory}
                </div>
              )}
            </motion.div>
          )}

          {/* Right-Side Beating Cycle Phase Modal */}
          {selectedModel === 'beating' && activePhase && (
            <motion.div
              key={activePhase.id}
              initial={{ opacity: 0, x: 30, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.94 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-left w-[280px] sm:w-[310px]"
              style={{
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                    style={{ background: activePhase.color }}
                  />
                  <span className="font-mono text-xs font-bold text-slate-900">
                    [{activePhase.code}]
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                    {activePhase.timing}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActivePhase(null);
                    animateCameraTo('beating_overview');
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close phase callout"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Phase Title */}
              <h4 className="font-display text-xs sm:text-sm font-bold text-slate-900 leading-tight mb-2">
                {activePhase.name}
              </h4>

              {/* Valve Mechanics Bar */}
              <div className="mb-2 bg-slate-50 rounded-lg p-2 border border-slate-200/80">
                <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Cardiac Valve Mechanics
                </span>
                <p className="text-[10px] font-semibold text-slate-800">
                  {activePhase.valves}
                </p>
              </div>

              {/* Hemodynamics */}
              <div className="mb-2 bg-sky-50/70 rounded-xl p-2.5 border border-sky-100/90">
                <div className="flex items-center gap-1.5 mb-1 text-sky-800">
                  <Activity className="w-3 h-3 text-sky-600 shrink-0" />
                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
                    Pumping Action
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
                  {activePhase.patientExpl}
                </p>
              </div>

              {/* Clinical Pathology */}
              <div className="bg-rose-50/70 rounded-xl p-2.5 border border-rose-100/90">
                <div className="flex items-center gap-1.5 mb-1 text-rose-800">
                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                  <span className="font-mono text-[9px] font-bold tracking-wider uppercase">
                    Clinical Diagnostic Impact
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-700 leading-relaxed font-medium">
                  {activePhase.clinicalPathology}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Bottom Selector Dock: 5 Anatomical Options (Realistic) OR 4 Cycle Stages (Beating) ── */}
      {selectedModel === 'realistic' ? (
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md mt-2 z-30 flex-wrap justify-center max-w-full">
          {ANATOMICAL_PINS.map((pin) => {
            const isCurrent = activePin?.id === pin.id;
            return (
              <button
                key={pin.id}
                type="button"
                id={`dock-pin-${pin.id}`}
                onClick={() => handleTogglePin(pin)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'bg-white/70 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-transform ${isCurrent ? 'scale-125 animate-pulse' : ''}`}
                  style={{ background: pin.color }}
                />
                <span className="font-mono text-[11px] font-bold tracking-tight">
                  {pin.code}
                </span>
                <span className="hidden sm:inline text-[10px] opacity-75 font-normal">
                  {pin.shortName}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 mt-2 z-30 w-full max-w-full">
          {/* Live Hemodynamic Telemetry Strip */}
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-mono shadow-sm">
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <Heart className="w-3 h-3 animate-pulse" /> 72 BPM
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-sky-400">120/80 mmHg</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400">SV: 70 mL</span>
            <span className="text-slate-400">|</span>
            <span className="text-amber-400">CO: 5.0 L/min</span>
          </div>

          {/* 4 Pumping Cycle Stages */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md flex-wrap justify-center">
            {CARDIAC_CYCLE_PHASES.map((phase) => {
              const isCurrent = activePhase?.id === phase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  id={`dock-phase-${phase.id}`}
                  onClick={() => handleTogglePhase(phase)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-md scale-105'
                      : 'bg-white/70 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-transform ${isCurrent ? 'scale-125 animate-pulse' : ''}`}
                    style={{ background: phase.color }}
                  />
                  <span className="text-[11px] font-bold">
                    {phase.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Bottom Footnote ── */}
      <p className="font-mono text-[10px] text-slate-400 tracking-wider mt-2 text-center">
        Click any landmark below to orbit camera 360° · Click again to close modal
      </p>

    </div>
  );
}

