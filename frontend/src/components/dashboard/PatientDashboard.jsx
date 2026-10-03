import { useState } from 'react';
import { 
  HeartHandshake, 
  Heart, 
  Activity, 
  Calendar, 
  FileText, 
  LogOut, 
  Home, 
  ArrowUpRight, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

export default function PatientDashboard({ user, onSignOut, onBackToLanding }) {
  const patientName = user?.user_metadata?.full_name || 'Alex Johnson';
  const patientEmail = user?.email || 'patient@example.com';

  return (
    <div className="min-h-screen bg-rose-50/30 flex flex-col font-body selection:bg-rose-500/20 selection:text-rose-900">
      
      {/* ─── Top Patient Navigation Bar ──────────────────────────────────── */}
      <header className="w-full bg-white border-b border-rose-100 sticky top-0 z-40 shadow-2xs">
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
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <HeartHandshake className="w-3 h-3" />
              Patient Heart Guide
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
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                {patientName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-bold text-slate-900 leading-tight">{patientName}</div>
                <div className="text-slate-500 font-mono text-[11px] truncate max-w-[180px]">{patientEmail}</div>
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

      {/* ─── Main Patient Workspace ──────────────────────────────────────── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Warm Welcome Banner */}
        <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Personalized Heart Guide
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
              Hello, {patientName}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Here is your heart health summary in plain, easy-to-understand words. You can explore how your heart works and prepare questions for your doctor.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Private & Encrypted Health Data
            </span>
          </div>
        </div>

        {/* 3 Simple Heart Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Your Heart Overview</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your overall heart muscle function is stable. One artery shows narrowing and is being monitored by your doctor.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-emerald-600">Stable with Doctor Follow-up</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">3D Interactive Heart</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              See exactly where your arteries are in 3D so you can understand your doctor's treatment advice with zero confusion.
            </p>
            <button
              onClick={onBackToLanding}
              className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs w-full text-left font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              <span>Explore 3D Heart Model</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Next Doctor Visit</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Scheduled cardiology check-in with your care team. Check recommended lifestyle steps before your appointment.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Scheduled Date</span>
              <span className="font-bold text-slate-900">Thursday, 10:30 AM</span>
            </div>
          </div>
        </div>

        {/* Plain-Language Doctor Questions & Advice */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold font-display text-slate-900">
              Questions Ready for Your Next Appointment
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            We prepared these simple questions so you feel confident discussing your test results:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
              <strong>1. "Which artery is narrowed, and how does it affect my daily energy?"</strong>
              <div className="text-slate-500 mt-1">Helps you understand if medication or exercise changes are best.</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
              <strong>2. "Do I need a procedure or can we manage this with medicine?"</strong>
              <div className="text-slate-500 mt-1">Gives you clarity on stenting versus blood pressure / cholesterol therapy.</div>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
