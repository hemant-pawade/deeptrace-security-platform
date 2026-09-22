import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { SecurityMeshScene } from '../components/common/SecurityMeshScene';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});

    try {
      await login(email, password);
      toast.success('Authentication verified. Access granted.');
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
    toast.info(`Loaded preset: ${demoRole}`);
  };

  return (
    <div className="min-h-screen bg-[#06090E] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-sky-500 selection:text-white">
      {/* 3D Real Three.js Security Mesh Background */}
      <SecurityMeshScene className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Cyber Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none z-0" />

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link to Landing Page */}
        <div className="mb-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#06090E] transition-colors bg-[#0B0F17]/80 border border-slate-800/80 px-3 py-1.5 rounded-lg backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to 3D Landing Page
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-3 shadow-lg shadow-sky-950/50 backdrop-blur-md">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            Deep Trace Cybernetics
          </h1>
          <p className="text-[11px] tracking-widest text-sky-400/90 uppercase font-mono mt-1">
            Multi-Tenant Security Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0B0F17]/90 border border-slate-800/90 rounded-2xl p-7 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5"
              >
                Corporate Identity (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
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
                  placeholder="analyst@domain.com"
                  className={`w-full bg-[#06090E] border ${
                    fieldErrors.email ? 'border-rose-500' : 'border-slate-700/80'
                  } rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] text-rose-400 font-mono">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5"
              >
                Master Security Key (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="••••••••••••"
                  className={`w-full bg-[#06090E] border ${
                    fieldErrors.password ? 'border-rose-500' : 'border-slate-700/80'
                  } rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono`}
                />
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-[11px] text-rose-400 font-mono">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30"
            >
              Authenticate Session <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Role Selector */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[10px] text-slate-500 text-center mb-2">
              For reviewer convenience — click a role below to autofill demo credentials for that tenant.
            </p>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-3 text-center">
              Quick Role & Tenant Presets
            </div>

            <div className="space-y-2.5">
              <div className="text-[10px] uppercase font-mono text-sky-400 font-semibold flex items-center justify-between">
                <span>Tenant 1: Apex Defense</span>
                <span className="text-slate-400 font-normal">apex-defense</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  aria-label="Fill demo credentials for Admin at Apex Defense"
                  onClick={() => setDemoCredentials('admin@apex.com', 'Apex ADMIN')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 hover:bg-purple-950/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-[#0B0F17] text-[11px] text-slate-300 font-mono transition-colors text-center cursor-pointer"
                >
                  Admin
                </button>
                <button
                  type="button"
                  aria-label="Fill demo credentials for Manager at Apex Defense"
                  onClick={() => setDemoCredentials('manager@apex.com', 'Apex MANAGER')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 hover:bg-cyan-950/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-[#0B0F17] text-[11px] text-slate-300 font-mono transition-colors text-center cursor-pointer"
                >
                  Manager
                </button>
                <button
                  type="button"
                  aria-label="Fill demo credentials for Analyst at Apex Defense"
                  onClick={() => setDemoCredentials('analyst@apex.com', 'Apex ANALYST (USER)')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-500/60 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-[#0B0F17] text-[11px] text-slate-300 font-mono transition-colors text-center cursor-pointer"
                >
                  Analyst
                </button>
              </div>

              <div className="text-[10px] uppercase font-mono text-indigo-400 font-semibold flex items-center justify-between pt-1">
                <span>Tenant 2: Sentinel Cyber</span>
                <span className="text-slate-400 font-normal">sentinel-cyber</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  aria-label="Fill demo credentials for Admin at Sentinel Cyber"
                  onClick={() => setDemoCredentials('admin@sentinel.com', 'Sentinel ADMIN')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 hover:bg-purple-950/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-[#0B0F17] text-[11px] text-slate-300 font-mono transition-colors text-center cursor-pointer"
                >
                  Admin
                </button>
                <button
                  type="button"
                  aria-label="Fill demo credentials for Manager at Sentinel Cyber"
                  onClick={() => setDemoCredentials('manager@sentinel.com', 'Sentinel MANAGER')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 hover:bg-cyan-950/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-[#0B0F17] text-[11px] text-slate-300 font-mono transition-colors text-center cursor-pointer"
                >
                  Manager
                </button>
                <button
                  type="button"
                  aria-label="Fill demo credentials for User at Sentinel Cyber"
                  onClick={() => setDemoCredentials('user@sentinel.com', 'Sentinel USER')}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-500/60 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-[#0B0F17] text-[11px] text-slate-300 font-mono transition-colors text-center cursor-pointer"
                >
                  User
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 text-[11px] text-slate-400 font-mono">
          Strict Multi-Tenant Isolation • Zero Trust Authentication
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
