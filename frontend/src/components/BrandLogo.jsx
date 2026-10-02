import React from 'react';

/**
 * BrandLogo — Official CardioVision AI Brand Identity
 * 
 * Design Concept:
 * - "Cardio": Aerodynamic, continuous cardiovascular silhouette.
 * - "Vision": Central optical lens / diagnostic focus aperture.
 * - "AI": Precision QRS telemetry rhythm intersecting the neural focus.
 */
export default function BrandLogo({ size = 32, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0 ${className}`}
      style={{ width: size, height: size, padding: Math.round(size * 0.16) }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Optical Vision Focal Aperture Ring */}
        <circle
          cx="16"
          cy="14"
          r="6.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray="2 2"
        />

        {/* Anatomical Heart Outer Contour */}
        <path
          d="M16 27.5C15.4 27.5 7.5 21.6 5 15.8C2.8 10.8 5 5.5 10.2 4.6C13.2 4.1 15.3 5.4 16 6.8C16.7 5.4 18.8 4.1 21.8 4.6C27 5.5 29.2 10.8 27 15.8C24.5 21.6 16.6 27.5 16 27.5Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Diagnostic AI QRS Rhythm Line through Lens Center */}
        <path
          d="M9 14H12.5L14.2 9.5L17.8 18.5L19.5 14H23"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Neural Vision Optical Core */}
        <circle
          cx="16"
          cy="14"
          r="1.6"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
