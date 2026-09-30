import React from 'react';
import { Heart, Award, ExternalLink, Activity, Code2 } from 'lucide-react';

export default function Footer({ onOpenSignIn, onScrollToSection }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
              <Heart className="w-5 h-5 text-red-500 fill-red-500/30" />
              <span>CardioVision <span className="text-red-500">3D</span></span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Interactive 3D cardiovascular risk visualization & explainable multi-vessel coronary artery stenosis prediction. Bridging the gap between statistical machine learning and spatial anatomical intuition.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/Shivansh1824/CardioVision-3D"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  style={{ minWidth: '14px', minHeight: '14px', maxWidth: '14px', maxHeight: '14px', display: 'inline-block' }}
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-[11px]">
              Platform Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollToSection('vessel-explorer')}
                  className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0"
                >
                  3D Vessel Explorer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('persona-section')}
                  className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0"
                >
                  Doctor vs Patient View
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('clinical-workflow')}
                  className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0"
                >
                  Multimodal Workflow
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('model-metrics')}
                  className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0"
                >
                  AI Accuracy Benchmarks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenSignIn && onOpenSignIn('doctor')}
                  className="text-red-400 hover:text-red-300 transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
                >
                  Portal Sign In ➔
                </button>
              </li>
            </ul>
          </div>

          {/* Hackathon Credentials */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-[11px]">
              Competition & Partners
            </h4>
            <div className="space-y-2 text-slate-400">
              <p className="text-white font-medium">Multimodal AI Hackathon 2026</p>
              <p>Track A: Cardiovascular Risk</p>
              <p className="text-[11px] text-slate-400">
                Organized by KamandPrompt (IIT Mandi) with Augli.ai, PurpleRain Tech & LDV Labs.
              </p>
              <div className="pt-2 text-emerald-400 flex items-center gap-1.5 font-mono text-[11px]">
                <Activity className="w-3.5 h-3.5" />
                <span>UCI #411 Verified Cohort</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 CardioVision 3D. Open source under MIT License.</p>
          <p>Designed with clinical precision & spatial computing standards.</p>
        </div>
      </div>
    </footer>
  );
}
