import React, { useState } from 'react';
import { X, Heart, Lock, ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';

export default function SignInModal({ isOpen, onClose, initialRole = 'doctor' }) {
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedMessage(
      `Welcome! You are accessing the ${
        role === 'doctor' ? 'Cardiologist Clinical Portal' : 'Patient Heart Guide'
      }.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold uppercase mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Portal Access</span>
          </div>
          <h3 className="text-2xl font-bold font-display text-slate-900">
            Sign In to CardioVision AI
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Select your account type to continue.
          </p>
        </div>

        {/* Role Toggle Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-5">
          <button
            type="button"
            onClick={() => {
              setRole('doctor');
              setSubmittedMessage(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'doctor'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Cardiologist</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('patient');
              setSubmittedMessage(null);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'patient'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Heart Patient</span>
          </button>
        </div>

        {/* Role Description Card */}
        <div className={`p-3 rounded-xl mb-5 text-xs border ${
          role === 'doctor'
            ? 'bg-sky-50 border-sky-200 text-sky-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          {role === 'doctor' ? (
            <p><strong>Doctor Access:</strong> Triage coronary artery disease, review vessel stenosis probabilities, and generate diagnostic summaries.</p>
          ) : (
            <p><strong>Patient Access:</strong> Explore your interactive 3D heart, understand your blood flow, and download your personalized heart guide.</p>
          )}
        </div>

        {submittedMessage ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Portal Connected</span>
            </div>
            <p>{submittedMessage}</p>
            <button
              onClick={onClose}
              className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Continue to Main Page
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'doctor' ? 'doctor@hospital.org' : 'patient@example.com'}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer transition-all ${
                role === 'doctor'
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : 'btn-primary-vibrant justify-center w-full'
              }`}
            >
              <span>Sign In as {role === 'doctor' ? 'Cardiologist' : 'Patient'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
