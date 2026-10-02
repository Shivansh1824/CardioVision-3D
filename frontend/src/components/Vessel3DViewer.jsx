import React, { useRef, useEffect, useLayoutEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap';
import { Heart } from 'lucide-react';
import { HEART_MODELS, ANATOMICAL_PINS } from '../services/heartModelService';

const ARTERY_CAMERA_PRESETS = {
  LAD: { pos: [2.65, 0.12, 0.70], target: [0.03, 0.10, 0.10] },
  LCX: { pos: [1.85, 0.28, 2.10], target: [0.15, 0.15, 0.05] },
  RCA: { pos: [2.20, 0.20, -1.80], target: [-0.15, 0.15, 0.05] },
};

const STAGE_COLOR = {
  normal: '#10b981',
  moderate: '#f59e0b',
  critical: '#e11d48',
};

function VesselHeartMesh({ selectedArtery, vesselStates, onSelectArtery }) {
  const groupRef = useRef();
  const [pinsVisible, setPinsVisible] = useState(false);
  const { scene: rawScene } = useGLTF(HEART_MODELS.realistic.url, '/draco/');
  const scene = useMemo(() => SkeletonUtils.clone(rawScene), [rawScene]);

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

    if (groupRef.current) {
      groupRef.current.scale.set(targetScale * 0.72, targetScale * 0.72, targetScale * 0.72);
      groupRef.current.position.set(
        -center.x * targetScale,
        -center.y * targetScale - 0.16,
        -center.z * targetScale
      );
      groupRef.current.rotation.y = -0.45;
    }

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.roughness = 0.42;
        child.material.metalness = 0.10;
        child.material.transparent = true;
        child.material.opacity = 0;
        child.material.needsUpdate = true;
      }
    });

    // 1. Smooth bloom scale
    gsap.to(groupRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 1.15,
      ease: 'power3.out',
    });

    // 2. Smooth vertical rise
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

    // 4. Material fade-in
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        gsap.to(child.material, {
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          onComplete: () => {
            if (child.material) {
              child.material.transparent = false;
            }
          },
        });
      }
    });

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

  // Only render the 3 coronary arteries (LAD, LCX, RCA)
  const coronaryPins = ANATOMICAL_PINS.filter((p) => ['lad', 'lcx', 'rca'].includes(p.id));

  return (
    <group ref={groupRef}>
      <primitive object={scene} />

      {coronaryPins.map((pin) => {
        const isCurrent = selectedArtery?.toUpperCase() === pin.code;
        const currentSeverity = vesselStates?.[pin.code] || 'normal';
        const pinColor = STAGE_COLOR[currentSeverity] || pin.color;

        return (
          <group key={pin.id} position={pin.position}>
            <Html center sprite={false} zIndexRange={isCurrent ? [100, 50] : [40, 10]} style={{ pointerEvents: pinsVisible ? 'auto' : 'none', opacity: pinsVisible ? 1 : 0, transition: 'opacity 0.45s ease-out' }}>
              <button
                type="button"
                id={`vessel-pin-${pin.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectArtery?.(pin.code);
                }}
                className="group relative flex items-center justify-center p-2.5 cursor-pointer focus:outline-none select-none"
                aria-label={`Select ${pin.code} Artery`}
              >
                {/* Pulsating warning ring on active or critical vessel */}
                {(isCurrent || currentSeverity === 'critical') && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-50"
                    style={{ background: pinColor }}
                  />
                )}

                {/* Minimal 3D Pin Marker */}
                <span
                  className="rounded-full transition-all duration-200 relative z-10 flex items-center justify-center"
                  style={{
                    width: isCurrent ? 18 : 13,
                    height: isCurrent ? 18 : 13,
                    background: pinColor,
                    border: '2px solid #ffffff',
                    boxShadow: isCurrent
                      ? `0 0 0 4px ${pinColor}40, 0 0 16px ${pinColor}`
                      : '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>

                {/* Always-visible or hover badge */}
                <div
                  className={`absolute left-full ml-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold whitespace-nowrap shadow-xs pointer-events-none transition-all duration-200 ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900 opacity-100'
                      : 'bg-white/95 text-slate-700 border-slate-200/90 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {pin.code} · {currentSeverity}
                </div>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function VesselLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center select-none">
        <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
        <p className="font-mono text-[10px] font-semibold text-slate-400">Loading 3D Vessel Anatomy...</p>
      </div>
    </Html>
  );
}

export default function Vessel3DViewer({
  selectedArtery = 'LAD',
  vesselStates = { LAD: 'moderate', LCX: 'normal', RCA: 'critical' },
  onSelectArtery = () => {},
}) {
  const controlsRef = useRef();

  // Smooth cinematic camera orbit when selectedArtery changes
  useEffect(() => {
    if (!controlsRef.current) return;
    const preset = ARTERY_CAMERA_PRESETS[selectedArtery] || ARTERY_CAMERA_PRESETS.LAD;
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
  }, [selectedArtery]);

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] flex items-center justify-center rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200/80">
      {/* Soft depth gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(225,29,72,0.08) 0%, rgba(56,189,248,0.05) 50%, transparent 75%)',
        }}
      />

      <Canvas
        camera={{ position: [2.65, 0.12, 0.70], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 5, 4]} intensity={2.0} color="#fff1f2" />
        <directionalLight position={[-4, 2, -2]} intensity={1.3} color="#e0f2fe" />
        <directionalLight position={[0, -4, 3]} intensity={0.8} color="#ffe4e6" />

        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enableDamping={true}
          dampingFactor={0.06}
          maxPolarAngle={Math.PI - 0.1}
          minPolarAngle={0.1}
        />

        <Suspense fallback={<VesselLoader />}>
          <VesselHeartMesh
            selectedArtery={selectedArtery}
            vesselStates={vesselStates}
            onSelectArtery={onSelectArtery}
          />
        </Suspense>
      </Canvas>

      {/* Floating Vessel Badge on bottom left */}
      <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 shadow-xs pointer-events-none">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: STAGE_COLOR[vesselStates?.[selectedArtery] || 'normal'] }}
        />
        <span className="font-mono text-[10px] font-bold text-slate-800">
          Target: {selectedArtery} ({vesselStates?.[selectedArtery] || 'normal'})
        </span>
      </div>

      {/* Hint on bottom right */}
      <span className="absolute bottom-2 right-2 z-20 font-mono text-[9px] text-slate-400 bg-white/80 px-2 py-0.5 rounded border border-slate-100 pointer-events-none hidden sm:inline">
        Drag to orbit 360°
      </span>
    </div>
  );
}
