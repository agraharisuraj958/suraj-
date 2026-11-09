"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Grid,
    Calendar,
    MessageSquare,
    FileText,
    Settings,
    LogOut,
    ArrowRight,
    UserCheck,
    BookOpen,
    Shield,
    FolderOpen
} from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
    const pathname = usePathname();

    const patientNav = [
        { name: "Overview", href: "/dashboard", icon: Grid },
        { name: "Schedule", href: "/dashboard/appointments", icon: Calendar },
        { name: "AI Triage", href: "/dashboard/symptoms", icon: MessageSquare },
        { name: "Lab Analysis", href: "/dashboard/analyzer", icon: FileText },
    ];

    const clinicalNav = [
        { name: "Doctor Portal", href: "/dashboard/doctor", icon: UserCheck },
        { name: "Guidelines RAG", href: "/dashboard/knowledge", icon: BookOpen },
        { name: "System Overview", href: "/dashboard/admin", icon: Shield },
        { name: "Document Vault", href: "/dashboard/admin/documents", icon: FolderOpen },
    ];

    return (
        <aside className="w-64 bg-surface border-r border-border h-screen fixed left-0 top-0 flex flex-col font-sans z-40 select-none">
            {/* Brand Header */}
            <div className="h-20 flex items-center px-8 border-b border-border shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-widest uppercase text-[var(--color-primary)]">
                        MediMind
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mb-1" />
                </Link>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 py-6 overflow-y-auto space-y-6">
                {/* Patient Navigation */}
                <div>
                    <div className="px-8 pb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        Patient Services
                    </div>
                    <ul className="flex flex-col">
                        {patientNav.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center justify-between px-8 py-3.5 border-l-2 transition-all group",
                                            isActive
                                                ? "border-[var(--color-primary)] bg-[var(--color-background)] text-[var(--color-primary)] font-bold"
                                                : "border-transparent text-text-muted hover:bg-[var(--color-background)] hover:text-text-main font-medium"
                                        )}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                                            <span className="text-xs uppercase tracking-wider">{item.name}</span>
                                        </div>
                                        {isActive && <ArrowRight size={14} strokeWidth={2} />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Clinical & System Navigation */}
                <div>
                    <div className="px-8 pb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        Clinical & Operations
                    </div>
                    <ul className="flex flex-col">
                        {clinicalNav.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center justify-between px-8 py-3.5 border-l-2 transition-all group",
                                            isActive
                                                ? "border-[var(--color-primary)] bg-[var(--color-background)] text-[var(--color-primary)] font-bold"
                                                : "border-transparent text-text-muted hover:bg-[var(--color-background)] hover:text-text-main font-medium"
                                        )}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                                            <span className="text-xs uppercase tracking-wider">{item.name}</span>
                                        </div>
                                        {isActive && <ArrowRight size={14} strokeWidth={2} />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* Footer Actions */}
            <div className="border-t border-border shrink-0 bg-surface">
                <Link
                    href="/dashboard/settings"
                    className={clsx(
                        "w-full flex items-center justify-between px-8 py-4 text-xs uppercase tracking-wider transition-all border-l-2",
                        pathname === "/dashboard/settings"
                            ? "border-[var(--color-primary)] bg-[var(--color-background)] text-[var(--color-primary)] font-bold"
                            : "border-transparent text-text-muted hover:bg-[var(--color-background)] hover:text-text-main font-medium"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Settings size={16} strokeWidth={pathname === "/dashboard/settings" ? 2 : 1.5} />
                        <span>Preferences</span>
                    </div>
                    {pathname === "/dashboard/settings" && <ArrowRight size={14} strokeWidth={2} />}
                </Link>
                <Link
                    href="/login"
                    className="w-full flex items-center gap-3 px-8 py-4 border-t border-border text-xs font-bold uppercase tracking-wider text-text-muted hover:bg-[var(--color-status-warning-bg)] hover:text-[var(--color-accent)] transition-colors"
                >
                    <LogOut size={16} strokeWidth={1.5} />
                    <span>Sign Out</span>
                </Link>
            </div>
        </aside>
    );
}

