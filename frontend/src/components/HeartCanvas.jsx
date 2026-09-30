import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// ── Status colour map ──────────────────────────────────────────────────
const STATUS = {
  normal:   { hex: '#00d68f', emissive: '#00a86b', label: 'Clear', intensity: 0.6 },
  moderate: { hex: '#f0a500', emissive: '#c87800', label: 'Moderate', intensity: 1.0 },
  critical: { hex: '#f43f5e', emissive: '#c0122e', label: 'Stenotic', intensity: 1.8 },
};

// ── Mouse proximity zoom camera ───────────────────────────────────────
function ProximityCamera() {
  const { camera, gl } = useThree();
  const baseZ = 3.4;
  const targetZ = useRef(baseZ);

  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      // zoom in when mouse is within 0.5 of center (normalised radius)
      const zoomIn = Math.max(0, 1 - dist * 1.5);
      targetZ.current = baseZ - zoomIn * 0.9;
    };
    const onLeave = () => { targetZ.current = baseZ; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [gl]);

  useFrame(() => {
    camera.position.z += (targetZ.current - camera.position.z) * 0.06;
  });

  return null;
}

// ── Tapered tube geometry helper ──────────────────────────────────────
function createTaperedTube(points, radii, segments = 32, tubeSegs = 8) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const pathPts = curve.getPoints(segments);
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];
  const uvs = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const r = THREE.MathUtils.lerp(radii[0], radii[1], t);
    const pt = pathPts[i];
    let tangent;
    if (i < segments) {
      tangent = new THREE.Vector3().subVectors(pathPts[i + 1], pt).normalize();
    } else {
      tangent = new THREE.Vector3().subVectors(pt, pathPts[i - 1]).normalize();
    }
    const normal = new THREE.Vector3(0, 1, 0);
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
    normal.crossVectors(binormal, tangent).normalize();

    for (let j = 0; j <= tubeSegs; j++) {
      const angle = (j / tubeSegs) * Math.PI * 2;
      const cx = pt.x + r * (Math.cos(angle) * normal.x + Math.sin(angle) * binormal.x);
      const cy = pt.y + r * (Math.cos(angle) * normal.y + Math.sin(angle) * binormal.y);
      const cz = pt.z + r * (Math.cos(angle) * normal.z + Math.sin(angle) * binormal.z);
      vertices.push(cx, cy, cz);
      uvs.push(j / tubeSegs, t);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < tubeSegs; j++) {
      const a = i * (tubeSegs + 1) + j;
      const b = a + tubeSegs + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// ── Single coronary vessel ─────────────────────────────────────────────
function CoronaryVessel({ name, pts, radii = [0.048, 0.022], status, active, onHover, onClick }) {
  const cfg = STATUS[status] || STATUS.normal;
  const ref = useRef();
  const geo = useMemo(() => createTaperedTube(pts, radii, 40, 10), [pts]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const intensity = cfg.intensity + (status === 'critical' ? Math.sin(t * 6) * 0.6 : Math.sin(t * 2) * 0.15);
    ref.current.material.emissiveIntensity = active ? intensity * 1.4 : intensity;
  });

  return (
    <mesh
      ref={ref}
      geometry={geo}
      onPointerOver={e => { e.stopPropagation(); onHover(name); }}
      onPointerOut={e => { e.stopPropagation(); onHover(null); }}
      onClick={e => { e.stopPropagation(); onClick(name); }}
    >
      <meshStandardMaterial
        color={cfg.hex}
        emissive={cfg.emissive}
        emissiveIntensity={cfg.intensity}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

// ── Branch vessel (thin, fixed) ────────────────────────────────────────
function BranchVessel({ pts, color, emissive }) {
  const geo = useMemo(() => createTaperedTube(pts, [0.022, 0.008], 20, 8), [pts]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.5} roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

// ── Organic ventricular chamber ────────────────────────────────────────
function Chamber({ position, scale, rotation = [0, 0, 0], color }) {
  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <sphereGeometry args={[1, 64, 48]} />
      <meshStandardMaterial
        color={color}
        roughness={0.55}
        metalness={0.05}
        envMapIntensity={0.4}
      />
    </mesh>
  );
}

// ── Myocardial fibrous layer over chamber ─────────────────────────────
function FibrousLayer({ position, scale, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} scale={scale.map(s => s * 1.004)} rotation={rotation}>
      <sphereGeometry args={[1, 64, 48]} />
      <meshStandardMaterial
        color="#5a0c18"
        roughness={0.85}
        metalness={0}
        transparent
        opacity={0.18}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// ── Great vessel (aorta, pulmonary trunk, SVC) ─────────────────────────
function GreatVessel({ pts, radii, color, emissive }) {
  const geo = useMemo(() => createTaperedTube(pts, radii, 24, 14), [pts]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.35} roughness={0.3} metalness={0.15} />
    </mesh>
  );
}

// ── Fine nerve/conduction fibres ─────────────────────────────────────
function ConductionFibre({ pts, color }) {
  const geo = useMemo(() => createTaperedTube(pts, [0.008, 0.004], 16, 6), [pts]);
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} roughness={0.2} metalness={0} />
    </mesh>
  );
}

