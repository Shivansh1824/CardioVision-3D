import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ArrowRight, Activity } from 'lucide-react';

gsap.registerPlugin(useGSAP);

// --------------------------------------------------
// 3D Heart — Volumetric iridescent beating organ
// --------------------------------------------------
const STATUS_COLORS = {
  normal:   '#10b981',
  moderate: '#f59e0b',
  critical: '#ef4444',
};

function createArteryCurve(points) {
  return new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
}

function CoronaryArtery({ points, status, isSelected, radius = 0.05 }) {
  const meshRef = useRef();
  const color = STATUS_COLORS[status] || STATUS_COLORS.normal;
  const curve = React.useMemo(() => createArteryCurve(points), [points]);
  const geo = React.useMemo(() => new THREE.TubeGeometry(curve, 40, radius, 14, false), [curve, radius]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      if (status === 'critical') {
        const p = 1 + Math.sin(clock.getElapsedTime() * 7) * 0.18;
        meshRef.current.scale.setScalar(p);
      }
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isSelected ? 2.5 : status === 'critical' ? 1.8 : 0.9}
        roughness={0.2}
        metalness={0.35}
      />
    </mesh>
  );
}

function HeartMesh({ vesselStates, selectedArtery }) {
  const group = useRef();

  // Gentle autonomous heartbeat rotation + scale
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      // Heartbeat systole / diastole cycle (~72 BPM = 0.83s period)
      const beat = 1 + Math.sin(t * 7.5) * 0.028 + Math.sin(t * 15) * 0.01;
      group.current.scale.setScalar(beat);
      // Slow idle sway
      group.current.rotation.y = Math.sin(t * 0.35) * 0.12;
      group.current.rotation.z = Math.sin(t * 0.22) * 0.04;
    }
  });

  // Anatomical artery paths
  const ladPts = [
    new THREE.Vector3(0.05, 0.45, 0.45),
    new THREE.Vector3(0.12, 0.2, 0.58),
    new THREE.Vector3(0.16, -0.1, 0.62),
    new THREE.Vector3(0.1, -0.45, 0.52),
    new THREE.Vector3(0.0, -0.85, 0.32),
    new THREE.Vector3(-0.02, -1.1, 0.12),
  ];
  const lcxPts = [
    new THREE.Vector3(0.05, 0.45, 0.45),
    new THREE.Vector3(0.35, 0.38, 0.32),
    new THREE.Vector3(0.6, 0.22, 0.1),
    new THREE.Vector3(0.65, 0.05, -0.18),
    new THREE.Vector3(0.54, -0.28, -0.35),
  ];
  const rcaPts = [
    new THREE.Vector3(-0.18, 0.4, 0.38),
    new THREE.Vector3(-0.42, 0.3, 0.22),
    new THREE.Vector3(-0.58, 0.1, 0.0),
    new THREE.Vector3(-0.6, -0.2, -0.18),
    new THREE.Vector3(-0.48, -0.55, -0.25),
  ];

  return (
    <group ref={group}>
      {/* Main heart body — crimson iridescent myocardium */}
      <mesh>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          color="#c0062b"
          emissive="#5c0018"
          emissiveIntensity={0.35}
          roughness={0.45}
          metalness={0.55}
        />
      </mesh>

      {/* Left ventricle bulge (elongated apex) */}
      <mesh position={[0.0, -0.62, 0.08]} rotation={[0.35, 0, 0.08]}>
        <sphereGeometry args={[0.68, 48, 48]} />
        <meshStandardMaterial
          color="#b00526"
          emissive="#4a0014"
          emissiveIntensity={0.4}
          roughness={0.42}
          metalness={0.5}
        />
      </mesh>

      {/* Right atrium */}
      <mesh position={[-0.62, 0.22, 0.1]}>
        <sphereGeometry args={[0.52, 36, 36]} />
        <meshStandardMaterial
          color="#be0a2f"
          emissive="#500012"
          emissiveIntensity={0.3}
          roughness={0.48}
          metalness={0.45}
        />
      </mesh>

      {/* Aorta arch — glowing crimson */}
      <mesh position={[0.18, 1.12, 0.08]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.24, 0.2, 0.72, 24]} />
        <meshStandardMaterial
          color="#e11d48"
          emissive="#e11d48"
          emissiveIntensity={0.85}
          roughness={0.2}
          metalness={0.65}
        />
      </mesh>

      {/* Pulmonary artery — luminous cyan */}
      <mesh position={[-0.15, 1.05, 0.28]} rotation={[0.15, 0.2, 0.25]}>
        <cylinderGeometry args={[0.18, 0.15, 0.6, 20]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0284c7"
          emissiveIntensity={0.75}
          roughness={0.25}
          metalness={0.6}
        />
      </mesh>

      {/* Coronary arteries with flow-state color coding */}
      <CoronaryArtery
        points={ladPts}
        status={vesselStates.LAD}
        isSelected={selectedArtery === 'LAD'}
        radius={0.06}
      />
      <CoronaryArtery
        points={lcxPts}
        status={vesselStates.LCX}
        isSelected={selectedArtery === 'LCX'}
        radius={0.055}
      />
      <CoronaryArtery
        points={rcaPts}
        status={vesselStates.RCA}
        isSelected={selectedArtery === 'RCA'}
        radius={0.055}
      />

      {/* Specular highlight overlay — mimics wet tissue gloss */}
      <mesh position={[-0.28, 0.35, 0.92]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fecdd3"
          emissiveIntensity={0.5}
          roughness={0.0}
          metalness={0.0}
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  );
}

