import { useCallback } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { COLORS } from '../constants/colors';
import { Card, Rarity } from '../network/types';
import { CardFace } from './CardFace';
import { RarityOverlayLabel } from './RarityOverlayLabel';

interface SwipeCardProps {
  card: Card;
  onSwiped: (guess: Rarity) => void;
}

// Single-card gesture surface: left=common, right=rare, up=holo. All transform
// math stays on the UI thread via shared values — no per-frame setState — so a
// fast swipe can't drop frames or get swallowed mid-gesture.
export function SwipeCard({ card, onSwiped }: SwipeCardProps) {
  const { width, height } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const hasAnswered = useSharedValue(false);

  const horizontalThreshold = width * 0.28;
  const verticalThreshold = height * 0.16;

  const finishSwipe = useCallback(
    (guess: Rarity) => {
      onSwiped(guess);
    },
    [onSwiped],
  );

  const pan = Gesture.Pan()
    .onUpdate(event => {
      'worklet';
      if (hasAnswered.value) return;
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(event => {
      'worklet';
      if (hasAnswered.value) return;
      const dx = event.translationX;
      const dy = event.translationY;

      if (dy < -verticalThreshold && Math.abs(dy) > Math.abs(dx)) {
        hasAnswered.value = true;
        translateY.value = withTiming(-height * 1.3, { duration: 220 });
        runOnJS(finishSwipe)('holo');
        return;
      }
      if (dx > horizontalThreshold) {
        hasAnswered.value = true;
        translateX.value = withTiming(width * 1.3, { duration: 220 });
        runOnJS(finishSwipe)('rare');
        return;
      }
      if (dx < -horizontalThreshold) {
        hasAnswered.value = true;
        translateX.value = withTiming(-width * 1.3, { duration: 220 });
        runOnJS(finishSwipe)('common');
        return;
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-12, 0, 12],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const leftLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -horizontalThreshold], [0, 1], Extrapolation.CLAMP),
  }));
  const rightLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, horizontalThreshold], [0, 1], Extrapolation.CLAMP),
  }));
  const topLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, -verticalThreshold], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, cardStyle]}>
        <CardFace card={card} />
        <Animated.View style={[styles.labelLeft, leftLabelStyle]} pointerEvents="none">
          <RarityOverlayLabel text="COMMON" color={COLORS.common} />
        </Animated.View>
        <Animated.View style={[styles.labelRight, rightLabelStyle]} pointerEvents="none">
          <RarityOverlayLabel text="RARE" color={COLORS.rare} />
        </Animated.View>
        <Animated.View style={[styles.labelTop, topLabelStyle]} pointerEvents="none">
          <RarityOverlayLabel text="HOLO" color={COLORS.holo} />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '82%',
    height: '78%',
  },
  labelLeft: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  labelRight: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  labelTop: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
  },
});