// ── Floating HUD crosshair pin ─────────────────────────────────────────
function CrosshairPin({ position, label, status, active, onClick }) {
  const cfg = STATUS[status] || STATUS.normal;
  return (
    <Html position={position} distanceFactor={4.5} center occlude>
      <button
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: active ? 'rgba(5,10,24,0.97)' : 'rgba(5,10,24,0.82)',
          border: `1px solid ${active ? cfg.hex : 'rgba(255,255,255,0.18)'}`,
          borderRadius: 6,
          padding: '3px 8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: active ? `0 0 14px ${cfg.hex}55` : 'none',
          pointerEvents: 'auto',
        }}
      >
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: cfg.hex,
          boxShadow: `0 0 8px ${cfg.hex}`,
          flexShrink: 0,
        }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: cfg.hex, whiteSpace: 'nowrap' }}>
          {cfg.label}
        </span>
      </button>
    </Html>
  );
}

// ── The full cardiac model ─────────────────────────────────────────────
function AnatomicalHeart({ vesselStates, activeVessel, setActiveVessel, onSelectArtery }) {
  const groupRef = useRef();

  // Heartbeat animation — bi-phasic systole/diastole
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Atrial kick (0.08) then ventricular systole (0.25) then diastole
    const atrial = Math.max(0, Math.sin(t * 4.2) * 0.06);
    const systole = Math.max(0, Math.sin(t * 4.2 - 0.4) * 0.025);
    const scale = 1 + atrial + systole;
    groupRef.current.scale.setScalar(scale);
  });

  // ── Main chamber paths ─────────────────────────────────────────────

  // Left Ventricle — dominant, conical, tilted left-inferior
  // Right Ventricle — thin crescent, anterior
  // Left Atrium — posterior
  // Right Atrium — right lateral

  // ── LAD: Left Anterior Descending ─────────────────────────────────
  const ladPts = useMemo(() => [
    [ 0.06,  0.42,  0.50],
    [ 0.10,  0.18,  0.58],
    [ 0.13, -0.08,  0.60],
    [ 0.10, -0.35,  0.54],
    [ 0.05, -0.62,  0.40],
    [ 0.01, -0.90,  0.22],
    [-0.02, -1.08,  0.06],
  ], []);
  // D1 diagonal
  const ladD1 = useMemo(() => [
    [ 0.11, -0.10,  0.58],
    [ 0.28, -0.30,  0.52],
    [ 0.40, -0.55,  0.38],
  ], []);
  // D2 diagonal
  const ladD2 = useMemo(() => [
    [ 0.08, -0.48,  0.52],
    [ 0.28, -0.70,  0.38],
    [ 0.42, -0.88,  0.22],
  ], []);
  // Septal perforators
  const ladSep1 = useMemo(() => [
    [ 0.10,  0.02,  0.57],
    [-0.02, -0.08,  0.45],
    [-0.12, -0.18,  0.30],
  ], []);

  // ── LCX: Left Circumflex ──────────────────────────────────────────
  const lcxPts = useMemo(() => [
    [ 0.06,  0.42,  0.50],
    [ 0.28,  0.36,  0.38],
    [ 0.50,  0.22,  0.12],
    [ 0.60,  0.05, -0.12],
    [ 0.56, -0.22, -0.30],
    [ 0.44, -0.44, -0.35],
  ], []);
  // OM1
  const lcxOM1 = useMemo(() => [
    [ 0.46,  0.10,  0.05],
    [ 0.60, -0.10, -0.05],
    [ 0.68, -0.35, -0.10],
  ], []);

  // ── RCA: Right Coronary Artery ─────────────────────────────────────
  const rcaPts = useMemo(() => [
    [-0.08,  0.42,  0.44],
    [-0.28,  0.30,  0.38],
    [-0.50,  0.10,  0.28],
    [-0.56, -0.16,  0.14],
    [-0.50, -0.42,  0.06],
    [-0.34, -0.66,  0.04],
    [-0.16, -0.84,  0.10],
  ], []);
  // PDA
  const rcaPDA = useMemo(() => [
    [-0.16, -0.84,  0.10],
    [-0.04, -0.96,  0.04],
    [ 0.06, -1.05, -0.04],
  ], []);
  // AM branch
  const rcaAM = useMemo(() => [
    [-0.52, -0.08,  0.18],
    [-0.64, -0.28,  0.16],
    [-0.68, -0.50,  0.12],
  ], []);

  // ── Great Vessels ─────────────────────────────────────────────────
  // Ascending Aorta
  const aortaPts  = useMemo(() => [[ 0.06, 0.45, 0.22], [ 0.10, 0.72, 0.10], [ 0.18, 0.95, -0.04], [ 0.28, 1.05, -0.12]], []);
  // Aortic arch
  const archPts   = useMemo(() => [[ 0.28, 1.05, -0.12], [ 0.22, 1.12, -0.28], [ 0.00, 1.14, -0.30], [-0.22, 1.10, -0.22]], []);
  // Pulmonary trunk
  const paTrunk   = useMemo(() => [[-0.14, 0.52, 0.30], [-0.16, 0.70, 0.22], [-0.12, 0.84, 0.10]], []);
  // SVC
  const svcPts    = useMemo(() => [[-0.45, 0.50, -0.10], [-0.44, 0.72, -0.12], [-0.42, 0.96, -0.14]], []);

  // ── Conduction system (HIS-Purkinje network) ──────────────────────
  const hisBundlePts = useMemo(() => [
    [ 0.02,  0.10,  0.40],
    [ 0.04, -0.10,  0.38],
    [ 0.06, -0.30,  0.35],
  ], []);
  const purkinjeLeft = useMemo(() => [
    [ 0.06, -0.30,  0.35],
    [ 0.22, -0.50,  0.30],
    [ 0.28, -0.72,  0.22],
  ], []);
  const purkinjeRight = useMemo(() => [
    [ 0.02,  0.10,  0.40],
    [-0.14, -0.10,  0.35],
    [-0.20, -0.30,  0.28],
    [-0.18, -0.55,  0.20],
  ], []);

  // ── Chamber positions ──────────────────────────────────────────────
  // Left Ventricle
  const lvPos = [ 0.10, -0.38,  0.04];
  const lvScl = [ 0.72,  0.88,  0.78];
  // Right Ventricle
  const rvPos = [-0.32, -0.28,  0.12];
  const rvScl = [ 0.60,  0.82,  0.72];
  // Left Atrium
  const laPos = [ 0.32,  0.30, -0.08];
  const laScl = [ 0.56,  0.55,  0.60];
  // Right Atrium
  const raPos = [-0.36,  0.28,  0.00];
  const raScl = [ 0.52,  0.52,  0.54];

  const ladCfg = STATUS[vesselStates.LAD] || STATUS.normal;
  const lcxCfg = STATUS[vesselStates.LCX] || STATUS.normal;
  const rcaCfg = STATUS[vesselStates.RCA] || STATUS.normal;

  return (
    <group ref={groupRef} position={[0, 0.05, 0]} rotation={[0.08, -0.18, 0.04]}>
      {/* ── Chambers ── */}
      <Chamber position={lvPos} scale={lvScl} rotation={[0, 0, -0.15]} color="#8b1a2a" />
      <FibrousLayer position={lvPos} scale={lvScl} rotation={[0, 0, -0.15]} />
      <Chamber position={rvPos} scale={rvScl} rotation={[0, 0,  0.10]} color="#721524" />
      <Chamber position={laPos} scale={laScl} color="#9b2030" />
      <Chamber position={raPos} scale={raScl} color="#8a1c28" />

      {/* Pericardial fat pad — subtle surface texture */}
      <mesh position={[0, -0.15, 0]} scale={[1.06, 1.12, 1.06]}>
        <sphereGeometry args={[0.7, 48, 36]} />
        <meshStandardMaterial color="#4a0a14" roughness={0.9} metalness={0} transparent opacity={0.08} />
      </mesh>

      {/* ── Great Vessels ── */}
      <GreatVessel pts={aortaPts} radii={[0.20, 0.16]} color="#c42030" emissive="#9b1020" />
      <GreatVessel pts={archPts}  radii={[0.16, 0.14]} color="#c42030" emissive="#9b1020" />
      {/* Brachiocephalic + Carotid stubs */}
      <GreatVessel
        pts={[[ 0.28, 1.05, -0.12], [ 0.34, 1.18, -0.06], [ 0.36, 1.32,  0.00]]}
        radii={[0.10, 0.08]} color="#c42030" emissive="#9b1020"
      />
      <GreatVessel
        pts={[[ 0.04, 1.12, -0.28], [ 0.06, 1.26, -0.24], [ 0.08, 1.38, -0.18]]}
        radii={[0.08, 0.06]} color="#c42030" emissive="#9b1020"
      />
      <GreatVessel pts={paTrunk} radii={[0.17, 0.14]} color="#1e4da8" emissive="#1840a0" />
      <GreatVessel pts={svcPts}  radii={[0.13, 0.12]} color="#1e4da8" emissive="#1840a0" />

      {/* ── Coronary Arteries ── */}
      <CoronaryVessel name="LAD" pts={ladPts} radii={[0.052, 0.022]} status={vesselStates.LAD} active={activeVessel === 'LAD'} onHover={setActiveVessel} onClick={onSelectArtery} />
      <CoronaryVessel name="LCX" pts={lcxPts} radii={[0.045, 0.018]} status={vesselStates.LCX} active={activeVessel === 'LCX'} onHover={setActiveVessel} onClick={onSelectArtery} />
      <CoronaryVessel name="RCA" pts={rcaPts} radii={[0.048, 0.020]} status={vesselStates.RCA} active={activeVessel === 'RCA'} onHover={setActiveVessel} onClick={onSelectArtery} />

      {/* ── Coronary Branches ── */}
      <BranchVessel pts={ladD1}  color={ladCfg.hex} emissive={ladCfg.emissive} />
      <BranchVessel pts={ladD2}  color={ladCfg.hex} emissive={ladCfg.emissive} />
      <BranchVessel pts={ladSep1} color={ladCfg.hex} emissive={ladCfg.emissive} />
      <BranchVessel pts={lcxOM1} color={lcxCfg.hex} emissive={lcxCfg.emissive} />
      <BranchVessel pts={rcaPDA} color={rcaCfg.hex} emissive={rcaCfg.emissive} />
      <BranchVessel pts={rcaAM}  color={rcaCfg.hex} emissive={rcaCfg.emissive} />

      {/* ── Conduction System (HIS-Purkinje) ── */}
      <ConductionFibre pts={hisBundlePts} color="#a78bfa" />
      <ConductionFibre pts={purkinjeLeft}  color="#818cf8" />
      <ConductionFibre pts={purkinjeRight} color="#818cf8" />

      {/* ── HUD Crosshair Pins ── */}
      <CrosshairPin position={[ 0.32, -0.10,  0.62]} label="LAD" status={vesselStates.LAD} active={activeVessel === 'LAD'} onClick={() => onSelectArtery('LAD')} />
      <CrosshairPin position={[ 0.68,  0.08,  0.02]} label="LCX" status={vesselStates.LCX} active={activeVessel === 'LCX'} onClick={() => onSelectArtery('LCX')} />
      <CrosshairPin position={[-0.68, -0.02,  0.28]} label="RCA" status={vesselStates.RCA} active={activeVessel === 'RCA'} onClick={() => onSelectArtery('RCA')} />
      <CrosshairPin position={[-0.45,  0.75, -0.15]} label="HIS-Purkinje" status="normal" active={false} onClick={() => {}} />
    </group>
  );
}

