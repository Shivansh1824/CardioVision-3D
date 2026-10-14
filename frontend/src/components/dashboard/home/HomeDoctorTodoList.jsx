import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, ListChecks, User } from 'lucide-react';
import HomeNewTaskModal from './HomeNewTaskModal';

const STORAGE_KEY = 'cv_doctor_clinical_todos_v2';

// Top 1-3 most critical patients pre-filled as pending tasks (none auto-completed)
const INITIAL_TODOS = [
  {
    id: 'td-1',
    task: 'Adjudicate proximal LAD stenosis (90%) and evaluate bifurcation stent geometry',
    patientCode: 'PT-001',
    patientName: 'James Smith',
    done: false,
    tier: 'critical',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'td-2',
    task: 'Simulate statin response & coronary hemodynamics in 3D Studio',
    patientCode: 'PT-002',
    patientName: 'Mary Johnson',
    done: false,
    tier: 'critical',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'td-3',
    task: 'Review triple-vessel CAD ischemic burden and finalize revascularization plan',
    patientCode: 'PT-003',
    patientName: 'Robert Williams',
    done: false,
    tier: 'critical',
    createdAt: new Date().toISOString(),
  },
];

/**
 * HomeDoctorTodoList — Clinical action plan with:
 * - Pre-filled pending tasks for top critical patients (0 auto-completed)
 * - Clean task completion toggling and persistence
 * - Global portaled modal to assign new tasks across all 303 patients
 */
export default function HomeDoctorTodoList({ onOpenPatient }) {
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Persist todos to localStorage and notify listeners (e.g. Clinical Calendar)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      window.dispatchEvent(new Event('cv_activity_updated'));
    } catch (_) {}
  }, [todos]);

  const handleToggle = (id) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextDone = !t.done;
          return {
            ...t,
            done: nextDone,
            completedAt: nextDone ? new Date().toISOString() : null,
          };
        }
        return t;
      })
    );
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (newTask) => {
    setTodos((prev) => [newTask, ...prev]);
  };

  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.62) 0%, rgba(240, 253, 250, 0.38) 50%, rgba(255, 255, 255, 0.60) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 4px 20px -2px rgba(13, 148, 136, 0.04), 0 1px 0 1px rgba(255, 255, 255, 0.95) inset',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Header ── */}
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
              background: 'rgba(2, 132, 199, 0.1)',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ListChecks size={15} />
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
              Doctor's Clinical Action Plan
            </h3>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              {doneCount}/{todos.length} Tasks Completed
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 11px',
            borderRadius: 7,
            background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 6px rgba(225, 29, 72, 0.25)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 3px 8px rgba(225, 29, 72, 0.35)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(225, 29, 72, 0.25)';
          }}
        >
          <Plus size={12} />
          <span>New Task</span>
        </button>
      </div>

      {/* ── Scrollable Task List ── */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          paddingRight: 4,
        }}
      >
        {todos.length === 0 ? (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '0.76rem',
              background: 'rgba(248, 250, 252, 0.6)',
              borderRadius: 8,
              border: '1px dashed #cbd5e1',
            }}
          >
            No active tasks. Click "+ New Task" above to define your clinical focus.
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => handleToggle(todo.id)}
              style={{
                padding: '9px 12px',
                borderRadius: 9,
                background: todo.done ? 'rgba(241, 245, 249, 0.55)' : 'rgba(255, 255, 255, 0.78)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: todo.done ? '1px solid rgba(226, 232, 240, 0.6)' : '1px solid rgba(255, 255, 255, 0.85)',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.03)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = todo.done ? '#e2e8f0' : 'rgba(226, 232, 240, 0.9)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Checkbox & Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 5,
                    border: todo.done ? 'none' : '1.5px solid #94a3b8',
                    background: todo.done ? '#059669' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {todo.done && <Check size={11} color="#ffffff" strokeWidth={3} />}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: todo.done ? 500 : 700,
                      color: todo.done ? '#94a3b8' : '#0f172a',
                      textDecoration: todo.done ? 'line-through' : 'none',
                      lineHeight: 1.25,
                    }}
                  >
                    {todo.task}
                  </div>
                  {todo.patientCode && (
                    <div
                      style={{
                        fontSize: '0.64rem',
                        color: todo.done ? '#cbd5e1' : '#0284c7',
                        fontWeight: 600,
                        marginTop: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenPatient) {
                          onOpenPatient({
                            patient_code: todo.patientCode,
                            name: todo.patientName,
                          });
                        }
                      }}
                    >
                      <User size={10} />
                      <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                        {todo.patientName} ({todo.patientCode})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(todo.id, e)}
                title="Delete task"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.background = '#fef2f2';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.background = 'none';
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Global Portaled New Task Modal (303 Patients) ── */}
      <HomeNewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
