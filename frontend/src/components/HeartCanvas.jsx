import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Cylinder, Html } from '@react-three/drei';
import * as THREE from 'three';

// Arterial status color map
const STATUS_COLORS = {
  normal: '#10b981',    // Emerald Green
  moderate: '#f59e0b',  // Amber Warning
  critical: '#ef4444',  // Crimson Alert
};

// Procedural anatomical tube curve for arteries
function createArteryCurve(points) {
  const vectors = points.map((p) => new THREE.Vector3(...p));
  return new THREE.CatmullRomCurve3(vectors);
}

// 3D Coronary Artery Component with pulsing glow
function CoronaryArtery({ name, points, status, isHovered, onHover, onClick, radius = 0.045 }) {
  const meshRef = useRef();
  const color = STATUS_COLORS[status] || STATUS_COLORS.normal;

  const curve = useMemo(() => createArteryCurve(points), [points]);
  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 32, radius, 12, false),
    [curve, radius]
  );

  useFrame(({ clock }) => {
    if (meshRef.current && status === 'critical') {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 8) * 0.2;
      meshRef.current.scale.set(pulse, pulse, pulse);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(name);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(name);
      }}
    >
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 1.6 : status === 'critical' ? 1.1 : 0.6}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

// Anatomical Heart Model with Ventricles, Great Vessels & Coronaries
function AnatomicalHeartModel({ vesselStates, activeHover, setActiveHover, setSelectedArtery }) {
  const heartGroupRef = useRef();

  // Coronary Artery Path Coordinates (anatomically mapped)
  // LAD: Left Anterior Descending (runs down anterior interventricular groove to apex)
  const ladPoints = useMemo(
    () => [
      [0.05, 0.45, 0.45],
      [0.12, 0.25, 0.58],
      [0.18, 0.0, 0.62],
      [0.14, -0.35, 0.52],
      [0.05, -0.75, 0.35],
      [0.0, -1.05, 0.15],
    ],
    []
  );

  // LCX: Left Circumflex (courses along coronary sulcus towards posterior)
  const lcxPoints = useMemo(
    () => [
      [0.05, 0.45, 0.45],
      [0.32, 0.38, 0.35],
      [0.55, 0.22, 0.12],
      [0.62, 0.05, -0.15],
      [0.52, -0.25, -0.32],
    ],
    []
  );

  // RCA: Right Coronary Artery (runs down right atrioventricular groove)
  const rcaPoints = useMemo(
    () => [
      [-0.1, 0.45, 0.42],
      [-0.32, 0.32, 0.36],
      [-0.52, 0.1, 0.22],
      [-0.55, -0.22, 0.12],
      [-0.42, -0.55, 0.05],
      [-0.2, -0.78, 0.1],
    ],
    []
  );

  // Heartbeat systolic/diastolic contraction
  useFrame(({ clock }) => {
    if (heartGroupRef.current) {
      const t = clock.getElapsedTime() * 4.2;
      // Cardiac cycle rhythm simulation: Lub-Dub dual contraction
      const contraction = 1 + Math.sin(t) * 0.035 + Math.sin(t * 2) * 0.018;
      heartGroupRef.current.scale.set(contraction, contraction * 1.02, contraction);
    }
  });

  return (
    <group ref={heartGroupRef} position={[0, 0.1, 0]} rotation={[0.15, -0.3, 0]}>
      {/* --- Left Ventricle & Apex (main cardiac muscle bulk) --- */}
      <mesh position={[0.08, -0.35, 0.05]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color="#8b1827"
          roughness={0.45}
          metalness={0.15}
          bumpScale={0.05}
        />
      </mesh>

      {/* --- Right Ventricle --- */}
      <mesh position={[-0.35, -0.3, 0.1]} scale={[0.85, 0.95, 0.8]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial
          color="#781321"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* --- Left & Right Atria --- */}
      <mesh position={[0.3, 0.35, -0.1]} scale={[0.75, 0.7, 0.7]}>
        <sphereGeometry args={[0.55, 28, 28]} />
        <meshStandardMaterial color="#941d2c" roughness={0.4} />
      </mesh>
      <mesh position={[-0.35, 0.35, -0.05]} scale={[0.75, 0.7, 0.7]}>
        <sphereGeometry args={[0.55, 28, 28]} />
        <meshStandardMaterial color="#881927" roughness={0.4} />
      </mesh>

      {/* --- Aorta Arch (Red-Oxygenated Great Vessel) --- */}
      <mesh position={[0.0, 0.72, -0.05]} rotation={[0, 0, THREE.MathUtils.degToRad(-15)]}>
        <cylinderGeometry args={[0.22, 0.24, 0.65, 24]} />
        <meshStandardMaterial color="#a81e2b" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Aortic Branch Arch Curve */}
      <mesh position={[0.12, 1.0, -0.1]} rotation={[0.2, 0.3, -0.4]}>
        <torusGeometry args={[0.32, 0.16, 16, 32, Math.PI * 0.9]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* --- Pulmonary Trunk & Arteries (Blue-Deoxygenated) --- */}
      <mesh position={[-0.18, 0.6, 0.18]} rotation={[0.3, -0.2, 0.25]}>
        <cylinderGeometry args={[0.2, 0.22, 0.58, 24]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* --- Superior Vena Cava --- */}
      <mesh position={[-0.48, 0.78, -0.18]}>
        <cylinderGeometry args={[0.16, 0.17, 0.6, 20]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* --- Coronary Arteries (LAD, LCX, RCA) with live glowing status --- */}
      <CoronaryArtery
        name="LAD"
        points={ladPoints}
        status={vesselStates.LAD}
        isHovered={activeHover === 'LAD'}
        onHover={setActiveHover}
        onClick={setSelectedArtery}
      />
      <CoronaryArtery
        name="LCX"
        points={lcxPoints}
        status={vesselStates.LCX}
        isHovered={activeHover === 'LCX'}
        onHover={setActiveHover}
        onClick={setSelectedArtery}
      />
      <CoronaryArtery
        name="RCA"
        points={rcaPoints}
        status={vesselStates.RCA}
        isHovered={activeHover === 'RCA'}
        onHover={setActiveHover}
        onClick={setSelectedArtery}
      />

      {/* 3D Anatomical Pin Labels in 3D Space */}
      <Html position={[0.28, 0.05, 0.7]} distanceFactor={6} center>
        <button
          onClick={() => setSelectedArtery('LAD')}
          className="badge-pill"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${STATUS_COLORS[vesselStates.LAD]}`,
            color: '#ffffff',
            boxShadow: `0 0 10px ${STATUS_COLORS[vesselStates.LAD]}`,
            cursor: 'pointer',
            padding: '3px 8px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
          }}
        >
          LAD
        </button>
      </Html>

      <Html position={[0.7, 0.15, 0.05]} distanceFactor={6} center>
        <button
          onClick={() => setSelectedArtery('LCX')}
          className="badge-pill"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${STATUS_COLORS[vesselStates.LCX]}`,
            color: '#ffffff',
            boxShadow: `0 0 10px ${STATUS_COLORS[vesselStates.LCX]}`,
            cursor: 'pointer',
            padding: '3px 8px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
          }}
        >
          LCX
        </button>
      </Html>

      <Html position={[-0.65, 0.05, 0.25]} distanceFactor={6} center>
        <button
          onClick={() => setSelectedArtery('RCA')}
          className="badge-pill"
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: `1px solid ${STATUS_COLORS[vesselStates.RCA]}`,
            color: '#ffffff',
            boxShadow: `0 0 10px ${STATUS_COLORS[vesselStates.RCA]}`,
            cursor: 'pointer',
            padding: '3px 8px',
            fontSize: '11px',
            whiteSpace: 'nowrap',
          }}
        >
          RCA
        </button>
      </Html>
    </group>
  );
}

