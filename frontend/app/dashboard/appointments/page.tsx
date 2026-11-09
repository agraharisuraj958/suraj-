"use client";

import { useState } from "react";
import { Search, Calendar as CalendarIcon, ArrowRight, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, MapPin, Clock } from "lucide-react";
import { clsx } from "clsx";

interface Doctor {
    id: string;
    name: string;
    dept: string;
    experience: string;
    initials: string;
    bio: string;
    location: string;
}

const doctorsByDept: Record<string, Doctor> = {
    Cardiology: {
        id: "doc-1",
        name: "Dr. Sarah Jenkins",
        dept: "Cardiologist",
        experience: "15 Yrs Exp.",
        initials: "SJ",
        bio: "Specializes in adult cardiology, heart rhythm disorders, and preventive cardiovascular medicine.",
        location: "Suite 402 • Heart & Vascular Wing",
    },
    Neurology: {
        id: "doc-2",
        name: "Dr. Marcus Webb",
        dept: "Neurologist",
        experience: "18 Yrs Exp.",
        initials: "MW",
        bio: "Expertise in migraine management, neurodegenerative diagnostics, and clinical electrophysiology.",
        location: "Suite 310 • Neurosciences Center",
    },
    "General Practice": {
        id: "doc-3",
        name: "Dr. Elena Rostova",
        dept: "Internal Medicine",
        experience: "12 Yrs Exp.",
        initials: "ER",
        bio: "Comprehensive family health, preventative wellness protocols, and chronic condition management.",
        location: "Suite 105 • Primary Care Pavilion",
    },
};