// ── Telemetry HUD overlay ─────────────────────────────────────────────
function TelemHUD({ vesselStates }) {
  const status = {
    LAD: STATUS[vesselStates.LAD],
    LCX: STATUS[vesselStates.LCX],
    RCA: STATUS[vesselStates.RCA],
  };
  return (
    <div style={{
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(5,8,16,0.88)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 8,
        padding: '6px 12px',
        backdropFilter: 'blur(12px)',
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: '#f43f5e',
          boxShadow: '0 0 10px #f43f5e',
          animation: 'pulse-ring 1.2s ease infinite',
        }} />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#e2e8f0' }}>
          72 BPM &nbsp;<span style={{ color: '#94a3b8' }}>|</span>&nbsp; <span style={{ color: '#00e5ff' }}>98.2% Perfusion</span>
        </span>
      </div>
      <div style={{
        display: 'flex',
        gap: 6,
        background: 'rgba(5,8,16,0.82)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 8,
        padding: '5px 10px',
        backdropFilter: 'blur(12px)',
      }}>
        {Object.entries(status).map(([key, cfg]) => (
          <span key={key} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: cfg.hex }}>
            {key}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Legend (bottom-right) ─────────────────────────────────────────────
function Legend() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 14,
      right: 14,
      zIndex: 10,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      background: 'rgba(5,8,16,0.82)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
      padding: '8px 12px',
      backdropFilter: 'blur(12px)',
    }}>
      {[
        { color: '#00d68f', label: 'Clear' },
        { color: '#f0a500', label: 'Moderate' },
        { color: '#f43f5e', label: 'Stenotic' },
        { color: '#818cf8', label: 'Conduction' },
      ].map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#94a3b8' }}>{item.label}</span>
        </div>
      ))}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 4, paddingTop: 4 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#475569' }}>Hover · Orbit · Scroll</span>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────
