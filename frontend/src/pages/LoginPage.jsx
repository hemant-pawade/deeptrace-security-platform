import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('apex');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      await login(email, password);
      toast.success('Authentication verified. Welcome to Deep Trace.');
      navigate('/dashboard');
    } catch (err) {
      setFieldErrors(err.errors || {});
      toast.error(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setFieldErrors({});
    toast.info(`Loaded demo credentials: ${demoRole}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#F5C744] selection:text-stone-900">
      {/* Outer subtle decorative background glow */}
      <div className="fixed top-12 left-12 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-stone-300/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Container Card matching the Nixtio Dribbble layout */}
      <div className="w-full max-w-[1140px] bg-[#FAF8F5] rounded-[2.25rem] sm:rounded-[2.75rem] shadow-[0_25px_70px_rgba(40,30,20,0.08)] border border-[#E8E3D7] p-5 sm:p-7 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch relative z-10">
        
        {/* Left Column: Form & Presets */}
        <div className="lg:col-span-6 flex flex-col justify-between py-2 sm:py-4 px-1 sm:px-4">
          <div>
            {/* Header Brand Pill matching "Crextio" in reference */}
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-300/70 bg-white/90 shadow-sm text-stone-800 text-xs font-semibold tracking-wide">
                <Shield className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                <span>DeepTrace</span>
                <span className="text-stone-300">|</span>
                <span className="text-stone-500 font-mono text-[10px]">SEC-OPS</span>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-stone-500" /> Landing Page
              </Link>
            </div>

            {/* Typography Header */}
            <div className="mb-7">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 font-sans">
                Sign in to account
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
                Multi-tenant zero-trust security operations platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-stone-600 mb-1.5 ml-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="analyst@apex.com"
                    className="light-input w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm border border-stone-200/90 focus:border-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300/40 transition-all font-sans placeholder-stone-400"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 ml-1 text-xs text-rose-500 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-stone-600 mb-1.5 ml-1"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="••••••••••••"
                    className="light-input w-full rounded-2xl pl-11 pr-11 py-3.5 text-sm border border-stone-200/90 focus:border-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300/40 transition-all font-sans placeholder-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 ml-1 text-xs text-rose-500 font-medium">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button matching the Golden Pill in reference */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl sm:rounded-full bg-[#F5C744] hover:bg-[#EEBA32] active:scale-[0.99] text-stone-900 font-bold text-sm shadow-[0_4px_14px_rgba(245,199,68,0.35)] hover:shadow-[0_6px_20px_rgba(245,199,68,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Verifying Authentication...</>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Evaluation Shortcuts / Demo Presets */}
            <div className="mt-6 pt-5 border-t border-stone-200/80">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 font-mono">
                  Demo Evaluation Presets
                </span>
                <div className="flex gap-1.5 bg-stone-200/60 p-0.5 rounded-full text-[10px] font-medium text-stone-600">
                  <button
                    type="button"
                    onClick={() => setSelectedTenant('apex')}
                    className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                      selectedTenant === 'apex'
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Apex Defense
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTenant('sentinel')}
                    className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                      selectedTenant === 'sentinel'
                        ? 'bg-white text-stone-900 shadow-xs font-semibold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Sentinel Cyber
                  </button>
                </div>
              </div>

              {selectedTenant === 'apex' ? (
                <div className="bg-white/90 border border-stone-200/90 rounded-2xl p-3 shadow-xs">
                  <div className="text-[11px] font-semibold text-sky-700 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      Apex Defense (Primary Tenant)
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">apex-defense</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('admin@apex.com', 'Apex ADMIN')}
                      className="px-2 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium transition-all text-center cursor-pointer shadow-xs"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('manager@apex.com', 'Apex MANAGER')}
                      className="px-2 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium transition-all text-center cursor-pointer shadow-xs"
                    >
                      Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('analyst@apex.com', 'Apex ANALYST')}
                      className="px-2 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium transition-all text-center cursor-pointer shadow-xs"
                    >
                      Analyst
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/90 border border-stone-200/90 rounded-2xl p-3 shadow-xs">
                  <div className="text-[11px] font-semibold text-indigo-700 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      Sentinel Cyber (Secondary Tenant)
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">sentinel-cyber</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('admin@sentinel.com', 'Sentinel ADMIN')}
                      className="px-2 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium transition-all text-center cursor-pointer shadow-xs"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('manager@sentinel.com', 'Sentinel MANAGER')}
                      className="px-2 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium transition-all text-center cursor-pointer shadow-xs"
                    >
                      Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('user@sentinel.com', 'Sentinel USER')}
                      className="px-2 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium transition-all text-center cursor-pointer shadow-xs"
                    >
                      User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6 text-[11px] text-stone-500 font-mono">
            Zero-Trust Isolation • Row-Level Security Guaranteed
          </div>
        </div>

        {/* Right Column: Hero Visual with Layered Floating Cards (Directly replicating reference) */}
        <div className="lg:col-span-6 relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden min-h-[500px] sm:min-h-[580px] lg:min-h-[620px] shadow-lg border border-stone-200/80 bg-stone-100 group">
          {/* Main Unsplash Team Photo */}
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
            alt="Security Operations Team Collaborating"
            className="absolute inset-0 w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.02]"
          />

          {/* Gentle gradient vignette to make floating elements pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* Close/Return Button top-right (matching 'x' in reference) */}
          <Link
            to="/"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-stone-950 flex items-center justify-center backdrop-blur-md shadow-md transition-all hover:scale-105 z-30 cursor-pointer"
            title="Return to Landing Page"
            aria-label="Return to Landing Page"
          >
            <X className="w-4 h-4" />
          </Link>

          {/* 1. Floating Golden Yellow Note (matching "Task Review with Team") */}
          <div className="absolute top-6 left-6 z-20 bg-[#F5C744] text-stone-900 rounded-2xl p-3.5 shadow-xl max-w-[210px] border border-amber-300/80 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="text-xs font-bold flex items-center justify-between gap-2">
              <span>Task Review with Team</span>
            </div>
            <div className="text-[10px] text-stone-800 font-medium mt-0.5">
              09:30am - 10:00am
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-900/10 text-stone-900 text-[9px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
              09:30am - 10:00am
            </div>
          </div>

          {/* 2. Floating Circular Avatars Cluster (matching right avatar cluster in reference) */}
          <div className="absolute top-36 right-7 z-20 flex flex-col items-center gap-1.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Analyst Sarah"
                className="w-12 h-12 rounded-full object-cover ring-3 ring-white shadow-xl"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Analyst David"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Analyst Elena"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-lg"
              />
            </div>
          </div>

          {/* 3. Floating Glass Calendar Widget (matching calendar bar in reference) */}
          <div className="absolute bottom-28 left-5 right-5 sm:left-8 sm:right-8 z-20 backdrop-blur-md bg-stone-900/40 border border-white/25 text-white rounded-2xl p-3.5 shadow-2xl">
            <div className="grid grid-cols-7 text-center gap-1 text-[10px] text-stone-300 font-medium mb-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
            <div className="grid grid-cols-7 text-center gap-1 text-xs font-semibold items-center">
              <span className="text-stone-300">22</span>
              <span className="text-stone-300">23</span>
              <span className="text-stone-300">24</span>
              <span className="text-stone-300">25</span>
              <span className="text-stone-300">26</span>
              <span className="bg-white/30 rounded-lg py-1 border border-white/40 shadow-xs text-white">27</span>
              <span className="text-stone-300">28</span>
            </div>
          </div>

          {/* 4. Floating White Card Bottom-Left (matching "Daily Meeting" in reference) */}
          <div className="absolute bottom-6 left-5 sm:left-8 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-stone-100 max-w-[210px]">
            <div className="text-xs font-bold text-stone-900">
              Daily Meeting
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              12:00pm - 01:00pm
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex -space-x-1.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Team"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Team"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                  alt="Team"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="Team"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
                />
              </div>
              <span className="text-[10px] text-stone-600 font-medium">+4 members</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
