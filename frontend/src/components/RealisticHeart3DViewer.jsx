/**
 * RealisticHeart3DViewer — Native WebGL 3D Heart Centerpiece
 * 
 * Features:
 * - Direct WebGL rendering with Three.js & React Three Fiber (No card box, no border, no video)
 * - Automatic 3D bounding-box calculation and auto-scaling so models are perfectly centered & framed
 * - Dual modes: Animated Beating Cycle (skeletal heartbeat) & Realistic Anatomy (PBR Draco mesh)
 * - Interactive 3D pins (1–5) with zero distanceFactor distortion
 * - Rich clinical pathology data & simplified patient-friendly explanations
 * - Full 360° orbital rotation, smooth damping, auto-rotate toggle, and dedicated zoom controls
 */

import React, { useState, useEffect, useLayoutEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
  Activity,
  Layers,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Heart,
  Stethoscope,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { HEART_MODELS, ANATOMICAL_PINS } from '../services/heartModelService';

/**
 * 3D Heart Model with auto-centering, dynamic vertex colors & skeletal animation
 */
function HeartMesh({ modelConfig, activePin, onSelectPin }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(modelConfig.url, '/draco/');
  const { actions, names } = useAnimations(animations, groupRef);

  // Auto-center and normalize scale precisely using bounding box
  useLayoutEffect(() => {
    if (!scene) return;

    // Calculate scene bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Scale to standard 2.45 units to fill viewport majestically
    const targetScale = 2.45 / (maxDim || 1);

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
          child.material.roughness = 0.44;
          child.material.metalness = 0.12;
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
    <>
      {/* 3D Heart Mesh Geometry */}
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>

      {/* 3D Pins in Standardized World Space (Always Crisp & Perfectly Positioned) */}
      {ANATOMICAL_PINS.map((pin) => {
        const isSelected = activePin?.id === pin.id;
        return (
          <group key={pin.id} position={pin.position}>
            <Html center sprite={false} zIndexRange={[50, 0]}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPin(pin);
                }}
                className={`relative flex items-center justify-center cursor-pointer transition-transform duration-200 select-none ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-115 opacity-90 hover:opacity-100'
                }`}
                title={`${pin.number}. ${pin.name}`}
              >
                {/* Active radar ping */}
                {isSelected && (
                  <span
                    className="absolute -inset-2 rounded-full animate-ping opacity-40 pointer-events-none"
                    style={{ backgroundColor: pin.color }}
                  />
                )}

                {/* Pin badge circle */}
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full text-white font-mono text-xs font-black shadow-md border-2 border-white transition-all"
                  style={{
                    backgroundColor: pin.color,
                    boxShadow: isSelected
                      ? `0 0 14px ${pin.color}`
                      : '0 2px 6px rgba(0,0,0,0.35)',
                  }}
                >
                  {pin.number}
                </div>
              </button>
            </Html>
          </group>
        );
      })}
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
          Rendering 3D Cardiac Geometry...
        </p>
      </div>
    </Html>
  );
}

/**
 * Main 3D Heart Centerpiece
 * Pure transparent stage, zero card box, zero video, full clinical precision
 */
