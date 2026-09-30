import React, { useState } from 'react';
import { X, Stethoscope, Heart, Lock, ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';

export default function SignInModal({ isOpen, onClose, initialRole = 'doctor' }) {
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedMessage(
      `Ready! In the next milestone, authentication will connect directly with Supabase Auth for ${
        role === 'doctor' ? 'Cardiologist portal' : 'Patient digital twin'
      }.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-red-950/40 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-800/60 text-red-400 font-mono text-xs uppercase mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Clinical Portal</span>
          </div>
          <h3 className="text-2xl font-bold font-display text-white">
            Sign In to CardioVision 3D
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose your persona below to access personalized cardiovascular analytics.
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setRole('doctor');
              setSubmittedMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'doctor'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Cardiologist</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('patient');
              setSubmittedMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'patient'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Heart Patient</span>
          </button>
        </div>

        {/* Role Description Card */}
        <div className={`p-3 rounded-xl mb-5 text-xs border ${
          role === 'doctor'
            ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300'
            : 'bg-red-950/40 border-red-800/60 text-red-300'
        }`}>
          {role === 'doctor' ? (
            <p><strong>🩺 Doctor Portal:</strong> Access 303-patient clinical cohort, multi-vessel LAD/LCX/RCA risk stratification, and official PDF generation.</p>
          ) : (
            <p><strong>👤 Patient Portal:</strong> View your interactive 3D digital heart twin, explore "What-If" lifestyle improvements, and download your Heart Passport.</p>
          )}
        </div>

        {submittedMessage ? (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Persona Selected Successfully</span>
            </div>
            <p>{submittedMessage}</p>
            <button
              onClick={onClose}
              className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs transition-colors"
            >
              Continue Exploring Main Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Hospital / Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'doctor' ? 'doctor@hospital.org' : 'patient@example.com'}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all ${
                role === 'doctor'
                  ? 'bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-600/30'
                  : 'btn-primary-glow justify-center'
              }`}
            >
              <span>Sign In as {role === 'doctor' ? 'Cardiologist' : 'Patient'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-xs text-slate-500">
          <span>Protected by HIPAA-compliant Supabase Cloud PostgreSQL</span>
        </div>

      </div>
    </div>
  );
}
