import { useRef, useMemo, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import HomeBanner from './HomeBanner';
import HomePriorityQueue from './HomePriorityQueue';
import HomeHeartHeroCard from './HomeHeartHeroCard';
import HomeDoctorTodoList, { STORAGE_KEY, INITIAL_TODOS } from './HomeDoctorTodoList';
import HomeClinicalCalendar from './HomeClinicalCalendar';
import HomeRecentReports from './HomeRecentReports';

/**
 * DoctorHomeView — Redesigned Master Clinical Cockpit.
 * Follows @modern-immersive-frontend and @gsap-animation guidelines:
 * - Clean translucent glassmorphism (distinct cards with visible content)
 * - Simplified physician briefing without jargon
 * - 50/50 vertical division:
 *   - Top Row: Compact Priority Queue (Critical/Moderate/Stable) + Zoomed 3D Heart Hero Card
 *   - Bottom Row: Doctor Custom To-Do Planner + Clinical Tracking Calendar + Genuine EHR Reports
 */
import { getTriageCounts } from '../../../services/patientDataService';

export default function DoctorHomeView({
  user,
  onOpenPatient,
  onGoToStudio,
  onGoToPatients,
  onGoToRecords,
}) {
  const containerRef = useRef(null);
  const triageCounts = useMemo(() => getTriageCounts(), []);

  // Shared reactive todos state synchronizing Action Plan & Clinical Calendar
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return INITIAL_TODOS;
  });

  // Dynamic current date (auto-focuses to day of action)
  const todayNum = useMemo(() => new Date().getDate() || 15, []);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(todayNum);

  // Persist to localStorage and dispatch event for any external consumers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      window.dispatchEvent(new Event('cv_activity_updated'));
    } catch (_) {}
  }, [todos]);

  const handleToggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextDone = !t.done;
          const now = new Date();
          if (nextDone) {
            setSelectedCalendarDay(now.getDate());
          }
          return {
            ...t,
            done: nextDone,
            completedAt: nextDone ? now.toISOString() : null,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTodo = (newTask) => {
    setTodos((prev) => [newTask, ...prev]);
  };

  // GSAP staggered entrance for glass cards
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.home-glass-card'),
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform',
        }
      );
    }
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── 1. Top Physician Briefing Banner ── */}
      <div className="home-glass-card">
        <HomeBanner
          user={user}
          totalPatients={triageCounts.all}
          criticalPatients={triageCounts.critical}
          stablePatients={triageCounts.stable}
          onGoToPatients={onGoToPatients}
        />
      </div>

      {/* ── 2. Top Split Row: Priority Queue & Zoomed 3D Heart ── */}
      <div
        style={{
          flex: '1 1 50%',
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 12,
        }}
      >
        {/* Left: Compact Patient Triage Queue with 3 Category Filter Buttons */}
        <div className="home-glass-card lg:!col-span-7" style={{ gridColumn: 'span 12', height: '100%', minHeight: 0 }}>
          <HomePriorityQueue
            onOpenPatient={onOpenPatient}
            onGoToPatients={onGoToPatients}
          />
        </div>

        {/* Right: Zoomed-in 3D Heart Hero Card (Matching Height) */}
        <div className="home-glass-card lg:!col-span-5" style={{ gridColumn: 'span 12', height: '100%', minHeight: 0 }}>
          <HomeHeartHeroCard onGoToStudio={onGoToStudio} />
        </div>
      </div>

      {/* ── 3. Bottom Row: Doctor To-Do Planner + Clinical Calendar + Recent Reports ── */}
      <div
        style={{
          flex: '1 1 50%',
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 12,
        }}
      >
        {/* Left: Doctor's Interactive Custom Clinical To-Do Planner */}
        <div className="home-glass-card lg:!col-span-4" style={{ gridColumn: 'span 12', height: '100%', minHeight: 0 }}>
          <HomeDoctorTodoList
            onOpenPatient={onOpenPatient}
            todos={todos}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onAddTask={handleAddTodo}
          />
        </div>

        {/* Center: Interactive Clinical Tracking Calendar */}
        <div className="home-glass-card lg:!col-span-4" style={{ gridColumn: 'span 12', height: '100%', minHeight: 0 }}>
          <HomeClinicalCalendar
            onOpenPatient={onOpenPatient}
            todos={todos}
            onToggleTask={handleToggleTodo}
            selectedDay={selectedCalendarDay}
            onSelectDay={setSelectedCalendarDay}
          />
        </div>

        {/* Right: Genuine Recent Committed Reports (with direct Modal trigger) */}
        <div className="home-glass-card lg:!col-span-4" style={{ gridColumn: 'span 12', height: '100%', minHeight: 0 }}>
          <HomeRecentReports
            onGoToStudio={onGoToStudio}
            onGoToRecords={onGoToRecords}
          />
        </div>
      </div>
    </div>
  );
}
