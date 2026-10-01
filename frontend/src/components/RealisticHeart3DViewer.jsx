/**
 * RealisticHeart3DViewer — Native WebGL 3D Heart Centerpiece
 * 
 * Features:
 * - Direct WebGL rendering with Three.js & React Three Fiber (No card box, no border, no video)
 * - Large, commanding heart geometry (auto-centered and scaled to eliminate white space)
 * - 3D pins locked 100% to the heart's anatomical surface mesh (rotate & scale synchronously)
 * - Zero-overlap dynamic canvas shift: heart glides left when callout is open on the right
 * - Real-time SVG leader line tracking from the 3D pin to the clinical callout modal
 * - Identical modal design to Surface & Blood Flow with patient overview and clinical pathology
 * - Clean model switcher (Realistic Anatomy vs Beating Cycle) with zero zoom button clutter
 * - 360° mouse / touch orbital rotation
 */

import React, { useState, useEffect, useLayoutEffect, useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Layers, Activity, Heart } from 'lucide-react';
import { HEART_MODELS, ANATOMICAL_PINS } from '../services/heartModelService';
import AnatomicalCalloutTooltip from './AnatomicalCalloutTooltip';

/**
 * Projects the active 3D pin's world coordinates into 2D stage percentage (x, y)
 * accounting for canvasShiftX so the SVG leader line stays locked to the pin in real time.
 */
function ScreenProjector({ activePinId, pinRefs, onProject, canvasShiftX, stageWidth = 720 }) {
  const { camera } = useThree();
  const lastPos = useRef({ x: 50, y: 50 });

  useFrame(() => {
    if (!activePinId || !pinRefs.current[activePinId]) return;
    const pinGroup = pinRefs.current[activePinId];

    const worldPos = new THREE.Vector3();
    pinGroup.getWorldPosition(worldPos);
    worldPos.project(camera);

    const basePercentX = ((worldPos.x + 1) / 2) * 100;
    const basePercentY = ((-worldPos.y + 1) / 2) * 100;

    // Adjust for the motion.div shift of the canvas
    const shiftPercent = (canvasShiftX / stageWidth) * 100;
    const x = Math.max(5, Math.min(95, basePercentX + shiftPercent));
    const y = Math.max(5, Math.min(95, basePercentY));

    if (Math.abs(x - lastPos.current.x) > 0.1 || Math.abs(y - lastPos.current.y) > 0.1) {
      lastPos.current = { x, y };
      onProject({ x, y, isFrontFacing: worldPos.z < 1 });
    }
  });

  return null;
}

/**
 * 3D Heart Mesh Geometry with auto-centering, dynamic vertex colors & surface-locked pins
 */
