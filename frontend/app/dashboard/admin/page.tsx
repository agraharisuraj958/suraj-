"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    Users, 
    FileText, 
    ArrowRight, 
    UploadCloud, 
    Trash2, 
    Stethoscope, 
    Calendar, 
    Sparkles, 
    TrendingUp, 
    BarChart3,
    LineChart,
    CheckCircle2, 
    Clock,
    Activity,
    Layers,
    Info
} from "lucide-react";
import { clsx } from "clsx";

interface DataPoint {
    label: string;
    total: number;
    inPerson: number;
    virtual: number;
}

const timeframes: Record<string, { label: string; total: string; data: DataPoint[] }> = {
    this_week: {
        label: "This Week",
        total: "1,204 Visits",
        data: [
            { label: "Mon", total: 182, inPerson: 124, virtual: 58 },
            { label: "Tue", total: 238, inPerson: 162, virtual: 76 },
            { label: "Wed", total: 154, inPerson: 104, virtual: 50 },
            { label: "Thu", total: 258, inPerson: 174, virtual: 84 },
            { label: "Fri", total: 218, inPerson: 148, virtual: 70 },
            { label: "Sat", total: 98, inPerson: 68, virtual: 30 },
            { label: "Sun", total: 56, inPerson: 38, virtual: 18 },
        ]
    },
    last_week: {
        label: "Last Week",
        total: "1,105 Visits",
        data: [
            { label: "Mon", total: 165, inPerson: 110, virtual: 55 },
            { label: "Tue", total: 210, inPerson: 142, virtual: 68 },
            { label: "Wed", total: 175, inPerson: 118, virtual: 57 },
            { label: "Thu", total: 230, inPerson: 155, virtual: 75 },
            { label: "Fri", total: 195, inPerson: 130, virtual: 65 },
            { label: "Sat", total: 85, inPerson: 60, virtual: 25 },
            { label: "Sun", total: 45, inPerson: 30, virtual: 15 },
        ]
    },
    monthly: {
        label: "Monthly Trajectory",
        total: "4,319 Visits",
        data: [
            { label: "Wk 1", total: 940, inPerson: 640, virtual: 300 },
            { label: "Wk 2", total: 1120, inPerson: 760, virtual: 360 },
            { label: "Wk 3", total: 1055, inPerson: 715, virtual: 340 },
            { label: "Wk 4", total: 1204, inPerson: 820, virtual: 384 },
        ]
    }
};

