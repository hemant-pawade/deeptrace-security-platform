import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Cpu,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Layers,
  Terminal,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { Cyber3DScene } from '../components/common/Cyber3DScene';
import { Button } from '../components/common/Button';

export function LandingPage() {
  const [activeSimTenant, setActiveSimTenant] = useState('apex');

  const capabilities = [
    {
      icon: Shield,
      title: 'Zero-Trust Tenant Isolation',
      desc: 'Shared-database architecture with mathematical query-scoping. Cross-tenant access strictly returns 404 Anti-Enumeration with zero data leakage.',
      tag: 'CORE SECURITY',
      tech: 'WHERE tenant_id = req.user.tenantId',
    },
    {
      icon: Layers,
      title: 'Campaign State Machine',
      desc: 'Deterministic lifecycle transitions (DRAFT -> ACTIVE -> COMPLETED). Illegal status tampering is blocked at the gateway with 409 Conflict.',
      tag: 'WORKFLOW ENGINE',
      tech: 'Enforced State Guard',
    },
    {
      icon: Activity,
      title: 'Real-Time Threat Radar',
      desc: 'Live telemetry classification across CRITICAL, HIGH, MEDIUM, and LOW severity threats with real-time incident resolution workflows.',
      tag: 'TELEMETRY',
      tech: 'Indexed Server-Side Filters',
    },
    {
      icon: Terminal,
      title: 'Tamper-Evident Audit Ledger',
      desc: 'Cryptographic non-repudiation logging for all administrative events, user provisioning, access revocations, and campaign mutations.',
      tag: 'COMPLIANCE',
      tech: 'Immutable Audit Log',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06090E] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-sky-500 selection:text-white">
      {/* 3D Background Canvas (Masked to Hero Section) */}
      <Cyber3DScene />

      {/* Cyber Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none z-0" />

      {/* Ambient Radial Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Top Navigation */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/60 backdrop-blur-xl bg-[#06090E]/70 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-950/50">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base tracking-wider text-white uppercase">
              Deep Trace
            </div>
            <div className="text-[10px] tracking-widest text-sky-400 uppercase font-mono">
              Cybernetics
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-slate-400">
          <a href="#features" className="hover:text-sky-400 transition-colors">
            Capabilities
          </a>
          <a href="#simulator" className="hover:text-sky-400 transition-colors">
            Isolation Engine
          </a>
          <a href="#metrics" className="hover:text-sky-400 transition-colors">
            Telemetry
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button size="sm" className="bg-sky-600 hover:bg-sky-500 text-xs font-semibold px-4.5 py-2 shadow-md shadow-sky-900/30">
              Access Console <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono mb-8 backdrop-blur-md shadow-lg shadow-sky-950/40">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          NEXT-GEN MULTI-TENANT DEFENSE PLATFORM • v2.4 LIVE
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
          Unified Security Operations &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">
            Tenant Isolation
          </span>
        </h1>

        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-300/90 max-w-2xl leading-relaxed font-normal">
          Enterprise cyber-defense infrastructure designed for defense contractors and MSSPs.
          Featuring cryptographic RBAC, threat campaign lifecycle automation, and verified zero-trust multi-tenancy.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link to="/login">
            <Button
              size="lg"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 py-3 shadow-xl shadow-sky-500/25 text-sm"
            >
              Launch Operations Console <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a href="#features">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-700/80 bg-slate-900/50 backdrop-blur-md text-slate-300 hover:bg-slate-800 text-sm px-6 py-3"
            >
              Explore Architecture
            </Button>
          </a>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div id="metrics" className="mt-16 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-[#0B0F17]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl font-bold font-mono text-sky-400">100%</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Tenant Isolation</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B0F17]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl font-bold font-mono text-emerald-400">0.00%</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Cross-Data Leakage</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B0F17]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl font-bold font-mono text-amber-400">4-Stage</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Campaign Lifecycle</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0B0F17]/80 border border-slate-800/80 backdrop-blur-md">
            <div className="text-2xl font-bold font-mono text-indigo-400">Immutable</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Audit Ledger</div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="relative z-10 max-w-7xl w-full mx-auto px-6 py-24 border-t border-slate-800/80 bg-[#06090E]/90 backdrop-blur-sm">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-2">
            Defense Capabilities
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Engineered for High-Assurance Security Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
            Every layer from the API gateway to database queries is bound by strict zero-trust principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-[#0B0F17] border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-sky-400 font-semibold tracking-wider">
                    {c.tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {c.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 block truncate">
                    {c.tech}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Live Multi-Tenant Query Simulator */}
      <section id="simulator" className="relative z-10 max-w-5xl w-full mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="bg-[#0B0F17] border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
              Interactive Architecture Proof
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
              Live Tenant Query Boundary Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Select an authenticated tenant identity below to inspect how the API Gateway and Prisma ORM scope database queries.
            </p>
          </div>

          {/* Tenant Switcher Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setActiveSimTenant('apex')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeSimTenant === 'apex'
                  ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tenant A: Apex Defense Systems
            </button>
            <button
              onClick={() => setActiveSimTenant('sentinel')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeSimTenant === 'sentinel'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tenant B: Sentinel Cybernetics
            </button>
          </div>

          {/* Simulated Query & Defense Window */}
          <div className="bg-[#05080E] border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 text-slate-300">
                  {activeSimTenant === 'apex' ? 'Apex Defense Session' : 'Sentinel Cybernetics Session'}
                </span>
              </span>
              <span className="text-emerald-400">ISOLATION LOCKED</span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-slate-400">
                # 1. Verified JWT Claims (Derived purely from token signature)
              </div>
              <div className="text-sky-300">
                {activeSimTenant === 'apex'
                  ? '{ userId: "usr_apex_admin", tenantId: "apex-defense-uuid", role: "ADMIN" }'
                  : '{ userId: "usr_sentinel_admin", tenantId: "sentinel-cyber-uuid", role: "ADMIN" }'}
              </div>

              <div className="text-slate-400 pt-2">
                # 2. Scoped Database Query (Zero reliance on client params)
              </div>
              <div className="text-emerald-300">
                {activeSimTenant === 'apex'
                  ? 'SELECT * FROM campaigns WHERE tenant_id = \'apex-defense-uuid\' AND status = \'ACTIVE\';'
                  : 'SELECT * FROM campaigns WHERE tenant_id = \'sentinel-cyber-uuid\' AND status = \'ACTIVE\';'}
              </div>

              <div className="text-slate-400 pt-2">
                # 3. Cross-Tenant Attempt: Requesting other tenant\'s campaign ID 201
              </div>
              <div className="text-rose-400">
                {activeSimTenant === 'apex'
                  ? 'GET /api/campaigns/sentinel-201 -> 404 NOT FOUND (Anti-Enumeration Guard)'
                  : 'GET /api/campaigns/apex-101 -> 404 NOT FOUND (Anti-Enumeration Guard)'}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/login">
              <Button size="md" className="bg-sky-600 hover:bg-sky-500 font-semibold px-6">
                Test In Security Portal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#06090E] py-8 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Deep Trace Cybernetics. All rights reserved.</div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            All Tenant Defenses Operational
          </div>
        </div>
      </footer>
    </div>
  );
}
