import Link from "next/link";
import { ArrowRight, Sparkles, Calendar, FileText, Stethoscope, Shield, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-text-main font-sans selection:bg-[var(--color-primary-light)] selection:text-[var(--color-primary)]">
      {/* Editorial Navigation */}
      <nav className="h-24 px-8 md:px-16 flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-widest uppercase text-[var(--color-primary)]">
            MediMind
          </span>
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mb-1" />
        </Link>

        <div className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-text-muted">
          <Link href="/dashboard" className="hover:text-text-main transition-colors">
            Portal Overview
          </Link>
          <Link href="/dashboard/symptoms" className="hover:text-text-main transition-colors">
            AI Triage
          </Link>
          <Link href="/dashboard/appointments" className="hover:text-text-main transition-colors">
            Specialist Booking
          </Link>
          <Link href="/dashboard/analyzer" className="hover:text-text-main transition-colors">
            Lab Diagnostics
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main transition-colors px-4 py-2.5"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-colors flex items-center gap-2 shadow-sm"
          >
            Launch Portal <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest rounded-sm border border-[var(--color-primary)]/10">
            <Sparkles size={14} />
            Next-Generation Clinical Architecture
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-text-main tracking-tight leading-[1.08]">
            Intelligent routing. <br />
            Bespoke patient care.
          </h1>

          <p className="text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed font-normal">
            A state-of-the-art clinic management system uniting clinical triage, specialist scheduling, automated biomarker analysis, and guideline-driven AI assistance.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              Enter Patient Dashboard <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard/doctor"
              className="bg-surface hover:bg-[var(--color-background)] border border-border text-text-main px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-3"
            >
              Clinician Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="border-t border-border bg-surface py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Core Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main mt-2">
                Designed for precision and clinical clarity.
              </h2>
            </div>
            <p className="text-sm text-text-muted max-w-md">
              Every workflow has been crafted to minimize friction between symptoms, diagnosis, and treatment plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <Link
              href="/dashboard/symptoms"
              className="group p-8 bg-[var(--color-background)] border border-border rounded-sm hover:border-[var(--color-primary)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-sm bg-surface flex items-center justify-center text-[var(--color-primary)] border border-border group-hover:bg-[var(--color-primary)] group-hover:text-surface transition-colors">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-lg font-bold text-text-main">AI Triage Concierge</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Real-time symptom analysis with automated clinical risk level calculation and triage.
                </p>
              </div>
              <div className="pt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Try Triage <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              href="/dashboard/appointments"
              className="group p-8 bg-[var(--color-background)] border border-border rounded-sm hover:border-[var(--color-primary)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-sm bg-surface flex items-center justify-center text-[var(--color-primary)] border border-border group-hover:bg-[var(--color-primary)] group-hover:text-surface transition-colors">
                  <Calendar size={20} />
                </div>
                <h3 className="text-lg font-bold text-text-main">Specialist Booking</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Natural language calendar matching with cardiology, neurology, and internal medicine.
                </p>
              </div>
              <div className="pt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Book Visit <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              href="/dashboard/analyzer"
              className="group p-8 bg-[var(--color-background)] border border-border rounded-sm hover:border-[var(--color-primary)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-sm bg-surface flex items-center justify-center text-[var(--color-primary)] border border-border group-hover:bg-[var(--color-primary)] group-hover:text-surface transition-colors">
                  <FileText size={20} />
                </div>
                <h3 className="text-lg font-bold text-text-main">Lab Diagnostics</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Upload reports for automated biomarker breakdown, out-of-range flags, and summaries.
                </p>
              </div>
              <div className="pt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Analyze Labs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4 */}
            <Link
              href="/dashboard/knowledge"
              className="group p-8 bg-[var(--color-background)] border border-border rounded-sm hover:border-[var(--color-primary)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-sm bg-surface flex items-center justify-center text-[var(--color-primary)] border border-border group-hover:bg-[var(--color-primary)] group-hover:text-surface transition-colors">
                  <Stethoscope size={20} />
                </div>
                <h3 className="text-lg font-bold text-text-main">Clinical Research RAG</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Live indexing of ACC/AHA cholesterol guidelines and clinical standards with citation verification.
                </p>
              </div>
              <div className="pt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Explore Guidelines <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-[var(--color-background)] py-12 px-8 md:px-16 text-sm text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold uppercase tracking-widest text-[var(--color-primary)]">MediMind</span>
            <span>•</span>
            <span>Boutique AI Health Systems</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-status-success-text)]">
            <CheckCircle size={14} /> All Systems Operational
          </div>
          <div className="text-xs">
            © 2026 MediMind Health Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
