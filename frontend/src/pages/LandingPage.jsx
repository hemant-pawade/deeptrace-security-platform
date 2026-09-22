import React from 'react';
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
} from 'lucide-react';
import { Cyber3DScene } from '../components/common/Cyber3DScene';
import { Button } from '../components/common/Button';

export function LandingPage() {
  const capabilities = [
    {
      icon: Shield,
      title: 'Zero-Trust Tenant Isolation',
      desc: 'Shared-database architecture with mathematical query-scoping. Cross-tenant access strictly returns 404 Anti-Enumeration with zero data leakage.',
      tag: 'CORE SECURITY',
    },
    {
      icon: Layers,
      title: 'Campaign State Machine',
      desc: 'Deterministic lifecycle transitions (DRAFT -> ACTIVE -> COMPLETED). Illegal status tampering is blocked at the gateway with 409 Conflict.',
      tag: 'WORKFLOW ENGINE',
    },
    {
      icon: Activity,
      title: 'Real-Time Threat Radar',
      desc: 'Live telemetry classification across CRITICAL, HIGH, MEDIUM, and LOW severity threats with real-time incident resolution workflows.',
      tag: 'TELEMETRY',
    },
    {
      icon: Terminal,
      title: 'Tamper-Evident Audit Ledger',
      desc: 'Cryptographic non-repudiation logging for all administrative events, user provisioning, access revocations, and campaign mutations.',
      tag: 'COMPLIANCE',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06090E] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-sky-500 selection:text-white">
      {/* 3D Background Canvas */}
      <Cyber3DScene />

      {/* Subtle Scanline / Cyber Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      {/* Top Navigation */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/40 backdrop-blur-md bg-[#06090E]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-950/50">
            <Shield className="w-6 h-6" />
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
          <a href="#isolation" className="hover:text-sky-400 transition-colors">
            Tenant Isolation
          </a>
          <a href="#metrics" className="hover:text-sky-400 transition-colors">
            Telemetry
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button size="sm" className="bg-sky-600 hover:bg-sky-500 text-xs font-semibold px-4">
              Access Console <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono mb-8 backdrop-blur-md shadow-lg shadow-sky-950/40">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          NEXT-GEN MULTI-TENANT DEFENSE PLATFORM • v2.4 LIVE
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Unified Security Operations &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">
            Tenant Isolation
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed font-normal">
          Enterprise cyber-defense infrastructure designed for defense contractors and MSSPs.
          Featuring cryptographic RBAC, threat campaign lifecycle automation, and verified zero-trust multi-tenancy.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link to="/login">
            <Button
              size="lg"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 shadow-xl shadow-sky-500/20 text-sm"
            >
              Launch Operations Console <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <a href="#features">
            <Button
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 text-sm px-6"
            >
              Explore Architecture
            </Button>
          </a>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div id="metrics" className="mt-16 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-[#090D16]/80 border border-slate-800 backdrop-blur-md">
            <div className="text-2xl font-bold font-mono text-sky-400">100%</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Tenant Isolation</div>
          </div>
          <div className="p-4 rounded-xl bg-[#090D16]/80 border border-slate-800 backdrop-blur-md">
            <div className="text-2xl font-bold font-mono text-emerald-400">0.00%</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Cross-Data Leakage</div>
          </div>
          <div className="p-4 rounded-xl bg-[#090D16]/80 border border-slate-800 backdrop-blur-md">
            <div className="text-2xl font-bold font-mono text-amber-400">4-Stage</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Campaign State Machine</div>
          </div>
          <div className="p-4 rounded-xl bg-[#090D16]/80 border border-slate-800 backdrop-blur-md">
            <div className="text-2xl font-bold font-mono text-indigo-400">Immutable</div>
            <div className="text-[11px] text-slate-400 uppercase font-mono mt-1">Audit Ledger</div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="features" className="relative z-10 max-w-7xl w-full mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-2">
            Defense Capabilities
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Engineered for High-Assurance Security Operations
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Every layer from the API gateway to database queries is bound by strict zero-trust principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-[#0B0F17]/90 border border-slate-800/90 hover:border-sky-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sky-950/30 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-sky-400/90 font-semibold tracking-wider">
                    {c.tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tenant Isolation Explanation Section */}
      <section id="isolation" className="relative z-10 max-w-5xl w-full mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="bg-[#111726]/90 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-semibold">
              Mandatory Security Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2 mb-4">
              Cryptographically Guarded Multi-Tenancy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              When an operative from <strong>Tenant A (Apex Defense)</strong> makes an API call, their identity and tenant binding are derived exclusively from verified JWT cryptographic signatures. Client-supplied tenant IDs are completely discarded.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#080C14] border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-white">GET /api/campaigns/201</strong> by Tenant A &rarr; <span className="text-rose-400 font-bold">404 Not Found</span> (Anti-Enumeration)
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#080C14] border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-white">DELETE /api/users/:id</strong> by USER role &rarr; <span className="text-amber-400 font-bold">403 Forbidden</span> (Strict RBAC)
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#080C14] border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-white">COMPLETED &rarr; DRAFT</strong> transition &rarr; <span className="text-rose-400 font-bold">409 Conflict</span> (Deterministic State)
                </span>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/login">
                <Button size="md" className="bg-sky-600 hover:bg-sky-500 font-semibold">
                  Test Credentials in Security Portal <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#06090E] py-8 text-center text-xs text-slate-500 font-mono">
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
