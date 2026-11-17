import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

interface StreakTimerProps {
  streak: number;
  secondsRemaining: number;
  onExpire?: () => void;
}

function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function StreakTimer({ streak, secondsRemaining, onExpire }: StreakTimerProps) {
  const [remaining, setRemaining] = useState(secondsRemaining);

  useEffect(() => {
    setRemaining(secondsRemaining);
  }, [secondsRemaining]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(current => {
        if (current <= 1) {
          onExpire?.();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpire]);

  return (
    <View style={styles.container}>
      <Text style={styles.streak}>Streak: {streak}</Text>
      <Text style={styles.countdown}>{formatCountdown(remaining)} left today</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  streak: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  countdown: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
