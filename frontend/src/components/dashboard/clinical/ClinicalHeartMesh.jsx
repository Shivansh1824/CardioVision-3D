import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap';

/**
 * 3D Heart Mesh with dynamic vessel risk color glow & Lub-Dub heartbeat.
 * Encapsulated 3D component rendered inside the Canvas.
 */
export default function ClinicalHeartMesh({ 
  modelConfig, 
  vessels, 
  activeVessel, 
  onSelectVessel, 
  onLoaded 
}) {
  const groupRef = useRef();
  const beatRef = useRef();
  const { scene: rawScene, animations } = useGLTF(modelConfig.url, '/draco/');
  const scene = useMemo(() => SkeletonUtils.clone(rawScene), [rawScene]);
  const { actions, names } = useAnimations(animations, groupRef);

  // Auto-center and smooth entrance
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
    // Scale 1.02 gives full breathing room so both top aorta and bottom apex stay inside frame
    const targetScale = 1.02 / (maxDim || 1);

    if (groupRef.current) {
      groupRef.current.scale.set(targetScale * 0.75, targetScale * 0.75, targetScale * 0.75);
      // Lift slightly (+0.08) so apex floats cleanly above bottom HUD and compass dial
      groupRef.current.position.set(
        -center.x * targetScale,
        -center.y * targetScale + 0.08,
        -center.z * targetScale
      );
      groupRef.current.rotation.y = -0.45;
    }

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.roughness = 0.42;
        child.material.metalness = 0.12;
        child.material.transparent = true;
        child.material.opacity = 0;
        child.material.needsUpdate = true;
      }
    });

    gsap.to(groupRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 1.1,
      ease: 'elastic.out(1, 0.75)',
    });

    gsap.to(groupRef.current.rotation, {
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
    });

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        gsap.to(child.material, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
          stagger: 0.03,
        });
      }
    });

    onLoaded?.();
  }, [scene, onLoaded]);

  // Contraction animation if animated model (Dissected Heart)
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

  // Procedural Lub-Dub heartbeat for Human Heart model
  useFrame(({ clock }) => {
    if (!beatRef.current) return;
    if (modelConfig.id !== 'realistic') {
      beatRef.current.scale.set(1, 1, 1);
      return;
    }

    const t = clock.getElapsedTime();
    const period = 0.8333; // ~72 BPM
    const cycle = (t % period) / period;
    let pulse = 0;
    let twist = 0;

    if (cycle < 0.14) {
      const p = cycle / 0.14;
      pulse = Math.sin(p * Math.PI) * 0.035;
      twist = Math.sin(p * Math.PI) * 0.015;
    } else if (cycle >= 0.18 && cycle < 0.38) {
      const p = (cycle - 0.18) / 0.20;
      pulse = Math.sin(p * Math.PI) * 0.052;
      twist = -Math.sin(p * Math.PI) * 0.020;
    }

    beatRef.current.scale.set(1 + pulse, 1 - pulse * 0.38, 1 + pulse);
    beatRef.current.rotation.y = twist;
  });

  // Anatomical marker anchors for LAD, LCX, RCA
  const pinMarkers = [
    {
      id: 'lad',
      code: 'LAD',
      label: 'Left Anterior Descending',
      pos: [0.06, 0.40, 0.32],
      risk: vessels?.lad,
    },
    {
      id: 'lcx',
      code: 'LCX',
      label: 'Left Circumflex',
      pos: [0.22, 0.56, 0.14],
      risk: vessels?.lcx,
    },
    {
      id: 'rca',
      code: 'RCA',
      label: 'Right Coronary Artery',
      pos: [-0.22, 0.50, 0.16],
      risk: vessels?.rca,
    },
  ];

  return (
    <group ref={groupRef}>
      <group ref={beatRef}>
        <primitive object={scene} />

        {/* 3D Arterial Diagnostic Pins */}
        {modelConfig.id === 'realistic' && pinMarkers.map((marker) => {
          const isSelected = activeVessel === marker.id;
          const prob = marker.risk?.probability ?? 0.5;
          const isBlocked = marker.risk?.is_blocked ?? prob >= 0.5;

          // Clinical dynamic color: crimson for high risk / blocked, amber for moderate, emerald for patent
          const pinColor = isBlocked || prob >= 0.5
            ? '#ef4444' // Crimson
            : prob >= 0.35
            ? '#f59e0b' // Amber
            : '#10b981'; // Emerald

          return (
            <group key={marker.id} position={marker.pos}>
              <Html center sprite={false} zIndexRange={isSelected ? [100, 50] : [40, 10]}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectVessel(marker.id);
                  }}
                  className="group relative flex items-center justify-center p-2 cursor-pointer focus:outline-none select-none"
                  style={{ transform: 'scale(1)' }}
                >
                  {/* Pulsing halo for stenotic vessels */}
                  {(isSelected || isBlocked) && (
                    <span
                      className="absolute -inset-2.5 rounded-full pointer-events-none animate-ping"
                      style={{
                        background: pinColor,
                        opacity: 0.35,
                      }}
                    />
                  )}

                  {/* Surface Anchor Dot */}
                  <span
                    style={{
                      width: isSelected ? 18 : 14,
                      height: isSelected ? 18 : 14,
                      borderRadius: '50%',
                      background: pinColor,
                      border: '2px solid #ffffff',
                      boxShadow: `0 0 12px ${pinColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />
                  </span>

                  {/* Persistent Tooltip Pill for Artery Identification */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '100%',
                      marginLeft: 8,
                      padding: isSelected ? '4px 10px' : '3px 8px',
                      borderRadius: 8,
                      background: isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      fontSize: isSelected ? '11px' : '10px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      border: isSelected ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: isSelected ? '0 4px 16px rgba(56, 189, 248, 0.35)' : '0 2px 8px rgba(0,0,0,0.25)',
                      pointerEvents: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ color: pinColor, fontSize: '9px' }}>●</span>
                    <span style={{ letterSpacing: '0.02em' }}>{marker.code}:</span>
                    <span style={{ color: pinColor, fontFamily: 'monospace', fontWeight: 800 }}>
                      {Math.round(prob * 100)}%
                    </span>
                  </div>
                </button>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