function HeartMesh({ modelConfig, activePin, onSelectPin, pinRefs }) {
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
    
    // Scale to 4.2 units for an impressive, prominent heart filling the stage
    const targetScale = 4.2 / (maxDim || 1);

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

      {/* 3D Pins LOCKED INSIDE the Heart Group (Synchronous 360° Rotation & Scale) */}
      {ANATOMICAL_PINS.map((pin) => {
        const isSelected = activePin?.id === pin.id;
        return (
          <group
            key={pin.id}
            ref={(el) => {
              if (el) pinRefs.current[pin.id] = el;
            }}
            position={pin.position}
          >
            <Html center sprite={false} zIndexRange={[50, 0]}>
              <div
                onMouseEnter={() => onSelectPin(pin)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPin(pin);
                }}
                className={`group relative flex items-center justify-center cursor-pointer transition-transform duration-200 select-none ${
                  isSelected ? 'scale-125 z-40' : 'hover:scale-115 opacity-95 hover:opacity-100'
                }`}
                title={`${pin.number}. ${pin.name}`}
              >
                {/* Active radar ping */}
                {isSelected && (
                  <span
                    className="absolute -inset-2.5 rounded-full animate-ping opacity-60 pointer-events-none"
                    style={{ backgroundColor: pin.color }}
                  />
                )}

                {/* Medical pinpoint badge with number */}
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-full text-white font-mono text-xs font-black shadow-lg border-2 border-white transition-all"
                  style={{
                    backgroundColor: pin.color,
                    boxShadow: isSelected
                      ? `0 0 18px ${pin.color}`
                      : '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  {pin.number}
                </div>
              </div>
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
 * Pure transparent stage, zero card box, zero video, zero overlap
 */
export default function RealisticHeart3DViewer({ vesselStates }) {
  // Realistic Anatomy active by default
  const [selectedModel, setSelectedModel] = useState('realistic');
  const [activePin, setActivePin] = useState(ANATOMICAL_PINS[0]);
  const [pin2DPos, setPin2DPos] = useState({ x: 38, y: 50, isFrontFacing: true });
  const [isHoveringModal, setIsHoveringModal] = useState(false);
  const controlsRef = useRef();
  const pinRefs = useRef({});

  const currentModelConfig = HEART_MODELS[selectedModel];

  // Shift heart left when callout modal is active to guarantee ZERO overlap
  const canvasShiftX = activePin ? -110 : 0;

  // Prepare callout data formatted identically to Surface & Blood Flow
  const calloutData = activePin
    ? {
        code: activePin.code,
        name: activePin.name,
        shortName: `${activePin.number} · ${activePin.shortName}`,
        tag: activePin.tag,
        flow: activePin.patientExpl,
        role: activePin.patientExpl,
        pathology: activePin.pathology,
        calloutSide: 'right', // Card docked on the right side
      }
    : null;

  return (
    <div className="relative w-full max-w-[720px] flex flex-col items-center select-none">
      
      {/* ── Top Model Switcher: Realistic Anatomy vs Beating Cycle ── */}
      <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-xs mb-1.5 z-30">
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

      {/* ── Seamless Transparent 3D Stage (No Card Frame, No Video) ── */}
      <div className="relative w-full h-[500px] sm:h-[540px] flex items-center justify-center overflow-visible">
        
        {/* Soft volumetric depth glow behind the heart */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.09) 0%, rgba(56,189,248,0.05) 50%, transparent 72%)',
          }}
        />

        {/* Heart Canvas Motion Container with zero-overlap shift */}
        <motion.div
          animate={{ x: canvasShiftX }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <Canvas
            camera={{ position: [0, 0, 3.4], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Medical Studio Lighting */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 5, 4]} intensity={2.2} color="#fff1f2" />
            <directionalLight position={[-4, 2, -2]} intensity={1.4} color="#e0f2fe" />
            <directionalLight position={[0, -4, 3]} intensity={0.9} color="#ffe4e6" />

            {/* Smooth 360° Orbit Controls */}
            <OrbitControls
              ref={controlsRef}
              enableDamping={true}
              dampingFactor={0.06}
              minDistance={2.0}
              maxDistance={5.0}
              maxPolarAngle={Math.PI - 0.1}
              minPolarAngle={0.1}
            />

            {/* Real-time 3D to 2D Screen Projector for Dynamic Leader Line */}
            <ScreenProjector
              activePinId={activePin?.id}
              pinRefs={pinRefs}
              canvasShiftX={canvasShiftX}
              onProject={setPin2DPos}
            />

            <Suspense fallback={<Loader />}>
              <HeartMesh
                key={selectedModel}
                modelConfig={currentModelConfig}
                activePin={activePin}
                onSelectPin={setActivePin}
                pinRefs={pinRefs}
              />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* ── Leader Line & Clinical Callout Modal (Matching Surface & Blood Flow 1:1) ── */}
        <AnimatePresence>
          {calloutData && (
            <AnatomicalCalloutTooltip
              viewMode="surface"
              data={calloutData}
              vesselStates={vesselStates}
              pinPos={{ x: pin2DPos.x, y: pin2DPos.y }}
              onClose={() => setActivePin(null)}
              onCardMouseEnter={() => setIsHoveringModal(true)}
              onCardMouseLeave={() => setIsHoveringModal(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Footnote ── */}
      <p className="font-mono text-[10px] text-slate-400 tracking-wider mt-1 mb-8 text-center">
        Hover pins (1–5) to inspect pathology · Drag heart to rotate 360°
      </p>

    </div>
  );
}
