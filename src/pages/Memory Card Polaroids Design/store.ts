
import { useState, useCallback } from 'react';
import { AppState } from './types';

export const useAppState = (): AppState => {
  const [focusedId, setFocusedIdState] = useState<number | null>(null);
  const [hoveredId, setHoveredIdState] = useState<number | null>(null);

  const setFocusedId = useCallback((id: number | null) => {
    setFocusedIdState(id);
  }, []);

  const setHoveredId = useCallback((id: number | null) => {
    setHoveredIdState(id);
  }, []);

  return {
    focusedId,
    setFocusedId,
    hoveredId,
    setHoveredId
  };
};
