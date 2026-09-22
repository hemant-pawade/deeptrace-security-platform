import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Activity,
  ScrollText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Cyber3DScene } from '../components/common/Cyber3DScene';

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Tenant Isolation',
      description: 'Shared-database architecture with cryptographically derived tenant query scoping, ensuring zero cross-tenant data exposure.',
    },
    {
      icon: Lock,
      title: 'Role-Based Access Control',
      description: 'Strict hierarchical clearances across ADMIN, MANAGER, and USER roles enforced at API route gateways and database operations.',
    },
    {
      icon: Activity,
      title: 'Real-Time Security Events',
      description: 'Dynamic threat telemetry with severity triage (CRITICAL, HIGH, MEDIUM, LOW) and immediate incident response workflows.',
    },
    {
      icon: ScrollText,
      title: 'Full Audit Trail',
      description: 'Immutable, tamper-evident audit logging for user provisioning, campaign lifecycle changes, and administrative actions.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Authenticate',
      description: 'Operatives authenticate securely via bcrypt-hashed credentials and receive a signed JWT with embedded RBAC claims.',
    },
    {
      step: '02',
      title: 'Scoped by Tenant',
      description: 'Every database query and mutation is mathematically locked to req.user.tenantId, preventing unauthorized enumeration.',
    },
    {
      step: '03',
      title: 'Full Audit Trail',
      description: 'Critical events and deterministic state transitions are recorded into an append-only ledger for non-repudiation.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          scrolled
            ? 'bg-[#080C14]/90 backdrop-blur-md border-slate-800/80 shadow-lg shadow-black/40'
            : 'bg-transparent border-slate-800/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wider uppercase text-white">
              Deep Trace <span className="text-sky-400 font-mono text-xs">SOC</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-slate-400">
            <a href="#features" className="hover:text-sky-400 transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-sky-400 transition-colors">
              Security
            </a>
            <Link to="/login" className="hover:text-sky-400 transition-colors">
              Login
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-900/30 transition-all cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Cyber3DScene renders strictly inside this container) */}
      <section className="relative overflow-hidden border-b border-slate-800/80 pt-20 pb-28 md:pt-28 md:pb-36 flex items-center">
        {/* Animated Threat Mesh Canvas */}
        <Cyber3DScene className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Contrast Gradient Overlays for High Legibility on Mobile & Desktop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080C14]/70 via-[#080C14]/85 to-[#080C14] pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080C14_90%)] pointer-events-none z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono mb-6"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Cryptographic Multi-Tenancy Architecture
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight"
          >
            Multi-tenant security operations, built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              zero-trust from day one
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Cryptographically isolated workspace boundaries, deterministic campaign state machines, and immutable audit ledgers designed for modern enterprise defense.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex justify-center"
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-xl shadow-sky-900/30 hover:shadow-sky-500/20 transition-all cursor-pointer"
            >
              Sign In to Console <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 3. Feature Highlights (3–4 Cards Grid) */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto w-full relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Enterprise Defense Architecture
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Engineered from the database layer to the API gateway to prevent cross-tenant enumeration and state mutation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0B101B] border border-slate-800/80 hover:border-sky-500/40 p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-950/20"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. "How It Works" Trust Strip */}
      <section id="how-it-works" className="py-20 px-6 border-t border-slate-800/80 bg-[#06090E]/60 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              How Deep Trace Enforces Isolation
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              Three-stage non-bypassable verification pipeline executed on every operation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, i) => (
              <motion.div
                key={st.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-[#0B101B] border border-slate-800 p-6 rounded-xl"
              >
                <div className="text-2xl font-mono font-bold text-sky-400/80 mb-3">
                  {st.step}
                </div>
                <h3 className="text-sm font-semibold text-slate-100 mb-2">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {st.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 bg-[#080C14] text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-300">Deep Trace Cybernetics</span> — Multi-Tenant Security Platform
          </div>
          <div className="text-slate-400">
            Node.js • Express • PostgreSQL • Prisma • React • Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  );
}
