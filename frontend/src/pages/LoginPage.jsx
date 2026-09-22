import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('admin@apex.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Authentication verified. Welcome to Deep Trace.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    toast.info(`Filled credentials for ${demoRole} (${demoEmail})`);
  };

  return (
    <div className="min-h-screen bg-[#06090E] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background cyber grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-4 shadow-lg shadow-sky-950/40">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            DEEP TRACE CYBERNETICS
          </h1>
          <p className="text-xs tracking-widest text-sky-400/80 uppercase font-mono mt-1">
            Multi-Tenant Security Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111726]/90 border border-slate-800 rounded-2xl p-7 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                Corporate Identity (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  className="w-full bg-[#090D16] border border-slate-700/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5">
                Master Security Key (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#090D16] border border-slate-700/80 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2"
            >
              Authenticate Session <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Role Selector */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 text-center">
              Quick Role & Tenant Presets
            </div>

            <div className="space-y-2">
              <div className="text-[10px] uppercase font-mono text-sky-400/90 font-semibold">
                Tenant 1: Apex Defense Systems
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin@apex.com', 'Apex ADMIN')}
                  className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-[11px] text-slate-300 font-mono transition-colors text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('manager@apex.com', 'Apex MANAGER')}
                  className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-[11px] text-slate-300 font-mono transition-colors text-center"
                >
                  Manager
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('analyst@apex.com', 'Apex USER')}
                  className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-500/50 hover:bg-slate-800/40 text-[11px] text-slate-300 font-mono transition-colors text-center"
                >
                  Analyst
                </button>
              </div>

              <div className="text-[10px] uppercase font-mono text-indigo-400/90 font-semibold pt-2">
                Tenant 2: Sentinel Cybernetics
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin@sentinel.com', 'Sentinel ADMIN')}
                  className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-[11px] text-slate-300 font-mono transition-colors text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('manager@sentinel.com', 'Sentinel MANAGER')}
                  className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-[11px] text-slate-300 font-mono transition-colors text-center"
                >
                  Manager
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('user@sentinel.com', 'Sentinel USER')}
                  className="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-500/50 hover:bg-slate-800/40 text-[11px] text-slate-300 font-mono transition-colors text-center"
                >
                  User
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500 font-mono">
          Strict Multi-Tenant Isolation • Zero Trust Authentication
        </div>
      </div>
    </div>
  );
}
