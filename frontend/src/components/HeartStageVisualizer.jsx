/**
 * HeartStageVisualizer — Interactive 3D Cardiac Centerpiece
 * 
 * Features:
 * - Two modes:
 *     1) 'surface': 360° 3D orbital rotation turntable (Anterior + Posterior views) with active blood flow
 *     2) 'dissected': Coronal split-peel surgical dissection revealing interior ventricles, septum & valves
 * - 360° View Controls:
 *     - Drag-to-rotate horizontally with mouse or touch
 *     - Preset anatomical angles: Anterior (0°), Lateral (75°), Posterior (180°)
 *     - Smooth 360° Auto-Orbit rotation toggle
 *     - Angle scrubber slider
 * - High-visibility clinical landmark reticles & persistent badges
 * - Dismissible clinical tooltip with pathology and hemodynamics
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  VESSEL_COLOR,
  SURFACE_VESSELS,
  DISSECTION_LANDMARKS,
  POSTERIOR_VESSELS,
} from './cardiacAnatomyData';
import AnatomicalCalloutTooltip from './AnatomicalCalloutTooltip';
import RotationControls from './RotationControls';
import CoronaryBloodFlowSvg from './CoronaryBloodFlowSvg';
import DissectionPinpoints from './DissectionPinpoints';

export default function HeartStageVisualizer({
  viewMode,
  vesselStates,
  selectedArtery,
  onSelectArtery,
  onScrollToSection,
}) {
  const heartWrapRef = useRef(null);
  const isDissected = viewMode === 'dissected';

  // 360° Orbital Rotation State
  const [rotationY, setRotationY] = useState(0);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRot, setDragStartRot] = useState(0);

  // Tooltip & hover states
  const [activeCallout, setActiveCallout] = useState(isDissected ? 'LV' : (selectedArtery || 'LAD'));
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHoveringHeart, setIsHoveringHeart] = useState(false);

  // Normalized rotation angle for front/back visibility (0 to 360)
  const normRot = ((rotationY % 360) + 360) % 360;
  const isPosteriorFacing = normRot > 90 && normRot < 270;

  // Auto-orbit animation loop
  useEffect(() => {
    if (!isAutoOrbit || isDissected) return;
    let animId;
    const step = () => {
      setRotationY((prev) => (prev + 0.45) % 360);
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isAutoOrbit, isDissected]);

  // When switching to dissection mode, re-center rotation to 0°
  useEffect(() => {
    if (isDissected) {
      setIsAutoOrbit(false);
      setRotationY(0);
    }
  }, [isDissected]);

  const prevSelectedRef = useRef(selectedArtery);
  useEffect(() => {
    if (selectedArtery && selectedArtery !== prevSelectedRef.current && viewMode === 'surface') {
      setActiveCallout(selectedArtery);
      prevSelectedRef.current = selectedArtery;
    }
  }, [selectedArtery, viewMode]);

  // Pointer drag for 360° rotation
  const handlePointerDown = (e) => {
    if (isDissected) return;
    setIsDragging(true);
    setIsAutoOrbit(false);
    setDragStartX(e.clientX);
    setDragStartRot(rotationY);
  };

  const handlePointerMove = (e) => {
    if (!heartWrapRef.current) return;
    const rect = heartWrapRef.current.getBoundingClientRect();

    // Handle horizontal 360° drag rotation
    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      setRotationY(dragStartRot + deltaX * 0.7);
      return;
    }

    // Subtle 3D tilt tracking
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -normY * 6, ry: normX * 8 });
    setIsHoveringHeart(true);

    if (!isHoveringCard) {
      if (viewMode === 'surface') {
        if (!isPosteriorFacing) {
          let nearest = null;
          let minDistance = Infinity;
          SURFACE_VESSELS.forEach((v) => {
            const dx = px - v.coords.x;
            const dy = py - v.coords.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = v.code;
            }
          });
          setActiveCallout(minDistance < 18 ? nearest : null);
        } else {
          let nearest = null;
          let minDistance = Infinity;
          POSTERIOR_VESSELS.forEach((v) => {
            const dx = px - v.coords.x;
            const dy = py - v.coords.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDistance) {
              minDistance = dist;
              nearest = v.code;
            }
          });
          setActiveCallout(minDistance < 20 ? nearest : null);
        }
      } else if (viewMode === 'dissected') {
        let nearest = null;
        let minDistance = Infinity;
        DISSECTION_LANDMARKS.forEach((l) => {
          const dx = px - l.coords.x;
          const dy = py - l.coords.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance) {
            minDistance = dist;
            nearest = l.id;
          }
        });
        setActiveCallout(minDistance < 20 ? nearest : null);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
    setTilt({ rx: 0, ry: 0 });
    setIsHoveringHeart(false);
    setIsHoveringCard(false);
    setActiveCallout(null);
  };

  // Find active callout data across sets
  const activeVesselData =
    SURFACE_VESSELS.find((v) => v.code === activeCallout) ||
    POSTERIOR_VESSELS.find((v) => v.code === activeCallout) ||
    null;
  const activeDissectionData = DISSECTION_LANDMARKS.find((d) => d.id === activeCallout) || null;
  const activeData = activeVesselData || activeDissectionData;

  const isCardLeft = activeData?.calloutSide === 'left';
  // Shift and scale heart canvas when callout is active to guarantee ZERO overlap with external card
  const canvasShiftX = activeCallout ? (isCardLeft ? 115 : -115) : 0;
  const canvasScale = isDissected ? 0.94 : activeCallout ? 0.90 : isHoveringHeart ? 1.02 : 1.0;

  // Calculate projected 2D coordinates of the target pinpoint in stage percentage space
  const calculatePinPos = () => {
    if (!activeData) return { x: 50, y: 50 };
    const stageW = 720;
    const shiftPercent = (canvasShiftX / stageW) * 100;

    if (isDissected) {
      return {
        x: activeData.coords.x * canvasScale + shiftPercent + (1 - canvasScale) * 50,
        y: activeData.coords.y,
      };
    }
    const currentRot = ((rotationY + tilt.ry) % 360 + 360) % 360;
    const isBack = currentRot > 90 && currentRot < 270;
    const angleRad = isBack
      ? (((currentRot - 180) * Math.PI) / 180)
      : ((currentRot * Math.PI) / 180);
    const projX = 50 + (activeData.coords.x - 50) * Math.cos(angleRad) * canvasScale;
    const projY = activeData.coords.y + tilt.rx * 0.12;
    return {
      x: Math.max(8, Math.min(projX + shiftPercent, 92)),
      y: Math.max(8, Math.min(projY, 90)),
    };
  };

  const pinPos = calculatePinPos();

  return (
    <div className="flex flex-col items-center w-full">
      {/* 3D Heart Visualizer Stage */}
      <div
        ref={heartWrapRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onMouseLeave={handlePointerLeave}
        className={`relative w-full max-w-[620px] sm:max-w-[700px] lg:max-w-[740px] flex items-center justify-center py-2 select-none min-h-[460px] ${
          isDissected ? 'cursor-crosshair' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Soft volumetric glow backdrop */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: -10,
            background: isDissected
              ? 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(225,29,72,0.16) 0%, rgba(56,189,248,0.12) 50%, transparent 72%)'
              : 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(225,29,72,0.14) 0%, rgba(186,230,253,0.12) 48%, transparent 72%)',
            borderRadius: '50%',
            filter: 'blur(24px)',
            transition: 'background 0.5s ease',
          }}
        />

        {/* 3D Perspective Tilt & 360° Rotation Stage */}
        <motion.div
          id="ca-heart-canvas"
          animate={{
            x: canvasShiftX,
            scale: canvasScale,
            rotateX: tilt.rx,
            rotateY: rotationY + tilt.ry,
          }}
          transition={{
            x: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            rotateX: { duration: isDragging ? 0 : 0.15, ease: 'easeOut' },
            rotateY: { duration: isDragging ? 0 : isAutoOrbit ? 0 : 0.25, ease: 'easeOut' },
          }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 480,
            perspective: 1200,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ── Layer 1: Internal Dissected Chamber View ── */}
          <motion.div
            animate={{
              opacity: isDissected ? 1 : 0,
              scale: isDissected ? 1 : 0.94,
              filter: isDissected ? 'blur(0px)' : 'blur(4px)',
            }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: isDissected ? 'relative' : 'absolute',
              inset: 0,
              zIndex: 10,
              pointerEvents: isDissected ? 'auto' : 'none',
              transform: 'translateZ(-1px)',
            }}
          >
            <img
              src="/heart-dissected.png"
              alt="Coronal cross section showing left and right ventricles, valves and septum"
              width={500}
              height={500}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                userSelect: 'none',
                WebkitUserDrag: 'none',
                filter: 'drop-shadow(0 20px 32px rgba(0,0,0,0.18))',
              }}
              draggable={false}
            />

            {/* Volumetric Internal Cavity Depth Lighting */}
            <div
              style={{
                position: 'absolute',
                inset: '20% 22% 22% 22%',
                background: 'radial-gradient(ellipse at 50% 50%, rgba(15,23,42,0.35) 0%, rgba(225,29,72,0.08) 50%, transparent 80%)',
                borderRadius: '50%',
                filter: 'blur(16px)',
                pointerEvents: 'none',
                mixBlendMode: 'multiply',
              }}
            />
          </motion.div>

          {/* ── Layer 2: Surgical Dissection Incision Line (Seam flash effect) ── */}
          <AnimatePresence>
            {isDissected && (
              <motion.div
                key="incision-laser"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: [0, 0.9, 0], scaleY: [0.2, 1, 0.8] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '12%',
                  bottom: '12%',
                  width: 2,
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(180deg, rgba(225,29,72,0) 0%, #38bdf8 30%, #ffffff 50%, #e11d48 80%, rgba(225,29,72,0) 100%)',
                  boxShadow: '0 0 12px #38bdf8, 0 0 20px rgba(255,255,255,0.8)',
                  zIndex: 25,
                  pointerEvents: 'none',
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Layer 3: Surface Heart (Anterior Coronal Hemisections Split & Peel) ── */}
          <div
            style={{
              position: isDissected ? 'absolute' : 'relative',
              inset: 0,
              zIndex: 20,
              pointerEvents: isDissected ? 'none' : 'auto',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(1px)',
            }}
          >
            {/* Left Flap */}
            <motion.div
              animate={
                isDissected
                  ? { x: -46, rotateY: -55, opacity: 0, scale: 0.94 }
                  : { x: 0, rotateY: 0, opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                clipPath: 'polygon(0% 0%, 50.2% 0%, 50.2% 100%, 0% 100%)',
                transformOrigin: 'left center',
                backfaceVisibility: 'hidden',
              }}
            >
              <img
                src="/heart-clean.png"
                alt="Anterior heart left coronal section"
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  userSelect: 'none',
                  WebkitUserDrag: 'none',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.12))',
                }}
                draggable={false}
              />
            </motion.div>

            {/* Right Flap */}
            <motion.div
              animate={
                isDissected
                  ? { x: 46, rotateY: 55, opacity: 0, scale: 0.94 }
                  : { x: 0, rotateY: 0, opacity: 1, scale: 1 }
              }
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: isDissected ? 'absolute' : 'relative',
                inset: 0,
                clipPath: 'polygon(49.8% 0%, 100% 0%, 100% 100%, 49.8% 100%)',
                transformOrigin: 'right center',
                backfaceVisibility: 'hidden',
              }}
            >
              <img
                src="/heart-clean.png"
                alt="Anterior heart right coronal section"
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  userSelect: 'none',
                  WebkitUserDrag: 'none',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.12))',
                }}
                draggable={false}
              />
            </motion.div>
          </div>

          {/* ── Layer 4: Posterior Back-Face View (Active during 360° turn) ── */}
          {!isDissected && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 18,
                transform: 'rotateY(180deg) translateZ(1px)',
                backfaceVisibility: 'hidden',
                pointerEvents: isPosteriorFacing ? 'auto' : 'none',
              }}
            >
              <img
                src="/heart-posterior.png"
                alt="Posterior heart anatomical view showing pulmonary veins and coronary sinus"
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  userSelect: 'none',
                  WebkitUserDrag: 'none',
                  filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.14))',
                }}
                draggable={false}
              />

              {/* Posterior landmark pins */}
              {POSTERIOR_VESSELS.map((pv) => {
                const isSelected = activeCallout === pv.code;
                return (
                  <div
                    key={pv.code}
                    style={{
                      position: 'absolute',
                      left: `${pv.coords.x}%`,
                      top: `${pv.coords.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: isSelected ? 35 : 24,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveCallout(isSelected ? null : pv.code)}
                      onMouseEnter={() => setActiveCallout(pv.code)}
                      className="relative flex items-center justify-center p-2 group cursor-pointer focus:outline-none"
                    >
                      <span
                        className="rounded-full transition-all duration-200"
                        style={{
                          width: isSelected ? 13 : 9,
                          height: isSelected ? 13 : 9,
                          background: '#38bdf8',
                          border: '2px solid #ffffff',
                          boxShadow: isSelected
                            ? '0 0 0 4px rgba(56,189,248,0.45), 0 0 14px #38bdf8'
                            : '0 2px 6px rgba(0,0,0,0.35)',
                        }}
                      />
                      <span className="absolute left-full ml-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-[9px] font-mono font-bold text-sky-300 border border-slate-700 whitespace-nowrap shadow-sm">
                        {pv.code}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Layer 5: Active Coronary Blood Flow Streams ── */}
          <CoronaryBloodFlowSvg
            isDissected={isDissected}
            isPosteriorFacing={isPosteriorFacing}
            activeCallout={activeCallout}
          />

          {/* ── Layer 6: Precision Surface Pinpoints (Anterior Mode) ── */}
          {!isDissected &&
            !isPosteriorFacing &&
            SURFACE_VESSELS.map((v) => {
              const isSelected = activeCallout === v.code;
              const status = vesselStates?.[v.code] || 'normal';
              const color = VESSEL_COLOR[status];

              return (
                <div
                  key={v.code}
                  style={{
                    position: 'absolute',
                    left: `${v.coords.x}%`,
                    top: `${v.coords.y}%`,
                    transform: 'translate(-50%, -50%) translateZ(3px)',
                    zIndex: isSelected ? 35 : 24,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectArtery?.(v.code);
                      setActiveCallout(isSelected ? null : v.code);
                    }}
                    onMouseEnter={() => setActiveCallout(v.code)}
                    className="relative flex items-center justify-center p-2.5 group cursor-pointer focus:outline-none"
                    aria-label={`Inspect ${v.name}`}
                  >
                    <span
                      className="rounded-full transition-all duration-200"
                      style={{
                        width: isSelected ? 13 : 9,
                        height: isSelected ? 13 : 9,
                        background: color,
                        border: '2px solid #ffffff',
                        boxShadow: isSelected
                          ? `0 0 0 4px ${color}45, 0 0 14px ${color}`
                          : '0 2px 6px rgba(0,0,0,0.35)',
                      }}
                    />
                  </button>
                </div>
              );
            })}

          {/* ── Layer 7: Visible Clinical Internal Landmark Targets (Dissection Mode) ── */}
          {isDissected && (
            <DissectionPinpoints
              activeCallout={activeCallout}
              onSelectLandmark={(id) => setActiveCallout(id)}
            />
          )}

        </motion.div>

        {/* ── Layer 8: External Clinical Callout Card & SVG Leader Line (Fixed 2D Plane) ── */}
        <AnimatePresence>
          {activeData && (
            <AnatomicalCalloutTooltip
              viewMode={viewMode}
              data={activeData}
              vesselStates={vesselStates}
              pinPos={pinPos}
              onClose={() => setActiveCallout(null)}
              onCardMouseEnter={() => setIsHoveringCard(true)}
              onCardMouseLeave={() => {
                setIsHoveringCard(false);
                setActiveCallout(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── 360° Turntable Perspective & Rotation Controls (Surface Mode) ── */}
      {!isDissected && (
        <RotationControls
          isAutoOrbit={isAutoOrbit}
          onToggleAutoOrbit={() => setIsAutoOrbit(!isAutoOrbit)}
          normRot={normRot}
          onSetRotation={(val) => {
            setIsAutoOrbit(false);
            setRotationY(val);
          }}
          isPosteriorFacing={isPosteriorFacing}
        />
      )}
    </div>
  );
}
