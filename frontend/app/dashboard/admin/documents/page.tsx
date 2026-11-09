"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
    UploadCloud, 
    FileText, 
    Trash2, 
    RefreshCw, 
    ArrowLeft, 
    Search, 
    X, 
    CheckCircle2, 
    Filter,
    Plus
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface DocumentItem {
    id: number;
    name: string;
    size: string;
    uploadedBy: string;
    status: "Indexed" | "Processing" | "Failed" | "Uploaded";
    date: string;
    category?: string;
}

export default function DocumentManager() {
    const [documents, setDocuments] = useState<DocumentItem[]>([
        { id: 1, name: "ACC_AHA_Cholesterol_Guidelines_2025.pdf", size: "2.4 MB", uploadedBy: "Dr. Jenkins", status: "Indexed", date: "Nov 08, 2026", category: "Cardiology" },
        { id: 2, name: "Diabetes_Care_Standards_2026.pdf", size: "4.1 MB", uploadedBy: "Admin", status: "Processing", date: "Nov 09, 2026", category: "Endocrinology" },
        { id: 3, name: "Hypertension_Protocol_Draft.pdf", size: "1.2 MB", uploadedBy: "Dr. Webb", status: "Failed", date: "Nov 09, 2026", category: "Neurology" },
        { id: 4, name: "Pediatric_Dosage_Chart.pdf", size: "0.8 MB", uploadedBy: "Admin", status: "Uploaded", date: "Nov 10, 2026", category: "Pediatrics" },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [newDocName, setNewDocName] = useState("");
    const [newDocCategory, setNewDocCategory] = useState("Cardiology");
    const [isUploading, setIsUploading] = useState(false);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    const showFeedback = (msg: string) => {
        setActionFeedback(msg);
        setTimeout(() => setActionFeedback(null), 3500);
    };

    const handleDelete = (id: number) => {
        const docToDelete = documents.find(d => d.id === id);
        setDocuments(prev => prev.filter(d => d.id !== id));
        if (docToDelete) {
            showFeedback(`Removed "${docToDelete.name}" from vector database`);
        }
    };

    const handleRetry = (id: number) => {
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: "Processing" as const } : d));
        showFeedback("Re-indexing document in ChromaDB...");
        setTimeout(() => {
            setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: "Indexed" as const } : d));
            showFeedback("Document successfully indexed & ready for RAG queries");
        }, 2000);
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDocName.trim()) return;

        setIsUploading(true);
        setTimeout(() => {
            const fileName = newDocName.endsWith(".pdf") ? newDocName : `${newDocName}.pdf`;
            const newDoc: DocumentItem = {
                id: Date.now(),
                name: fileName,
                size: "1.8 MB",
                uploadedBy: "Dr. Marcus Webb",
                status: "Processing",
                date: "Today",
                category: newDocCategory,
            };

            setDocuments(prev => [newDoc, ...prev]);
            setIsUploading(false);
            setIsUploadModalOpen(false);
            setNewDocName("");
            showFeedback(`Uploaded "${fileName}" • Vector embeddings processing initiated`);

            // Transition from Processing to Indexed after 2.5s
            setTimeout(() => {
                setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: "Indexed" as const } : d));
                showFeedback(`"${fileName}" indexing complete • Chunks stored in ChromaDB`);
            }, 2500);
        }, 1000);
    };

    const filteredDocs = documents.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.category && doc.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusBadge = (status: DocumentItem["status"]) => {
        switch (status) {
            case "Indexed": return <Badge variant="success">Indexed</Badge>;
            case "Processing": return <Badge variant="warning" className="animate-pulse">Processing</Badge>;
            case "Failed": return <Badge variant="danger">Failed</Badge>;
            default: return <Badge variant="neutral">Uploaded</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans pb-16">
            {/* Editorial Header */}
            <header className="border-b border-border bg-surface px-8 py-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <Link href="/dashboard/admin" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main mb-4 transition-colors">
                            <ArrowLeft size={16} /> Back to System Overview
                        </Link>
                        <h1 className="text-4xl font-bold tracking-tight text-text-main">
                            Clinical Document Vault
                        </h1>
                        <p className="text-sm font-medium text-text-muted mt-2">
                            Manage clinical guidelines, PDFs, and indexed literature for AI RAG synthesis.
                        </p>
                    </div>
                    <Button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-surface px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm self-start md:self-auto shadow-sm"
                    >
                        <UploadCloud size={16} />
                        Upload Document
                    </Button>
                </div>
            </header>

            <main className="p-8 max-w-6xl mx-auto space-y-6">
                {/* Feedback Toast */}
                {actionFeedback && (
                    <div className="p-4 bg-[var(--color-status-success-bg)] border border-[var(--color-primary)]/20 rounded-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 size={18} className="text-[var(--color-primary)] shrink-0" />
                        <span className="text-sm font-bold text-[var(--color-primary)]">
                            {actionFeedback}
                        </span>
                    </div>
                )}

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter guidelines by name or author..."
                            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-sm text-sm focus:outline-none focus:border-[var(--color-primary)] text-text-main"
                        />
                    </div>
                    <div className="text-xs text-text-muted font-medium">
                        {filteredDocs.length} of {documents.length} guidelines displayed
                    </div>
                </div>

                <Card className="overflow-hidden bg-surface border border-border rounded-sm shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-background border-b border-border text-xs uppercase font-semibold text-text-muted">
                            <tr>
                                <th className="px-6 py-4">Document Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Uploaded By</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                                        No documents found matching "{searchQuery}"
                                    </td>
                                </tr>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <tr key={doc.id} className="bg-surface hover:bg-background/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "p-2 rounded-sm text-surface shrink-0",
                                                    doc.status === "Failed" ? "bg-[var(--color-status-danger-text)]" : "bg-[var(--color-primary)]"
                                                )}>
                                                    <FileText size={16} />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-text-main block truncate max-w-sm">
                                                        {doc.name}
                                                    </span>
                                                    <span className="text-xs text-text-muted">{doc.date}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">
                                            {doc.category || "General"}
                                        </td>
                                        <td className="px-6 py-4 text-text-muted">{doc.size}</td>
                                        <td className="px-6 py-4 text-text-main font-medium">{doc.uploadedBy}</td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(doc.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                {doc.status === "Failed" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRetry(doc.id)}
                                                        className="p-1.5 text-text-muted hover:text-[var(--color-primary)] rounded-sm hover:bg-background transition-colors"
                                                        title="Retry vector indexing"
                                                    >
                                                        <RefreshCw size={15} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-1.5 text-text-muted hover:text-[var(--color-status-danger-text)] rounded-sm hover:bg-background transition-colors"
                                                    title="Delete document"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Table Footer */}
                    <div className="px-6 py-4 border-t border-border bg-background flex items-center justify-between text-xs text-text-muted">
                        <span>Total RAG vector chunks: {documents.length * 370}</span>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" disabled>Previous</Button>
                            <Button variant="secondary" size="sm" disabled>Next</Button>
                        </div>
                    </div>
                </Card>
            </main>

            {/* UPLOAD DOCUMENT MODAL */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div 
                        className="bg-surface border border-border rounded-sm max-w-lg w-full p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-sm">
                                    <UploadCloud size={18} />
                                </div>
                                <h3 className="text-xl font-bold text-text-main">Index Clinical Document</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-text-muted hover:text-text-main p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-main block">
                                    Document / Guideline Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newDocName}
                                    onChange={(e) => setNewDocName(e.target.value)}
                                    placeholder="e.g. AHA_Stroke_Management_2026.pdf"
                                    className="w-full px-4 py-3 bg-[var(--color-background)] border border-border rounded-sm text-sm focus:outline-none focus:border-[var(--color-primary)] text-text-main"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-main block">
                                    Specialty Category
                                </label>
                                <select
                                    value={newDocCategory}
                                    onChange={(e) => setNewDocCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--color-background)] border border-border rounded-sm text-sm focus:outline-none focus:border-[var(--color-primary)] text-text-main"
                                >
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Endocrinology">Endocrinology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="General Practice">General Practice</option>
                                </select>
                            </div>

                            {/* Drop Zone Box */}
                            <div className="border-2 border-dashed border-border rounded-sm p-8 text-center bg-[var(--color-background)] hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                                <UploadCloud size={32} className="mx-auto text-text-muted mb-2" />
                                <span className="text-xs font-bold text-text-main block">Click to select PDF or drag and drop</span>
                                <span className="text-[11px] text-text-muted mt-1 block">Maximum file size: 25 MB</span>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading || !newDocName.trim()}
                                    className="px-6 py-2.5 bg-[var(--color-primary)] text-surface text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <RefreshCw size={14} className="animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Upload & Chunk Embeddings</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
