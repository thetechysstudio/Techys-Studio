export interface PhotoData {
  id: number;
  url: string;        // mapped from API: image
  title: string;
  subtitle: string;   // mapped from API: subtile
  description: string;
  tagline: string;    // keep as tagline
  size: string;       // keep as size
}

export interface AppState {
  focusedId: number | null;
  setFocusedId: (id: number | null) => void;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
}