// --------------------------------------------------
// Live ECG Waveform (Canvas-drawn, animated)
// --------------------------------------------------
function ECGWaveform() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const mid = H / 2;
    let offset = 0;

    // One cycle of a realistic ECG: flat baseline → P wave → QRS spike → T wave
    function ecgY(x) {
      const cycle = (x % 120) / 120; // normalised 0-1 per cycle
      if (cycle < 0.12) return -Math.sin(cycle / 0.12 * Math.PI) * 4;    // P
      if (cycle < 0.22) return 0;
      if (cycle < 0.26) return Math.sin((cycle - 0.22) / 0.04 * Math.PI) * 22; // QRS up
      if (cycle < 0.30) return -Math.sin((cycle - 0.26) / 0.04 * Math.PI) * 14; // S down
      if (cycle < 0.38) return 0;
      if (cycle < 0.55) return Math.sin((cycle - 0.38) / 0.17 * Math.PI) * 6;  // T
      return 0;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 6;
      for (let x = 0; x < W; x++) {
        const y = mid + ecgY(x + offset);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset += 1.2;
      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={44}
      className="w-full h-11 opacity-90"
      aria-hidden="true"
    />
  );
}

// --------------------------------------------------
// HeroConceptA — Main export
// --------------------------------------------------
export default function HeroConceptA({ onOpenSignIn, onScrollToSection, vesselStates, selectedArtery }) {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('.ca-overline', { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 })
        .fromTo('.ca-headline', { y: 35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.75 }, '-=0.35')
        .fromTo('.ca-sub',      { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6  }, '-=0.45')
        .fromTo('.ca-cta',      { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 }, '-=0.35')
        .fromTo('.ca-stat',     { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.07 }, '-=0.3')
        .fromTo('.ca-canvas',   { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'back.out(1.4)' }, '-=0.65')
        .fromTo('.ca-hud',      { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.1 }, '-=0.55');
    },
    { scope: sectionRef }
  );

  const ladStatus = vesselStates?.LAD || 'moderate';
  const lcxStatus = vesselStates?.LCX || 'normal';
  const rcaStatus = vesselStates?.RCA || 'critical';

  const vesselColor = (s) =>
    s === 'critical' ? '#ef4444' : s === 'moderate' ? '#f59e0b' : '#10b981';
  const vesselLabel = (s) =>
    s === 'critical' ? 'Severe' : s === 'moderate' ? 'Moderate' : 'Clear';

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 65% 40%, rgba(225,29,72,0.10) 0%, transparent 60%),' +
          'radial-gradient(ellipse 70% 55% at 15% 60%, rgba(186,230,253,0.30) 0%, transparent 60%),' +
          'linear-gradient(170deg, #f8fafc 0%, #fdf2f8 50%, #f0f9ff 100%)',
        minHeight: '92vh',
        paddingTop: '5rem',
        paddingBottom: '5rem',
      }}
    >
      {/* Ambient glow rings (purely decorative depth cues) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)',
          width: 640, height: 640,
          background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center">

          {/* ── LEFT COLUMN: Editorial Copy ── */}
          <div className="lg:col-span-5 space-y-7 lg:pr-6">

            {/* Style A overline */}
            <div className="ca-overline flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 flex-shrink-0" />
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-rose-600 uppercase">
                Interactive 3D Cardiovascular Twin
              </span>
            </div>

            <h1 className="ca-headline font-display font-extrabold text-slate-900 leading-[1.05]"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', letterSpacing: '-0.04em' }}>
              Understand Your Heart &amp;{' '}
              <span className="text-gradient-vivid">Coronary Arteries</span>
            </h1>

            <p className="ca-sub text-base sm:text-lg text-slate-600 leading-relaxed max-w-md">
              An intuitive 3D visual platform that helps doctors triage coronary disease and patients
              see exactly how blood flows through their arteries — with zero medical confusion.
            </p>

            <div className="ca-cta flex flex-wrap items-center gap-3">
              <button
                onClick={() => onScrollToSection?.('vessel-explorer')}
                className="ca-cta btn-primary-vibrant text-sm cursor-pointer shadow-lg hover:shadow-rose-400/30 transition-shadow"
                id="concept-a-explore-btn"
              >
                <span>Explore Arteries</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenSignIn?.('doctor')}
                className="ca-cta btn-secondary-glass text-sm cursor-pointer"
                id="concept-a-signin-btn"
              >
                <span>Clinical Portal</span>
              </button>
            </div>

            {/* Live Vessel Status Strip */}
            <div className="pt-1">
              <p className="font-mono text-[10px] font-semibold text-slate-400 tracking-widest uppercase mb-2.5">
                Live Vessel Triage Status
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { code: 'LAD', name: 'Anterior', status: ladStatus },
                  { code: 'LCX', name: 'Lateral',  status: lcxStatus },
                  { code: 'RCA', name: 'Inferior', status: rcaStatus },
                ].map((v) => (
                  <div key={v.code} className="ca-stat flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 border border-slate-200/80 shadow-xs backdrop-blur-sm">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: vesselColor(v.status), boxShadow: `0 0 6px ${vesselColor(v.status)}88` }}
                    />
                    <span className="font-mono text-xs font-bold text-slate-800">{v.code}</span>
                    <span className="text-[10px] text-slate-500">{v.name}</span>
                    <span className="text-[10px] font-semibold" style={{ color: vesselColor(v.status) }}>
                      {vesselLabel(v.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Cinematic 3D Heart + Floating HUDs ── */}
          <div className="lg:col-span-7 relative ca-canvas">
            {/* ── Floating HUD: ECG Monitor (top-left of canvas) ── */}
            <motion.div
              className="ca-hud absolute left-0 top-4 z-20 bg-white/88 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3.5 shadow-xl"
              style={{ minWidth: 185, boxShadow: '0 8px 32px rgba(225,29,72,0.12), 0 2px 8px rgba(0,0,0,0.08)' }}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping flex-shrink-0" />
                <span className="font-mono text-[10px] font-bold text-rose-600 tracking-wider uppercase">Live ECG</span>
                <span className="ml-auto font-display font-bold text-slate-900 text-sm">72 BPM</span>
              </div>
              <ECGWaveform />
              <p className="mt-1 font-mono text-[9px] text-slate-400 tracking-wider">Normal sinus rhythm</p>
            </motion.div>

            {/* ── Floating HUD: 5-Fold Validation ring (top-right) ── */}
            <motion.div
              className="ca-hud absolute right-0 top-4 z-20 bg-white/88 backdrop-blur-xl border border-emerald-200/70 rounded-2xl p-3.5 shadow-xl"
              style={{ minWidth: 155, boxShadow: '0 8px 32px rgba(5,150,105,0.12), 0 2px 8px rgba(0,0,0,0.06)' }}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
            >
              <p className="font-mono text-[10px] font-bold text-emerald-700 tracking-wider uppercase mb-1.5">
                Detection Rate
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-extrabold text-emerald-700 text-2xl">91.2%</span>
                <span className="text-[10px] text-slate-500 font-medium">Overall CAD</span>
              </div>
              <div className="mt-2 w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: '91.2%', boxShadow: '0 0 8px #10b98166' }}
                />
              </div>
              <p className="mt-1.5 font-mono text-[9px] text-slate-400 tracking-wider">5-Fold Stratified</p>
            </motion.div>

            {/* ── Floating HUD: Vessel breakdown (bottom-left) ── */}
            <motion.div
              className="ca-hud absolute left-0 bottom-6 z-20 bg-white/88 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-3.5 shadow-xl"
              style={{ minWidth: 170, boxShadow: '0 8px 32px rgba(2,132,199,0.10), 0 2px 8px rgba(0,0,0,0.07)' }}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
            >
              <p className="font-mono text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                Vessel Accuracy
              </p>
              {[
                { code: 'LAD', pct: 84.4, color: '#e11d48' },
                { code: 'LCX', pct: 73.1, color: '#0284c7' },
                { code: 'RCA', pct: 72.1, color: '#d97706' },
              ].map((v) => (
                <div key={v.code} className="flex items-center gap-2 mb-1.5 last:mb-0">
                  <span className="font-mono text-[10px] font-bold text-slate-700 w-7">{v.code}</span>
                  <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: v.color }} />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 w-9 text-right">{v.pct}%</span>
                </div>
              ))}
            </motion.div>

            {/* ── Floating HUD: Clinical grade badge (bottom-right) ── */}
            <motion.div
              className="ca-hud absolute right-2 bottom-6 z-20 bg-white/88 backdrop-blur-xl border border-sky-200/70 rounded-2xl p-3 shadow-xl"
              style={{ boxShadow: '0 8px 24px rgba(14,165,233,0.12), 0 2px 8px rgba(0,0,0,0.06)' }}
              whileHover={{ y: -3, transition: { duration: 0.25 } }}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-600" />
                <div>
                  <p className="font-mono text-[9px] font-bold text-sky-700 tracking-wider uppercase">Clinical CDS</p>
                  <p className="font-display font-bold text-slate-900 text-xs mt-0.5">Triage Ready</p>
                </div>
              </div>
            </motion.div>

            {/* ── Three.js R3F Canvas ── */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                height: 540,
                background: 'radial-gradient(ellipse 70% 65% at 50% 50%, rgba(225,29,72,0.10) 0%, rgba(186,230,253,0.12) 45%, rgba(248,250,252,0.08) 100%)',
                boxShadow: '0 25px 80px rgba(225,29,72,0.14), inset 0 1px 0 rgba(255,255,255,0.8)',
                border: '1px solid rgba(226,232,240,0.7)',
              }}
            >
              <Canvas
                camera={{ position: [0, 0, 4.2], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.9} />
                <pointLight position={[-4, 4, 4]} intensity={3.5} color="#fecdd3" />
                <pointLight position={[4, -2, 3]} intensity={2.2} color="#bae6fd" />
                <pointLight position={[0, -5, 2]} intensity={1.4} color="#fde68a" />
                <spotLight
                  position={[0, 6, 5]}
                  intensity={4}
                  angle={0.35}
                  penumbra={0.7}
                  color="#fff1f2"
                />
                <Environment preset="city" />
                <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
                  <HeartMesh vesselStates={vesselStates} selectedArtery={selectedArtery} />
                </Float>
                <ContactShadows
                  position={[0, -2.2, 0]}
                  opacity={0.25}
                  scale={5}
                  blur={2.5}
                  far={3}
                  color="#e11d48"
                />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
