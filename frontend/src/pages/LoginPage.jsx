import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

/**
 * High-End Cybersecurity Ambient Animation for Login
 * Renders smooth 60fps subtle glowing nodes, gentle drift, and technical radar pulse.
 * Designed to look calm, elegant, and enterprise-grade — never intrusive or chaotic.
 */
function LoginCyberBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes configuration
    const NODE_COUNT = 45;
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.6 + 1.2,
        color: Math.random() > 0.4 ? '56, 189, 248' : '129, 140, 248',
        baseAlpha: Math.random() * 0.35 + 0.25,
      });
    }

    let radarAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Rotating Technical Radar Sweep from center
      const centerX = width / 2;
      const centerY = height / 2;
      const radarRadius = Math.max(width, height) * 0.55;

      radarAngle += 0.003;
      const sweepGradient = ctx.createConicGradient(radarAngle, centerX, centerY);
      sweepGradient.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
      sweepGradient.addColorStop(0.12, 'rgba(56, 189, 248, 0.005)');
      sweepGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = sweepGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Faint Concentric Orbit Rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
      ctx.lineWidth = 1;
      [180, 320, 480].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Connect nodes that are close to each other
      const maxDist = 130;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Update and render particle nodes
      for (let node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Soft outer glow
        const glow = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * 3.5
        );
        glow.addColorStop(0, `rgba(${node.color}, ${node.baseAlpha})`);
        glow.addColorStop(1, `rgba(${node.color}, 0)`);

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Bright core dot
        ctx.fillStyle = `rgba(${node.color}, ${node.baseAlpha + 0.3})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

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
    toast.info(`Loaded demo credentials: ${demoRole}`);
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. Calm, Elegant 60fps Cyber Backdrop */}
      <LoginCyberBackdrop />

      {/* Cyber Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none z-0" />

      {/* Ambient Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Vignette Overlay for High Legibility */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#080C14_92%)] pointer-events-none z-0" />

      <div className="w-full max-w-[460px] relative z-10">
        {/* Navigation Back Link */}
        <div className="mb-5 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-[#080C14] transition-all bg-[#0B101B]/80 hover:bg-[#0B101B] border border-slate-800 hover:border-slate-700 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" /> Return to 3D Landing Page
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-3.5 shadow-lg shadow-sky-950/40 backdrop-blur-md ring-1 ring-sky-500/20">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
            Deep Trace Cybernetics
          </h1>
          <div className="inline-flex items-center gap-2 mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Security Operations Console
          </div>
        </div>

        {/* Authentication Card */}
        <div className="bg-[#0B101B]/95 border border-slate-800/90 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-300 uppercase font-mono mb-1.5"
              >
                Corporate Identity (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
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
                  style={{ backgroundColor: '#06090E', color: '#F1F5F9' }}
                  className={`w-full !bg-[#06090E] border ${
                    fieldErrors.email ? 'border-rose-500' : 'border-slate-700/80 hover:border-slate-600'
                  } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm !text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono`}
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
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
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
                  style={{ backgroundColor: '#06090E', color: '#F1F5F9' }}
                  className={`w-full !bg-[#06090E] border ${
                    fieldErrors.password ? 'border-rose-500' : 'border-slate-700/80 hover:border-slate-600'
                  } rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm !text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors font-mono`}
                />
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-[11px] text-rose-400 font-mono">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 mt-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-900/40 hover:shadow-sky-500/20 transition-all cursor-pointer"
            >
              Authenticate Session <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Quick Demo Role Presets */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 text-center mb-3">
              <span className="text-slate-300 font-medium">Evaluation Shortcuts</span> — click to autofill verified credentials:
            </p>

            <div className="space-y-3">
              {/* Tenant 1: Apex Defense */}
              <div className="bg-[#06090E]/70 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] uppercase font-mono text-sky-400 font-semibold flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    Tenant 1: Apex Defense
                  </span>
                  <span className="text-slate-400 text-[9px] font-normal">apex-defense</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    aria-label="Fill demo credentials for Admin at Apex Defense"
                    onClick={() => setDemoCredentials('admin@apex.com', 'Apex ADMIN')}
                    className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/30 text-purple-300 text-[11px] font-mono transition-all text-center cursor-pointer shadow-sm"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    aria-label="Fill demo credentials for Manager at Apex Defense"
                    onClick={() => setDemoCredentials('manager@apex.com', 'Apex MANAGER')}
                    className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/30 text-cyan-300 text-[11px] font-mono transition-all text-center cursor-pointer shadow-sm"
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    aria-label="Fill demo credentials for Analyst at Apex Defense"
                    onClick={() => setDemoCredentials('analyst@apex.com', 'Apex ANALYST (USER)')}
                    className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/30 text-emerald-300 text-[11px] font-mono transition-all text-center cursor-pointer shadow-sm"
                  >
                    Analyst
                  </button>
                </div>
              </div>

              {/* Tenant 2: Sentinel Cyber */}
              <div className="bg-[#06090E]/70 border border-slate-800/80 rounded-xl p-3">
                <div className="text-[10px] uppercase font-mono text-indigo-400 font-semibold flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Tenant 2: Sentinel Cyber
                  </span>
                  <span className="text-slate-400 text-[9px] font-normal">sentinel-cyber</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    aria-label="Fill demo credentials for Admin at Sentinel Cyber"
                    onClick={() => setDemoCredentials('admin@sentinel.com', 'Sentinel ADMIN')}
                    className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/30 text-purple-300 text-[11px] font-mono transition-all text-center cursor-pointer shadow-sm"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    aria-label="Fill demo credentials for Manager at Sentinel Cyber"
                    onClick={() => setDemoCredentials('manager@sentinel.com', 'Sentinel MANAGER')}
                    className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/30 text-cyan-300 text-[11px] font-mono transition-all text-center cursor-pointer shadow-sm"
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    aria-label="Fill demo credentials for User at Sentinel Cyber"
                    onClick={() => setDemoCredentials('user@sentinel.com', 'Sentinel USER')}
                    className="px-2 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/60 text-slate-300 text-[11px] font-mono transition-all text-center cursor-pointer shadow-sm"
                  >
                    User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="text-center mt-5 text-[11px] text-slate-400 font-mono">
          Strict Multi-Tenant Isolation • Zero Trust Authentication
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
