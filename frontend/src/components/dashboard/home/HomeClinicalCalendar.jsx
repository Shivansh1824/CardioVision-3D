import { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, FileText, Clock, User, ExternalLink } from 'lucide-react';
import { getLocalRecords } from '../../../services/ehrStorageService';
import ClinicalReportModal from '../clinical/ClinicalReportModal';

const TODOS_STORAGE_KEY = 'cv_doctor_clinical_todos_v2';

function formatActivityTime(isoString) {
  if (!isoString) return 'Today';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Logged';
  }
}

/**
 * HomeClinicalCalendar — Dynamic Clinical Tracking Calendar.
 * Strictly reflects verified physician actions:
 * 1. Tasks completed from Doctor's Clinical Action Plan
 * 2. Real committed/saved EHR treatment plans
 * Zero hardcoded or pre-defined fake events.
 */
export default function HomeClinicalCalendar({
  onOpenPatient,
  todos: propTodos,
  onToggleTask,
  selectedDay: propSelectedDay,
  onSelectDay: propOnSelectDay,
}) {
  const todayDay = useMemo(() => new Date().getDate() || 15, []);
  const [internalDay, setInternalDay] = useState(todayDay);
  const [internalTodos, setInternalTodos] = useState([]);
  const [records, setRecords] = useState([]);
  const [activeReportModal, setActiveReportModal] = useState(null);

  const selectedDay = propSelectedDay !== undefined ? propSelectedDay : internalDay;
  const setSelectedDay = propOnSelectDay || setInternalDay;
  const todos = propTodos || internalTodos;

  // Load and sync real activity from localStorage and events
  const loadActivities = () => {
    // 1. Read to-do items only if not controlled via props
    if (!propTodos) {
      try {
        const rawTodos = localStorage.getItem(TODOS_STORAGE_KEY);
        if (rawTodos) {
          const parsed = JSON.parse(rawTodos);
          if (Array.isArray(parsed)) {
            setInternalTodos(parsed);
          }
        }
      } catch (_) {}
    }

    // 2. Read genuine committed EHR records
    try {
      const committed = getLocalRecords();
      setRecords(committed || []);
    } catch (_) {}
  };

  useEffect(() => {
    loadActivities();

    const handleUpdate = () => {
      loadActivities();
    };

    window.addEventListener('cv_activity_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cv_activity_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Map real activity by day of the month
  const activitiesByDay = useMemo(() => {
    const map = {};

    // 1. Completed tasks from to-do list
    todos
      .filter((t) => t.done)
      .forEach((t) => {
        const dateStr = t.completedAt || t.createdAt || new Date().toISOString();
        const d = new Date(dateStr);
        // Default to current calendar day if date parsing defaults to today
        const day = d.getDate() || todayDay;

        if (!map[day]) map[day] = [];
        map[day].push({
          id: `task-${t.id}`,
          taskId: t.id,
          type: 'task',
          title: t.task,
          patientCode: t.patientCode,
          patientName: t.patientName,
          patientId: t.patientId || (t.patientCode ? Number(t.patientCode.replace(/\D/g, '')) : null),
          time: formatActivityTime(dateStr),
          rawTime: new Date(dateStr).getTime() || 0,
        });
      });

    // 2. Committed EHR simulation reports
    records.forEach((r) => {
      const dateStr = r.created_at || new Date().toISOString();
      const d = new Date(dateStr);
      const day = d.getDate() || todayDay;

      if (!map[day]) map[day] = [];
      map[day].push({
        id: `ehr-${r.id}`,
        type: 'ehr',
        title: r.plan_title || `EHR Simulation Plan (${r.patient_code})`,
        patientCode: r.patient_code,
        patientName: r.patient_name,
        patientId: r.patient_id,
        visitNumber: r.visit_number,
        riskReduction: r.risk_reduction_pct,
        time: formatActivityTime(dateStr),
        rawTime: new Date(dateStr).getTime() || 0,
        recordData: r,
      });
    });

    // Sort items latest first for each day
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => b.rawTime - a.rawTime);
    });

    return map;
  }, [todos, records]);

  const daysInMonth = 31;
  const startDayOffset = 4; // Thursday (Oct 1, 2026) -> offset 4 for Sun-first
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const selectedActivities = activitiesByDay[selectedDay] || [];

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.62) 0%, rgba(245, 243, 255, 0.40) 50%, rgba(255, 255, 255, 0.60) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px -2px rgba(124, 58, 237, 0.05), 0 1px 0 1px rgba(255, 255, 255, 0.95) inset',
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
              October 2026 · Doctor Activity & EHR Audit
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setSelectedDay(todayDay)}
            style={{
              padding: '3px 8px',
              borderRadius: 5,
              background: selectedDay === todayDay ? '#0f172a' : '#f1f5f9',
              border: selectedDay === todayDay ? '1px solid #0f172a' : '1px solid #e2e8f0',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: selectedDay === todayDay ? '#ffffff' : '#334155',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
            }}
          >
            Today ({todayDay}th)
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
            const isToday = dayNum === todayDay;
            const isSelected = selectedDay === dayNum;
            const dayActs = activitiesByDay[dayNum] || [];
            const hasActivity = dayActs.length > 0;
            const hasCommittedReport = dayActs.some((a) => a.type === 'ehr');

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
                    ? 'rgba(225, 29, 72, 0.08)'
                    : hasActivity
                    ? 'rgba(16, 185, 129, 0.09)'
                    : 'transparent',
                  color: isSelected
                    ? '#ffffff'
                    : isToday
                    ? '#e11d48'
                    : '#334155',
                  fontSize: '0.68rem',
                  fontWeight: isSelected || isToday ? 800 : hasActivity ? 700 : 500,
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
                {hasActivity && !isSelected && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      width: 3.5,
                      height: 3.5,
                      borderRadius: '50%',
                      background: hasCommittedReport ? '#0284c7' : '#059669',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected Day Activity Drawer ── */}
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
          <span>Logged for Oct {selectedDay}, 2026:</span>
          <span>{selectedActivities.length} Activity Record{selectedActivities.length === 1 ? '' : 's'}</span>
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
          {selectedActivities.length === 0 ? (
            <div
              style={{
                padding: '16px 12px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.72rem',
                background: 'rgba(248, 250, 252, 0.55)',
                borderRadius: 8,
                border: '1px dashed #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                margin: 'auto 0',
              }}
            >
              <div style={{ fontWeight: 700, color: '#334155' }}>
                No recorded actions on Oct {selectedDay}
              </div>
              <div style={{ fontSize: '0.67rem', color: '#94a3b8', maxWidth: 260, lineHeight: 1.35 }}>
                Check off items in your Clinical Action Plan or commit 3D simulation reports to log verified activity for this day.
              </div>
            </div>
          ) : (
            selectedActivities.map((act) => {
              const isTask = act.type === 'task';

              return (
                <div
                  key={act.id}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 7,
                    background: isTask ? 'rgba(240, 253, 244, 0.75)' : 'rgba(240, 249, 255, 0.75)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: isTask ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                      <span
                        style={{
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          padding: '1.5px 5px',
                          borderRadius: 4,
                          background: isTask ? '#059669' : '#0284c7',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        {isTask ? <CheckCircle2 size={9} /> : <FileText size={9} />}
                        <span>{isTask ? 'ACTION COMPLETED' : 'EHR COMMITTED'}</span>
                      </span>
                      <span style={{ fontSize: '0.64rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={9} />
                        <span>{act.time}</span>
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.3,
                        marginTop: 2,
                      }}
                    >
                      {act.title}
                    </div>

                    <div style={{ fontSize: '0.66rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      {act.patientName && (
                        <span style={{ fontWeight: 600, color: '#334155' }}>
                          {act.patientName} {act.patientCode && `(${act.patientCode})`}
                        </span>
                      )}
                      {act.visitNumber && (
                        <span>· Visit #{act.visitNumber}</span>
                      )}
                    </div>
                  </div>

                  {/* Contextual Action Button */}
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    {isTask && onToggleTask && (
                      <button
                        onClick={() => onToggleTask(act.taskId)}
                        title="Uncheck this task to remove from calendar"
                        style={{
                          padding: '3px 7px',
                          borderRadius: 5,
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#64748b',
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = '#dc2626';
                          e.currentTarget.style.borderColor = '#fca5a5';
                          e.currentTarget.style.background = '#fef2f2';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = '#64748b';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.background = '#ffffff';
                        }}
                      >
                        <span>Uncheck</span>
                      </button>
                    )}
                    {!isTask && act.recordData && (
                      <button
                        onClick={() => setActiveReportModal(act.recordData)}
                        style={{
                          padding: '3px 7px',
                          borderRadius: 5,
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#0284c7',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <span>View Plan</span>
                        <ExternalLink size={9} />
                      </button>
                    )}
                    {act.patientId && onOpenPatient && (
                      <button
                        onClick={() => onOpenPatient(act.patientId)}
                        style={{
                          padding: '3px 7px',
                          borderRadius: 5,
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <User size={9} />
                        <span>Profile</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── View Clinical Report Modal (if clicked) ── */}
      {activeReportModal && (
        <ClinicalReportModal
          report={activeReportModal}
          isOpen={Boolean(activeReportModal)}
          onClose={() => setActiveReportModal(null)}
        />
      )}
    </div>
  );
}
