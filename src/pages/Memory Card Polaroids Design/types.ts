
export interface PhotoData {
  id: number;
  url: string;
  title: string;
  location: string;
  date: string;
  description: string;
}

export interface AppState {
  focusedId: number | null;
  setFocusedId: (id: number | null) => void;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
}
