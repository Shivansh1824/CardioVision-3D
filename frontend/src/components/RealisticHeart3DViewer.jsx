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
import { Layers, Activity, Heart, X, AlertTriangle } from 'lucide-react';
import { HEART_MODELS, ANATOMICAL_PINS } from '../services/heartModelService';

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

    // Calculate scene bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Scale factor to ensure full heart fits comfortably with generous margins matching reference
    const targetScale = 1.55 / (maxDim || 1);

    if (groupRef.current) {
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
      // Offset so center of mass is precisely at (0, 0, 0)
      groupRef.current.position.set(
        -center.x * targetScale,
        -center.y * targetScale,
        -center.z * targetScale
      );
    }

    // Traverse mesh materials: enable vertex colors & enhance natural cardiac highlights
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
      {/* 3D Heart Mesh Geometry */}
      <primitive object={scene} />

      {/* 3D Medical Pinpoint Dots & Surface-Connected Callouts */}
      {ANATOMICAL_PINS.map((pin) => {
        const isSelected = activePin?.id === pin.id;
        const dotColor = pin.color || '#e11d48';

        // Orient connected line and modal into the open space to the left of the heart
        const isTopSide = pin.id === 'aorta';
        const dirX = -1;
        const dirY = isTopSide ? 1 : -1;

        const elbowX = -36;
        const elbowY = 26 * dirY;
        const endX = -65;
        const endY = 26 * dirY;

        return (
          <group key={pin.id} position={pin.position}>
            <Html
              center={false}
              sprite={false}
              zIndexRange={isSelected ? [100, 50] : [40, 10]}
              style={{
                pointerEvents: 'none',
                position: 'relative',
              }}
            >
              {/* ── 1. The Surface-Locked Medical Dot (Centered at (0, 0)) ── */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                }}
              >
                <button
                  type="button"
                  id={`pin-marker-${pin.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPin(isSelected ? null : pin);
                  }}
                  onMouseEnter={() => {
                    if (!activePin) onSelectPin(pin);
                  }}
                  className="group relative flex items-center justify-center p-2.5 cursor-pointer focus:outline-none select-none"
                  aria-label={`Inspect ${pin.name}`}
                >
                  {/* Pulsating radar ring when active */}
                  {isSelected && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-50"
                      style={{ background: dotColor }}
                    />
                  )}

                  {/* Minimal Medical Dot (12px idle, 15px active with crisp white ring) */}
                  <span
                    className="rounded-full transition-all duration-200 relative z-10 flex items-center justify-center"
                    style={{
                      width: isSelected ? 15 : 12,
                      height: isSelected ? 15 : 12,
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
              </div>

              {/* ── 2. Connected Dotted Line & Modal (Synchronized with Dot) ── */}
              <AnimatePresence>
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Dynamic Connected Dotted SVG Leader Line starting at (0, 0) */}
                    <svg
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        overflow: 'visible',
                        pointerEvents: 'none',
                        zIndex: 20,
                      }}
                    >
                      {/* Outer glowing dotted line */}
                      <path
                        d={`M 0 0 L ${elbowX} ${elbowY} H ${endX}`}
                        fill="none"
                        stroke={dotColor}
                        strokeWidth="2.2"
                        strokeDasharray="4 3"
                        strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 4px ${dotColor}99)` }}
                      />
                      {/* Inner solid white core line for contrast */}
                      <path
                        d={`M 0 0 L ${elbowX} ${elbowY} H ${endX}`}
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.1"
                        strokeDasharray="4 3"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                      {/* Terminal anchor node dot touching the card */}
                      <circle
                        cx={endX}
                        cy={endY}
                        r="3.5"
                        fill={dotColor}
                        stroke="#ffffff"
                        strokeWidth="2"
                        style={{ filter: `drop-shadow(0 0 4px ${dotColor})` }}
                      />
                    </svg>

                    {/* Integrated Clinical Callout Modal (Connected to End of Line) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.90, y: dirY * 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.90, y: dirY * 10 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      onClick={(e) => e.stopPropagation()}
                      className="pointer-events-auto bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 shadow-2xl border border-slate-200/90 text-left w-[275px] sm:w-[295px]"
                      style={{
                        position: 'absolute',
                        left: dirX === 1 ? `${endX}px` : 'auto',
                        right: dirX === -1 ? `${-endX}px` : 'auto',
                        top: `${endY - 26}px`,
                        zIndex: 35,
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.20), 0 4px 16px rgba(0,0,0,0.06)',
                      }}
                    >
                      {/* Header Bar */}
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                            style={{ background: dotColor }}
                          />
                          <span className="font-mono text-xs font-bold text-slate-900">
                            [{pin.code}]
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                            {pin.shortName || pin.tag}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPin(null);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label="Close callout"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Landmark Full Name */}
                      <h4 className="font-display text-xs sm:text-sm font-bold text-slate-900 leading-tight mb-2">
                        {pin.name}
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
                          {pin.patientExpl}
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
                          {pin.pathology}
                        </p>
                      </div>

                      {/* Territory Note (NO arterial status) */}
                      {pin.bloodTerritory && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 text-[9px] font-mono text-slate-400">
                          Territory: {pin.bloodTerritory}
                        </div>
                      )}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
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
 * Pure transparent stage, centered heart, smooth hover modal with auto-dismiss
 */
export default function RealisticHeart3DViewer() {
  const [selectedModel, setSelectedModel] = useState('realistic');
  const [activePin, setActivePin] = useState(null);

  const controlsRef = useRef();
  const stageRef = useRef(null);

  const currentModelConfig = HEART_MODELS[selectedModel];

  // Reset camera view whenever model is switched
  useEffect(() => {
    setActivePin(null);
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [selectedModel]);

  return (
    <div
      ref={stageRef}
      className="relative w-full max-w-[740px] flex flex-col items-center select-none"
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

      {/* ── Seamless Transparent 3D Stage (Permanently Centered with Ample Padding) ── */}
      <div className="relative w-full h-[500px] sm:h-[540px] flex items-center justify-center">
        
        {/* Soft volumetric depth glow behind the heart */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.10) 0%, rgba(56,189,248,0.06) 50%, transparent 72%)',
          }}
        />

        {/* 3D WebGL Canvas */}
        <div className="w-full h-full">
          <Canvas
            camera={{ position: [0, 0, 2.85], fov: 40 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onClick={() => setActivePin(null)}
          >
            {/* Medical Studio Lighting */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 5, 4]} intensity={2.2} color="#fff1f2" />
            <directionalLight position={[-4, 2, -2]} intensity={1.4} color="#e0f2fe" />
            <directionalLight position={[0, -4, 3]} intensity={0.9} color="#ffe4e6" />

            {/* Smooth 360° Orbit Controls (Zoom strictly disabled per user request) */}
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
                onSelectPin={(pin) => setActivePin(pin)}
              />
            </Suspense>
          </Canvas>
        </div>

      </div>

      {/* ── Bottom Footnote ── */}
      <p className="font-mono text-[10px] text-slate-400 tracking-wider mt-1 text-center">
        Click or hover anatomical dots to inspect pathology · Drag heart to rotate 360°
      </p>

    </div>
  );
}
