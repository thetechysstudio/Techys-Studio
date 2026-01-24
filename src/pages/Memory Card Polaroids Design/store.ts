import { create } from 'zustand';
import { AppState } from './types';

// Extend AppState to match the store signature if needed, 
// or simply use the interface if it matches exactly.
interface AppStore extends AppState { }

export const useAppState = create<AppStore>((set) => ({
  focusedId: null,
  hoveredId: null,
  setFocusedId: (id) => set({ focusedId: id }),
  setHoveredId: (id) => set({ hoveredId: id }),
}));
