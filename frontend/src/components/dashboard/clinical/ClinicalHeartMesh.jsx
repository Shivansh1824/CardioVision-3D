import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import gsap from 'gsap';

/**
 * Individual Coronary Artery Pin with precise surface anchor, SVG leader line, and smooth value tweening.
 */
function ArteryPin({ marker, isSelected, onSelect }) {
  const targetProb = marker.risk?.probability ?? 0.5;
  const [smoothProb, setSmoothProb] = useState(targetProb);

  // Smoothly interpolate percentage and color when What-If Simulator values change
  useEffect(() => {
    const animObj = { val: smoothProb };
    const tween = gsap.to(animObj, {
      val: targetProb,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => setSmoothProb(animObj.val),
    });
    return () => tween.kill();
  }, [targetProb]);

  const isBlocked = smoothProb >= 0.5;
  const pinColor = isBlocked
    ? '#ef4444' // Crimson for high risk / stenotic
    : smoothProb >= 0.35
    ? '#f59e0b' // Amber for moderate plaque
    : '#10b981'; // Emerald for patent

  const { dx, dy } = marker.leaderOffset;
  const isLeftOriented = dx < 0;

  return (
    <group position={marker.pos}>
      <Html center sprite={false} zIndexRange={isSelected ? [100, 50] : [40, 10]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(marker.id);
          }}
          style={{
            position: 'relative',
            width: 0,
            height: 0,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {/* 1. Exact Surface Anchor Dot on the Coronary Artery Wall */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Pulsing halo for stenotic vessels or active focus */}
            {(isSelected || isBlocked) && (
              <span
                className="animate-ping"
                style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: pinColor,
                  opacity: 0.35,
                  pointerEvents: 'none',
                  transition: 'background-color 0.4s ease',
                }}
              />
            )}

            {/* Precision Core Dot */}
            <span
              style={{
                width: isSelected ? 13 : 10,
                height: isSelected ? 13 : 10,
                borderRadius: '50%',
                background: pinColor,
                border: '2px solid #ffffff',
                boxShadow: `0 0 10px ${pinColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.35s ease',
              }}
            >
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#ffffff' }} />
            </span>
          </div>

          {/* 2. Sleek Vector Pointer Leader Line (From Artery Surface to Badge) */}
          <svg
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              overflow: 'visible',
              pointerEvents: 'none',
            }}
          >
            <line
              x1={0}
              y1={0}
              x2={dx}
              y2={dy}
              stroke={pinColor}
              strokeWidth={isSelected ? 1.8 : 1.4}
              strokeDasharray="3 2"
              style={{
                transition: 'stroke 0.4s ease, stroke-width 0.2s ease',
                filter: `drop-shadow(0 0 2px ${pinColor})`,
              }}
            />
            {/* Surface Contact Pip */}
            <circle cx={0} cy={0} r={2} fill={pinColor} style={{ transition: 'fill 0.4s ease' }} />
            {/* Badge Connection Pip */}
            <circle cx={dx} cy={dy} r={2} fill={pinColor} style={{ transition: 'fill 0.4s ease' }} />
          </svg>

          {/* 3. Floating Clinical Artery Badge Pill */}
          <div
            style={{
              position: 'absolute',
              left: dx,
              top: dy,
              transform: isLeftOriented ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
              padding: isSelected ? '4px 10px' : '3px 8px',
              borderRadius: 8,
              background: isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontSize: isSelected ? '11px' : '10px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              border: isSelected ? `1.5px solid ${pinColor}` : '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: isSelected
                ? `0 4px 18px ${pinColor}40`
                : '0 2px 8px rgba(0,0,0,0.28)',
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.35s ease',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: pinColor,
                transition: 'background-color 0.4s ease',
              }}
            />
            <span style={{ letterSpacing: '0.02em', color: '#f8fafc' }}>{marker.code}:</span>
            <span
              style={{
                color: pinColor,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 800,
                transition: 'color 0.4s ease',
              }}
            >
              {Math.round(smoothProb * 100)}%
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

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
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
  }, [onLoaded]);

  const { scene: rawScene, animations } = useGLTF(modelConfig.url, '/draco/');
  const scene = useMemo(() => SkeletonUtils.clone(rawScene), [rawScene]);
  const { actions, names } = useAnimations(animations, groupRef);

  // Auto-center and smooth, non-jarring entrance (only on scene/model change, never on props/slider update)
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
    // Scale 1.25 lets the heart use the full viewport cleanly and majestically
    const targetScale = 1.25 / (maxDim || 1);

    if (groupRef.current) {
      groupRef.current.scale.set(targetScale * 0.94, targetScale * 0.94, targetScale * 0.94);
      // Center accurately with subtle vertical offset
      groupRef.current.position.set(
        -center.x * targetScale,
        -center.y * targetScale + 0.04,
        -center.z * targetScale
      );
      groupRef.current.rotation.y = -0.15;
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
      duration: 0.8,
      ease: 'power2.out',
    });

    gsap.to(groupRef.current.rotation, {
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    });

    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        gsap.to(child.material, {
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
        });
      }
    });

    onLoadedRef.current?.();
  }, [scene]);

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

  // Anatomical marker anchors for LAD, LCX, RCA (Exact Coronary Vessels)
  // Each marker defines its exact surface position and clinical leader line offset
  const pinMarkers = [
    {
      id: 'lad',
      code: 'LAD',
      label: 'Left Anterior Descending',
      pos: [0.06, 0.39, 0.27],
      leaderOffset: { dx: 42, dy: 16 }, // Extends down-right along anterior interventricular sulcus
      risk: vessels?.lad,
    },
    {
      id: 'lcx',
      code: 'LCX',
      label: 'Left Circumflex',
      pos: [0.21, 0.50, 0.12],
      leaderOffset: { dx: 40, dy: -18 }, // Extends up-right along lateral left ventricle border
      risk: vessels?.lcx,
    },
    {
      id: 'rca',
      code: 'RCA',
      label: 'Right Coronary Artery',
      pos: [-0.25, 0.49, 0.18],
      leaderOffset: { dx: -36, dy: -16 }, // Extends up-left into clear right atrioventricular space
      risk: vessels?.rca,
    },
  ];

  return (
    <group ref={groupRef}>
      <group ref={beatRef}>
        <primitive object={scene} />

        {/* 3D Arterial Diagnostic Pins with Pointer Leader Lines */}
        {modelConfig.id === 'realistic' && pinMarkers.map((marker) => (
          <ArteryPin
            key={marker.id}
            marker={marker}
            isSelected={activeVessel === marker.id}
            onSelect={onSelectVessel}
          />
        ))}
      </group>
    </group>
  );
}
