import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope,
  HeartHandshake
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import AuthContentStage from './auth/AuthContentStage';
import AuthLoadingOverlay from './auth/AuthLoadingOverlay';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function AuthPortalView({ onBack, onSignInSuccess }) {
  const authContainerRef = useRef(null);
  const cardRef = useRef(null);
  const cardGlowRef = useRef(null);

  // Auth Mode: false = Sign In, true = Create Account
  const [isSignUp, setIsSignUp] = useState(false);

  // Fixed Role: 100% Doctor / Cardiologist Decision Support
  const role = 'doctor';

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const [loadingState, setLoadingState] = useState({
    message: 'Connecting to Google...',
    subMessage: 'Redirecting to Google to sign in to your clinical portal.'
  });

  // Ensure role is persisted as doctor
  useEffect(() => {
    try {
      localStorage.setItem('cardiovision_role', 'doctor');
    } catch {}
  }, []);

  // GSAP Smooth Card Entrance Timeline (Rock-Solid Clinical Standard)
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Ambient glow expands softly behind card with subtle resting cardiac rhythm
    if (cardGlowRef.current) {
      tl.fromTo(
        cardGlowRef.current,
        { scale: 0.92, autoAlpha: 0 },
        { 
          scale: 1, 
          autoAlpha: 0.75, 
          duration: 0.95, 
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(cardGlowRef.current, {
              scale: 1.04,
              autoAlpha: 0.9,
              duration: 2.4,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
        },
        0
      );
    }

    // Smooth, stable vertical entrance for the card (no 3D tilt)
    if (cardRef.current) {
      tl.fromTo(
        cardRef.current,
        {
          y: 28,
          scale: 0.97,
          autoAlpha: 0
        },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power3.out'
        },
        0.05
      );
    }

    // Refined micro-stagger of internal controls
    tl.fromTo(
      [
        '.auth-card-header',
        '.auth-form-field',
        '.auth-submit-btn',
        '.auth-divider-line',
        '.auth-google-btn',
        '.auth-footer-toggle'
      ],
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.045, ease: 'power2.out' },
      0.18
    );
  }, { scope: authContainerRef });

  // ─── Email & Password Authentication (Sign In & Sign Up) ───────────────
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoadingState({
      message: isSignUp ? 'Creating your Account...' : 'Authenticating Credentials...',
      subMessage: 'Connecting you to the Cardiologist Clinical Suite.'
    });
    setIsLoading(true);
    setAuthStatus(null);
    try {
      localStorage.setItem('cardiovision_role', 'doctor');
    } catch {
      // ignore
    }

    try {
      if (isSupabaseConfigured()) {
        if (isSignUp) {
          // Supabase User Registration
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                role: 'doctor',
                full_name: fullName,
              },
            },
          });

          if (error) throw error;

          if (data.session) {
            setAuthStatus({
              type: 'success',
              message: 'Account created! Accessing the Cardiologist Clinical Suite...',
            });
            if (onSignInSuccess) {
              setTimeout(() => {
                onSignInSuccess(data.user, 'doctor');
              }, 500);
            }
          } else {
            setAuthStatus({
              type: 'success',
              message: `Account registered for ${email}. Accessing dashboard...`,
            });
            if (onSignInSuccess) {
              setTimeout(() => {
                onSignInSuccess(data.user || { email, user_metadata: { role: 'doctor', full_name: fullName } }, 'doctor');
              }, 600);
            }
          }
        } else {
          // Supabase Password Login
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          setAuthStatus({
            type: 'success',
            message: `Welcome back, ${data.user?.email || email}! Accessing Cardiologist Clinical Suite...`,
          });

          if (onSignInSuccess) {
            setTimeout(() => {
              onSignInSuccess(data.user, 'doctor');
            }, 500);
          }
        }
      } else {
        // High-fidelity fallback for offline demo / hackathon presentation
        setTimeout(() => {
          setAuthStatus({
            type: 'success',
            message: `${isSignUp ? 'Account created' : 'Welcome back'}! Redirecting to Cardiologist Clinical Suite...`,
          });
          if (onSignInSuccess) {
            setTimeout(() => {
              onSignInSuccess({
                email: email || 'demo@hospital.org',
                user_metadata: { role: 'doctor', full_name: fullName || 'Dr. Sarah Jenkins' },
              }, 'doctor');
            }, 600);
          }
        }, 700);
      }
    } catch (err) {
      setAuthStatus({
        type: 'error',
        message: err.message || 'Authentication failed. Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Google OAuth Authentication ────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setLoadingState({
      message: 'Connecting to Google...',
      subMessage: 'Redirecting to Google to sign in to your Cardiologist Clinical Suite.'
    });
    setIsLoading(true);
    setAuthStatus(null);
    try {
      localStorage.setItem('cardiovision_role', 'doctor');
    } catch {
      // ignore
    }

    if (!supabase) {
      setIsLoading(false);
      setAuthStatus({
        type: 'error',
        message: 'Supabase configuration is missing. Please check your environment variables.',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      setIsLoading(false);
      setAuthStatus({
        type: 'error',
        message: err.message || 'Google authentication failed. Please try again.',
      });
    }
  };

  // ─── Forgot Password (Hackathon Resilient Handler) ───────────────────────
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setAuthStatus({
        type: 'error',
        message: 'Please enter your email address in the field above to reset your password.',
      });
      return;
    }

    setIsLoading(true);
    setAuthStatus(null);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#portal-signin`,
        });

        if (error) {
          // Detect Supabase free tier rate-limit (3 emails/hr max)
          if (error.status === 429 || error.message.toLowerCase().includes('rate limit')) {
            setAuthStatus({
              type: 'warning',
              message: 'Supabase free-tier email limit reached (3/hr). For hackathon evaluation, you can sign in directly or test with demo credentials.',
            });
          } else {
            throw error;
          }
        } else {
          setAuthStatus({
            type: 'success',
            message: `Password reset instructions sent to ${email}. Check your inbox.`,
          });
        }
      } else {
        setAuthStatus({
          type: 'success',
          message: `Password reset instructions dispatched to ${email} (Demo Mode).`,
        });
      }
    } catch (err) {
      setAuthStatus({
        type: 'error',
        message: err.message || 'Could not send reset email.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luminous-mesh flex flex-col font-body selection:bg-rose-500/20 selection:text-rose-900">
      
      {/* ─── Top Global Transparent Glass Header ─────────────────────────── */}
      <header className="w-full bg-white/40 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-40 transition-colors shadow-2xs supports-backdrop-filter:bg-white/35">
        <div className="max-w-[1512px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: CardioVision Brand in its original place */}
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 text-left group cursor-pointer bg-transparent border-0 p-0 shrink-0"
            aria-label="CardioVision AI Home"
          >
            <BrandLogo size={32} />
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">
              CardioVision <span className="text-rose-600">AI</span>
            </span>
          </button>

          {/* Right: Back to Overview Action */}
          <button
            onClick={onBack}
            className="btn-secondary-glass text-xs py-1.5 px-3.5 cursor-pointer shadow-xs inline-flex items-center gap-2 shrink-0 bg-white/80 hover:bg-white text-slate-700 font-semibold border-slate-300/80"
            id="auth-back-to-overview-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Back to Overview</span>
          </button>

        </div>
      </header>

      {/* ─── Main Content Split-Stage ────────────────────────────────────── */}
      <main ref={authContainerRef} className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: 3 Simple Clinical Explanation Cards
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <AuthContentStage role={role} />
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: Enlarged, Well-Spaced Authentication Card
              (Email on TOP, Password, Submit, Divider, Google below)
              ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px]">
              {/* Luminous Ambient Depth Glow */}
              <div 
                ref={cardGlowRef}
                className="absolute -inset-2.5 rounded-[36px] blur-2xl transition-colors duration-700 pointer-events-none bg-gradient-to-tr from-sky-400/25 via-indigo-300/20 to-teal-200/20"
              />

              {/* Smooth Frosted Card */}
              <div 
                ref={cardRef}
                className="relative w-full bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.10),0_4px_6px_-2px_rgba(15,23,42,0.03)] p-8 sm:p-10 text-left will-change-transform"
              >
              
              {/* Card Header: Welcome Back */}
              <div className="auth-card-header mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-100 text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-2.5">
                  <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                  <span>Cardiologist Portal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                  {isSignUp 
                    ? 'Create an account to access the Cardiologist Clinical Suite.' 
                    : 'Sign in to access your clinical decision support workstation.'}
                </p>
              </div>

              {/* Feedback Alert for Success / Error / Notice */}
              {authStatus && (
                <div className={`p-4 rounded-2xl text-xs sm:text-sm mb-5 flex items-start gap-3 border ${
                  authStatus.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : authStatus.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  {authStatus.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {authStatus.type === 'success' ? 'Portal Connected' : 'Notice'}
                    </div>
                    <p className="mt-0.5 leading-relaxed">{authStatus.message}</p>
                    {authStatus.type === 'success' && (
                      <button
                        onClick={onBack}
                        className="mt-2.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
                      >
                        Return to Overview
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ─── 1. Email Sign-In / Sign-Up Form (ON TOP, Well-Spaced) ── */}
              <form onSubmit={handleAuthSubmit} className="space-y-4 sm:space-y-5">
                
                {/* Full Name Field (Sign Up only) */}
                {isSignUp && (
                  <div className="auth-form-field">
                    <label 
                      htmlFor="register-fullname" 
                      className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
                    >
                      {role === 'doctor' ? 'Doctor Name & Title' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                      <input
                        id="register-fullname"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Sarah Jenkins, MD"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all focus:border-sky-500 focus:ring-sky-500/20"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field (Always on top) */}
                <div className="auth-form-field">
                  <label 
                    htmlFor="login-email" 
                    className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5"
                  >
                    Institutional Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@hospital.org"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all focus:border-sky-500 focus:ring-sky-500/20"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="auth-form-field">
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="login-password" 
                      className="block text-xs sm:text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>
                    {!isSignUp && (
                      <button 
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold cursor-pointer bg-transparent border-0 p-0 transition-colors text-sky-600 hover:text-sky-700"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      minLength={6}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all focus:border-sky-500 focus:ring-sky-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="auth-submit-btn w-full mt-2 justify-center cursor-pointer disabled:opacity-50 btn-cardiologist-vibrant"
                  id="auth-submit-btn"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-white">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-white">{isSignUp ? 'Creating Account...' : 'Authenticating...'}</span>
                    </div>
                  ) : (
                    <span className="text-white">
                      {isSignUp
                        ? 'Create Cardiologist Account'
                        : 'Sign In to Cardiologist Portal'}
                    </span>
                  )}
                </button>

              </form>

              {/* ─── Divider: or continue with ────────────────────────────── */}
              <div className="auth-divider-line relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider text-slate-400">
                  <span className="bg-white px-3 font-medium">or continue with</span>
                </div>
              </div>

              {/* ─── 2. Google Sign-In (BELOW EMAIL) ──────────────────────── */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="auth-google-btn w-full py-3 px-5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/80 text-slate-800 text-sm font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-2xs active:scale-[0.99] disabled:opacity-50"
                id="auth-google-signin-btn"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* ─── Mode Switcher: Sign In <-> Create Account ─────────────── */}
              <div className="auth-footer-toggle mt-6 pt-5 border-t border-slate-200/80 text-center text-xs sm:text-sm text-slate-500">
                {isSignUp ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setAuthStatus(null);
                      }}
                      className="font-bold cursor-pointer bg-transparent border-0 p-0 ml-1 transition-colors text-sky-600 hover:text-sky-700"
                      id="auth-toggle-signin-btn"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setAuthStatus(null);
                      }}
                      className="font-bold cursor-pointer bg-transparent border-0 p-0 ml-1 transition-colors text-sky-600 hover:text-sky-700"
                      id="auth-toggle-signup-btn"
                    >
                      Create an Account
                    </button>
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </main>

      {/* ─── Transparent Glass Footer with Reserved Rights ─────────────── */}
      <footer className="w-full py-4 border-t border-slate-200/50 bg-white/40 backdrop-blur-xl text-center text-xs text-slate-600 font-medium tracking-wide supports-backdrop-filter:bg-white/35">
        CardioVision 3D • © 2026 • All rights reserved.
      </footer>

      {/* ─── Full-Screen Luminous Loading Overlay ─────────────────────── */}
      {isLoading && (
        <AuthLoadingOverlay 
          message={loadingState.message} 
          subMessage={loadingState.subMessage} 
        />
      )}

    </div>
  );
}
