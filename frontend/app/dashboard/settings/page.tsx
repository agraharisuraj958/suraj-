
"use client";

import { useState } from "react";
import {
    User,
    Bell,
    Lock,
    Globe,
    Camera,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";
import { clsx } from "clsx";

export default function PreferencesPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", name: "Personal Profile", icon: User },
        { id: "notifications", name: "Notifications", icon: Bell },
        { id: "security", name: "Security & Access", icon: Lock },
        { id: "system", name: "System Preferences", icon: Globe },
    ];

    return (
        <div className="min-h-screen w-full min-w-0 bg-[var(--color-background)] font-sans flex flex-col">

            {/* PAGE HEADER */}
            <header className="w-full border-b border-border bg-surface px-6 md:px-10 lg:px-12 py-8 md:py-10 shrink-0">
                <div className="w-full max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">
                        Preferences
                    </h1>
                    <p className="text-sm font-medium text-text-muted mt-2">
                        Manage your account settings and system preferences.
                    </p>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 w-full min-w-0 px-6 md:px-10 lg:px-12 py-8 md:py-12">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

                    {/* LEFT NAVIGATION */}
                    <aside className="lg:col-span-3">
                        <nav className="flex flex-row lg:flex-col overflow-x-auto border-b lg:border-b-0 lg:border-l border-border">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const Icon = tab.icon;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={clsx(
                                            "shrink-0 w-auto lg:w-full min-h-[64px] lg:min-h-[72px] flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-4 text-left border-b-2 lg:border-b-0 lg:border-l-2 transition-all lg:-ml-[1px]",
                                            isActive
                                                ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-surface"
                                                : "border-transparent text-text-muted hover:text-text-main hover:bg-surface/50"
                                        )}
                                    >
                                        <Icon size={18} strokeWidth={1.5} />

                                        <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap lg:whitespace-normal">
                                            {tab.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* RIGHT SETTINGS CONTENT */}
                    <div className="lg:col-span-9 min-w-0 pb-20">

                        {/* PERSONAL PROFILE */}
                        {activeTab === "profile" && (
                            <div className="space-y-12 animate-in fade-in duration-500">
                                <section>
                                    <div className="border-b border-text-main pb-4 mb-8">
                                        <h2 className="text-xl font-bold text-text-main">
                                            Personal Information
                                        </h2>
                                    </div>

                                    {/* PROFILE PHOTO */}
                                    <div className="flex items-center gap-8 mb-10">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-sm flex items-center justify-center font-bold text-3xl border border-[var(--color-primary-light)]">
                                                AM
                                            </div>

                                            <button
                                                type="button"
                                                className="absolute -bottom-2 -right-2 w-8 h-8 bg-surface border border-border text-text-main rounded-sm flex items-center justify-center hover:border-[var(--color-primary)] transition-colors shadow-sm"
                                            >
                                                <Camera size={14} />
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-text-main">
                                                Profile Photo
                                            </h3>
                                            <p className="text-xs font-medium text-text-muted mt-1">
                                                JPG or PNG, max 5MB.
                                            </p>
                                        </div>
                                    </div>

                                    {/* PROFILE FORM */}
                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Alex"
                                                className="w-full border border-border bg-surface px-4 py-3 text-sm font-medium text-text-main rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Mercer"
                                                className="w-full border border-border bg-surface px-4 py-3 text-sm font-medium text-text-main rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                defaultValue="alex.mercer@example.com"
                                                disabled
                                                className="w-full border border-border bg-[var(--color-background)] px-4 py-3 text-sm font-medium text-text-muted rounded-sm focus:outline-none cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                defaultValue="+1 (555) 123-4567"
                                                className="w-full border border-border bg-surface px-4 py-3 text-sm font-medium text-text-main rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                            />
                                        </div>
                                    </form>
                                </section>

                                <div className="flex justify-end pt-6 border-t border-border">
                                    <button
                                        type="button"
                                        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center gap-2"
                                    >
                                        Save Changes <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS */}
                        {activeTab === "notifications" && (
                            <div className="space-y-12 animate-in fade-in duration-500">
                                <section>
                                    <div className="border-b border-text-main pb-4 mb-8">
                                        <h2 className="text-xl font-bold text-text-main">
                                            Communication Preferences
                                        </h2>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                title: "Appointment Reminders",
                                                description:
                                                    "Receive SMS and email reminders 24 hours before your visit.",
                                                checked: true,
                                            },
                                            {
                                                title: "AI Triage Alerts",
                                                description:
                                                    "Notify me immediately if an AI assessment flags an urgent condition.",
                                                checked: true,
                                            },
                                            {
                                                title: "Lab Result Summaries",
                                                description:
                                                    "Send a notification when new lab reports have been analyzed.",
                                                checked: false,
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.title}
                                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-surface border border-border rounded-sm"
                                            >
                                                <div>
                                                    <h3 className="text-sm font-bold text-text-main">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs font-medium text-text-muted mt-1">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={item.checked}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-12 h-6 bg-[var(--color-background)] border border-border peer-focus:outline-none rounded-sm after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border after:border-border after:rounded-sm after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] peer-checked:after:translate-x-full peer-checked:after:bg-surface peer-checked:after:border-transparent" />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="flex justify-end pt-6 border-t border-border">
                                    <button
                                        type="button"
                                        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
                                    >
                                        Update Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SECURITY & ACCESS */}
                        {activeTab === "security" && (
                            <div className="space-y-12 animate-in fade-in duration-500">
                                <section>
                                    <div className="border-b border-text-main pb-4 mb-8">
                                        <h2 className="text-xl font-bold text-text-main">
                                            Change Password
                                        </h2>
                                    </div>

                                    <form className="space-y-6">
                                        {[
                                            "Current Password",
                                            "New Password",
                                            "Confirm New Password",
                                        ].map((label) => (
                                            <div key={label} className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                                    {label}
                                                </label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="w-full border border-border bg-surface px-4 py-3 text-sm font-medium text-text-main rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                                />
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            className="bg-surface border border-border hover:border-[var(--color-primary)] text-text-main px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors mt-2"
                                        >
                                            Update Password
                                        </button>
                                    </form>
                                </section>

                                <section>
                                    <div className="border-b border-text-main pb-4 mb-8">
                                        <h2 className="text-xl font-bold text-text-main">
                                            Two-Factor Authentication (2FA)
                                        </h2>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[var(--color-primary-light)] border border-[var(--color-primary-light)] rounded-sm">
                                        <div className="flex items-start gap-4">
                                            <ShieldCheck
                                                size={24}
                                                className="text-[var(--color-primary)] mt-1 shrink-0"
                                                strokeWidth={1.5}
                                            />

                                            <div>
                                                <h3 className="text-sm font-bold text-[var(--color-primary)]">
                                                    Protect Your Health Data
                                                </h3>
                                                <p className="text-xs font-medium text-[var(--color-primary)]/80 mt-1 max-w-md">
                                                    Require an additional security code from your mobile device when signing in from unrecognized devices.
                                                </p>
                                            </div>
                                        </div>

                                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-6 bg-[var(--color-background)] border border-[var(--color-primary)]/30 peer-focus:outline-none rounded-sm after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border after:border-border after:rounded-sm after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] peer-checked:after:translate-x-full peer-checked:after:bg-surface peer-checked:after:border-transparent" />
                                        </label>
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* SYSTEM PREFERENCES */}
                        {activeTab === "system" && (
                            <div className="space-y-12 animate-in fade-in duration-500">
                                <section>
                                    <div className="border-b border-text-main pb-4 mb-8">
                                        <h2 className="text-xl font-bold text-text-main">
                                            Regional & Localization
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                                Display Language
                                            </label>

                                            <select className="w-full border border-border bg-surface px-4 py-3 text-sm font-medium text-text-main rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none">
                                                <option>English (United States)</option>
                                                <option>English (United Kingdom)</option>
                                                <option>Spanish (Español)</option>
                                                <option>French (Français)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                                                Timezone
                                            </label>

                                            <select className="w-full border border-border bg-surface px-4 py-3 text-sm font-medium text-text-main rounded-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none">
                                                <option>Eastern Time (ET)</option>
                                                <option>Pacific Time (PT)</option>
                                                <option>Central European Time (CET)</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}
