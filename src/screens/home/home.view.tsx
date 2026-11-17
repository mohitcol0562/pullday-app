import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../../components/AppHeader';
import { ChallengeSwiper } from '../../components/ChallengeSwiper';
import { RevealOverlay } from '../../components/RevealOverlay';
import { StreakTimer } from '../../components/StreakTimer';
import { COLORS } from '../../constants/colors';
import { styles } from './styles';
import { HomeViewProps } from './type';

export function HomeView({
  isLoading,
  currentStreak,
  secondsUntilNextDay,
  totalCount,
  answeredCount,
  completedToday,
  cards,
  feedback,
  revealCard,
  onAnswer,
  onSwipedAll,
  onDismissReveal,
  onStreakDayRollover,
  onLogout,
}: HomeViewProps) {
  const { top } = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: top }]}>
        <ActivityIndicator color={COLORS.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top + 12 }]}>
      <AppHeader />

      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Card Challenge</Text>
        <StreakTimer
          streak={currentStreak}
          secondsRemaining={secondsUntilNextDay}
          onExpire={onStreakDayRollover}
        />
      </View>

      <TouchableOpacity style={styles.logout} onPress={onLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      {completedToday ? (
        <View style={styles.centered}>
          <Text style={styles.doneTitle}>Today's challenge is done</Text>
          <Text style={styles.doneHint}>Come back tomorrow for the next one.</Text>
        </View>
      ) : (
        <>
          {feedback ? (
            <View style={[styles.feedback, feedback.correct ? styles.feedbackGood : styles.feedbackBad]}>
              <Text style={styles.feedbackText}>
                {feedback.correct ? 'Correct!' : `Wrong — it was ${feedback.rarity}`}
              </Text>
            </View>
          ) : null}

          <View style={styles.challengeArea}>
            <ChallengeSwiper cards={cards} onAnswer={onAnswer} onSwipedAll={onSwipedAll} />
          </View>

          <View style={styles.progressRow}>
            {Array.from({ length: totalCount }).map((_, index) => (
              <View key={index} style={[styles.dot, index < answeredCount && styles.dotFilled]} />
            ))}
          </View>
          <Text style={styles.progressLabel}>
            Card {Math.min(answeredCount + 1, totalCount)} of {totalCount}
          </Text>
        </>
      )}

      {revealCard ? <RevealOverlay card={revealCard} onDismiss={onDismissReveal} /> : null}
    </View>
  );
}
