import { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { apiClient } from '../../network';
import { Card, Rarity } from '../../network/types';
import { useAuthStore } from '../../store/useAuthStore';
import { HomeView } from './home.view';
import { HomeFeedback } from './type';
import { useHomeDataQuery } from './utils/useHomeDataQuery';

export function HomeContainer() {
  const { clearSession } = useAuthStore();
  const { data, isLoading, error, fetchHomeData } = useHomeDataQuery();
  const [answeredCount, setAnsweredCount] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [feedback, setFeedback] = useState<HomeFeedback | null>(null);
  const [revealCard, setRevealCard] = useState<Card | null>(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (data) {
      setAnsweredCount(data.challenge.answers.length);
      setCompletedToday(data.challenge.completed);
    }
  }, [data]);

  if (error) {
    // show error popup
  }

  const handleAnswer = async (card: Card, guess: Rarity) => {
    const result = await apiClient.submitAnswer(card.id, guess);

    setFeedback({ correct: result.correct, rarity: card.rarity });
    setTimeout(() => setFeedback(null), 900);
    setAnsweredCount(result.challenge.answers.length);

    if (result.challenge.completed) {
      setCompletedToday(true);
      fetchHomeData();

      if (result.challenge.rewardCardId) {
        const reward = await apiClient.getCard(result.challenge.rewardCardId);
        Image.prefetch(reward.imageUrl).catch(() => {});
        setRevealCard(reward);
      }
    }
  };

  return (
    <HomeView
      isLoading={isLoading && !data}
      currentStreak={data?.streak.currentStreak ?? 0}
      secondsUntilNextDay={data?.streak.secondsUntilNextDay ?? 0}
      totalCount={data?.challenge.cardIds.length ?? 0}
      answeredCount={answeredCount}
      completedToday={completedToday}
      cards={data?.remainingCards ?? []}
      feedback={feedback}
      revealCard={revealCard}
      onAnswer={handleAnswer}
      onSwipedAll={() => {}}
      onDismissReveal={() => setRevealCard(null)}
      onStreakDayRollover={fetchHomeData}
      onLogout={clearSession}
    />
  );
}