export default function AdminDashboard() {
    const [selectedTimeframe, setSelectedTimeframe] = useState<"this_week" | "last_week" | "monthly">("this_week");
    const [chartMode, setChartMode] = useState<"bar" | "area">("bar");
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(3); // Default to peak day

    const [documents, setDocuments] = useState([
        { id: 1, name: "ACC_AHA_Guidelines_2025.pdf", size: "2.4 MB", status: "Indexed", date: "Nov 08" },
        { id: 2, name: "Diabetes_Care_Standards.pdf", size: "4.1 MB", status: "Processing", date: "Nov 09" },
        { id: 3, name: "Hypertension_Protocol_2026.pdf", size: "1.2 MB", status: "Indexed", date: "Nov 09" },
    ]);

    const stats = [
        { title: "Total Patients", value: "12,450", change: "+12%", changeText: "vs last month", icon: Users },
        { title: "Active Clinicians", value: "48", change: "+2", changeText: "onboarded this mo.", icon: Stethoscope },
        { title: "Monthly Consultations", value: "1,204", change: "+8.4%", changeText: "completed visits", icon: Calendar },
        { title: "AI Triage Queries", value: "3,892", change: "+24%", changeText: "automated intake", icon: Sparkles },
    ];

    const currentDataset = timeframes[selectedTimeframe];
    const maxVal = Math.max(...currentDataset.data.map(d => d.total)) * 1.15;

    // Helper for smooth SVG curve
    const width = 600;
    const height = 180;
    const paddingX = 40;
    const availableW = width - paddingX * 2;
    const stepX = availableW / (currentDataset.data.length - 1 || 1);

    const points = currentDataset.data.map((d, i) => {
        const x = paddingX + i * stepX;
        const y = height - (d.total / maxVal) * (height - 20) - 10;
        return { x, y, ...d };
    });

    const getSpline = (pts: typeof points) => {
        if (pts.length === 0) return "";
        let d = `M ${pts[0].x},${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i];
            const p1 = pts[i + 1];
            const cpX = (p0.x + p1.x) / 2;
            d += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
        }
        return d;
    };

    const linePath = getSpline(points);
    const areaPath = points.length > 0 
        ? `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z` 
        : "";

    const activePoint = hoveredIdx !== null && points[hoveredIdx] ? points[hoveredIdx] : points[points.length - 1];

    const handleDeleteDoc = (id: number) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans pb-16">
            {/* Header */}
            <header className="border-b border-border bg-surface px-8 py-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-text-main">System Overview</h1>
                        <p className="text-sm font-medium text-text-muted mt-2">
                            Real-time clinic operations, patient flow, and AI infrastructure telemetry.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/admin/documents"
                            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <UploadCloud size={16} /> Document Vault
                        </Link>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-10">
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="bg-surface border border-border p-6 rounded-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-text-main mt-2">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className="p-2.5 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-sm">
                                        <Icon size={18} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 mt-4 text-xs font-bold text-[var(--color-status-success-text)]">
                                    <TrendingUp size={14} />
                                    <span>{stat.change}</span>
                                    <span className="text-text-muted font-normal ml-0.5">{stat.changeText}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Middle Grid: Advanced Interactive Visual Graph & System Telemetry */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Visual Graph Card */}
                    <div className="bg-surface border border-border p-8 rounded-sm lg:col-span-2 space-y-6 flex flex-col justify-between">
                        {/* Graph Controls & Legend Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-text-main">Consultation Volume & Patient Flow</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] bg-[var(--color-primary-light)] px-2 py-0.5 rounded-sm">
                                        Live Analytics
                                    </span>
                                </div>
                                <p className="text-xs text-text-muted mt-0.5">
                                    Breakdown of in-person appointments vs. virtual AI-triaged consultations
                                </p>
                            </div>

                            {/* View Switchers & Timeframe Filters */}
                            <div className="flex items-center gap-3 self-start sm:self-auto">
                                {/* Mode Toggle */}
                                <div className="p-1 bg-[var(--color-background)] border border-border rounded-sm flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setChartMode("bar")}
                                        className={clsx(
                                            "p-1.5 rounded-sm transition-all text-xs font-bold flex items-center gap-1",
                                            chartMode === "bar"
                                                ? "bg-surface text-[var(--color-primary)] shadow-sm"
                                                : "text-text-muted hover:text-text-main"
                                        )}
                                        title="Stacked Bar View"
                                    >
                                        <BarChart3 size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setChartMode("area")}
                                        className={clsx(
                                            "p-1.5 rounded-sm transition-all text-xs font-bold flex items-center gap-1",
                                            chartMode === "area"
                                                ? "bg-surface text-[var(--color-primary)] shadow-sm"
                                                : "text-text-muted hover:text-text-main"
                                        )}
                                        title="Smooth Area Trend"
                                    >
                                        <LineChart size={15} />
                                    </button>
                                </div>

                                {/* Timeframe Selection */}
                                <div className="p-1 bg-[var(--color-background)] border border-border rounded-sm flex items-center gap-1 text-xs">
                                    {(["this_week", "last_week", "monthly"] as const).map((key) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => {
                                                setSelectedTimeframe(key);
                                                setHoveredIdx(0);
                                            }}
                                            className={clsx(
                                                "px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider transition-colors",
                                                selectedTimeframe === key
                                                    ? "bg-surface text-text-main shadow-sm"
                                                    : "text-text-muted hover:text-text-main"
                                            )}
                                        >
                                            {key === "this_week" ? "Week" : key === "last_week" ? "Prev" : "Month"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Visual Legend & Active Metric Readout */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-[var(--color-background)] p-3 rounded-sm border border-border">
                            <div className="flex items-center gap-5">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-xs bg-[var(--color-primary)]" />
                                    <span className="text-text-main font-semibold">In-Person Visits (68%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-xs bg-[var(--color-accent)]" />
                                    <span className="text-text-main font-semibold">Virtual / AI Triage (32%)</span>
                                </div>
                            </div>
                            {activePoint && (
                                <div className="flex items-center gap-2 text-text-main font-mono text-xs">
                                    <span className="text-text-muted">{activePoint.label}:</span>
                                    <strong className="text-[var(--color-primary)]">{activePoint.total} visits</strong>
                                    <span className="text-text-muted">({activePoint.inPerson} In-Person / {activePoint.virtual} Virtual)</span>
                                </div>
                            )}
                        </div>

                        {/* GRAPH CANVAS WITH Y-AXIS GRIDLINES */}
                        <div className="relative h-64 w-full pt-4">
                            {/* Horizontal Y-Axis Gridlines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
                                {[1, 0.75, 0.5, 0.25, 0].map((ratio) => (
                                    <div key={ratio} className="w-full flex items-center gap-3">
                                        <span className="text-[10px] font-mono font-bold text-text-muted/70 w-8 text-right">
                                            {Math.round(ratio * maxVal)}
                                        </span>
                                        <div className="flex-1 border-b border-dashed border-border" />
                                    </div>
                                ))}
                            </div>

                            {/* MODE 1: VISUAL STACKED BAR CHART */}
                            {chartMode === "bar" && (
                                <div className="absolute inset-0 pl-11 pb-7 flex items-end justify-between gap-2 sm:gap-6">
                                    {currentDataset.data.map((d, i) => {
                                        const isHovered = hoveredIdx === i;
                                        const totalHeightPct = (d.total / maxVal) * 100;
                                        const inPersonHeightPct = (d.inPerson / d.total) * 100;
                                        const virtualHeightPct = (d.virtual / d.total) * 100;

                                        return (
                                            <div
                                                key={d.label}
                                                onMouseEnter={() => setHoveredIdx(i)}
                                                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                                            >
                                                {/* Floating Tooltip */}
                                                <div className={clsx(
                                                    "absolute -top-12 left-1/2 -translate-x-1/2 transition-all duration-150 z-20 pointer-events-none whitespace-nowrap",
                                                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                                                )}>
                                                    <div className="bg-text-main text-surface text-[11px] font-bold py-1.5 px-3 rounded-sm shadow-xl flex items-center gap-2">
                                                        <span>{d.label}:</span>
                                                        <span className="text-[#A7D7C5]">{d.total} total</span>
                                                    </div>
                                                </div>

                                                {/* Stacked Bar Container */}
                                                <div 
                                                    className={clsx(
                                                        "w-full max-w-[48px] rounded-t-sm flex flex-col overflow-hidden transition-all duration-300",
                                                        isHovered ? "ring-2 ring-offset-2 ring-[var(--color-primary)] scale-[1.03]" : "opacity-90 hover:opacity-100"
                                                    )}
                                                    style={{ height: `${totalHeightPct}%` }}
                                                >
                                                    {/* Top Segment: Virtual / AI Triage (Accent) */}
                                                    <div 
                                                        className="w-full bg-[var(--color-accent)] transition-colors"
                                                        style={{ height: `${virtualHeightPct}%` }}
                                                        title={`Virtual/AI: ${d.virtual}`}
                                                    />
                                                    {/* Bottom Segment: In-Person (Primary Forest Green) */}
                                                    <div 
                                                        className="w-full bg-[var(--color-primary)] transition-colors"
                                                        style={{ height: `${inPersonHeightPct}%` }}
                                                        title={`In-Person: ${d.inPerson}`}
                                                    />
                                                </div>

                                                {/* X-Axis Label */}
                                                <span className={clsx(
                                                    "text-xs font-bold uppercase tracking-wider mt-2 transition-colors",
                                                    isHovered ? "text-[var(--color-primary)] font-extrabold" : "text-text-muted"
                                                )}>
                                                    {d.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* MODE 2: SMOOTH SVG SPLINE AREA CHART */}
                            {chartMode === "area" && (
                                <div className="absolute inset-0 pl-11 pb-7 flex flex-col justify-between">
                                    <div className="relative w-full h-full">
                                        <svg
                                            viewBox={`0 0 ${width} ${height}`}
                                            preserveAspectRatio="none"
                                            className="w-full h-full overflow-visible"
                                        >
                                            <defs>
                                                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#274029" stopOpacity="0.45" />
                                                    <stop offset="85%" stopColor="#274029" stopOpacity="0.05" />
                                                    <stop offset="100%" stopColor="#274029" stopOpacity="0.0" />
                                                </linearGradient>
                                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#274029" floodOpacity="0.25" />
                                                </filter>
                                            </defs>

                                            {/* Gradient Area Fill */}
                                            <path d={areaPath} fill="url(#areaGradient)" />

                                            {/* Main Spline Curve */}
                                            <path
                                                d={linePath}
                                                fill="none"
                                                stroke="#274029"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                filter="url(#glow)"
                                            />

                                            {/* Interactive Node Circles */}
                                            {points.map((pt, i) => {
                                                const isHovered = hoveredIdx === i;
                                                return (
                                                    <g key={pt.label} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)}>
                                                        {isHovered && (
                                                            <line
                                                                x1={pt.x}
                                                                y1={pt.y}
                                                                x2={pt.x}
                                                                y2={height}
                                                                stroke="#274029"
                                                                strokeWidth="1.5"
                                                                strokeDasharray="3 3"
                                                                opacity="0.6"
                                                            />
                                                        )}
                                                        <circle
                                                            cx={pt.x}
                                                            cy={pt.y}
                                                            r={isHovered ? 6 : 4}
                                                            className={clsx(
                                                                "transition-all duration-150",
                                                                isHovered ? "fill-[var(--color-primary)] stroke-surface stroke-[3px]" : "fill-surface stroke-[var(--color-primary)] stroke-[2.5px]"
                                                            )}
                                                        />
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    </div>

                                    {/* X-Axis Labels */}
                                    <div className="flex justify-between w-full px-2 mt-1">
                                        {currentDataset.data.map((d, i) => (
                                            <button
                                                key={d.label}
                                                type="button"
                                                onClick={() => setHoveredIdx(i)}
                                                className={clsx(
                                                    "text-xs font-bold uppercase tracking-wider transition-colors",
                                                    hoveredIdx === i ? "text-[var(--color-primary)] font-extrabold" : "text-text-muted hover:text-text-main"
                                                )}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chart Bottom Insights Strip */}
                        <div className="pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 bg-[var(--color-background)] rounded-sm border border-border">
                                <span className="text-[10px] uppercase font-bold text-text-muted block">Peak Volume Day</span>
                                <span className="text-sm font-bold text-text-main mt-0.5 block">Thursday (258 visits)</span>
                            </div>
                            <div className="p-3 bg-[var(--color-background)] rounded-sm border border-border">
                                <span className="text-[10px] uppercase font-bold text-text-muted block">Daily Average</span>
                                <span className="text-sm font-bold text-text-main mt-0.5 block">172.0 consultations</span>
                            </div>
                            <div className="p-3 bg-[var(--color-background)] rounded-sm border border-border">
                                <span className="text-[10px] uppercase font-bold text-text-muted block">Virtual AI Intake</span>
                                <span className="text-sm font-bold text-[var(--color-accent)] mt-0.5 block">31.8% of Total</span>
                            </div>
                            <div className="p-3 bg-[var(--color-background)] rounded-sm border border-border">
                                <span className="text-[10px] uppercase font-bold text-text-muted block">Clinical Efficiency</span>
                                <span className="text-sm font-bold text-[var(--color-status-success-text)] mt-0.5 block">94.2% On-Time</span>
                            </div>
                        </div>
                    </div>

                    {/* Live System Telemetry / Service Health */}
                    <div className="bg-surface border border-border p-8 rounded-sm space-y-6 flex flex-col justify-between">
                        <div>
                            <div className="border-b border-border pb-4 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-text-main">System Health</h3>
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-status-success-text)] bg-[var(--color-status-success-bg)] px-2 py-0.5 rounded-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-success-text)] animate-pulse" />
                                    Online
                                </span>
                            </div>

                            <div className="space-y-5 mt-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-text-main">AI RAG Inference Pipeline</p>
                                        <p className="text-xs text-text-muted">Response Latency: 118ms</p>
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-status-success-text)]" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-text-main">ChromaDB Vector Store</p>
                                        <p className="text-xs text-text-muted">1,480 Chunks Indexed</p>
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-status-success-text)]" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-text-main">Clinic Database Sync</p>
                                        <p className="text-xs text-text-muted">Last synchronized 1m ago</p>
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-status-success-text)]" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-text-main">Telehealth Video Gateway</p>
                                        <p className="text-xs text-text-muted">99.98% Service Uptime</p>
                                    </div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-status-success-text)]" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border space-y-3">
                            <div className="p-3 bg-[var(--color-background)] rounded-sm border border-border flex items-center justify-between">
                                <span className="text-xs text-text-muted">Security Compliance</span>
                                <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                                    HIPAA Validated
                                </span>
                            </div>
                            <div className="p-3 bg-[var(--color-background)] rounded-sm border border-border flex items-center justify-between">
                                <span className="text-xs text-text-muted">Model Architecture</span>
                                <span className="text-xs font-bold text-text-main font-mono">
                                    MedLM-RAG-v2
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Vault Quick View */}
                <div>
                    <div className="flex items-center justify-between border-b border-text-main pb-4 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-text-main">Indexed Guidelines & Protocols</h2>
                            <p className="text-xs text-text-muted mt-0.5">
                                Active literature used for automated physician RAG generation
                            </p>
                        </div>
                        <Link
                            href="/dashboard/admin/documents"
                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:underline"
                        >
                            Open Full Vault <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="bg-surface border border-border rounded-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border bg-[var(--color-background)]">
                                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Document</th>
                                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Size</th>
                                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Date</th>
                                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-[var(--color-background)] transition-colors">
                                        <td className="py-5 px-6 font-medium text-text-main flex items-center gap-3">
                                            <FileText size={16} className="text-text-muted shrink-0" />
                                            <span className="truncate max-w-sm">{doc.name}</span>
                                        </td>
                                        <td className="py-5 px-6 text-sm font-medium text-text-muted">{doc.size}</td>
                                        <td className="py-5 px-6 text-sm text-text-muted">{doc.date}</td>
                                        <td className="py-5 px-6">
                                            <span className={clsx(
                                                "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm",
                                                doc.status === "Indexed"
                                                    ? "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]"
                                                    : "bg-[var(--color-status-warning-bg)] text-[var(--color-accent)]"
                                            )}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteDoc(doc.id)}
                                                className="text-text-muted hover:text-[var(--color-accent)] transition-colors p-1"
                                                title="Remove document"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
