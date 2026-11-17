import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { COLORS } from '../constants/colors';
import { PricePoint } from '../network/types';

interface PriceSparklineProps {
  history: PricePoint[];
  width?: number;
  height?: number;
}

export function PriceSparkline({ history, width = 280, height = 64 }: PriceSparklineProps) {
  if (history.length < 2) {
    return null;
  }

  const prices = history.map(point => point.priceCents);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const padding = 6;

  const points = history
    .map((point, index) => {
      const x = padding + (index / (history.length - 1)) * (width - padding * 2);
      const y = padding + (1 - (point.priceCents - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const lastX = width - padding;
  const lastY =
    padding + (1 - (prices[prices.length - 1] - min) / range) * (height - padding * 2);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Polyline points={points} fill="none" stroke={COLORS.rare} strokeWidth={2} />
        <Circle cx={lastX} cy={lastY} r={3.5} fill={COLORS.rare} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});
