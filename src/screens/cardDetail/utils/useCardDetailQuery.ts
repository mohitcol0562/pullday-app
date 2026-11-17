import { useCallback, useState } from 'react';

import { apiClient } from '../../../network';
import { Card } from '../../../network/types';

export function useCardDetailQuery() {
  const [card, setCard] = useState<Card | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCard = useCallback(async (cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiClient.getCard(cardId);
      setCard(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { card, error, isLoading, fetchCard };
}
