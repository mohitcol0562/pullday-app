import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { Card } from '../network/types';

interface RevealOverlayProps {
  card: Card;
  onDismiss: () => void;
}

// Unmounted until a reward card exists, so the heaviest work here never
// runs while the user is just swiping through the challenge.
export function RevealOverlay({ card, onDismiss }: RevealOverlayProps) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  return (
    <View style={styles.backdrop}>
      <Animated.View style={[styles.sheet, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.eyebrow}>New card unlocked</Text>
        <Image source={{ uri: card.imageUrl }} style={styles.image} resizeMode="cover" />
        <Text style={styles.name}>{card.name}</Text>
        <Text style={styles.meta}>
          {card.setName} · {card.rarity}
        </Text>

        <TouchableOpacity style={styles.button} onPress={onDismiss}>
          <Text style={styles.buttonText}>Nice</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    width: '80%',
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  image: {
    width: 160,
    height: 220,
    borderRadius: 12,
    marginBottom: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  meta: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  button: {
    width: '100%',
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '600',
  },
});
