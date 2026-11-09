"use client";

import { useState } from "react";
import { Send, AlertTriangle, User, Sparkles, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface Message {
    id: string;
    role: "user" | "ai";
    text?: string;
    isCard?: boolean;
    department?: string;
    urgency?: "Low" | "Medium" | "High";
}

export default function SymptomChecker() {
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            text: "Welcome to the MediMind Triage Concierge. Please describe your symptoms, including duration and severity, so we may direct you to the appropriate care.",
        },
    ]);

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text: input }]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    isCard: true,
                    text: "Based on your description of chest discomfort and shortness of breath, a comprehensive clinical evaluation is highly recommended.",
                    department: "Cardiology",
                    urgency: "High",
                },
            ]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans flex flex-col">

            {/* Editorial Header */}
            <header className="bg-surface border-b border-border p-8 shrink-0">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main mb-6 transition-colors">
                            <ArrowLeft size={16} /> Back to Overview
                        </Link>
                        <h1 className="text-4xl font-serif text-text-main tracking-tight">Symptom Assessment</h1>
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                        AI Triage Concierge
                    </div>
                </div>
            </header>

            {/* Disclaimer */}
            <div className="bg-[var(--color-status-warning-bg)] border-b border-[#F9DED6]">
                <div className="max-w-4xl mx-auto p-4 flex items-start gap-4">
                    <AlertTriangle size={18} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-[var(--color-accent)] leading-relaxed">
                        <span className="font-bold uppercase tracking-wider mr-2">Disclaimer:</span>
                        This assessment is for preliminary routing only and does not constitute a medical diagnosis. In emergencies, contact local services immediately.
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-8 pb-10">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={clsx(
                                "flex gap-6",
                                msg.role === "user" ? "flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className={clsx(
                                "w-12 h-12 rounded-sm flex items-center justify-center shrink-0 border",
                                msg.role === "user"
                                    ? "bg-[var(--color-primary)] text-surface border-[var(--color-primary)]"
                                    : "bg-surface text-[var(--color-primary)] border-border"
                            )}>
                                {msg.role === "user" ? <User size={20} strokeWidth={1.5} /> : <Sparkles size={20} strokeWidth={1.5} />}
                            </div>

                            {/* Message Block */}
                            {msg.isCard ? (
                                <div className="bg-surface border border-border rounded-sm w-full md:w-3/4">
                                    <div className="p-6 md:p-8 border-b border-border">
                                        <p className="text-lg font-serif text-text-main leading-relaxed">{msg.text}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border bg-[var(--color-background)]">
                                        <div className="p-6">
                                            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-2">Recommended Dept</span>
                                            <span className="text-xl font-medium text-text-main">{msg.department}</span>
                                        </div>
                                        <div className="p-6">
                                            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold block mb-2">Triage Urgency</span>
                                            <span className={clsx(
                                                "inline-flex px-2 py-1 rounded-sm text-xs font-bold uppercase tracking-widest",
                                                msg.urgency === "High" ? "bg-[#FDE8E8] text-[#9B1C1C]" :
                                                    msg.urgency === "Medium" ? "bg-[var(--color-status-warning-bg)] text-[var(--color-accent)]" :
                                                        "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]"
                                            )}>
                                                {msg.urgency}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 border-t border-border">
                                        <Link href="/dashboard/appointments" className="block w-full">
                                            <button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface py-4 text-sm font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-3">
                                                <Calendar size={18} /> Schedule Appointment
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className={clsx(
                                    "p-6 rounded-sm text-base leading-relaxed w-full md:w-3/4 border",
                                    msg.role === "user"
                                        ? "bg-[var(--color-background)] text-text-main border-border"
                                        : "bg-surface text-text-main border-border"
                                )}>
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-sm bg-surface border border-border text-[var(--color-primary)] flex items-center justify-center shrink-0">
                                <Sparkles size={20} strokeWidth={1.5} />
                            </div>
                            <div className="p-6 rounded-sm bg-surface border border-border flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-surface border-t border-border p-6 md:p-8 shrink-0">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Describe your condition..."
                        className="flex-1 min-h-[56px] max-h-32 bg-[var(--color-background)] border border-border px-6 py-4 text-base text-text-main placeholder:text-text-muted focus:outline-none focus:border-[var(--color-primary)] rounded-sm resize-y transition-colors"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="shrink-0 h-[56px] px-8 bg-[var(--color-primary)] text-surface text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}