"use client";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Header />
                <main className="p-4">{children}</main>
                <Footer />
            </div>
        </div>
    );
}
