"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, MicOff, Activity, AlertTriangle, Pill,
    Check, ArrowLeft, Plus, FileText, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function ConsultationRoom() {
    const [isListening, setIsListening] = useState(false);
    const [prescribingMed, setPrescribingMed] = useState("");
    const [showInteractionWarning, setShowInteractionWarning] = useState(false);

    // Simulated AI Scribe Transcription
    const [subjective, setSubjective] = useState("Patient reports chronic migraines, onset 4 hours ago. Photophobia present.");

    useEffect(() => {
        if (!isListening) return;
        const timer = setInterval(() => {
            setSubjective(prev => prev + " OTC ibuprofen provided no relief.");
        }, 4000);
        return () => clearInterval(timer);
    }, [isListening]);

    // Simulated Smart Pharmacy Interaction Check
    useEffect(() => {
        if (prescribingMed.toLowerCase().includes("clarithromycin")) {
            setShowInteractionWarning(true);
        } else {
            setShowInteractionWarning(false);
        }
    }, [prescribingMed]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans pl-64 flex flex-col">

            {/* Consultation Header */}
            <header className="h-20 px-8 flex items-center justify-between border-b border-border bg-surface shrink-0">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/doctor" className="text-text-muted hover:text-text-main transition-colors">
                        <ArrowLeft size={20} strokeWidth={1.5} />
                    </Link>
                    <div className="flex items-center gap-4 border-l border-border pl-6">
                        <div className="w-10 h-10 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-sm flex items-center justify-center font-bold text-lg">
                            JT
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-text-main leading-none">Jakub Tucker</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-1">42 Yrs • Male • DOB: 12 Oct 1984</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-sm bg-[var(--color-background)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-status-success-text)] animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-main">Visit Active: 12:45</span>
                    </div>
                    <button className="bg-[var(--color-primary)] text-surface px-6 h-9 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-hover)] transition-colors">
                        End Encounter
                    </button>
                </div>
            </header>

            <main className="flex-1 w-full p-8 overflow-hidden">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="h-full grid grid-cols-1 lg:grid-cols-12 gap-8"
                >

                    {/* LEFT COLUMN: Patient Context & Vitals */}
                    <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6 flex flex-col overflow-y-auto pr-2">
                        <div className="bg-surface border border-border rounded-sm p-6">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 border-b border-border pb-2">Current Vitals</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">BP</span>
                                    <span className="text-lg font-bold text-text-main">128/82</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">HR</span>
                                    <span className="text-lg font-bold text-text-main">72 bpm</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">Temp</span>
                                    <span className="text-lg font-bold text-text-main">98.6°F</span>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">SpO2</span>
                                    <span className="text-lg font-bold text-text-main">99%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface border border-border rounded-sm p-6 flex-1">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 border-b border-border pb-2">Active Medications</h2>
                            <ul className="space-y-3">
                                <li className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-text-main">Atorvastatin</p>
                                        <p className="text-xs font-medium text-text-muted">20mg • Once daily</p>
                                    </div>
                                    <Pill size={16} className="text-text-muted mt-0.5" strokeWidth={1.5} />
                                </li>
                                <li className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-text-main">Lisinopril</p>
                                        <p className="text-xs font-medium text-text-muted">10mg • Once daily</p>
                                    </div>
                                    <Pill size={16} className="text-text-muted mt-0.5" strokeWidth={1.5} />
                                </li>
                            </ul>

                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-8 mb-4 border-b border-border pb-2">Allergies</h2>
                            <div className="inline-flex px-2 py-1 bg-[#FDF2EF] border border-[#F9DED6] text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                Penicillin
                            </div>
                        </div>
                    </motion.div>

                    {/* MIDDLE COLUMN: Ambient Scribe & SOAP Note */}
                    <motion.div variants={itemVariants} className="lg:col-span-6 bg-surface border border-border rounded-sm flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-border bg-[var(--color-background)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity size={20} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                                <h2 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest">Ambient Scribe</h2>
                            </div>
                            <button
                                onClick={() => setIsListening(!isListening)}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-colors",
                                    isListening
                                        ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-surface"
                                        : "bg-surface border-border text-text-main hover:border-[var(--color-primary)]"
                                )}
                            >
                                {isListening ? <Mic size={14} /> : <MicOff size={14} />}
                                {isListening ? "Listening / Transcribing..." : "Start Scribe"}
                            </button>
                        </div>

                        {/* AI Waveform Animation */}
                        <AnimatePresence>
                            {isListening && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-[var(--color-primary-light)] border-b border-[var(--color-primary-light)] px-6 py-4 flex items-center justify-center gap-1 overflow-hidden"
                                >
                                    {[...Array(30)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: ["4px", "24px", "4px"] }}
                                            transition={{ duration: Math.random() * 0.5 + 0.5, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-1 bg-[var(--color-primary)] rounded-full opacity-50"
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Subjective */}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">Subjective</label>
                                <textarea
                                    value={subjective}
                                    onChange={(e) => setSubjective(e.target.value)}
                                    className="w-full min-h-[100px] border-none bg-transparent resize-none text-sm font-medium text-text-main focus:outline-none"
                                />
                            </div>

                            {/* Objective */}
                            <div className="border-t border-border pt-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block flex items-center justify-between">
                                    Objective
                                    <button className="text-[var(--color-primary)] hover:underline">Import Vitals</button>
                                </label>
                                <textarea
                                    defaultValue="BP 128/82, HR 72, Temp 98.6°F, SpO2 99%. Patient appears comfortable, no acute distress."
                                    className="w-full min-h-[80px] border-none bg-transparent resize-none text-sm font-medium text-text-main focus:outline-none"
                                />
                            </div>

                            {/* Assessment */}
                            <div className="border-t border-border pt-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block">Assessment</label>
                                <textarea
                                    defaultValue="1. Acute migraine without aura.&#10;2. Essential hypertension, well-controlled."
                                    className="w-full min-h-[60px] border-none bg-transparent resize-none text-sm font-medium text-text-main focus:outline-none"
                                />
                            </div>

                            {/* Plan */}
                            <div className="border-t border-border pt-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2 block flex items-center justify-between">
                                    Plan
                                    <button className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
                                        <Activity size={12} /> Generate AI Plan
                                    </button>
                                </label>
                                <textarea
                                    placeholder="AI awaiting assessment completion..."
                                    className="w-full min-h-[100px] border-none bg-transparent resize-none text-sm font-medium text-text-main focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t border-border bg-[var(--color-background)]">
                            <button className="w-full bg-[var(--color-primary)] text-surface py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2">
                                <Check size={16} strokeWidth={2} /> Sign & Lock Note
                            </button>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: Smart Pharmacy & Orders */}
                    <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6 flex flex-col">
                        <div className="bg-surface border border-border rounded-sm p-6 flex-1">
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 border-b border-border pb-2 flex items-center gap-2">
                                <Pill size={14} /> Smart e-Prescribe
                            </h2>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={prescribingMed}
                                    onChange={(e) => setPrescribingMed(e.target.value)}
                                    placeholder="Search medication..."
                                    className="w-full border border-border bg-[var(--color-background)] px-4 py-3 text-sm font-medium text-text-main rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                />

                                <AnimatePresence>
                                    {showInteractionWarning && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: "auto", y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className="bg-[#FDF2EF] border border-[#F9DED6] p-4 rounded-sm"
                                        >
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle size={18} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] mb-1">Major Interaction Detected</h4>
                                                    <p className="text-xs font-medium text-[var(--color-accent)] leading-relaxed">
                                                        <strong>Clarithromycin</strong> significantly increases the toxicity of <strong>Atorvastatin</strong> (Active Med) by decreasing its metabolism.
                                                        <br /><br />
                                                        <em>Recommendation: Consider Azithromycin or suspend Atorvastatin temporarily.</em>
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button className="w-full border border-border bg-surface text-text-main py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2">
                                    <Plus size={14} /> Add Prescription
                                </button>
                            </div>

                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mt-8 mb-4 border-b border-border pb-2 flex items-center gap-2">
                                <FileText size={14} /> Lab Orders
                            </h2>
                            <button className="w-full border border-border bg-[var(--color-background)] text-text-main py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:border-[var(--color-primary)] transition-colors flex items-center justify-between px-4 group">
                                Comprehensive Metabolic Panel
                                <ChevronRight size={14} className="opacity-50 group-hover:opacity-100" />
                            </button>
                        </div>
                    </motion.div>

                </motion.div>
            </main>
        </div>
    );
}