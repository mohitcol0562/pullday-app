import { useShallow } from 'zustand/react/shallow';

import { useStorageService } from './storageService';

export function useCollectionStore() {
  return useStorageService(
    useShallow(state => ({
      ownedCardIds: state.ownedCardIds,
      setOwnedCardIds: state.setOwnedCardIds,
    })),
  );
}
