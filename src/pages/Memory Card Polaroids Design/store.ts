import { create } from "zustand";
import type { AppState } from "./types";

export const useAppState = create<AppState>((set) => ({
  focusedId: null,
  hoveredId: null,
  setFocusedId: (id) => set({ focusedId: id }),
  setHoveredId: (id) => set({ hoveredId: id }),
}));
