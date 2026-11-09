import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex font-sans bg-[var(--color-background)]">
            {/* Left Panel: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
                <div className="max-w-md w-full mx-auto space-y-10">
                    <div>
                        <Link href="/" className="inline-block">
                            <h1 className="text-xl font-bold tracking-widest uppercase text-[var(--color-primary)] mb-8">
                                MediMind
                            </h1>
                        </Link>
                        <h2 className="text-3xl font-bold text-text-main tracking-tight">
                            Create your account
                        </h2>
                        <p className="text-text-muted mt-2 font-medium">
                            Join our AI-powered clinical care platform.
                        </p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-main" htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="Jane"
                                    required
                                    className="w-full px-4 py-3.5 bg-surface border border-border rounded-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-main" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Doe"
                                    required
                                    className="w-full px-4 py-3.5 bg-surface border border-border rounded-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-main" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="w-full px-4 py-3.5 bg-surface border border-border rounded-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-text-main" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a secure password"
                                required
                                className="w-full px-4 py-3.5 bg-surface border border-border rounded-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface py-4 text-sm font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-3 mt-4"
                        >
                            Complete Registration <ArrowRight size={16} />
                        </button>
                    </form>

                    <p className="text-sm font-medium text-text-muted pt-8 border-t border-border">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[var(--color-primary)] font-bold hover:underline">
                            Sign in here.
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Panel: Editorial Graphic */}
            <div className="hidden lg:flex w-1/2 bg-[var(--color-primary)] text-surface flex-col justify-between p-24 border-l border-border">
                <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-light)]">
                    Patient Onboarding
                </div>
                <div>
                    <h2 className="text-5xl font-medium leading-tight tracking-tight max-w-lg mb-6">
                        Your health. <br />Unified through intelligence.
                    </h2>
                    <p className="text-[var(--color-primary-light)] text-lg max-w-md leading-relaxed">
                        Access our comprehensive suite: instant triage concierge, specialist scheduling, and smart lab diagnostics.
                    </p>
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary-light)] opacity-50">
                    © 2026 MediMind Health
                </div>
            </div>
        </div>
    );
}
