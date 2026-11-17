import rawCards from '../data/cards.json';
import { Card, Rarity } from '../types';

interface RawCardRow {
  id: string;
  game: string;
  set_name: string;
  card_name: string;
  card_number: string;
  year: number;
  variety: string | null;
  grader: string | null;
  cert_number: string | null;
  grade: number | null;
  rarity: Rarity;
  price_cents: number;
  population: number | null;
  story: string;
  image_url: string;
  price_history: { date: string; price_cents: number }[];
}

// Parsed from the assignment's data.sql (data-source/data.sql + parse_cards.py)
// into JSON once, ahead of time — see DECISIONS.md. This is the real ~2,000
// card catalogue, not generated fixtures.
export const MOCK_CARDS: Card[] = (rawCards as RawCardRow[]).map(row => ({
  id: row.id,
  game: row.game,
  setName: row.set_name,
  name: row.card_name,
  number: row.card_number,
  year: row.year,
  variety: row.variety,
  grader: row.grader,
  certNumber: row.cert_number,
  grade: row.grade,
  rarity: row.rarity,
  priceCents: row.price_cents,
  population: row.population,
  story: row.story,
  imageUrl: row.image_url,
  priceHistory: row.price_history.map(point => ({
    date: point.date,
    priceCents: point.price_cents,
  })),
}));

export const MOCK_CARD_COUNT = MOCK_CARDS.length;

export function getMockCard(cardId: string): Card | undefined {
  return MOCK_CARDS.find(card => card.id === cardId);
}
