import { Image, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { Card } from '../network/types';

interface CardFaceProps {
  card: Card;
}

const GAME_LABELS: Record<string, string> = {
  onepiece: 'One Piece',
  pokemon: 'Pokémon',
};

function formatGame(game: string): string {
  return GAME_LABELS[game] ?? game;
}

export function CardFace({ card }: CardFaceProps) {
  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.card}>
        <Image source={{ uri: card.imageUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.gameBadge}>
          <Text style={styles.gameBadgeText}>{formatGame(card.game)}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.name} numberOfLines={1}>
            {card.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {card.setName} · #{card.number}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Shadow lives on this outer, un-clipped view — overflow:'hidden' (needed to
  // round the image/footer inside) would otherwise clip the shadow itself.
  shadowWrapper: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  gameBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gameBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
  },
  footer: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
