import { useShallow } from 'zustand/react/shallow';

import { useStorageService } from './storageService';

export function useAuthStore() {
  return useStorageService(
    useShallow(state => ({
      token: state.token,
      user: state.user,
      setSession: state.setSession,
      clearSession: state.clearSession,
    })),
  );
}

export function useHasHydrated() {
  return useStorageService(state => state.hasHydrated);
}
