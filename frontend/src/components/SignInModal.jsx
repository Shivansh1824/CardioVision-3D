import { useState } from 'react';
import { X, Lock, ArrowRight, ShieldCheck, Mail, Key } from 'lucide-react';

export default function SignInModal({ isOpen, onClose }) {
  const role = 'doctor';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedMessage('Welcome! Accessing the Cardiologist Clinical Suite.');
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Cardiologist Clinical Access</span>
          </div>
          <h3 className="text-2xl font-bold font-display text-slate-900">
            Sign In to CardioVision AI
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access coronary risk visualization &amp; stenosis decision support.
          </p>
        </div>

        {/* Role Description Card */}
        <div className="p-3 rounded-xl mb-5 text-xs border bg-sky-50 border-sky-200 text-sky-900">
          <p><strong>Doctor Access:</strong> Triage coronary artery disease, review vessel stenosis probabilities, and generate diagnostic summaries.</p>
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
                  placeholder="doctor@hospital.org"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer transition-all bg-slate-900 hover:bg-slate-800"
            >
              <span>Sign In as Cardiologist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
