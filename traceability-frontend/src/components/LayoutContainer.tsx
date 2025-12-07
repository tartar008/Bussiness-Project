"use client";

export default function LayoutContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-3xl mx-auto p-6">
            {children}
        </div>
    );
}
