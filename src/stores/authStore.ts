import { create } from 'zustand';
import type { User } from 'firebase/auth';

interface AuthState {
  currentUser: User | null;
  isAuthLoading: boolean;
  setCurrentUser: (u: User | null) => void;
  setAuthLoading: (b: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthLoading: true,
  setCurrentUser: (currentUser) => set({ currentUser }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
}));
