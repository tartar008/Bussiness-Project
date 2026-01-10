"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Map,
    MapPin,
    User,
    Store,
    Package,
    FileText,
    Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
    id: string;
    path: string;
    label: string;
    labelTh: string;
    icon: React.ElementType;
};

const navItems: NavItem[] = [
    { id: "dashboard", path: "/dashboard", label: "Dashboard", labelTh: "หน้าหลัก", icon: LayoutDashboard },
    { id: "farmer", path: "/farmer", label: "Farmer", labelTh: "เกษตรกร", icon: User },
    { id: "plot", path: "/plot", label: "Plot", labelTh: "แปลงปลูก", icon: MapPin },
    { id: "gis", path: "/gis", label: "GIS", labelTh: "แผนที่", icon: Map },
    { id: "buyer", path: "/buyer", label: "Buyer", labelTh: "ผู้ซื้อ", icon: Store },
    { id: "receiving", path: "/receiving", label: "Receiving", labelTh: "รับผลผลิต", icon: Package },
    { id: "reports", path: "/reports", label: "Reports", labelTh: "รายงาน", icon: FileText },
    { id: "import", path: "/import", label: "Import", labelTh: "นำเข้าข้อมูล", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
            <div className="p-6 text-xl font-bold text-blue-600">
                TRACEABILITY
            </div>

            <nav className="space-y-1 px-3">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <Button
                            key={item.id}
                            variant={isActive ? "secondary" : "ghost"}
                            className="w-full justify-start gap-3"
                            onClick={() => router.push(item.path)}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{item.labelTh}</span>
                        </Button>
                    );
                })}
            </nav>
        </aside>
    );
}
