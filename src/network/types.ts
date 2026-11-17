export type Rarity = 'common' | 'rare' | 'holo';

export interface Card {
  id: string;
  game: string;
  setName: string;
  name: string;
  number: string;
  year: number;
  rarity: Rarity;
  priceCents: number;
  story: string;
  imageUrl: string;
  priceHistory: number[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface ChallengeAnswer {
  cardId: string;
  guess: Rarity;
  correct: boolean;
}

export interface DailyChallenge {
  challengeDay: string;
  cardIds: string[];
  answers: ChallengeAnswer[];
  completed: boolean;
  rewardCardId: string | null;
}

export interface AnswerResult {
  correct: boolean;
  challenge: DailyChallenge;
}

export interface StreakStatus {
  currentStreak: number;
  status: 'active' | 'broken';
  lastCompletedDay: string | null;
  secondsUntilNextDay: number;
  freezesAvailable: number;
}

export interface PurchaseResult {
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  freezesAvailable: number;
}

export interface SessionResult {
  token: string;
  user: User;
}
