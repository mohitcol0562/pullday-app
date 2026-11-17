import {
  AnswerResult,
  Card,
  DailyChallenge,
  PurchaseResult,
  Rarity,
  SessionResult,
  StreakStatus,
  User,
} from './types';

export interface ApiClient {
  login(email: string, password: string): Promise<SessionResult>;
  getMe(): Promise<User>;
  getServerTime(): Promise<string>;
  getTodayChallenge(): Promise<DailyChallenge>;
  submitAnswer(cardId: string, guess: Rarity): Promise<AnswerResult>;
  getCollection(): Promise<string[]>;
  getCards(): Promise<Card[]>;
  getCard(cardId: string): Promise<Card>;
  getStreak(): Promise<StreakStatus>;
  purchaseFreeze(idempotencyKey: string): Promise<PurchaseResult>;
}
