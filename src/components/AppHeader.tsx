import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { useServerDate } from '../hooks/useServerDate';

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});

export function AppHeader() {
  const { date, fetchServerDate } = useServerDate();

  useEffect(() => {
    fetchServerDate();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pullday</Text>
      <Text style={styles.date}>{date ? DATE_FORMAT.format(date) : '…'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  date: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
