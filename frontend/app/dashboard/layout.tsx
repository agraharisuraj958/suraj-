import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans flex">
            {/* Left Fixed Sidebar */}
            <Sidebar />

            {/* Fullscreen Main Content Area */}
            <div className="flex-1 min-w-0 pl-64 flex flex-col min-h-screen">
                <main className="flex-1 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
