import { useCallback, useState } from 'react';

import { apiClient } from '../../../network';

export function useFreezeStatusQuery() {
  const [freezesAvailable, setFreezesAvailable] = useState<number | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFreezeStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const streak = await apiClient.getStreak();
      setFreezesAvailable(streak.freezesAvailable);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { freezesAvailable, error, isLoading, fetchFreezeStatus };
}
