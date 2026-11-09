"use client";

import { useState } from "react";
import { Send, FileText, X, BookOpen, ArrowRight, Sparkles, Search } from "lucide-react";
import { clsx } from "clsx";

interface Citation {
    id: string;
    doc: string;
    page: number;
    excerpt: string;
}

interface Message {
    id: string;
    role: "user" | "ai";
    text: string;
    citations?: Citation[];
}

export default function KnowledgeAssistant() {
    const [activeCitation, setActiveCitation] = useState<null | Citation>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "user",
            text: "What are the latest ACC/AHA guidelines for managing statin intolerance in patients with high ASCVD risk?"
        },
        {
            id: "2",
            role: "ai",
            text: "According to the latest ACC/AHA guidelines, management of statin intolerance in high-risk ASCVD patients involves a systematic approach. First, discontinue the statin until symptoms resolve, then rechallenge with a different statin or lower dose. If intolerance is confirmed, non-statin therapies such as Ezetimibe or PCSK9 inhibitors are recommended to achieve LDL-C lowering goals.",
            citations: [
                { id: "c1", doc: "ACC/AHA Blood Cholesterol Guidelines 2025", page: 42, excerpt: "In patients with severe statin intolerance and high ASCVD risk, the addition of non-statin therapies (e.g., ezetimibe, PCSK9 inhibitors) is indicated class I recommendation." }
            ]
        }
    ]);

    const handleSearch = () => {
        if (!searchQuery.trim() || isSearching) return;
        const queryText = searchQuery;
        setSearchQuery("");

        const newMsgId = Date.now().toString();
        setMessages(prev => [...prev, { id: newMsgId, role: "user", text: queryText }]);
        setIsSearching(true);

        setTimeout(() => {
            let aiResponse = "Based on indexed literature and consensus statements, primary interventions prioritize lifestyle modification alongside baseline biomarker evaluation before titration of pharmacological agents.";
            let citation: Citation = {
                id: `c-${Date.now()}`,
                doc: "Clinical Practice Guidelines Compendium 2026",
                page: 18,
                excerpt: "Initial management should confirm diagnosis through repeated measurements and rule out secondary causes prior to establishing maintenance regimens."
            };

            const q = queryText.toLowerCase();
            if (q.includes("diabetes") || q.includes("glucose") || q.includes("hba1c")) {
                aiResponse = "Per ADA Standards of Care 2026, first-line therapy for type 2 diabetes remains Metformin and comprehensive lifestyle management, combined with SGLT2 inhibitors or GLP-1 RAs in patients with established ASCVD, heart failure, or CKD.";
                citation = {
                    id: `c-${Date.now()}`,
                    doc: "Standards of Medical Care in Diabetes 2026",
                    page: 64,
                    excerpt: "In adults with T2D and high cardiovascular risk, SGLT2 inhibitors or GLP-1 RAs with proven CVD benefit are recommended independent of baseline A1C."
                };
            } else if (q.includes("hypertension") || q.includes("blood pressure") || q.includes("bp")) {
                aiResponse = "Under current ACC/AHA Hypertension Protocols, Stage 1 HTN (130-139 / 80-89 mmHg) with an estimated 10-year ASCVD risk ≥10% warrants prompt initiation of first-line antihypertensive medication (thiazide diuretic, CCB, or ACEi/ARB).";
                citation = {
                    id: `c-${Date.now()}`,
                    doc: "ACC/AHA High Blood Pressure Clinical Practice Guideline",
                    page: 29,
                    excerpt: "Simultaneous initiation of two first-line agents of different classes is recommended for Stage 2 HTN with average BP >20/10 mmHg above goal."
                };
            }

            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    text: aiResponse,
                    citations: [citation]
                }
            ]);
            setIsSearching(false);
        }, 1200);
    };

    return (
        <div className="flex h-screen bg-[var(--color-background)] font-sans overflow-hidden">
            {/* Main Transcript Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 px-8 flex items-center justify-between border-b border-border bg-surface shrink-0">
                    <div className="flex items-center gap-4">
                        <BookOpen size={20} className="text-[var(--color-primary)]" strokeWidth={1.5} />
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-text-main">Clinical Research Assistant</h1>
                            <p className="text-xs text-text-muted">Indexed clinical guidelines with verified RAG citations</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-status-success-text)] bg-[var(--color-status-success-bg)] px-3 py-1 rounded-sm border border-[var(--color-primary)]/10">
                        Vector DB Active
                    </span>
                </header>

                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    <div className="max-w-3xl mx-auto space-y-10">
                        {messages.map((msg) => (
                            <div key={msg.id} className="space-y-4">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2 border-b border-border pb-2">
                                    {msg.role === "user" ? "Physician Query" : "AI Evidence-Based Synthesis"}
                                </div>

                                <div className={clsx(
                                    "text-lg leading-relaxed",
                                    msg.role === "user" ? "font-bold text-text-main" : "font-medium text-text-main"
                                )}>
                                    {msg.text}
                                </div>

                                {/* Citations */}
                                {msg.citations && (
                                    <div className="flex flex-wrap gap-3 pt-3">
                                        {msg.citations.map((cite) => (
                                            <button
                                                key={cite.id}
                                                type="button"
                                                onClick={() => setActiveCitation(cite)}
                                                className={clsx(
                                                    "inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer",
                                                    activeCitation?.id === cite.id
                                                        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-surface shadow-sm"
                                                        : "border-border bg-surface text-text-main hover:border-[var(--color-primary)] hover:bg-[var(--color-background)]"
                                                )}
                                            >
                                                <FileText size={14} />
                                                <span>{cite.doc} (Pg {cite.page})</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Searching Indicator */}
                        {isSearching && (
                            <div className="space-y-3 pt-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] flex items-center gap-2">
                                    <Sparkles size={14} className="animate-spin" />
                                    Retrieving relevant guideline excerpts...
                                </div>
                                <div className="h-10 bg-surface border border-border rounded-sm animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6 md:p-8 bg-surface border-t border-border shrink-0">
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="E.g., 'Hypertension Stage 2 initiation criteria' or 'Metformin contraindications'..."
                                className="w-full border border-border bg-[var(--color-background)] pl-12 pr-6 py-4 text-sm md:text-base font-medium text-text-main placeholder:text-text-muted focus:outline-none focus:border-[var(--color-primary)] rounded-sm transition-colors"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            disabled={!searchQuery.trim() || isSearching}
                            className="h-[54px] px-8 bg-[var(--color-primary)] text-surface text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shrink-0 shadow-sm"
                        >
                            <span>Query</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Citation Document Panel */}
            {activeCitation && (
                <div className="w-[420px] lg:w-[480px] bg-surface border-l border-border flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
                    <div className="h-20 flex items-center justify-between px-8 border-b border-border bg-[var(--color-background)]">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                            Verified Citation
                        </span>
                        <button
                            type="button"
                            onClick={() => setActiveCitation(null)}
                            className="text-text-muted hover:text-text-main transition-colors p-1"
                        >
                            <X size={20} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold leading-tight text-text-main">
                                {activeCitation.doc}
                            </h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] mt-2">
                                Page Reference: {activeCitation.page}
                            </p>
                        </div>

                        <div className="border-l-2 border-[var(--color-primary)] pl-6 py-2 bg-[var(--color-background)] rounded-r-sm p-4">
                            <p className="text-base font-serif italic leading-relaxed text-text-main">
                                "{activeCitation.excerpt}"
                            </p>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-border">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                                Document Index Metadata
                            </span>
                            <p className="text-xs text-text-muted">
                                Source: MediMind Vector Store • Cosine Similarity: 0.94 • Verified Guideline
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveCitation(null)}
                            className="w-full mt-6 bg-[var(--color-primary)] text-surface py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-hover)] transition-colors"
                        >
                            Close Drawer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
