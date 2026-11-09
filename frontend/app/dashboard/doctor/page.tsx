"use client";

import { useState } from "react";
import { 
    Search, 
    ArrowRight, 
    Activity, 
    Clock, 
    Check, 
    X, 
    FileText, 
    AlertTriangle, 
    Heart, 
    Thermometer, 
    Pill, 
    Calendar, 
    Sparkles, 
    User,
    CheckCircle2,
    Shield
} from "lucide-react";
import { clsx } from "clsx";

interface LabResult {
    test: string;
    date: string;
    result: string;
    status: "normal" | "abnormal";
}

interface Patient {
    id: string;
    name: string;
    mrn: string;
    dob: string;
    age: number;
    gender: string;
    time: string;
    type: string;
    status: string;
    urgent: boolean;
    bp: string;
    hr: string;
    spo2: string;
    temp: string;
    weight: string;
    allergies: string[];
    conditions: string[];
    medications: string[];
    synthesis: string;
    clinicalNote: string;
    recentLabs: LabResult[];
}

const queuePatients: Patient[] = [
    {
        id: "1",
        name: "Zaina Riddle",
        mrn: "#MM-73921",
        dob: "Oct 22, 1991",
        age: 35,
        gender: "Female",
        time: "09:00 AM",
        type: "Follow-up",
        status: "Waiting",
        urgent: false,
        bp: "118/76",
        hr: "68 bpm",
        spo2: "100%",
        temp: "98.4°F",
        weight: "62 kg",
        allergies: ["Sulfa Drugs"],
        conditions: ["Cervical Radiculopathy", "Tension Headache"],
        medications: ["Baclofen 10mg (Nightly)", "Naproxen 500mg (PRN)"],
        synthesis: "Follow-up visit regarding cervical nerve impingement. Patient reports 60% reduction in radicular pain following 6 weeks of physical therapy and targeted ergonomic adjustment. Neurological exam shows intact deep tendon reflexes bilaterally.",
        clinicalNote: "Patient has responded favorably to conservative physical therapy. Continue cervical stabilization exercises twice weekly for an additional 4 weeks. Re-evaluate range of motion in 60 days.",
        recentLabs: [
            { test: "Cervical Spine X-Ray", date: "Oct 12, 2026", result: "Mild C5-C6 disc space narrowing", status: "normal" },
            { test: "Serum Vitamin D3", date: "Sep 28, 2026", result: "38 ng/mL (Sufficient)", status: "normal" },
        ]
    },
    {
        id: "2",
        name: "Jakub Tucker",
        mrn: "#MM-88492",
        dob: "May 14, 1984",
        age: 42,
        gender: "Male",
        time: "10:30 AM",
        type: "Initial Consult",
        status: "In Progress",
        urgent: true,
        bp: "128/82",
        hr: "72 bpm",
        spo2: "99%",
        temp: "98.6°F",
        weight: "78 kg",
        allergies: ["Penicillin (Moderate rash)"],
        conditions: ["Episodic Migraine with Aura", "Mild Hyperlipidemia"],
        medications: ["Sumatriptan 50mg (PRN onset)", "Atorvastatin 10mg (Daily)"],
        synthesis: "Patient presents with chronic migraines lasting 4+ hours, unresponsive to OTC analgesics. Recent brain MRI is unremarkable for acute pathology. Recommend reviewing sleep triggers and evaluating prophylactic CGRP antagonist therapy.",
        clinicalNote: "Exam reveals normal cranial nerve function with no focal deficits. Bilateral funduscopic exam normal. Discussed lifestyle modifications, hydration, and initiated headache diary protocol.",
        recentLabs: [
            { test: "Brain MRI (Non-contrast)", date: "Nov 02, 2026", result: "Normal intracranial morphology", status: "normal" },
            { test: "Lipid Profile (LDL-C)", date: "Oct 15, 2026", result: "128 mg/dL (Elevated)", status: "abnormal" },
            { test: "Comprehensive Metabolic Panel", date: "Oct 15, 2026", result: "Normal hepatic and renal function", status: "normal" },
        ]
    },
    {
        id: "3",
        name: "Aleksander Craig",
        mrn: "#MM-54120",
        dob: "Feb 03, 1968",
        age: 58,
        gender: "Male",
        time: "11:30 AM",
        type: "Lab Review",
        status: "Scheduled",
        urgent: false,
        bp: "136/86",
        hr: "78 bpm",
        spo2: "98%",
        temp: "98.7°F",
        weight: "84 kg",
        allergies: ["No Known Drug Allergies (NKDA)"],
        conditions: ["Essential Hypertension", "Carpal Tunnel Syndrome"],
        medications: ["Lisinopril 20mg (Daily)", "Amlodipine 5mg (Daily)"],
        synthesis: "Routine lab and nerve conduction study review. Moderate median nerve motor latency delay on the right wrist. Blood pressure is slightly elevated at 136/86 mmHg. Recommend nocturnal wrist splinting and adherence to low-sodium dietary regimen.",
        clinicalNote: "Confirmed positive Tinel's and Phalen's signs on right wrist. Provided neutral-wrist night splint. Advised on blood pressure home logging twice weekly.",
        recentLabs: [
            { test: "EMG / Nerve Conduction", date: "Oct 29, 2026", result: "Moderate right median neuropathy", status: "abnormal" },
            { test: "Serum Creatinine", date: "Oct 20, 2026", result: "0.9 mg/dL (Normal)", status: "normal" },
            { test: "eGFR", date: "Oct 20, 2026", result: "> 90 mL/min/1.73m²", status: "normal" },
        ]
    },
];

