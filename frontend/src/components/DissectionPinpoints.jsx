import React from 'react';
import { motion } from 'framer-motion';
import { DISSECTION_LANDMARKS } from './cardiacAnatomyData';

export default function DissectionPinpoints({ activeCallout, onSelectLandmark }) {
  return (
    <>
      {DISSECTION_LANDMARKS.map((landmark, idx) => {
        const isSelected = activeCallout === landmark.id;

        return (
          <div
            key={landmark.id}
            style={{
              position: 'absolute',
              left: `${landmark.coords.x}%`,
              top: `${landmark.coords.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: isSelected ? 40 : 30,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: 'backOut' }}
              className="relative flex items-center group"
            >
              <button
                type="button"
                onClick={() => onSelectLandmark(isSelected ? null : landmark.id)}
                onMouseEnter={() => onSelectLandmark(landmark.id)}
                className="relative flex items-center justify-center p-2 cursor-pointer focus:outline-none"
                aria-label={`Inspect ${landmark.name}`}
              >
                <span
                  className="absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40"
                  style={{ background: '#e11d48' }}
                />
                <span
                  className="rounded-full transition-all duration-200 relative z-10 flex items-center justify-center"
                  style={{
                    width: isSelected ? 16 : 12,
                    height: isSelected ? 16 : 12,
                    background: '#e11d48',
                    border: '2px solid #ffffff',
                    boxShadow: isSelected
                      ? '0 0 0 4px rgba(225,29,72,0.45), 0 0 16px #e11d48'
                      : '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </button>

              {/* High-Visibility Clinical Floating Badge */}
              <div
                onClick={() => onSelectLandmark(isSelected ? null : landmark.id)}
                className={`cursor-pointer absolute whitespace-nowrap px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold transition-all shadow-md pointer-events-auto ${
                  landmark.badgePos === 'left'
                    ? 'right-full mr-1 top-1/2 -translate-y-1/2'
                    : landmark.badgePos === 'top'
                    ? 'bottom-full mb-1 left-1/2 -translate-x-1/2'
                    : landmark.badgePos === 'bottom'
                    ? 'top-full mt-1 left-1/2 -translate-x-1/2'
                    : 'left-full ml-1 top-1/2 -translate-y-1/2'
                } ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-500 shadow-rose-500/25 scale-105'
                    : 'bg-slate-900/90 text-slate-100 hover:bg-slate-950 border-slate-700/80 backdrop-blur-sm'
                }`}
              >
                <span className="text-rose-400 font-extrabold mr-1">[{landmark.id}]</span>
                <span>{landmark.name}</span>
              </div>
            </motion.div>
          </div>
        );
      })}
    </>
  );
}
