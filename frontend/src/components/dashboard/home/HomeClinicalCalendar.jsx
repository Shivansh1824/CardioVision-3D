import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Activity } from 'lucide-react';

/**
 * HomeClinicalCalendar — Modern interactive clinical calendar widget.
 * Allows physician to track patient adjudication days, cath lab cases, and follow-ups.
 */
export default function HomeClinicalCalendar({ onOpenPatient }) {
  const [selectedDay, setSelectedDay] = useState(14); // Today: Oct 14, 2026

  // Sample scheduled clinical tracking events mapped by day
  const clinicalEvents = {
    12: [
      { id: 'ev-1', time: '10:00 AM', title: 'PT-004 Echocardiogram Review', type: 'echo', doctor: 'Dr. Shivansh' },
      { id: 'ev-2', time: '02:30 PM', title: 'PT-167 Lipid Follow-up', type: 'consult', doctor: 'Dr. Shivansh' },
    ],
    14: [
      { id: 'ev-3', time: '09:00 AM', title: 'PT-001 Severe LAD Stent Staging', type: 'cath', doctor: 'Dr. Shivansh', urgent: true },
      { id: 'ev-4', time: '11:15 AM', title: 'PT-002 Bifurcation Angiography', type: 'cath', doctor: 'Dr. Shivansh', urgent: true },
      { id: 'ev-5', time: '03:45 PM', title: 'Cath Lab Station 4 Handover', type: 'admin', doctor: 'Dr. Shivansh' },
    ],
    15: [
      { id: 'ev-6', time: '10:30 AM', title: 'PT-003 RCA Ischemia Mapping', type: 'eval', doctor: 'Dr. Shivansh' },
      { id: 'ev-7', time: '01:00 PM', title: 'Station 4 Weekly Mortality Review', type: 'meeting', doctor: 'Cardiology Dept' },
    ],
    18: [
      { id: 'ev-8', time: '11:00 AM', title: 'PT-215 Normal Perfusion Discharge', type: 'discharge', doctor: 'Dr. Shivansh' },
    ],
  };

  const daysInMonth = 31;
  const startDayOffset = 4; // Thursday (Oct 1, 2026) -> offset 4 for Sun-first
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const selectedEvents = clinicalEvents[selectedDay] || [];

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 16,
        border: '1px solid rgba(226, 232, 240, 0.85)',
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Calendar Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'rgba(124, 58, 237, 0.1)',
              color: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarIcon size={15} />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              Clinical Tracking Calendar
            </h3>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              October 2026 · Cath Lab Schedule
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setSelectedDay(14)}
            style={{
              padding: '3px 8px',
              borderRadius: 5,
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            Today (14th)
          </button>
        </div>
      </div>

      {/* ── Days Grid ── */}
      <div style={{ flexShrink: 0, marginBottom: 8 }}>
        {/* Week Day Labels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 2,
            textAlign: 'center',
            marginBottom: 4,
          }}
        >
          {weekDays.map((d) => (
            <div
              key={d}
              style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                color: '#94a3b8',
                padding: '2px 0',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Month Day Cells */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 3,
          }}
        >
          {/* Leading empty spaces */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} style={{ height: 22 }} />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = dayNum === 14;
            const isSelected = selectedDay === dayNum;
            const hasEvent = Boolean(clinicalEvents[dayNum]);

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                style={{
                  height: 22,
                  borderRadius: 5,
                  border: isSelected
                    ? '1.5px solid #0f172a'
                    : isToday
                    ? '1px solid #e11d48'
                    : 'none',
                  background: isSelected
                    ? '#0f172a'
                    : isToday
                    ? 'rgba(225, 29, 72, 0.1)'
                    : hasEvent
                    ? 'rgba(124, 58, 237, 0.08)'
                    : 'transparent',
                  color: isSelected
                    ? '#ffffff'
                    : isToday
                    ? '#e11d48'
                    : '#334155',
                  fontSize: '0.68rem',
                  fontWeight: isSelected || isToday ? 800 : hasEvent ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: 0,
                  transition: 'all 0.12s ease',
                }}
              >
                <span>{dayNum}</span>
                {hasEvent && !isSelected && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      background: isToday ? '#e11d48' : '#7c3aed',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected Day Schedule Drawer ── */}
      <div
        style={{
          borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          paddingTop: 8,
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
          <span>Schedule for Oct {selectedDay}, 2026:</span>
          <span>{selectedEvents.length} Clinical Case{selectedEvents.length === 1 ? '' : 's'}</span>
        </div>

        <div
          className="custom-scrollbar"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            paddingRight: 3,
          }}
        >
          {selectedEvents.length === 0 ? (
            <div
              style={{
                padding: '12px 10px',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.72rem',
                background: 'rgba(248, 250, 252, 0.5)',
                borderRadius: 6,
                border: '1px dashed #cbd5e1',
              }}
            >
              No scheduled procedures on Oct {selectedDay}.
            </div>
          ) : (
            selectedEvents.map((ev) => (
              <div
                key={ev.id}
                style={{
                  padding: '7px 10px',
                  borderRadius: 7,
                  background: ev.urgent ? 'rgba(254, 242, 242, 0.85)' : 'rgba(255, 255, 255, 0.95)',
                  border: ev.urgent ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: ev.urgent ? '#be123c' : '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {ev.title}
                  </div>
                  <div style={{ fontSize: '0.64rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <Clock size={10} />
                    <span>{ev.time} · {ev.doctor}</span>
                  </div>
                </div>

                {ev.urgent && (
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '2px 5px',
                      borderRadius: 4,
                      background: '#e11d48',
                      color: '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    CATH LAB
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