export default function DoctorDashboard() {
    const [selectedPatientId, setSelectedPatientId] = useState<string>("2"); // Jakub Tucker default
    const [isChartOpen, setIsChartOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"summary" | "notes" | "labs" | "meds">("summary");
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    const activePatient = queuePatients.find(p => p.id === selectedPatientId) || queuePatients[1];

    const filteredQueue = queuePatients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const triggerAction = (message: string) => {
        setActionFeedback(message);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans pb-16">
            {/* Header */}
            <header className="h-20 px-8 flex items-center justify-between border-b border-border bg-surface sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold flex items-center justify-center font-serif text-sm">
                        MW
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-text-main">
                            Dr. Marcus Webb
                        </h1>
                        <p className="text-xs font-medium text-text-muted">Neurology Department • Attending Physician</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-light)] px-3 py-1 rounded-sm border border-[var(--color-primary)]/10">
                        Clinic Session Active
                    </span>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Feedback Toast */}
                {actionFeedback && (
                    <div className="p-4 bg-[var(--color-status-success-bg)] border border-[var(--color-primary)]/20 rounded-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 size={18} className="text-[var(--color-primary)] shrink-0" />
                        <span className="text-sm font-bold text-[var(--color-primary)]">
                            {actionFeedback}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Queue */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-text-main pb-4">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-text-main">Today's Patient Queue</h2>
                                <p className="text-sm font-medium text-text-muted mt-1">
                                    {queuePatients.length} Patients in Consultation Pipeline
                                </p>
                            </div>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter patient queue..."
                                    className="pl-9 pr-4 py-2 bg-surface border border-border rounded-sm text-sm focus:outline-none focus:border-[var(--color-primary)] w-full sm:w-64"
                                />
                            </div>
                        </div>

                        <div className="bg-surface border border-border rounded-sm divide-y divide-border">
                            {filteredQueue.map((patient) => {
                                const isSelected = selectedPatientId === patient.id;
                                return (
                                    <div
                                        key={patient.id}
                                        onClick={() => setSelectedPatientId(patient.id)}
                                        className={clsx(
                                            "p-6 flex items-center justify-between transition-colors cursor-pointer group",
                                            isSelected 
                                                ? "bg-[var(--color-primary-light)]/40 border-l-4 border-l-[var(--color-primary)]" 
                                                : "hover:bg-[var(--color-background)] border-l-4 border-l-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={clsx(
                                                "w-12 h-12 rounded-sm flex items-center justify-center font-bold text-base transition-colors",
                                                isSelected
                                                    ? "bg-[var(--color-primary)] text-surface"
                                                    : "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                                            )}>
                                                {patient.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-bold text-text-main group-hover:text-[var(--color-primary)] transition-colors">
                                                        {patient.name}
                                                    </h4>
                                                    <span className="text-xs text-text-muted font-normal">
                                                        ({patient.age}y, {patient.gender})
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-text-muted mt-1 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={13} /> {patient.time}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{patient.type}</span>
                                                    <span>•</span>
                                                    <span className="text-text-main/70">{patient.mrn}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {patient.urgent && (
                                                <span className="px-2.5 py-1 bg-[var(--color-status-warning-bg)] text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-widest rounded-sm border border-[#F9DED6]">
                                                    Urgent
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPatientId(patient.id);
                                                    setIsChartOpen(true);
                                                }}
                                                className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline flex items-center gap-1"
                                            >
                                                Chart <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Active Patient AI Quick Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[var(--color-primary)] text-surface p-8 rounded-sm sticky top-28 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-light)] flex items-center gap-2">
                                    <Activity size={16} />
                                    Active Patient Summary
                                </h3>
                                <span className="text-[10px] font-bold uppercase tracking-widest bg-surface/10 px-2 py-0.5 rounded-sm">
                                    {activePatient.mrn}
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-2xl font-bold text-surface">
                                        {activePatient.name}
                                    </h4>
                                    <p className="text-[var(--color-primary-light)] text-xs font-medium mt-1">
                                        {activePatient.age} yrs • {activePatient.gender} • {activePatient.type}
                                    </p>
                                </div>

                                <div className="pt-5 border-t border-surface/20">
                                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-light)] mb-2 flex items-center gap-1.5">
                                        <Sparkles size={12} />
                                        AI Clinical Synthesis
                                    </h5>
                                    <p className="text-xs leading-relaxed font-normal text-surface/90">
                                        {activePatient.synthesis}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-5 border-t border-surface/20">
                                    <div className="p-3 bg-surface/10 rounded-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-light)] block">
                                            Blood Pressure
                                        </span>
                                        <span className="text-base font-bold text-surface mt-0.5 block">
                                            {activePatient.bp}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-surface/10 rounded-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-light)] block">
                                            Heart Rate
                                        </span>
                                        <span className="text-base font-bold text-surface mt-0.5 block">
                                            {activePatient.hr}
                                        </span>
                                    </div>
                                </div>

                                {/* Working "Open Full Chart" Button */}
                                <button
                                    type="button"
                                    onClick={() => setIsChartOpen(true)}
                                    className="w-full bg-surface text-[var(--color-primary)] py-4 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-light)] transition-all flex items-center justify-center gap-2 shadow-sm font-sans"
                                >
                                    <FileText size={15} />
                                    Open Full Chart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* FULL MEDICAL CHART MODAL DIALOG */}
            {isChartOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
                    <div 
                        className="bg-surface border border-border rounded-sm max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 md:p-8 bg-[var(--color-background)] border-b border-border flex items-start justify-between gap-6 shrink-0">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-sm bg-[var(--color-primary)] text-surface flex items-center justify-center text-xl font-bold font-serif shrink-0">
                                    {activePatient.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold text-text-main">
                                            {activePatient.name}
                                        </h2>
                                        <span className="text-xs font-mono font-bold bg-surface border border-border px-2 py-0.5 rounded-sm text-text-muted">
                                            {activePatient.mrn}
                                        </span>
                                        {activePatient.urgent && (
                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-[var(--color-status-warning-bg)] text-[var(--color-accent)] border border-[#F9DED6] px-2 py-0.5 rounded-sm">
                                                Urgent Review
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-muted mt-1 font-medium">
                                        DOB: {activePatient.dob} ({activePatient.age} yrs) • Gender: {activePatient.gender} • Appt: {activePatient.time} ({activePatient.type})
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsChartOpen(false)}
                                className="p-2 text-text-muted hover:text-text-main rounded-sm hover:bg-surface border border-transparent hover:border-border transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chart Navigation Tabs */}
                        <div className="px-8 border-b border-border bg-surface flex gap-6 text-xs font-bold uppercase tracking-widest text-text-muted shrink-0">
                            <button
                                type="button"
                                onClick={() => setActiveTab("summary")}
                                className={clsx(
                                    "py-4 border-b-2 transition-colors",
                                    activeTab === "summary"
                                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                        : "border-transparent hover:text-text-main"
                                )}
                            >
                                Vitals & Synthesis
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("notes")}
                                className={clsx(
                                    "py-4 border-b-2 transition-colors",
                                    activeTab === "notes"
                                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                        : "border-transparent hover:text-text-main"
                                )}
                            >
                                Clinical Notes
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("labs")}
                                className={clsx(
                                    "py-4 border-b-2 transition-colors",
                                    activeTab === "labs"
                                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                        : "border-transparent hover:text-text-main"
                                )}
                            >
                                Diagnostics & Labs ({activePatient.recentLabs.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("meds")}
                                className={clsx(
                                    "py-4 border-b-2 transition-colors",
                                    activeTab === "meds"
                                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                                        : "border-transparent hover:text-text-main"
                                )}
                            >
                                Medications & Allergies
                            </button>
                        </div>

                        {/* Modal Body Content */}
                        <div className="p-8 overflow-y-auto space-y-6 flex-1">
                            {/* TAB 1: SUMMARY & VITALS */}
                            {activeTab === "summary" && (
                                <div className="space-y-8 animate-in fade-in duration-150">
                                    {/* Vitals Grid */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
                                            Current Vitals Check
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                            <div className="p-4 bg-[var(--color-background)] border border-border rounded-sm">
                                                <span className="text-[10px] uppercase font-bold text-text-muted block">Blood Pressure</span>
                                                <span className="text-lg font-bold text-text-main mt-1 block">{activePatient.bp}</span>
                                                <span className="text-[10px] text-[var(--color-status-success-text)] font-semibold">Resting</span>
                                            </div>
                                            <div className="p-4 bg-[var(--color-background)] border border-border rounded-sm">
                                                <span className="text-[10px] uppercase font-bold text-text-muted block">Heart Rate</span>
                                                <span className="text-lg font-bold text-text-main mt-1 block">{activePatient.hr}</span>
                                                <span className="text-[10px] text-text-muted font-medium">Regular</span>
                                            </div>
                                            <div className="p-4 bg-[var(--color-background)] border border-border rounded-sm">
                                                <span className="text-[10px] uppercase font-bold text-text-muted block">SpO2</span>
                                                <span className="text-lg font-bold text-text-main mt-1 block">{activePatient.spo2}</span>
                                                <span className="text-[10px] text-[var(--color-status-success-text)] font-semibold">Room Air</span>
                                            </div>
                                            <div className="p-4 bg-[var(--color-background)] border border-border rounded-sm">
                                                <span className="text-[10px] uppercase font-bold text-text-muted block">Temp</span>
                                                <span className="text-lg font-bold text-text-main mt-1 block">{activePatient.temp}</span>
                                                <span className="text-[10px] text-text-muted font-medium">Oral</span>
                                            </div>
                                            <div className="p-4 bg-[var(--color-background)] border border-border rounded-sm">
                                                <span className="text-[10px] uppercase font-bold text-text-muted block">Weight</span>
                                                <span className="text-lg font-bold text-text-main mt-1 block">{activePatient.weight}</span>
                                                <span className="text-[10px] text-text-muted font-medium">Stable</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Synthesis Box */}
                                    <div className="p-6 bg-[var(--color-primary-light)]/70 border border-[var(--color-primary)]/20 rounded-sm space-y-2">
                                        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest">
                                            <Sparkles size={16} />
                                            Automated Clinical Summary
                                        </div>
                                        <p className="text-sm text-text-main leading-relaxed font-medium">
                                            {activePatient.synthesis}
                                        </p>
                                    </div>

                                    {/* Active Conditions */}
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">
                                            Diagnosed Chronic Conditions
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {activePatient.conditions.map((cond, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-surface border border-border rounded-sm text-xs font-bold text-text-main">
                                                    {cond}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: CLINICAL NOTES */}
                            {activeTab === "notes" && (
                                <div className="space-y-6 animate-in fade-in duration-150">
                                    <div className="border border-border bg-[var(--color-background)] p-6 rounded-sm space-y-4">
                                        <div className="flex items-center justify-between border-b border-border pb-3">
                                            <span className="text-xs font-bold uppercase tracking-widest text-text-main">
                                                Attending Physician Note • {activePatient.time}
                                            </span>
                                            <span className="text-xs text-text-muted">Dr. Marcus Webb</span>
                                        </div>
                                        <p className="text-sm text-text-main leading-relaxed">
                                            {activePatient.clinicalNote}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-text-muted block">
                                            Append Progress Observation
                                        </label>
                                        <textarea
                                            placeholder="Enter real-time consultation observation or treatment plan..."
                                            rows={3}
                                            className="w-full border border-border bg-[var(--color-background)] p-4 text-sm rounded-sm focus:outline-none focus:border-[var(--color-primary)] text-text-main"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: DIAGNOSTICS & LABS */}
                            {activeTab === "labs" && (
                                <div className="space-y-6 animate-in fade-in duration-150">
                                    <div className="border border-border rounded-sm overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="bg-[var(--color-background)] border-b border-border text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                                    <th className="py-3 px-4">Diagnostic Test</th>
                                                    <th className="py-3 px-4">Date</th>
                                                    <th className="py-3 px-4">Finding / Value</th>
                                                    <th className="py-3 px-4 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {activePatient.recentLabs.map((lab, i) => (
                                                    <tr key={i} className="hover:bg-[var(--color-background)]/50 transition-colors">
                                                        <td className="py-4 px-4 font-bold text-text-main flex items-center gap-2">
                                                            <FileText size={15} className="text-text-muted" />
                                                            {lab.test}
                                                        </td>
                                                        <td className="py-4 px-4 text-xs text-text-muted">{lab.date}</td>
                                                        <td className="py-4 px-4 font-medium text-text-main">{lab.result}</td>
                                                        <td className="py-4 px-4 text-right">
                                                            <span className={clsx(
                                                                "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm",
                                                                lab.status === "normal"
                                                                    ? "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]"
                                                                    : "bg-[var(--color-status-warning-bg)] text-[var(--color-accent)]"
                                                            )}>
                                                                {lab.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB 4: MEDICATIONS & ALLERGIES */}
                            {activeTab === "meds" && (
                                <div className="space-y-6 animate-in fade-in duration-150">
                                    {/* Allergies */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <AlertTriangle size={14} className="text-[var(--color-accent)]" />
                                            Documented Allergies
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {activePatient.allergies.map((allg, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-[var(--color-status-warning-bg)] text-[var(--color-accent)] border border-[#F9DED6] rounded-sm text-xs font-bold">
                                                    {allg}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Medications */}
                                    <div className="space-y-3 pt-4 border-t border-border">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <Pill size={14} className="text-[var(--color-primary)]" />
                                            Active Prescription Regimen
                                        </h4>
                                        <div className="space-y-2">
                                            {activePatient.medications.map((med, i) => (
                                                <div key={i} className="p-3 bg-[var(--color-background)] border border-border rounded-sm flex items-center justify-between">
                                                    <span className="text-sm font-bold text-text-main">{med}</span>
                                                    <span className="text-xs text-[var(--color-status-success-text)] font-semibold">Active</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="p-6 bg-[var(--color-background)] border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                            <div className="text-xs text-text-muted font-medium">
                                Chart ID: <span className="text-text-main font-mono">{activePatient.mrn}-2026</span> • Electronic Health Record System
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => triggerAction("Prescription renewal request submitted")}
                                    className="px-4 py-2.5 bg-surface border border-border text-text-main rounded-sm text-xs font-bold uppercase tracking-widest hover:border-text-muted transition-colors"
                                >
                                    Renew Rx
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        triggerAction("Clinical notes and session finalized successfully");
                                        setIsChartOpen(false);
                                    }}
                                    className="px-6 py-2.5 bg-[var(--color-primary)] text-surface rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
                                >
                                    Finalize Encounter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
