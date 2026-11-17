import { Card, Rarity } from '../../network/types';

export interface HomeFeedback {
  correct: boolean;
  rarity: Rarity;
}

export interface HomeViewProps {
  isLoading: boolean;
  currentStreak: number;
  secondsUntilNextDay: number;
  totalCount: number;
  answeredCount: number;
  completedToday: boolean;
  cards: Card[];
  feedback: HomeFeedback | null;
  revealCard: Card | null;
  onAnswer: (card: Card, guess: Rarity) => void;
  onSwipedAll: () => void;
  onDismissReveal: () => void;
  onStreakDayRollover: () => void;
  onOpenShop: () => void;
  onLogout: () => void;
}
