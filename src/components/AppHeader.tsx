import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { useServerDate } from '../hooks/useServerDate';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

interface AppHeaderProps {
  onOpenShop?: () => void;
}

export function AppHeader({ onOpenShop }: AppHeaderProps) {
  const { date, fetchServerDate } = useServerDate();

  useEffect(() => {
    fetchServerDate();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Pullday</Text>
        {onOpenShop ? (
          <TouchableOpacity style={styles.shopButton} onPress={onOpenShop}>
            <Text style={styles.shopButtonText}>❄️ Freezes</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.date}>{date ? DATE_FORMAT.format(date) : '…'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  shopButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  shopButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  date: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
