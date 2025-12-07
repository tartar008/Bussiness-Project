import { create } from "zustand";

interface LayoutState {
    currentLayout: "default" | "blank";
    setLayout: (l: "default" | "blank") => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
    currentLayout: "default",
    setLayout: (l) => set({ currentLayout: l }),
}));