export default function HeartCanvas({
  vesselStates = { LAD: 'normal', LCX: 'moderate', RCA: 'normal' },
  onSelectArtery = () => {},
}) {
  const [activeVessel, setActiveVessel] = useState(null);

  return (
    <div className="heart-canvas-wrap" style={{ height: 520 }}>
      <TelemHUD vesselStates={vesselStates} />
      <Legend />

      <Canvas
        camera={{ position: [0, 0.05, 3.4], fov: 42 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Lighting rig — clinical studio quality */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[ 3,  6,  4]} intensity={2.2} color="#ffffff" castShadow />
        <directionalLight position={[-4, -2, -3]} intensity={0.7} color="#b0c8f0" />
        <pointLight       position={[ 1,  2,  3]} intensity={1.8} color="#fca5a5" />
        <pointLight       position={[-1,  0,  2]} intensity={0.6} color="#67e8f9" />
        <hemisphereLight  skyColor="#1e3a8a" groundColor="#0a0010" intensity={0.5} />

        <ProximityCamera />

        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.25}>
          <AnatomicalHeart
            vesselStates={vesselStates}
            activeVessel={activeVessel}
            setActiveVessel={setActiveVessel}
            onSelectArtery={onSelectArtery}
          />
        </Float>

        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={0.4}
          scale={4}
          blur={3}
          far={3}
          color="#f43f5e"
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}   /* zoom handled by ProximityCamera */
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.78}
          autoRotate={true}
          autoRotateSpeed={0.65}
          dampingFactor={0.04}
          enableDamping
        />
      </Canvas>
    </div>
  );
}
