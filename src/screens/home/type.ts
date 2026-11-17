import { Card, Rarity } from '../../network/types';

export interface HomeFeedback {
  correct: boolean;
  rarity: Rarity;
}

export interface HomeViewProps {
  isLoading: boolean;
  currentStreak: number;
  totalCount: number;
  answeredCount: number;
  completedToday: boolean;
  cards: Card[];
  feedback: HomeFeedback | null;
  revealCard: Card | null;
  onAnswer: (card: Card, guess: Rarity) => void;
  onSwipedAll: () => void;
  onDismissReveal: () => void;
  onLogout: () => void;
}
