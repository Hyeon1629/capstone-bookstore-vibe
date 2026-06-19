import { create } from 'zustand';
import type { Bookstore } from '@/data/bookstores';
import type { RemoteBookstore } from '@/lib/kakaoPlaces';

interface RemoteBookstoresState {
  byId: Map<string, RemoteBookstore>;
  list: RemoteBookstore[];
  upsertResults: (results: RemoteBookstore[]) => void;
  getById: (id: string) => Bookstore | undefined;
}

export const useRemoteBookstoresStore = create<RemoteBookstoresState>((set, get) => ({
  byId: new Map(),
  list: [],
  upsertResults: (results) => {
    set((state) => {
      const nextById = new Map(state.byId);
      for (const r of results) {
        nextById.set(r.id, r);
      }
      return {
        byId: nextById,
        list: Array.from(nextById.values()),
      };
    });
  },
  getById: (id) => {
    return get().byId.get(id);
  },
}));
