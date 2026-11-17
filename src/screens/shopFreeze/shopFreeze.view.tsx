import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../../constants/colors';
import { styles } from './styles';
import { ShopFreezeViewProps } from './type';

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function ShopFreezeView({
  freezesAvailable,
  maxFreezes,
  priceCents,
  purchaseState,
  isLoading,
  onBack,
  onBuy,
  onCancel,
}: ShopFreezeViewProps) {
  const { top } = useSafeAreaInsets();
  const atMax = freezesAvailable !== undefined && freezesAvailable >= maxFreezes;
  const isPending = purchaseState === 'pending';

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.text} />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.freezeBadge}>
            <Text style={styles.freezeEmoji}>❄️</Text>
          </View>

          <Text style={styles.title}>Streak freeze</Text>
          <Text style={styles.owned}>
            Freezes owned: {freezesAvailable ?? 0} / {maxFreezes}
          </Text>
          <Text style={styles.hint}>
            A held freeze automatically covers one missed day instead of breaking your streak.
          </Text>

          {purchaseState === 'succeeded' ? (
            <View style={[styles.feedback, styles.feedbackGood]}>
              <Text style={styles.feedbackText}>Freeze purchased!</Text>
            </View>
          ) : null}
          {purchaseState === 'failed' ? (
            <View style={[styles.feedback, styles.feedbackBad]}>
              <Text style={styles.feedbackText}>Purchase failed — please try again.</Text>
            </View>
          ) : null}
          {purchaseState === 'cancelled' ? (
            <View style={styles.feedback}>
              <Text style={styles.feedbackText}>Purchase cancelled.</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.priceButton, (atMax || isPending) && styles.priceButtonDisabled]}
            onPress={onBuy}
            disabled={atMax || isPending}>
            {isPending ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.priceButtonText}>
                {atMax ? 'Max freezes owned' : `Buy freeze — ${formatPrice(priceCents)}`}
              </Text>
            )}
          </TouchableOpacity>

          {isPending ? (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
}
