import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
    title: "Traceability System",
    description: "Farm Traceability Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="flex">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main content */}
                    <main className="flex-1 p-6 bg-gray-100 min-h-screen">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
