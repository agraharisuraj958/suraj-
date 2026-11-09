"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, ArrowRight, Check } from "lucide-react";
import { clsx } from "clsx";

export default function HealthForecasting() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans pl-64">

            <header className="border-b border-border bg-surface px-12 py-10 shrink-0">
                <div className="max-w-5xl">
                    <h1 className="text-4xl font-bold tracking-tight text-text-main">Health Trajectory</h1>
                    <p className="text-sm font-medium text-text-muted mt-2">Longitudinal AI forecasting based on historical lab analytics.</p>
                </div>
            </header>

            <main className="flex-1 w-full px-12 py-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="max-w-5xl space-y-12"
                >

                    {/* Predictive Velocity Warning */}
                    <motion.div variants={itemVariants} className="bg-[var(--color-status-warning-bg)] border border-[#F9DED6] p-8 md:p-10 rounded-sm flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-12 h-12 rounded-sm bg-[var(--color-accent)] text-surface flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] mb-2">
                                Velocity Warning: Pre-Diabetes
                            </h2>
                            <p className="text-2xl font-serif text-text-main leading-snug max-w-2xl mb-6">
                                Fasting glucose velocity is trending upward at a rate of 7.5% per annum. At this trajectory, clinical pre-diabetes threshold (100 mg/dL) will be breached within 14 months.
                            </p>
                            <button className="bg-surface text-[var(--color-accent)] px-6 py-3 border border-[#F9DED6] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:border-[var(--color-accent)] transition-colors">
                                Initiate Preventative Protocol
                            </button>
                        </div>
                    </motion.div>

                    {/* Longitudinal Chart Panel */}
                    <motion.div variants={itemVariants} className="bg-surface border border-border rounded-sm p-8 md:p-10">
                        <div className="flex items-center justify-between mb-12 border-b border-border pb-4">
                            <h3 className="text-lg font-bold text-text-main">Fasting Glucose (mg/dL)</h3>
                            <select className="border border-border bg-[var(--color-background)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-text-main rounded-sm focus:outline-none">
                                <option>3 Year View</option>
                                <option>All Time</option>
                            </select>
                        </div>

                        {/* Custom SVG Line Chart - Flat Design */}
                        <div className="h-64 w-full relative">
                            {/* Y-Axis Guidelines */}
                            <div className="absolute inset-0 flex flex-col justify-between">
                                <div className="w-full h-px bg-border flex justify-end"><span className="text-[10px] font-bold text-text-muted -mt-2 bg-surface pl-2">120 (High)</span></div>
                                <div className="w-full h-px border-t border-dashed border-[var(--color-accent)] flex justify-end"><span className="text-[10px] font-bold text-[var(--color-accent)] -mt-2 bg-surface pl-2">100 (Risk)</span></div>
                                <div className="w-full h-px bg-border flex justify-end"><span className="text-[10px] font-bold text-text-muted -mt-2 bg-surface pl-2">80 (Normal)</span></div>
                            </div>

                            {/* Data Line (SVG) */}
                            <svg className="absolute inset-0 h-full w-[calc(100%-60px)] overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <motion.polyline
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="2"
                                    points="0,80 25,75 50,60 75,45 100,20"
                                />
                                {/* Data Points */}
                                <circle cx="0" cy="80" r="3" fill="var(--color-primary)" />
                                <circle cx="25" cy="75" r="3" fill="var(--color-primary)" />
                                <circle cx="50" cy="60" r="3" fill="var(--color-primary)" />
                                <circle cx="75" cy="45" r="3" fill="var(--color-primary)" />
                                {/* Projected Point */}
                                <circle cx="100" cy="20" r="3" fill="var(--color-accent)" className="animate-pulse" />
                            </svg>

                            {/* X-Axis Labels */}
                            <div className="absolute -bottom-8 left-0 w-[calc(100%-60px)] flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                <span>Nov '23</span>
                                <span>Jul '24</span>
                                <span>Apr '25</span>
                                <span>Jan '26</span>
                                <span className="text-[var(--color-accent)]">Projected '27</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary Biomarkers Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-surface border border-border rounded-sm p-8 hover:border-[var(--color-primary)] transition-colors cursor-pointer group">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Stable Trajectory</span>
                                <Check size={16} className="text-[var(--color-status-success-text)]" strokeWidth={2} />
                            </div>
                            <h4 className="text-2xl font-bold text-text-main">LDL Cholesterol</h4>
                            <p className="text-sm font-medium text-text-muted mt-2">Variance &lt; 2% over 36 months.</p>
                        </div>

                        <div className="bg-surface border border-border rounded-sm p-8 hover:border-[var(--color-primary)] transition-colors cursor-pointer group">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Improving</span>
                                <TrendingUp size={16} className="text-[var(--color-status-success-text)]" strokeWidth={2} />
                            </div>
                            <h4 className="text-2xl font-bold text-text-main">Hemoglobin A1C</h4>
                            <p className="text-sm font-medium text-text-muted mt-2">Decreased by 0.2% since last check.</p>
                        </div>
                    </motion.div>

                </motion.div>
            </main>
        </div>
    );
}