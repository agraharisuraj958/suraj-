import { HTMLAttributes } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "danger" | "warning" | "success" | "neutral";
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
    const variants = {
        danger: "bg-[var(--color-status-danger-bg)] text-[var(--color-status-danger-text)]",
        warning: "bg-[var(--color-status-warning-bg)] text-[var(--color-status-warning-text)]",
        success: "bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]",
        neutral: "bg-background text-text-muted border border-border",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}