export default function RealisticHeart3DViewer({ vesselStates }) {
  const [selectedModel, setSelectedModel] = useState('realistic');
  const [activePin, setActivePin] = useState(ANATOMICAL_PINS[0]);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const controlsRef = useRef();

  const currentModelConfig = HEART_MODELS[selectedModel];

  // Camera zoom controls
  const handleZoomIn = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.multiplyScalar(0.85);
    controlsRef.current.update();
  };

  const handleZoomOut = () => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    cam.position.multiplyScalar(1.18);
    controlsRef.current.update();
  };

  const handleResetCamera = () => {
    controlsRef.current?.reset();
  };

  // Derive active pin triage status if it's a vessel
  const vesselStatus = activePin?.vesselKey ? vesselStates?.[activePin.vesselKey] || 'normal' : null;

  return (
    <div className="relative w-full max-w-[620px] flex flex-col items-center select-none">
      
      {/* ── Top Floating Toolbar: Model Toggle & Camera Utilities ── */}
      <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xs mb-1.5 z-20">
        <button
          type="button"
          onClick={() => setSelectedModel('realistic')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            selectedModel === 'realistic'
              ? 'bg-rose-500 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Realistic Anatomy</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedModel('beating')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            selectedModel === 'beating'
              ? 'bg-rose-500 text-white font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Beating Cycle</span>
        </button>

        <span className="w-[1px] h-4 bg-slate-200 mx-0.5" />

        {/* Auto Rotate Toggle */}
        <button
          type="button"
          onClick={() => setIsAutoRotate((prev) => !prev)}
          title={isAutoRotate ? 'Pause Rotation' : 'Auto Rotate 360°'}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            isAutoRotate ? 'bg-rose-50 text-rose-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Reset Camera */}
        <button
          type="button"
          onClick={handleResetCamera}
          title="Reset Camera Angle"
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Seamless Transparent 3D Stage (No Card Frame, No Video) ── */}
      <div className="relative w-full h-[430px] sm:h-[460px] flex items-center justify-center">
        
        {/* Soft volumetric depth glow behind the heart */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.08) 0%, rgba(56,189,248,0.05) 50%, transparent 72%)',
          }}
        />

        {/* Pure WebGL Canvas */}
        <Canvas
          camera={{ position: [0, 0, 3.8], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Medical Studio Lighting */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[4, 5, 4]} intensity={2.2} color="#fff1f2" />
          <directionalLight position={[-4, 2, -2]} intensity={1.4} color="#e0f2fe" />
          <directionalLight position={[0, -4, 3]} intensity={0.9} color="#ffe4e6" />

          {/* Interactive Orbit Controls with smooth damping */}
          <OrbitControls
            ref={controlsRef}
            enableDamping={true}
            dampingFactor={0.06}
            autoRotate={isAutoRotate}
            autoRotateSpeed={1.8}
            minDistance={1.8}
            maxDistance={5.5}
            maxPolarAngle={Math.PI - 0.1}
            minPolarAngle={0.1}
          />

          <Suspense fallback={<Loader />}>
            <HeartMesh
              key={selectedModel}
              modelConfig={currentModelConfig}
              activePin={activePin}
              onSelectPin={setActivePin}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Quick Pin Selector Strip ── */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 px-2 mt-1 mb-2 z-20">
        {ANATOMICAL_PINS.map((pin) => {
          const isSelected = activePin?.id === pin.id;
          return (
            <button
              key={pin.id}
              type="button"
              onClick={() => setActivePin(pin)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white shadow-xs border border-slate-300 ring-2 ring-rose-500/20 text-slate-900 font-bold'
                  : 'bg-white/70 hover:bg-white border border-slate-200 text-slate-600'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: pin.color }}
              />
              <span className="font-mono text-[10px]">{pin.number}</span>
              <span>{pin.code}</span>
            </button>
          );
        })}
      </div>

      {/* ── Dedicated Clinical Pathology & Patient Explanation Card ── */}
      <AnimatePresence mode="wait">
        {activePin && (
          <motion.div
            key={activePin.id}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.2 }}
            className="w-full px-2 sm:px-4 z-20"
          >
            <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-lg">
              
              {/* Card Header: Pin Number, Name, Tag & Live Perfusion Status */}
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full text-white font-mono text-xs font-black shadow-xs"
                    style={{ backgroundColor: activePin.color }}
                  >
                    {activePin.number}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{activePin.name}</span>
                      <span className="font-mono text-[10px] font-normal text-slate-400">({activePin.code})</span>
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">{activePin.shortName}</p>
                  </div>
                </div>

                {/* Perfusion Status Badge */}
                {vesselStatus && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      vesselStatus === 'critical'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : vesselStatus === 'moderate'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {vesselStatus === 'critical' ? (
                      <AlertCircle className="w-3 h-3 text-rose-500" />
                    ) : (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    )}
                    <span>{vesselStatus.toUpperCase()}</span>
                  </span>
                )}
              </div>

              {/* 1. Patient Explanation (Friendly, Non-Technical) */}
              <div className="mt-2.5">
                <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>How It Works (Patient Overview)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {activePin.patientExpl}
                </p>
              </div>

              {/* 2. Clinical Pathology & Hemodynamic Risk (Medical-Grade Terms) */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 bg-slate-50/80 -mx-3.5 -mb-3.5 p-3 rounded-b-2xl">
                <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-rose-600 uppercase tracking-wider mb-0.5">
                  <Stethoscope className="w-3 h-3 text-rose-600" />
                  <span>Clinical Pathology &amp; Hemodynamics</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {activePin.pathology}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>Territory: {activePin.bloodTerritory}</span>
                  <span className="text-slate-300">Drag heart to inspect 360°</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
