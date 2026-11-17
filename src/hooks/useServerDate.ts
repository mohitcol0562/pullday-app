import { useCallback, useState } from 'react';

import { apiClient } from '../network';

export function useServerDate() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServerDate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const iso = await apiClient.getServerTime();
      setDate(new Date(iso));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { date, error, isLoading, fetchServerDate };
}
