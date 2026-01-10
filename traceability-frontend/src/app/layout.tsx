import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ReactQueryProvider } from "@/providers/react-query";

export const metadata = {
    title: "Traceability System",
    description: "Farm Traceability Dashboard",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="flex min-h-screen">
                <ReactQueryProvider>
                    {/* Sidebar */}
                    <aside className="w-64 h-screen bg-white shadow-md fixed left-0 top-0">
                        <Sidebar />
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
                        {children}
                    </main>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