export default function HeartCanvas({ vesselStates = { LAD: 'normal', LCX: 'moderate', RCA: 'normal' }, onSelectArtery }) {
  const [activeHover, setActiveHover] = useState(null);

  return (
    <div className="relative w-full h-[480px] md:h-[580px] rounded-2xl overflow-hidden glass-panel bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90 border border-slate-800">
      {/* Telemetry Overlay HUD */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5 font-mono text-xs">
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/60 px-3 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-slate-300">Live Heart Rate: <strong className="text-white">72 BPM</strong></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-700/60 px-3 py-1 rounded-full backdrop-blur-md text-[11px] text-slate-400">
          <span>Perfusion: <strong>98.2%</strong></span>
          <span className="text-slate-600">|</span>
          <span>Mesh: <strong>3D Anatomical Twin</strong></span>
        </div>
      </div>

      {/* Quick 360 Hint */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-right">
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 border border-slate-800/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
          🖱️ Click & Drag to Rotate 360° | Scroll to Zoom
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0.2, 3.4], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-4, -3, -2]} intensity={0.5} color="#38bdf8" />
        <pointLight position={[2, -2, 3]} intensity={0.8} color="#ef4444" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <AnatomicalHeartModel
            vesselStates={vesselStates}
            activeHover={activeHover}
            setActiveHover={setActiveHover}
            setSelectedArtery={onSelectArtery || (() => {})}
          />
        </Float>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.2}
          maxDistance={5.5}
          autoRotate={true}
          autoRotateSpeed={0.6}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
