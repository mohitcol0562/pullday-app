import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User } from '../network/types';

interface AuthSlice {
  token: string | null;
  user: User | null;
  setSession: (token: string, user: User) => void;
  clearSession: () => void;
}

interface CollectionSlice {
  ownedCardIds: string[];
  setOwnedCardIds: (ids: string[]) => void;
}

interface HydrationSlice {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

type StorageState = AuthSlice & CollectionSlice & HydrationSlice;

export const useStorageService = create<StorageState>()(
  persist(
    set => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clearSession: () => set({ token: null, user: null, ownedCardIds: [] }),

      ownedCardIds: [],
      setOwnedCardIds: ownedCardIds => set({ ownedCardIds }),

      hasHydrated: false,
      setHasHydrated: hasHydrated => set({ hasHydrated }),
    }),
    {
      name: 'pullday-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        token: state.token,
        user: state.user,
        ownedCardIds: state.ownedCardIds,
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
