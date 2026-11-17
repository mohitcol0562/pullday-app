import { Card, Rarity } from '../types';

const CREATURE_PARTS = [
  'Ember',
  'Frost',
  'Storm',
  'Shadow',
  'Crystal',
  'Iron',
  'Jade',
  'Solar',
  'Lunar',
  'Coral',
  'Ash',
  'Thorn',
  'Wisp',
  'Marsh',
  'Dune',
];

const CREATURE_KINDS = [
  'Drake',
  'Serpent',
  'Wolf',
  'Hawk',
  'Golem',
  'Sprite',
  'Beetle',
  'Fox',
  'Ray',
  'Stag',
];

const SETS = ['Founders', 'Tidewake', 'Emberfall', 'Glacier Reach', 'Dunewalk'];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) % 2147483648;
    return value / 2147483648;
  };
}

function buildPriceHistory(rand: () => number, base: number): number[] {
  const history: number[] = [];
  let price = base;
  for (let week = 0; week < 13; week += 1) {
    price = Math.max(50, Math.round(price * (0.9 + rand() * 0.25)));
    history.push(price);
  }
  return history;
}

function rarityForIndex(index: number): Rarity {
  const mod = index % 10;
  if (mod === 0) return 'holo';
  if (mod <= 3) return 'rare';
  return 'common';
}

export const MOCK_CARD_COUNT = 60;

export const MOCK_CARDS: Card[] = Array.from({ length: MOCK_CARD_COUNT }, (_, index) => {
  const rand = seededRandom(index + 1);
  const id = `mock_${String(index + 1).padStart(4, '0')}`;
  const rarity = rarityForIndex(index);
  const namePart = CREATURE_PARTS[index % CREATURE_PARTS.length];
  const kindPart = CREATURE_KINDS[Math.floor(index / CREATURE_PARTS.length) % CREATURE_KINDS.length];
  const setName = SETS[index % SETS.length];
  const basePrice = rarity === 'holo' ? 4000 : rarity === 'rare' ? 900 : 150;

  return {
    id,
    game: 'Pullday TCG',
    setName,
    name: `${namePart} ${kindPart}`,
    number: String(index + 1).padStart(3, '0'),
    year: 2021 + (index % 5),
    rarity,
    priceCents: basePrice + Math.floor(rand() * basePrice),
    story: `A ${rarity} find from the ${setName} set, said to channel the spirit of the ${namePart.toLowerCase()} wilds.`,
    imageUrl: `https://picsum.photos/seed/${id}/400/560`,
    priceHistory: buildPriceHistory(rand, basePrice),
  };
});

export function getMockCard(cardId: string): Card | undefined {
  return MOCK_CARDS.find(card => card.id === cardId);
}
