import { MAX_FREEZES } from '../constants/freeze';
import { ApiClient } from './ApiClient';
import { MOCK_CARDS, getMockCard } from './mock/cards';
import { MOCK_EMAIL, MOCK_PASSWORD, MOCK_USER } from './mock/user';
import {
  AnswerResult,
  Card,
  ChallengeAnswer,
  DailyChallenge,
  PurchaseResult,
  Rarity,
  SessionResult,
  StreakStatus,
  User,
} from './types';

const CHALLENGE_SIZE = 8;

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(key: string, days: number): string {
  const date = new Date(`${key}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return dateKey(date);
}

function msUntilNextUtcMidnight(): number {
  const now = new Date();
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  return next.getTime() - now.getTime();
}

interface ServerState {
  ownedCardIds: Set<string>;
  currentStreak: number;
  lastCompletedDay: string | null;
  broken: boolean;
  freezesAvailable: number;
  todayChallenge: DailyChallenge | null;
  usedIdempotencyKeys: Set<string>;
}

function seedState(): ServerState {
  const today = dateKey(new Date());
  const yesterday = addDays(today, -1);
  // Mirrors the "today@" seed account: a 12-day streak, not yet done today.
  const ownedCardIds = new Set(MOCK_CARDS.slice(0, 12).map(card => card.id));

  return {
    ownedCardIds,
    currentStreak: 12,
    lastCompletedDay: yesterday,
    broken: false,
    freezesAvailable: 0,
    todayChallenge: null,
    usedIdempotencyKeys: new Set(),
  };
}

export class MockApiClient implements ApiClient {
  private state: ServerState = seedState();

  private runStreakCheck(): void {
    const today = dateKey(new Date());
    const yesterday = addDays(today, -1);
    const { lastCompletedDay } = this.state;

    if (lastCompletedDay === today || lastCompletedDay === yesterday) {
      return;
    }

    if (lastCompletedDay === null) {
      return;
    }

    if (this.state.freezesAvailable > 0) {
      this.state.freezesAvailable -= 1;
      this.state.lastCompletedDay = yesterday;
      return;
    }

    if (this.state.currentStreak > 0) {
      this.state.currentStreak = 0;
      this.state.broken = true;
    }
  }

  async login(email: string, password: string): Promise<SessionResult> {
    if (email.trim().toLowerCase() !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
      throw new Error('Invalid email or password');
    }
    return { token: 'mock-session-token', user: MOCK_USER };
  }

  async getMe(): Promise<User> {
    return MOCK_USER;
  }

  async getServerTime(): Promise<string> {
    // No real backend yet — the device clock stands in for "server now".
    // The real streak engine (M9) must never make this swap-in-place; it
    // computes day boundaries from its own clock, not a client-supplied one.
    return new Date().toISOString();
  }

  async getTodayChallenge(): Promise<DailyChallenge> {
    this.runStreakCheck();
    const today = dateKey(new Date());

    if (this.state.todayChallenge?.challengeDay === today) {
      return this.state.todayChallenge;
    }

    const unowned = MOCK_CARDS.filter(card => !this.state.ownedCardIds.has(card.id));
    const pool = unowned.length >= CHALLENGE_SIZE ? unowned : MOCK_CARDS;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const cardIds = shuffled.slice(0, CHALLENGE_SIZE).map(card => card.id);

    const challenge: DailyChallenge = {
      challengeDay: today,
      cardIds,
      answers: [],
      completed: false,
      rewardCardId: null,
    };
    this.state.todayChallenge = challenge;
    return challenge;
  }

  async submitAnswer(cardId: string, guess: Rarity): Promise<AnswerResult> {
    const challenge = await this.getTodayChallenge();

    const existing = challenge.answers.find(answer => answer.cardId === cardId);
    if (existing) {
      return { correct: existing.correct, challenge };
    }

    const card = getMockCard(cardId);
    if (!card) {
      throw new Error(`Unknown card: ${cardId}`);
    }

    const correct = card.rarity === guess;
    const answer: ChallengeAnswer = { cardId, guess, correct };
    challenge.answers.push(answer);

    if (challenge.answers.length === CHALLENGE_SIZE && !challenge.completed) {
      const unowned = MOCK_CARDS.filter(c => !this.state.ownedCardIds.has(c.id));
      const reward = unowned.length > 0 ? unowned[Math.floor(Math.random() * unowned.length)] : null;

      if (reward) {
        this.state.ownedCardIds.add(reward.id);
        challenge.rewardCardId = reward.id;
      }
      challenge.completed = true;

      const today = dateKey(new Date());
      this.state.currentStreak += 1;
      this.state.lastCompletedDay = today;
      this.state.broken = false;
    }

    return { correct, challenge };
  }

  async getCollection(): Promise<string[]> {
    return Array.from(this.state.ownedCardIds);
  }

  async getCards(): Promise<Card[]> {
    return MOCK_CARDS;
  }

  async getCard(cardId: string): Promise<Card> {
    const card = getMockCard(cardId);
    if (!card) {
      throw new Error(`Unknown card: ${cardId}`);
    }
    return card;
  }

  async getStreak(): Promise<StreakStatus> {
    this.runStreakCheck();
    return {
      currentStreak: this.state.currentStreak,
      status: this.state.broken ? 'broken' : 'active',
      lastCompletedDay: this.state.lastCompletedDay,
      secondsUntilNextDay: Math.round(msUntilNextUtcMidnight() / 1000),
      freezesAvailable: this.state.freezesAvailable,
    };
  }

  async purchaseFreeze(idempotencyKey: string): Promise<PurchaseResult> {
    if (!this.state.usedIdempotencyKeys.has(idempotencyKey)) {
      this.state.usedIdempotencyKeys.add(idempotencyKey);
      if (this.state.freezesAvailable < MAX_FREEZES) {
        this.state.freezesAvailable += 1;
      }
    }
    return { status: 'succeeded', freezesAvailable: this.state.freezesAvailable };
  }
}
