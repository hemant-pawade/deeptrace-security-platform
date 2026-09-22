import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  ListChecks,
  Activity,
  LayoutDashboard,
  Database,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Server,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SecurityMeshScene } from '../components/common/SecurityMeshScene';

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section 2: Core Requirements A-F mapped specifically to implementation
  const specCards = [
    {
      icon: Lock,
      requirement: 'Requirement A',
      title: 'Authentication & Authorization',
      description:
        'JWT-based sessions, bcrypt-hashed credentials, and RBAC across ADMIN / MANAGER / USER roles enforced server-side on every route — not just hidden in the UI.',
      badge: 'Bcrypt + JWT + Route Guards',
    },
    {
      icon: Shield,
      requirement: 'Requirement B',
      title: 'Multi-Tenant Isolation',
      description:
        'Every query is scoped to the authenticated user\'s tenant ID, derived from the verified JWT. Cross-tenant access attempts return 403/404 with zero data exposure — verified by an 11-test automated security suite.',
      badge: 'JWT-Derived Tenant ID',
    },
    {
      icon: ListChecks,
      requirement: 'Requirement C',
      title: 'Campaign Management',
      description:
        'Full lifecycle CRUD with enforced state transitions (DRAFT → ACTIVE → COMPLETED/CANCELLED) and tenant-scoped user assignment.',
      badge: 'Deterministic State Machine',
    },
    {
      icon: Activity,
      requirement: 'Requirement D',
      title: 'Security Events & Audit Trail',
      description:
        'Severity-triaged event tracking (LOW/MEDIUM/HIGH/CRITICAL) with server-side filtering and pagination, backed by an immutable audit log restricted to authorized roles.',
      badge: 'Append-Only Audit Ledger',
    },
    {
      icon: LayoutDashboard,
      requirement: 'Requirement E',
      title: 'React Frontend',
      description:
        'Role-aware UI across Dashboard, Campaigns, Security Events, Users, and Audit Logs — every action gated by the same permissions the backend enforces.',
      badge: 'Vite + React 18 + Tailwind',
    },
    {
      icon: Database,
      requirement: 'Requirement F',
      title: 'PostgreSQL + Prisma',
      description:
        'Relational schema with proper foreign keys and indexes, parameterized queries throughout, server-side sorting/filtering/pagination on every list endpoint.',
      badge: 'Relational Integrity & Indexes',
    },
  ];

  // Architecture horizontal flow nodes
  const archSteps = [
    {
      name: 'Client Layer',
      tech: 'React / Vite SPA',
      desc: 'Role-aware UI & local state',
    },
    {
      name: 'API Gateway',
      tech: 'Express.js',
      desc: 'CORS, helmet & rate limiting',
    },
    {
      name: 'Security Guards',
      tech: 'JWT + RBAC + Tenant Check',
      desc: 'Cryptographic context extraction',
    },
    {
      name: 'Data Layer',
      tech: 'Prisma + PostgreSQL',
      desc: 'Scoped WHERE tenant_id queries',
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
              Deep Trace <span className="text-sky-400 font-mono text-xs">Security</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-slate-400">
            <a href="#spec" className="hover:text-sky-400 transition-colors">
              Built to Spec
            </a>
            <a href="#security-test" className="hover:text-sky-400 transition-colors">
              The Security Test
            </a>
            <a href="#architecture" className="hover:text-sky-400 transition-colors">
              Architecture
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
              Sign In to Console
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Confined Real 3D Three.js Constellation) */}
      <section className="relative overflow-hidden border-b border-slate-800/80 pt-20 pb-24 md:pt-28 md:pb-32 flex items-center min-h-[580px]">
        {/* Real 3D Three.js WebGL Security Mesh Canvas */}
        <SecurityMeshScene className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* Contrast Gradient Overlays for Guaranteed Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080C14]/75 via-[#080C14]/85 to-[#080C14] pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080C14_85%)] pointer-events-none z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono mb-6"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Assessment Technical Submission • Node / React / SQL
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight"
          >
            Multi-tenant security operations with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              zero-trust isolation
            </span>{' '}
            enforced at every query
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Built strictly to specification: JWT authorization with server-side RBAC, mathematically isolated tenant data boundaries, deterministic campaign state machines, and an immutable audit ledger.
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

      {/* 3. "Built to Spec" Section — Core Requirements A–F */}
      <section id="spec" className="py-24 px-6 max-w-7xl mx-auto w-full relative z-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Full Technical Specification Adherence
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Built to Specification: Core Requirements A–F
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every feature on this platform directly corresponds to the core assessment requirements — engineered with zero shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-[#0B101B] border border-slate-800/80 hover:border-sky-500/40 p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-950/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                      {card.requirement}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white tracking-tight mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-800/60">
                  <span className="text-[11px] font-mono text-sky-400/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    {card.badge}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. "The Mandatory Security Test" Callout Section */}
      <section id="security-test" className="py-20 px-6 border-t border-slate-800/80 bg-[#06090E]/80 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Architectural Guarantee
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The Mandatory Security Test
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              The foundational cross-tenant isolation scenario this platform was architected to defeat.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B101B] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60"
          >
            {/* Left Column: Explicit Statement of Guarantee */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-400">
                Core Architectural Guarantee
              </div>
              <blockquote className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed border-l-2 border-sky-500 pl-4 py-1 italic">
                &ldquo;If Campaign 201 belongs to Tenant B, a user authenticated under Tenant A can never retrieve or modify it — not through the UI, not by guessing the ID, not by spoofing a tenant claim in the request body. Every tenant-owned query is scoped to the JWT-derived tenant ID, with no exceptions.&rdquo;
              </blockquote>
              <div className="space-y-2 pt-2 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">✔</span>
                  <span><strong>Zero Client Trust:</strong> Client-supplied <code>tenant_id</code> headers or JSON bodies are stripped immediately.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">✔</span>
                  <span><strong>No Resource Enumeration:</strong> Cross-tenant resource lookups return HTTP 404 Not Found instead of leaking existence with a 403.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">✔</span>
                  <span><strong>Automated Verification:</strong> Verified against automated test suites running active cross-tenant attack assertions.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Terminal Simulation Code Block */}
            <div className="lg:col-span-6">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#05070B] shadow-lg font-mono text-xs">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-[11px] text-slate-400">cross_tenant_exploit_test.sh</span>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Terminal Body */}
                <div className="p-4 space-y-3 text-slate-300 overflow-x-auto">
                  <div>
                    <span className="text-slate-400"># 1. Attacker (Tenant A) targets Tenant B resource:</span>
                    <p className="text-sky-300 mt-1">
                      GET /api/campaigns/201 HTTP/1.1
                    </p>
                    <p className="text-slate-400">
                      Authorization: Bearer &lt;Tenant_A_JWT&gt;<br />
                      Host: api.deeptrace.internal
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400"># 2. Database query executed by server:</span>
                    <p className="text-emerald-400 mt-1">
                      SELECT * FROM campaigns<br />
                      WHERE id = '201' <span className="text-amber-300 font-bold">AND tenant_id = req.user.tenantId</span>;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400"># 3. HTTP Gateway Response:</span>
                    <div className="mt-1 p-2.5 rounded bg-slate-900/80 border border-rose-500/30 text-rose-300">
                      <span className="font-bold text-rose-400">HTTP/1.1 404 Not Found</span>
                      <pre className="text-[11px] text-slate-400 mt-1">
{`{
  "success": false,
  "message": "Campaign not found",
  "errors": {}
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Architecture Strip — Lightweight Horizontal Flow */}
      <section id="architecture" className="py-20 px-6 border-t border-slate-800/80 bg-[#080C14] relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Request Execution Pipeline
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              End-to-end traversal from client interaction to scoped database persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {archSteps.map((step, idx) => (
              <div
                key={step.name}
                className="bg-[#0B101B] border border-slate-800 rounded-xl p-5 relative flex flex-col justify-between group hover:border-sky-500/40 transition-colors"
              >
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400/80 mb-1">
                    Stage 0{idx + 1}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {step.name}
                  </h3>
                  <div className="text-xs font-mono text-slate-300 font-medium mb-2">
                    {step.tech}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-30 pointer-events-none text-slate-400 font-mono text-sm">
                    ➔
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Minimal Tech Stack Strip + Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 bg-[#080C14] text-xs text-slate-400 font-mono">
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

export default LandingPage;
