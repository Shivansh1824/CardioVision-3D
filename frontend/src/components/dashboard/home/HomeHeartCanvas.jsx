import React, { useRef, Suspense, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { HEART_MODELS } from '../../../services/heartModelService';
import { Heart, Activity } from 'lucide-react';

function isWebGLSupported() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

class CanvasSafeWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.warn('HomeHeartCanvas WebGL error handled gracefully:', err?.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function SimpleHeartMesh() {
  const groupRef = useRef();
  const { scene: rawScene } = useGLTF(HEART_MODELS.realistic.url, '/draco/');
  const scene = useMemo(() => SkeletonUtils.clone(rawScene), [rawScene]);

  // Center model based on actual geometry bounding box so it is fully in frame
  const { centerOffset, scaleFactor } = useMemo(() => {
    if (!scene) return { centerOffset: [0, -0.22, 0], scaleFactor: 0.85 };
    // Guarantee pristine neutral transform state before computing bounding box
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.scale.set(1, 1, 1);
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Heroic fit scale: prominent in card while preserving safe top & bottom margins
    const fitScale = 1.18 / (maxDim || 1);
    return {
      // Positioned slightly above center so apex has generous clearance above the bottom launch button
      centerOffset: [-center.x, -center.y + 0.04, -center.z],
      scaleFactor: fitScale,
    };
  }, [scene]);

  // Gentle anatomical lub-dub pulsation & auto-rotation around geometric center
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // 72 BPM = 1.2 Hz
    const pulse = 1 + 0.03 * Math.sin(t * 7.5) * Math.sin(t * 7.5);
    const s = scaleFactor * pulse;
    groupRef.current.scale.set(s, s, s);
    groupRef.current.rotation.y = t * 0.35;
  });

  return (
    <group ref={groupRef} rotation={[0.08, -0.4, 0]}>
      <primitive object={scene} position={centerOffset} />
    </group>
  );
}

function FallbackMesh() {
  const meshRef = useRef();
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.95, 24, 24]} />
      <meshStandardMaterial
        color="#e11d48"
        roughness={0.3}
        metalness={0.2}
        wireframe
      />
    </mesh>
  );
}

function FallbackCardioPulse() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, rgba(244, 63, 94, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 86,
          height: 86,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.4), 0 0 0 8px rgba(244, 63, 94, 0.15)',
          animation: 'pulse 1.8s infinite cubic-bezier(0.4, 0, 0.6, 1)',
        }}
      >
        <Heart size={40} color="#ffffff" fill="#ffffff" />
      </div>
      <div style={{ marginTop: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Cardiovascular Model Active</div>
        <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4 }}>
          <Activity size={12} color="#059669" />
          <span>72 BPM · Sinus Perfusion Live</span>
        </div>
      </div>
    </div>
  );
}

export default function HomeHeartCanvas() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(isWebGLSupported());
  }, []);

  if (!webglSupported) {
    return <FallbackCardioPulse />;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <CanvasSafeWrapper fallback={<FallbackCardioPulse />}>
        <Canvas
          camera={{ position: [0, 0, 2.38], fov: 38 }}
          gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} />
          <directionalLight position={[-5, -4, -5]} intensity={0.6} color="#38bdf8" />
          <pointLight position={[0, 2, 2]} intensity={1.2} color="#fda4af" />

          <Suspense fallback={<FallbackMesh />}>
            <SimpleHeartMesh />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.3}
          />
        </Canvas>
      </CanvasSafeWrapper>
    </div>
  );
}
