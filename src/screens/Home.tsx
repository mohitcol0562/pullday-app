import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { apiClient } from '../network';
import { DailyChallenge, StreakStatus } from '../network/types';
import { useAuthStore } from '../store/useAuthStore';

export function HomeScreen() {
  const { clearSession } = useAuthStore();
  const [streak, setStreak] = useState<StreakStatus | null>(null);
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);

  useEffect(() => {
    apiClient.getStreak().then(setStreak);
    apiClient.getTodayChallenge().then(setChallenge);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.line}>Streak: {streak?.currentStreak ?? '…'}</Text>
      <Text style={styles.line}>
        Today's challenge: {challenge ? `${challenge.answers.length}/8 answered` : 'loading…'}
      </Text>
      <Text style={styles.hint}>Swipe challenge UI lands in M4.</Text>

      <TouchableOpacity style={styles.logout} onPress={clearSession}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  line: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  logout: {
    marginTop: 32,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 14,
  },
});
