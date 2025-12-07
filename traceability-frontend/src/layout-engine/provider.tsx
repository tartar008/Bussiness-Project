"use client";

import { LayoutConfig, defaultLayout } from "./config";
import { useLayoutStore } from "./stores/useLayoutStore";
import { useEffect } from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import BlankLayout from "@/layouts/BlankLayout";

const layouts = {
    default: DefaultLayout,
    blank: BlankLayout,
};

export function LayoutEngine({ children }: { children: React.ReactNode }) {
    const { currentLayout } = useLayoutStore();

    const Layout = layouts[currentLayout] || layouts["default"];

    return <Layout>{children}</Layout>;
}
