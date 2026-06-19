import { create } from 'zustand';

interface MapInitState {
  fallbackArea: string | null;
  setFallbackArea: (s: string | null) => void;
}

export const useMapInitStore = create<MapInitState>((set) => ({
  fallbackArea: null,
  setFallbackArea: (fallbackArea) => set({ fallbackArea }),
}));
