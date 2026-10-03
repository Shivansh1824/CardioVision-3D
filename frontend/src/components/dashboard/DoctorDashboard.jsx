import { useState } from 'react';
import { 
  Stethoscope, 
  Activity, 
  Heart, 
  FileText, 
  LogOut, 
  Home, 
  ArrowUpRight, 
  ShieldCheck, 
  User, 
  Search,
  Bell,
  Cpu,
  ChevronRight
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

export default function DoctorDashboard({ user, onSignOut, onBackToLanding }) {
  const [selectedCase, setSelectedCase] = useState('case-1');
  const doctorName = user?.user_metadata?.full_name || 'Dr. Sarah Jenkins, MD';
  const doctorEmail = user?.email || 'doctor@hospital.org';

  const mockCases = [
    {
      id: 'case-1',
      patientName: 'Robert Vance (62M)',
      admissionTime: '15 mins ago',
      riskLevel: 'Critical',
      vesselTriage: 'LAD 85% Occlusion',
      ecgFindings: 'ST-Elevation in V1-V4',
      status: 'Awaiting Catheterization',
    },
    {
      id: 'case-2',
      patientName: 'Elena Rostova (54F)',
      admissionTime: '42 mins ago',
      riskLevel: 'Moderate',
      vesselTriage: 'LCX 45% Plaque',
      ecgFindings: 'Non-specific T-wave changes',
      status: 'Observation',
    },
    {
      id: 'case-3',
      patientName: 'David Kim (49M)',
      admissionTime: '1 hr ago',
      riskLevel: 'Stable',
      vesselTriage: 'RCA Clear / Patent',
      ecgFindings: 'Normal Sinus Rhythm',
      status: 'Discharge Ready',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-body selection:bg-rose-500/20 selection:text-rose-900">
      
      {/* ─── Top Clinical Navigation Bar ──────────────────────────────────── */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-[1512px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand + Role Badge */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToLanding}
              className="flex items-center gap-2.5 text-left group cursor-pointer bg-transparent border-0 p-0"
              title="Return to Landing Page"
            >
              <BrandLogo size={30} />
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
                CardioVision <span className="text-rose-600">AI</span>
              </span>
            </button>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
              <Stethoscope className="w-3 h-3" />
              Cardiologist Clinical Suite
            </span>
          </div>

          {/* Right: User Profile & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="btn-secondary-glass text-xs py-1.5 px-3 cursor-pointer shadow-2xs hidden md:inline-flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-slate-600" />
              <span>Public Site</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden md:block" />

            <div className="flex items-center gap-2.5 text-right">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {doctorName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-bold text-slate-900 leading-tight">{doctorName}</div>
                <div className="text-slate-500 font-mono text-[11px] truncate max-w-[180px]">{doctorEmail}</div>
              </div>
            </div>

            <button
              onClick={onSignOut}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200/80"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* ─── Main Clinical Workspace ──────────────────────────────────────── */}
      <main className="flex-1 max-w-[1512px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5" />
              Real-Time Decision Support
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Welcome, {doctorName}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Connected to CardioVision AI Clinical Engine. Ready for multi-artery coronary stenosis evaluation and catheterization triage.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              HIPAA Verified Session
            </span>
          </div>
        </div>

        {/* Quick KPI Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500">Active Coronary Cases</div>
            <div className="text-2xl font-bold font-display text-slate-900 mt-1">3 Patients</div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> 1 urgent triage required
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500">Model Accuracy Metric</div>
            <div className="text-2xl font-bold font-display text-slate-900 mt-1">91.2%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Validated on 1,024 angiograms</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500">Coronary Arteries Monitored</div>
            <div className="text-2xl font-bold font-display text-slate-900 mt-1">LAD • LCX • RCA</div>
            <div className="text-[11px] text-sky-600 font-semibold mt-1">Real-time bifurcation mapping</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-semibold text-slate-500">3D Diagnostic Pipeline</div>
            <div className="text-2xl font-bold font-display text-emerald-600 mt-1">Operational</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">WebGL 3D engine ready</div>
          </div>
        </div>

        {/* Clinical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Patient Case Queue */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold font-display text-slate-900">
                Patient Triage Queue
              </h2>
              <span className="text-xs font-medium text-slate-500">Live Updates</span>
            </div>

            <div className="space-y-3">
              {mockCases.map((c) => {
                const isSelected = selectedCase === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{c.patientName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{c.vesselTriage}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.riskLevel === 'Critical' 
                          ? 'bg-rose-100 text-rose-800' 
                          : c.riskLevel === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.riskLevel}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{c.ecgFindings}</span>
                      <span className="font-mono text-slate-400">{c.admissionTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Decision Details & 3D Launcher */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Detailed Case View</span>
                  <h3 className="text-lg font-bold text-slate-900 font-display mt-0.5">
                    Robert Vance (62M) — Multimodal Stenosis Report
                  </h3>
                </div>
                <button
                  onClick={onBackToLanding}
                  className="btn-primary-vibrant text-xs py-2 px-3.5 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Launch 3D Anatomical Viewer</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Artery Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="text-xs font-bold text-rose-900">LAD (Left Anterior Descending)</div>
                  <div className="text-xl font-bold text-rose-700 mt-1">85% Narrowing</div>
                  <div className="text-[11px] text-rose-800 mt-0.5">Immediate Stent Indicated</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-700">LCX (Circumflex)</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">15% Patent</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Medical Management</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-700">RCA (Right Coronary)</div>
                  <div className="text-xl font-bold text-slate-800 mt-1">Patent</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Normal Perfusion</div>
                </div>
              </div>

              {/* Diagnostic Rationale */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 text-slate-700">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  AI Clinical Explanation
                </div>
                <p className="leading-relaxed">
                  Deep learning coronary segmentation detected acute occlusion in the proximal LAD branch. High probability correlation with recorded ST-segment elevation in anterior leads V1 through V4. 
                </p>
                <div className="flex items-center gap-2 text-slate-500 pt-1">
                  <span>Confidence: <strong>94.8%</strong></span>
                  <span>•</span>
                  <span>Recommended Action: <strong>Cardiac Catheterization Lab Alert</strong></span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">CardioVision 3D Clinical Suite • Doctor Portal</span>
              <button 
                onClick={() => alert('Clinical Note Exported to Hospital EHR (Demo)')}
                className="btn-secondary-glass text-xs py-2 px-4 cursor-pointer"
              >
                Export EHR Summary
              </button>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
