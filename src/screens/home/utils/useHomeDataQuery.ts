import { useCallback, useState } from 'react';

import { apiClient } from '../../../network';
import { Card, DailyChallenge, StreakStatus } from '../../../network/types';

export interface HomeData {
  streak: StreakStatus;
  challenge: DailyChallenge;
  remainingCards: Card[];
}

export async function loadHomeData(): Promise<HomeData> {
  const [challenge, streak] = await Promise.all([
    apiClient.getTodayChallenge(),
    apiClient.getStreak(),
  ]);

  const answeredIds = new Set(challenge.answers.map(answer => answer.cardId));
  const remainingIds = challenge.cardIds.filter(id => !answeredIds.has(id));
  const remainingCards = await Promise.all(remainingIds.map(id => apiClient.getCard(id)));

  return { streak, challenge, remainingCards };
}

export function useHomeDataQuery() {
  const [data, setData] = useState<HomeData | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHomeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loadHomeData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, fetchHomeData };
}
