import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html, ContactShadows } from '@react-three/drei';
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
function CoronaryArtery({ name, points, status, isHovered, onHover, onClick, radius = 0.055 }) {
  const meshRef = useRef();
  const color = STATUS_COLORS[status] || STATUS_COLORS.normal;

  const curve = useMemo(() => createArteryCurve(points), [points]);
  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 40, radius, 16, false),
    [curve, radius]
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      if (status === 'critical') {
        const pulse = 1 + Math.sin(clock.getElapsedTime() * 7) * 0.18;
        meshRef.current.scale.set(pulse, pulse, pulse);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
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
          emissiveIntensity={isHovered ? 2.0 : status === 'critical' ? 1.5 : 0.8}
          roughness={0.25}
          metalness={0.2}
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
      const contraction = 1 + Math.sin(t) * 0.04 + Math.sin(t * 2) * 0.02;
      heartGroupRef.current.scale.set(contraction, contraction * 1.02, contraction);
    }
  });

  return (
    <group ref={heartGroupRef} position={[0, 0.05, 0]} rotation={[0.15, -0.3, 0]}>
      {/* --- Left Ventricle & Apex (main cardiac muscle bulk) --- */}
      <mesh position={[0.08, -0.35, 0.05]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color="#a31d2e"
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* --- Right Ventricle --- */}
      <mesh position={[-0.35, -0.3, 0.1]} scale={[0.85, 0.95, 0.8]}>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshStandardMaterial
          color="#921828"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* --- Left & Right Atria --- */}
      <mesh position={[0.3, 0.35, -0.1]} scale={[0.75, 0.7, 0.7]}>
        <sphereGeometry args={[0.55, 28, 28]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.35} />
      </mesh>
      <mesh position={[-0.35, 0.35, -0.05]} scale={[0.75, 0.7, 0.7]}>
        <sphereGeometry args={[0.55, 28, 28]} />
        <meshStandardMaterial color="#991b1b" roughness={0.35} />
      </mesh>

      {/* --- Aorta Arch (Red-Oxygenated Great Vessel) --- */}
      <mesh position={[0.0, 0.72, -0.05]} rotation={[0, 0, THREE.MathUtils.degToRad(-15)]}>
        <cylinderGeometry args={[0.22, 0.24, 0.65, 24]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Aortic Branch Arch Curve */}
      <mesh position={[0.12, 1.0, -0.1]} rotation={[0.2, 0.3, -0.4]}>
        <torusGeometry args={[0.32, 0.16, 16, 32, Math.PI * 0.9]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* --- Pulmonary Trunk & Arteries (Blue-Deoxygenated) --- */}
      <mesh position={[-0.18, 0.6, 0.18]} rotation={[0.3, -0.2, 0.25]}>
        <cylinderGeometry args={[0.2, 0.22, 0.58, 24]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* --- Superior Vena Cava --- */}
      <mesh position={[-0.48, 0.78, -0.18]}>
        <cylinderGeometry args={[0.16, 0.17, 0.6, 20]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.35} metalness={0.15} />
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

      {/* 3D Anatomical Pin Labels */}
      <Html position={[0.22, 0.05, 0.68]} distanceFactor={5} center>
        <button
          onClick={() => setSelectedArtery('LAD')}
          className="badge-pill"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: `2px solid ${STATUS_COLORS[vesselStates.LAD]}`,
            color: '#ffffff',
            boxShadow: `0 0 14px ${STATUS_COLORS[vesselStates.LAD]}`,
            cursor: 'pointer',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          LAD {vesselStates.LAD === 'critical' ? '⚠️' : '✓'}
        </button>
      </Html>

      <Html position={[0.65, 0.12, 0.05]} distanceFactor={5} center>
        <button
          onClick={() => setSelectedArtery('LCX')}
          className="badge-pill"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: `2px solid ${STATUS_COLORS[vesselStates.LCX]}`,
            color: '#ffffff',
            boxShadow: `0 0 14px ${STATUS_COLORS[vesselStates.LCX]}`,
            cursor: 'pointer',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          LCX {vesselStates.LCX === 'critical' ? '⚠️' : '✓'}
        </button>
      </Html>

      <Html position={[-0.6, 0.02, 0.22]} distanceFactor={5} center>
        <button
          onClick={() => setSelectedArtery('RCA')}
          className="badge-pill"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: `2px solid ${STATUS_COLORS[vesselStates.RCA]}`,
            color: '#ffffff',
            boxShadow: `0 0 14px ${STATUS_COLORS[vesselStates.RCA]}`,
            cursor: 'pointer',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          RCA {vesselStates.RCA === 'critical' ? '⚠️' : '✓'}
        </button>
      </Html>
    </group>
  );
}

export default function HeartCanvas({ vesselStates = { LAD: 'normal', LCX: 'moderate', RCA: 'normal' }, onSelectArtery }) {
  const [activeHover, setActiveHover] = useState(null);

  return (
    <div
      style={{ minHeight: '520px', height: '520px' }}
      className="relative w-full rounded-2xl overflow-hidden glass-panel bg-gradient-to-b from-slate-950/90 via-slate-900/70 to-slate-950/95 border border-slate-800 shadow-2xl"
    >
      {/* Telemetry Overlay HUD */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5 font-mono text-xs">
        <div className="flex items-center gap-2 bg-slate-950/85 border border-slate-700/80 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-slate-300">Heart Rate: <strong className="text-white">72 BPM</strong></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/85 border border-slate-700/80 px-3 py-1 rounded-full backdrop-blur-md text-[11px] text-slate-400">
          <span>Perfusion: <strong className="text-emerald-400">98.2%</strong></span>
          <span className="text-slate-600">|</span>
          <span>Mesh: <strong className="text-cyan-400">Anatomical Twin</strong></span>
        </div>
      </div>

      {/* Quick 360 Hint */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-right">
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950/85 border border-slate-800 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-md">
          🖱️ Click & Drag to Rotate 360° | Scroll to Zoom
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0.1, 3.2], fov: 45 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-5, -4, -3]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[2, 2, 3]} intensity={1.5} color="#fca5a5" />

        <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.35}>
          <AnatomicalHeartModel
            vesselStates={vesselStates}
            activeHover={activeHover}
            setActiveHover={setActiveHover}
            setSelectedArtery={onSelectArtery || (() => {})}
          />
        </Float>

        <ContactShadows
          position={[0, -1.3, 0]}
          opacity={0.5}
          scale={5}
          blur={2.4}
          far={4}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.0}
          maxDistance={5.0}
          autoRotate={true}
          autoRotateSpeed={0.8}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
