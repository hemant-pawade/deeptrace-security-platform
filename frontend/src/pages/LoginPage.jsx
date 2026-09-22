import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Radio,
} from 'lucide-react';
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
      toast.success('Authentication verified. Access granted to SOC console.');
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
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Ambient Cyber Lighting matching Deep Trace Landing Page */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none opacity-30" />

      {/* Main Split Container Card matching the Nixtio Dribbble layout in Deep Trace Dark Cybernetics */}
      <div className="w-full max-w-[1140px] bg-[#0B101B]/95 rounded-[2.25rem] sm:rounded-[2.75rem] shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-slate-800/90 p-5 sm:p-7 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch relative z-10 backdrop-blur-xl">
        
        {/* Left Column: Form & Presets */}
        <div className="lg:col-span-6 flex flex-col justify-between py-2 sm:py-4 px-1 sm:px-4">
          <div>
            {/* Header Brand Pill matching "Crextio" from reference */}
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 shadow-sm text-sky-400 text-xs font-semibold tracking-wide">
                <Shield className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                <span className="text-white">DeepTrace</span>
                <span className="text-slate-600">|</span>
                <span className="text-emerald-400 font-mono text-[10px]">SEC-OPS</span>
              </div>

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-sky-400" /> Landing Page
              </Link>
            </div>

            {/* Typography Header */}
            <div className="mb-7">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                Sign in to account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal">
                Multi-tenant zero-trust security operations platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 font-mono uppercase tracking-wider text-[11px]"
                >
                  Corporate Identity (Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                    style={{ backgroundColor: '#06090E', color: '#F1F5F9' }}
                    className="w-full rounded-2xl pl-11 pr-4 py-3.5 text-sm !bg-[#06090E] border border-slate-700/80 hover:border-slate-600 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-mono !text-slate-100 placeholder-slate-500"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 ml-1 text-xs text-rose-400 font-mono">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1 font-mono uppercase tracking-wider text-[11px]"
                >
                  Security Passkey (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                    style={{ backgroundColor: '#06090E', color: '#F1F5F9' }}
                    className="w-full rounded-2xl pl-11 pr-11 py-3.5 text-sm !bg-[#06090E] border border-slate-700/80 hover:border-slate-600 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-mono !text-slate-100 placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 ml-1 text-xs text-rose-400 font-mono">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button matching the Golden Pill in reference */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl sm:rounded-full bg-[#F5C744] hover:bg-[#EEBA32] active:scale-[0.99] text-stone-950 font-bold text-sm shadow-[0_4px_20px_rgba(245,199,68,0.35)] hover:shadow-[0_6px_25px_rgba(245,199,68,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Demo Evaluation Presets
                </span>
                <div className="flex gap-1.5 bg-slate-900 border border-slate-800 p-0.5 rounded-full text-[10px] font-medium text-slate-400">
                  <button
                    type="button"
                    onClick={() => setSelectedTenant('apex')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      selectedTenant === 'apex'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Apex Defense
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTenant('sentinel')}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      selectedTenant === 'sentinel'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sentinel Cyber
                  </button>
                </div>
              </div>

              {selectedTenant === 'apex' ? (
                <div className="bg-[#06090E]/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                  <div className="text-[11px] font-semibold text-sky-400 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      Apex Defense (Primary Tenant)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">apex-defense</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('admin@apex.com', 'Apex ADMIN')}
                      className="px-2 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-purple-300 text-xs font-mono transition-all text-center cursor-pointer shadow-xs"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('manager@apex.com', 'Apex MANAGER')}
                      className="px-2 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono transition-all text-center cursor-pointer shadow-xs"
                    >
                      Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('analyst@apex.com', 'Apex ANALYST')}
                      className="px-2 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-xs font-mono transition-all text-center cursor-pointer shadow-xs"
                    >
                      Analyst
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#06090E]/90 border border-slate-800 rounded-2xl p-3 shadow-sm">
                  <div className="text-[11px] font-semibold text-indigo-400 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      Sentinel Cyber (Secondary Tenant)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">sentinel-cyber</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('admin@sentinel.com', 'Sentinel ADMIN')}
                      className="px-2 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-purple-300 text-xs font-mono transition-all text-center cursor-pointer shadow-xs"
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('manager@sentinel.com', 'Sentinel MANAGER')}
                      className="px-2 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono transition-all text-center cursor-pointer shadow-xs"
                    >
                      Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoCredentials('user@sentinel.com', 'Sentinel USER')}
                      className="px-2 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-mono transition-all text-center cursor-pointer shadow-xs"
                    >
                      User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-slate-400 font-sans tracking-wide">
            Zero-Trust Isolation • Row-Level Security Guaranteed
          </div>
        </div>

        {/* Right Column: Hero Visual with Project-Accurate Security Telemetry Cards */}
        <div className="lg:col-span-6 relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden min-h-[500px] sm:min-h-[580px] lg:min-h-[620px] shadow-2xl border border-slate-800 bg-[#06090E] group">
          {/* Main Unsplash High-Tech SOC Operations Team Photo */}
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
            alt="Security Operations Center Monitoring"
            className="absolute inset-0 w-full h-full object-cover object-center filter saturate-[1.1] contrast-[1.05]"
          />

          {/* Vignette overlay for high-contrast legible floating widgets */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C14]/90 via-[#080C14]/30 to-[#080C14]/50 pointer-events-none" />

          {/* Close/Return Button top-right (matching 'x' in reference) */}
          <Link
            to="/"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-slate-700/80 shadow-md transition-all hover:scale-105 z-30 cursor-pointer"
            title="Return to Landing Page"
            aria-label="Return to Landing Page"
          >
            <X className="w-4 h-4" />
          </Link>

          {/* 1. Floating Golden Security Card: Zero-Trust RLS Active (replaces generic 'Task Review') */}
          <div className="absolute top-6 left-6 z-20 bg-[#F5C744] text-stone-950 rounded-2xl p-3.5 shadow-2xl max-w-[225px] border border-amber-300/80 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="text-xs font-bold flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-stone-950" />
                Zero-Trust Policy
              </span>
            </div>
            <div className="text-[10px] text-stone-900 font-medium mt-0.5">
              Row-Level Isolation Enforced
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-950/15 text-stone-950 text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              0 Cross-Tenant Leaks
            </div>
          </div>

          {/* 2. Floating Circular Avatars: Active SOC Clearance Operators */}
          <div className="absolute top-36 right-7 z-20 flex flex-col items-center gap-1.5">
            <div className="relative group/avatar cursor-pointer" title="Lead SecOps Analyst (Level 4 Clearance)">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Lead SecOps Analyst"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-400 shadow-xl"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" title="Active Clearance" />
            </div>
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="Threat Hunter"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800 shadow-lg"
                title="Apex Defense SOC Team"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Security Auditor"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800 shadow-lg"
                title="Sentinel Cyber SOC Team"
              />
            </div>
            <span className="text-[9px] font-mono text-sky-300/80 bg-slate-950/80 px-2 py-0.5 rounded-full border border-sky-500/20 backdrop-blur-xs">
              SOC Tier-3
            </span>
          </div>

          {/* 3. Floating Security Defense Telemetry Matrix (replaces generic calendar days) */}
          <div className="absolute bottom-28 left-5 right-5 sm:left-8 sm:right-8 z-20 backdrop-blur-md bg-slate-950/80 border border-slate-700/80 text-white rounded-2xl p-3.5 shadow-2xl">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2">
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold uppercase tracking-wider">
                <Activity className="w-3 h-3 text-sky-400 animate-pulse" />
                Security Verification Suite
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                31/31 PASS
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
              <div className="bg-slate-900/90 rounded-lg py-1 px-1.5 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase">RLS Scope</div>
                <div className="text-[11px] font-bold text-sky-400">100%</div>
              </div>
              <div className="bg-slate-900/90 rounded-lg py-1 px-1.5 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase">RBAC Guard</div>
                <div className="text-[11px] font-bold text-emerald-400">Strict</div>
              </div>
              <div className="bg-slate-900/90 rounded-lg py-1 px-1.5 border border-slate-800">
                <div className="text-[9px] text-slate-400 uppercase">JWT Auth</div>
                <div className="text-[11px] font-bold text-cyan-400">Verified</div>
              </div>
              <div className="bg-sky-500/20 rounded-lg py-1 px-1.5 border border-sky-400/40 shadow-xs">
                <div className="text-[9px] text-sky-300 uppercase">Audit Trail</div>
                <div className="text-[11px] font-bold text-white">SHA-256</div>
              </div>
            </div>
          </div>

          {/* 4. Floating Active SOC Incident Desk (replaces generic 'Daily Meeting') */}
          <div className="absolute bottom-6 left-5 sm:left-8 z-20 bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-700/80 max-w-[240px]">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live SOC Operations Desk
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Apex & Sentinel Isolation Active
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex -space-x-1.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="SOC Team"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="SOC Team"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                  alt="SOC Team"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-800"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="SOC Team"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-800"
                />
              </div>
              <span className="text-[10px] text-emerald-300 font-medium font-mono">0 Breaches Detected</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
