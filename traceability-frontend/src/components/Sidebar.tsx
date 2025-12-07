"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { label: "📊 Dashboard", href: "/dashboard" },
    { label: "👤 Farmer", href: "/farmer" },
    { label: "📍 Plot", href: "/plot" },
    { label: "🗺️ GIS", href: "/gis" },
    { label: "🏪 Buyer", href: "/buyer" },
    { label: "📦 Receiving", href: "/receiving" },
    { label: "📑 Reports", href: "/reports" },
    { label: "⚙️ Initial Import", href: "/import" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="sidebar fixed left-0 top-0 w-[250px] h-screen bg-white border-r border-gray-200 overflow-y-auto">
            <h2 className="text-center py-5 text-xl font-bold text-blue-600">
                TRACEABILITY
            </h2>

            {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-6 py-3 cursor-pointer transition 
              ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-800 hover:bg-gray-100"}
            `}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}
