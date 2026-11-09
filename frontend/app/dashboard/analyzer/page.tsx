"use client";

import { useState } from "react";
import { UploadCloud, FileText, Check, AlertTriangle, ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function LabReportAnalyzer() {
    const [uploadState, setUploadState] = useState<"idle" | "analyzing" | "results">("idle");

    const mockAnalyze = () => {
        setUploadState("analyzing");
        setTimeout(() => setUploadState("results"), 2000);
    };

    const reset = () => setUploadState("idle");

    const labResults = [
        { test: "Hemoglobin", value: "14.2", unit: "g/dL", range: "13.8 - 17.2", status: "normal" },
        { test: "White Blood Cells", value: "5.8", unit: "10^9/L", range: "4.5 - 11.0", status: "normal" },
        { test: "LDL Cholesterol", value: "158", unit: "mg/dL", range: "< 100", status: "high" },
        { test: "Fasting Glucose", value: "112", unit: "mg/dL", range: "70 - 99", status: "elevated" },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans">

            {/* Editorial Header */}
            <header className="bg-surface border-b border-border p-8">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main mb-6 transition-colors">
                            <ArrowLeft size={16} /> Back to Overview
                        </Link>
                        <h1 className="text-4xl font-serif text-text-main tracking-tight">Lab Report Analyzer</h1>
                    </div>
                    {uploadState === "results" && (
                        <button
                            onClick={reset}
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-background)] border border-border rounded-sm text-xs font-bold uppercase tracking-widest hover:border-text-muted transition-colors"
                        >
                            <RefreshCcw size={16} /> New Upload
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-8 py-12">

                {/* IDLE STATE: Minimalist Drag & Drop */}
                {uploadState === "idle" && (
                    <div
                        onClick={mockAnalyze}
                        className="border border-border bg-surface rounded-sm p-24 text-center cursor-pointer transition-all hover:border-[var(--color-primary)] group"
                    >
                        <div className="w-16 h-16 mx-auto mb-8 text-text-muted group-hover:text-[var(--color-primary)] transition-colors">
                            <UploadCloud size={64} strokeWidth={1} />
                        </div>
                        <h3 className="text-3xl font-serif text-text-main mb-4">
                            Select or drop document
                        </h3>
                        <p className="text-sm font-medium text-text-muted uppercase tracking-widest mb-10">
                            PDF, JPG, PNG (Max 10MB)
                        </p>
                        <button className="border border-border px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-sm group-hover:bg-[var(--color-primary)] group-hover:text-surface group-hover:border-[var(--color-primary)] transition-all">
                            Browse Files
                        </button>
                    </div>
                )}

                {/* ANALYZING STATE */}
                {uploadState === "analyzing" && (
                    <div className="border border-border bg-surface rounded-sm p-32 flex flex-col items-center justify-center space-y-8">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-2 border-[var(--color-primary-light)] rounded-full" />
                            <div className="absolute inset-0 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl font-serif text-text-main">Extracting Diagnostics</h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Standardizing reference ranges...</p>
                        </div>
                    </div>
                )}

                {/* RESULTS STATE */}
                {uploadState === "results" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* AI Summary Blockquote Style */}
                        <div className="bg-[var(--color-primary)] text-surface p-10 md:p-12 rounded-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <FileText size={20} className="text-[var(--color-primary-light)]" />
                                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-light)]">
                                    Clinical Synthesis
                                </span>
                            </div>
                            <p className="text-xl font-serif leading-relaxed text-surface mb-8 max-w-3xl">
                                The results indicate standard red and white blood cell counts. However, there is a prominent elevation in the lipid profile (LDL at 158 mg/dL) and borderline fasting glucose (112 mg/dL). This combination suggests a potential metabolic risk factor.
                            </p>
                            <div className="border-t border-surface/20 pt-8">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-light)] mb-4">Suggested Actions</h4>
                                <ul className="text-sm font-medium space-y-2 list-none">
                                    <li className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full" />
                                        Discuss dietary modifications for cholesterol management.
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full" />
                                        Consider an HbA1c test to rule out pre-diabetes.
                                    </li>
                                </ul>
                                <div className="mt-8 pt-6 border-t border-surface/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <span className="text-xs text-[var(--color-primary-light)] font-medium">
                                        Elevated biomarkers require clinical consultation.
                                    </span>
                                    <Link
                                        href="/dashboard/appointments"
                                        className="inline-flex items-center gap-2 bg-surface text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors self-start sm:self-auto shrink-0 shadow-sm"
                                    >
                                        Schedule Specialist Review <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Editorial Data Table */}
                        <div>
                            <div className="flex items-center justify-between border-b-2 border-text-main pb-4 mb-6">
                                <h3 className="text-lg font-serif text-text-main">Extracted Biomarkers</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border bg-surface text-[10px] text-text-muted uppercase tracking-widest font-bold">
                                            <th className="py-4 px-4 w-1/3">Test Name</th>
                                            <th className="py-4 px-4">Result</th>
                                            <th className="py-4 px-4">Reference</th>
                                            <th className="py-4 px-4 text-right">Flag</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {labResults.map((row, i) => (
                                            <tr
                                                key={i}
                                                className={clsx(
                                                    "border-b border-border bg-surface hover:bg-[var(--color-background)] transition-colors",
                                                    row.status === "high" && "bg-[#FDF2EF] hover:bg-[#F9DED6]"
                                                )}
                                            >
                                                <td className="py-5 px-4 font-medium text-text-main">{row.test}</td>
                                                <td className="py-5 px-4">
                                                    <span className={clsx(
                                                        "text-xl font-serif",
                                                        row.status === "high" ? "text-[var(--color-accent)]" : "text-text-main"
                                                    )}>
                                                        {row.value}
                                                    </span>
                                                    <span className="text-xs text-text-muted ml-2">{row.unit}</span>
                                                </td>
                                                <td className="py-5 px-4 text-sm text-text-muted">{row.range}</td>
                                                <td className="py-5 px-4 text-right">
                                                    {row.status === "normal" ? (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-status-success-text)] bg-[var(--color-status-success-bg)] px-2 py-1 rounded-sm">
                                                            <Check size={12} strokeWidth={2} /> Normal
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] bg-[var(--color-status-warning-bg)] px-2 py-1 rounded-sm border border-[#F9DED6]">
                                                            <AlertTriangle size={12} strokeWidth={2} /> {row.status}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}