export default function AppointmentBooking() {
    const [selectedDept, setSelectedDept] = useState<string>("Cardiology");
    const [consultType, setConsultType] = useState<"in-person" | "video">("in-person");
    const [selectedDate, setSelectedDate] = useState(10);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [aiQuery, setAiQuery] = useState("");

    const weekDates = [
        { day: "Mon", date: 9 },
        { day: "Tue", date: 10 },
        { day: "Wed", date: 11 },
        { day: "Thu", date: 12 },
        { day: "Fri", date: 13 },
        { day: "Sat", date: 14 },
        { day: "Sun", date: 15 },
    ];

    const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:30 PM"];

    const currentDoctor = doctorsByDept[selectedDept] || doctorsByDept["Cardiology"];

    const handleAutoSchedule = () => {
        if (!aiQuery.trim()) return;
        const q = aiQuery.toLowerCase();
        if (q.includes("neuro") || q.includes("headache") || q.includes("migraine")) {
            setSelectedDept("Neurology");
        } else if (q.includes("general") || q.includes("fever") || q.includes("checkup")) {
            setSelectedDept("General Practice");
        } else {
            setSelectedDept("Cardiology");
        }
        setSelectedSlot("10:00 AM");
        setSelectedDate(10);
    };

    const handleConfirm = () => {
        if (selectedSlot) {
            setBookingConfirmed(true);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans pb-16">
            {/* Header & AI Bar */}
            <header className="border-b border-border bg-surface px-8 py-10">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-text-main">Schedule a Visit</h1>
                        <p className="text-sm font-medium text-text-muted mt-2">
                            Select your specialist, date, and preferred consultation mode.
                        </p>
                    </div>

                    {/* AI Scheduling Bar */}
                    <div className="flex items-center gap-4 bg-[var(--color-background)] border border-border p-2 rounded-sm focus-within:border-[var(--color-primary)] transition-colors">
                        <div className="pl-4 text-[var(--color-primary)]">
                            <Sparkles size={20} strokeWidth={1.5} />
                        </div>
                        <input
                            type="text"
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAutoSchedule()}
                            placeholder="E.g., 'Book a cardiologist for tomorrow morning' or 'Neurologist for migraines'..."
                            className="flex-1 bg-transparent border-none px-2 py-3 text-sm md:text-base text-text-main placeholder:text-text-muted focus:outline-none font-medium min-w-0"
                        />
                        <button
                            onClick={handleAutoSchedule}
                            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface px-6 sm:px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors shrink-0"
                        >
                            Auto-Schedule
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
                {/* Filters Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="border-b border-text-main pb-4">
                        <h3 className="text-lg font-bold text-text-main">Filters</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                Department
                            </label>
                            <select
                                value={selectedDept}
                                onChange={(e) => {
                                    setSelectedDept(e.target.value);
                                    setBookingConfirmed(false);
                                }}
                                className="w-full border border-border bg-surface px-4 py-3 text-sm font-medium text-text-main rounded-sm focus:outline-none focus:border-[var(--color-primary)]"
                            >
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="General Practice">General Practice</option>
                            </select>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                Consultation Type
                            </label>
                            <div className="space-y-3">
                                <label
                                    onClick={() => setConsultType("in-person")}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div className={clsx(
                                        "w-4 h-4 border rounded-sm flex items-center justify-center transition-colors",
                                        consultType === "in-person"
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-surface"
                                            : "border-border group-hover:border-[var(--color-primary)]"
                                    )}>
                                        {consultType === "in-person" && <div className="w-2 h-2 bg-surface rounded-sm" />}
                                    </div>
                                    <span className="text-sm font-medium text-text-main group-hover:text-[var(--color-primary)]">
                                        In-Person Visit
                                    </span>
                                </label>
                                <label
                                    onClick={() => setConsultType("video")}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div className={clsx(
                                        "w-4 h-4 border rounded-sm flex items-center justify-center transition-colors",
                                        consultType === "video"
                                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-surface"
                                            : "border-border group-hover:border-[var(--color-primary)]"
                                    )}>
                                        {consultType === "video" && <div className="w-2 h-2 bg-surface rounded-sm" />}
                                    </div>
                                    <span className="text-sm font-medium text-text-main group-hover:text-[var(--color-primary)]">
                                        Video Consult
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Clinic Information Card */}
                        <div className="p-4 bg-surface border border-border rounded-sm space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                                Location & Hours
                            </span>
                            <p className="text-xs text-text-main font-medium leading-relaxed">
                                MediMind Main Clinic • 108 Healthcare Blvd
                            </p>
                            <p className="text-[11px] text-text-muted">
                                Mon - Sat: 08:30 AM - 06:00 PM
                            </p>
                        </div>
                    </div>
                </div>

                {/* Doctor List & Booking Calendar */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Booking Confirmation Alert */}
                    {bookingConfirmed && (
                        <div className="p-5 bg-[var(--color-status-success-bg)] border border-[var(--color-primary)]/20 rounded-sm flex items-start gap-4">
                            <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider">
                                    Appointment Confirmed
                                </h4>
                                <p className="text-sm text-text-main font-medium">
                                    Your {consultType === "in-person" ? "in-person consultation" : "video visit"} with{" "}
                                    <strong>{currentDoctor.name}</strong> is scheduled for{" "}
                                    <strong>Nov {selectedDate}, 2026 at {selectedSlot}</strong>.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-surface border border-border rounded-sm flex flex-col md:flex-row overflow-hidden">
                        {/* Doctor Info */}
                        <div className="flex-1 p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r border-border space-y-6">
                            <div className="flex items-start gap-5">
                                <div className="w-16 h-16 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-sm flex items-center justify-center font-bold text-2xl shrink-0">
                                    {currentDoctor.initials}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-text-main">{currentDoctor.name}</h2>
                                    <p className="text-sm font-medium text-[var(--color-accent)] mt-1">
                                        {currentDoctor.dept} • {currentDoctor.experience}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs text-text-muted mt-2">
                                        <MapPin size={13} className="shrink-0" />
                                        <span>{currentDoctor.location}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-text-main leading-relaxed font-medium">
                                {currentDoctor.bio}
                            </p>

                            <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                                <div className="p-3 bg-[var(--color-background)] rounded-sm border border-border">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                                        Consultation Fee
                                    </span>
                                    <span className="text-base font-bold text-text-main">$150.00</span>
                                </div>
                                <div className="p-3 bg-[var(--color-background)] rounded-sm border border-border">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted block">
                                        Insurance
                                    </span>
                                    <span className="text-base font-bold text-[var(--color-status-success-text)]">Accepted</span>
                                </div>
                            </div>
                        </div>

                        {/* Calendar & Slots */}
                        <div className="w-full md:w-[380px] lg:w-[420px] p-6 sm:p-8 bg-[var(--color-background)] shrink-0 flex flex-col justify-between">
                            <div>
                                {/* Month Navigation */}
                                <div className="flex items-center justify-between mb-4">
                                    <button className="p-1 rounded text-text-muted hover:text-text-main transition-colors">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span className="text-xs font-bold uppercase tracking-widest text-text-main">
                                        November 2026
                                    </span>
                                    <button className="p-1 rounded text-text-muted hover:text-text-main transition-colors">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                {/* Responsive Calendar Days Grid (7 Columns) */}
                                <div className="grid grid-cols-7 gap-1.5 mb-6">
                                    {weekDates.map((d) => {
                                        const isSelected = selectedDate === d.date;
                                        return (
                                            <button
                                                key={d.date}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDate(d.date);
                                                    setBookingConfirmed(false);
                                                }}
                                                className={clsx(
                                                    "flex flex-col items-center justify-center py-2.5 px-1 rounded-sm transition-all border min-w-0",
                                                    isSelected
                                                        ? "bg-[var(--color-primary)] text-surface border-[var(--color-primary)] font-bold shadow-sm"
                                                        : "bg-surface text-text-main border-border hover:border-text-muted font-medium"
                                                )}
                                            >
                                                <span className={clsx(
                                                    "text-[10px] uppercase font-semibold leading-none mb-1",
                                                    isSelected ? "text-surface/80" : "text-text-muted"
                                                )}>
                                                    {d.day}
                                                </span>
                                                <span className="text-sm font-bold leading-none">
                                                    {d.date}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Time Slots Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                        Available Slots • Nov {selectedDate}
                                    </span>
                                </div>

                                {/* Time Slots Grid */}
                                <div className="grid grid-cols-2 gap-2.5 mb-6">
                                    {timeSlots.map((slot) => {
                                        const isSelected = selectedSlot === slot;
                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedSlot(slot);
                                                    setBookingConfirmed(false);
                                                }}
                                                className={clsx(
                                                    "text-xs font-bold py-2.5 px-3 border rounded-sm transition-all text-center tracking-wider",
                                                    isSelected
                                                        ? "border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold"
                                                        : "bg-surface border-border text-text-main hover:border-text-muted font-medium"
                                                )}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Confirm Action */}
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={!selectedSlot}
                                className="w-full bg-[var(--color-primary)] text-surface py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-sm"
                            >
                                Confirm Booking <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
