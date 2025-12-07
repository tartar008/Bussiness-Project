"use client";

import { ReactNode, useEffect } from "react";
import initTheme from "./theme";
import initLayout from "./layout";
import initAxios from "./axios";

export function PluginProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        initTheme();
        initLayout();
        initAxios();
    }, []);

    return <>{children}</>;
}
