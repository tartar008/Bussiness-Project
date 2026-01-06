// app/farmer/layout.tsx
import React from "react";

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-blue-600 text-white p-4">Farmer Layout Header</header>
            <main className="p-6">{children}</main>
        </div>
    );
}
