import Link from "next/link";
import { Search, User, ArrowRight, Sparkles, Calendar, FileText, Check } from "lucide-react";

export default function PatientDashboard() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans selection:bg-[var(--color-primary-light)] selection:text-[var(--color-primary)]">
            {/* Top Navigation */}
            <nav className="h-20 px-8 flex items-center justify-between border-b border-border bg-surface sticky top-0 z-30">
                <div className="flex items-center gap-10">
                    <span className="text-sm font-bold uppercase tracking-widest text-text-main">
                        Patient Portal
                    </span>
                    <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-text-muted">
                        <Link href="/dashboard" className="text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1">
                            Overview
                        </Link>
                        <Link href="/dashboard/appointments" className="hover:text-text-main transition-colors">
                            Appointments
                        </Link>
                        <Link href="/dashboard/analyzer" className="hover:text-text-main transition-colors">
                            Lab Records
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">
                            AM
                        </div>
                        <span className="text-sm font-medium text-text-main">Alex Mercer</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-8 space-y-12">
                {/* Header Section */}
                <header className="flex justify-between items-end border-b border-border pb-8">
                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Tuesday, Nov 10</p>
                        <h2 className="text-4xl md:text-5xl font-serif text-text-main tracking-tight">
                            Good morning, Alex.
                        </h2>
                    </div>
                    <Link
                        href="/dashboard/symptoms"
                        className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] hover:text-text-main transition-colors"
                    >
                        Emergency Triage <ArrowRight size={14} />
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* The AI Symptom Checker - Concierge card */}
                        <div className="bg-surface border border-border p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 rounded-sm">
                            <div className="space-y-4 max-w-lg">
                                <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
                                    <Sparkles size={16} />
                                    <span>AI Triage Concierge</span>
                                </div>
                                <h3 className="text-2xl text-text-main font-medium leading-snug">
                                    Describe your symptoms to receive immediate clinical guidance and specialist routing.
                                </h3>
                            </div>
                            <Link href="/dashboard/symptoms" className="shrink-0 w-full md:w-auto">
                                <button className="w-full md:w-auto bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm shadow-sm">
                                    Start Assessment
                                </button>
                            </Link>
                        </div>

                        {/* Upcoming Appointments List */}
                        <div>
                            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-text-main">
                                    Scheduled Visits
                                </h4>
                                <Link
                                    href="/dashboard/appointments"
                                    className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                >
                                    Book New <ArrowRight size={12} />
                                </Link>
                            </div>

                            <div className="bg-surface border border-border rounded-sm">
                                <Link
                                    href="/dashboard/appointments"
                                    className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-[var(--color-background)] transition-colors cursor-pointer group block"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-sm flex items-center justify-center font-serif text-2xl font-bold">
                                            SJ
                                        </div>
                                        <div>
                                            <h5 className="text-lg font-medium text-text-main group-hover:text-[var(--color-primary)] transition-colors">
                                                Dr. Sarah Jenkins
                                            </h5>
                                            <p className="text-sm text-text-muted mt-1">Cardiology • Initial Consultation</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-1">
                                        <div className="flex items-center gap-2 text-text-main font-medium text-sm">
                                            <Calendar size={16} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                                            Nov 10, 2026
                                        </div>
                                        <span className="text-xs text-text-muted font-bold uppercase tracking-wider">09:00 AM - 09:30 AM</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar Column */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Quick Actions */}
                        <div className="bg-[var(--color-primary)] text-surface border border-[var(--color-primary)] p-8 rounded-sm">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-light)] mb-6">
                                Quick Actions
                            </h4>
                            <div className="space-y-3">
                                <Link
                                    href="/dashboard/appointments"
                                    className="w-full flex items-center justify-between p-4 border border-surface/20 rounded-sm hover:bg-surface hover:text-[var(--color-primary)] transition-all group"
                                >
                                    <span className="font-medium text-sm">Book Specialist Visit</span>
                                    <ArrowRight size={16} className="opacity-50 group-hover:opacity-100" />
                                </Link>
                                <Link
                                    href="/dashboard/analyzer"
                                    className="w-full flex items-center justify-between p-4 border border-surface/20 rounded-sm hover:bg-surface hover:text-[var(--color-primary)] transition-all group"
                                >
                                    <span className="font-medium text-sm">Upload Lab Report</span>
                                    <ArrowRight size={16} className="opacity-50 group-hover:opacity-100" />
                                </Link>
                                <Link
                                    href="/dashboard/symptoms"
                                    className="w-full flex items-center justify-between p-4 border border-surface/20 rounded-sm hover:bg-surface hover:text-[var(--color-primary)] transition-all group"
                                >
                                    <span className="font-medium text-sm">Check New Symptoms</span>
                                    <ArrowRight size={16} className="opacity-50 group-hover:opacity-100" />
                                </Link>
                            </div>
                        </div>

                        {/* Recent Records */}
                        <div>
                            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-text-main">
                                    Recent Records
                                </h4>
                                <Link
                                    href="/dashboard/analyzer"
                                    className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline"
                                >
                                    View All
                                </Link>
                            </div>
                            <div className="space-y-4">
                                <Link
                                    href="/dashboard/analyzer"
                                    className="flex items-start gap-4 p-4 bg-surface border border-border hover:border-text-muted transition-colors rounded-sm cursor-pointer block"
                                >
                                    <div className="mt-0.5 text-[var(--color-primary)]">
                                        <FileText size={20} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-text-main text-sm">Comprehensive Metabolic Panel</h5>
                                        <p className="text-xs text-text-muted mt-1">Processed Nov 08</p>
                                        <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                            <Check size={12} strokeWidth={2} /> Normal
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    href="/dashboard/analyzer"
                                    className="flex items-start gap-4 p-4 bg-surface border border-border hover:border-text-muted transition-colors rounded-sm cursor-pointer block"
                                >
                                    <div className="mt-0.5 text-[var(--color-accent)]">
                                        <FileText size={20} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-text-main text-sm">Lipid Profile & Glucose</h5>
                                        <p className="text-xs text-text-muted mt-1">Dr. Marcus Webb</p>
                                        <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                                            Follow-Up Needed
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
