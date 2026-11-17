import { useCallback, useState } from 'react';

import { apiClient } from '../../../network';
import { Card } from '../../../network/types';

export function useCardsQuery() {
  const [cards, setCards] = useState<Card[] | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.getCards();
      setCards(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { cards, error, isLoading, fetchCards };
}
