import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

interface RarityOverlayLabelProps {
  text: string;
  color: string;
}

export function RarityOverlayLabel({ text, color }: RarityOverlayLabelProps) {
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    margin: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
