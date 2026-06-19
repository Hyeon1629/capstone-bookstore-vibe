import { create } from 'zustand';

export type FilterCategory = 'all' | 'bookstore' | 'library' | 'visited';

interface MapState {
  filterCategory: FilterCategory;
  searchQuery: string;
  focusedPinId: string | null;
  userLocation: { lat: number; lng: number } | null;

  setFilterCategory: (c: FilterCategory) => void;
  setSearchQuery: (q: string) => void;
  setFocusedPinId: (id: string | null) => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  filterCategory: 'all',
  searchQuery: '',
  focusedPinId: null,
  userLocation: null,

  setFilterCategory: (filterCategory) => set({ filterCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFocusedPinId: (focusedPinId) => set({ focusedPinId }),
  setUserLocation: (userLocation) => set({ userLocation }),
}));
