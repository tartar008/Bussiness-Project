"use client";

import {
  LayoutDashboard,
  Users,
  Map,
  Building2,
  FileSpreadsheet,
  BarChart3,
  Settings,
  HelpCircle,
  Leaf,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { id: "dashboard", path: "/", label: "Dashboard", labelTh: "หน้าหลัก", icon: LayoutDashboard },
  { id: "farmers", path: "/farmers", label: "Farmers", labelTh: "เกษตรกร", icon: Users },
  { id: "plots", path: "/plots", label: "Plots & GIS", labelTh: "แปลง & GIS", icon: Map },
  { id: "collection", path: "/collection-points", label: "Collection Points", labelTh: "จุดรับซื้อ", icon: Building2 },
  { id: "vehicles", path: "/vehicles", label: "Vehicles", labelTh: "รถ & คนขับ", icon: Truck },
  { id: "receiving", path: "/receiving", label: "Receiving", labelTh: "รับซื้อยาง", icon: FileSpreadsheet },
  { id: "reports", path: "/reports", label: "Reports", labelTh: "รายงาน", icon: BarChart3 },
];

const bottomNavItems = [
  { id: "settings", path: "/settings", label: "Settings", labelTh: "ตั้งค่า", icon: Settings },
  { id: "help", path: "/help", label: "Help", labelTh: "ช่วยเหลือ", icon: HelpCircle },
];

interface SidebarProps {
  activeModule?: string;
  onModuleChange?: (module: string) => void;
}

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (item: { id: string; path: string }) => {
    router.push(item.path);          // ✅ Next.js navigation
    onModuleChange?.(item.id);
  };

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold text-sidebar-foreground">
            RubberTrace
          </h1>
          <p className="text-[10px] text-muted-foreground">
            EUDR Traceability
          </p>
        </div>
      </div>

      {/* Main menu */}
      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Main Menu
        </p>

        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={isActive(item.path) ? "navActive" : "nav"}
            className="w-full justify-start"
            onClick={() => handleNav(item)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            <span className="text-sm">{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Bottom menu */}
      <div className="border-t p-4 space-y-1">
        {bottomNavItems.map((item) => (
          <Button
            key={item.id}
            variant="nav"
            className="w-full justify-start"
            onClick={() => handleNav(item)}
          >
            <item.icon className="mr-3 h-4 w-4" />
            <span className="text-sm">{item.label}</span>
          </Button>
        ))}
      </div>
    </aside>
  );
}
