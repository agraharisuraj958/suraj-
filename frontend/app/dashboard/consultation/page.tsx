"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Video, VideoOff, PhoneMissed, Activity, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function TelehealthConsultation() {
    const [isRecording, setIsRecording] = useState(true);
    const [transcription, setTranscription] = useState("Patient reports onset of migraine symptoms roughly 4 hours ago, accompanied by photophobia. Denies nausea. Currently taking...");

    // Mocking the AI typing out the SOAP note dynamically
    useEffect(() => {
        if (!isRecording) return;
        const timer = setInterval(() => {
            setTranscription(prev => prev + (Math.random() > 0.5 ? " OTC medication." : " resting."));
        }, 3000);
        return () => clearInterval(timer);
    }, [isRecording]);

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans flex flex-col pl-64">

            {/* Editorial Header */}
            <header className="h-20 px-8 flex items-center justify-between border-b border-border bg-surface shrink-0">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="text-text-muted hover:text-text-main transition-colors">
                        <ArrowLeft size={20} strokeWidth={1.5} />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-text-main uppercase tracking-widest">Active Consultation</h1>
                        <p className="text-xs font-medium text-[var(--color-accent)] mt-0.5">Jakub Tucker • 42 yrs • Follow-up</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)]">04:22</span>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">

                {/* Left Area: Video Feed */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex-1 p-8 flex flex-col"
                >
                    <div className="flex-1 bg-surface border border-border rounded-sm relative overflow-hidden flex flex-col items-center justify-center group">
                        {/* Mock Patient Video Feed */}
                        <div className="absolute inset-0 bg-[var(--color-background)] flex items-center justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Video Feed Active</span>
                        </div>

                        {/* Doctor Picture-in-Picture */}
                        <div className="absolute top-6 right-6 w-48 h-32 bg-surface border border-border rounded-sm shadow-sm flex items-center justify-center z-10">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Self View</span>
                        </div>

                        {/* Video Controls */}
                        <div className="absolute bottom-8 flex items-center gap-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-12 h-12 rounded-sm bg-surface border border-border flex items-center justify-center text-text-main hover:border-[var(--color-primary)] transition-colors">
                                <Mic size={20} strokeWidth={1.5} />
                            </button>
                            <button className="w-12 h-12 rounded-sm bg-surface border border-border flex items-center justify-center text-text-main hover:border-[var(--color-primary)] transition-colors">
                                <Video size={20} strokeWidth={1.5} />
                            </button>
                            <button className="px-6 h-12 rounded-sm bg-[var(--color-accent)] text-surface text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#C2583D] transition-colors">
                                <PhoneMissed size={16} strokeWidth={1.5} /> End Call
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Right Area: Ambient Scribe */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="w-[450px] border-l border-border bg-surface flex flex-col shrink-0"
                >
                    <div className="p-8 border-b border-border bg-[var(--color-background)]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-2">
                                <Activity size={18} strokeWidth={1.5} /> Ambient Scribe
                            </h2>
                            <button
                                onClick={() => setIsRecording(!isRecording)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-colors",
                                    isRecording ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[#FDF2EF]" : "border-border text-text-muted hover:border-text-main"
                                )}
                            >
                                {isRecording ? "Listening..." : "Paused"}
                            </button>
                        </div>

                        {/* Minimalist Animated Waveform */}
                        {isRecording && (
                            <div className="flex items-end gap-1 h-8 opacity-70">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: ["20%", "100%", "20%"] }}
                                        transition={{ duration: Math.random() * 0.5 + 0.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="flex-1 bg-[var(--color-accent)] rounded-t-sm"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 border-b border-border pb-2">Subjective</h3>
                            <p className="text-sm font-medium text-text-main leading-relaxed">
                                {transcription}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 border-b border-border pb-2">Objective</h3>
                            <p className="text-sm font-medium text-text-main leading-relaxed opacity-50 italic">
                                AI awaiting clinical measurements...
                            </p>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 border-b border-border pb-2">Assessment & Plan</h3>
                            <p className="text-sm font-medium text-text-main leading-relaxed opacity-50 italic">
                                AI synthesizing ongoing consultation...
                            </p>
                        </div>
                    </div>

                    <div className="p-8 border-t border-border">
                        <button className="w-full bg-[var(--color-primary)] text-surface py-4 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2">
                            <Check size={16} strokeWidth={2} /> Finalize SOAP Note
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}