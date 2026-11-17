import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Rarity } from '../network/types';
import { SwipeCard } from './SwipeCard';

interface ChallengeSwiperProps {
  cards: Card[];
  onAnswer: (card: Card, guess: Rarity) => void;
  onSwipedAll: () => void;
}

// Owns which of the 8 cards is currently on top; everything else is
// SwipeCard's job. If the active card gets replaced out from under a
// pending gesture (shouldn't happen — see SwipeCard's hasAnswered guard)
// the `key` below forces a clean remount rather than stale shared values.
export function ChallengeSwiper({ cards, onAnswer, onSwipedAll }: ChallengeSwiperProps) {
  const [index, setIndex] = useState(0);

  const handleSwiped = (guess: Rarity) => {
    const card = cards[index];
    if (!card) return;
    onAnswer(card, guess);

    const next = index + 1;
    if (next >= cards.length) {
      onSwipedAll();
    } else {
      setIndex(next);
    }
  };

  const current = cards[index];
  if (!current) {
    return null;
  }

  return (
    <View style={styles.arena}>
      <SwipeCard key={current.id} card={current} onSwiped={handleSwiped} />
    </View>
  );
}

const styles = StyleSheet.create({
  arena: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
