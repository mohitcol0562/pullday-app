import { useCallback, useEffect, useRef, useState } from 'react';

import { apiClient } from '../../../network';

export function useCollectionQuery() {
  const [ownedCardIds, setOwnedCardIds] = useState<string[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOwnedCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ids = await apiClient.getCollection();
        setOwnedCardIds(ids);
    } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
        setIsLoading(false);
    }
  }, []);

  return { ownedCardIds, error, isLoading, fetchOwnedCards };
}
