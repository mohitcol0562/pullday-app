import { useState } from 'react';
import FastImage, { OnLoadEvent } from '@d11/react-native-fast-image';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PriceSparkline } from '../../components/PriceSparkline';
import { COLORS } from '../../constants/colors';
import { Rarity } from '../../network/types';
import { styles } from './styles';
import { CardDetailViewProps } from './type';

const RARITY_COLORS: Record<Rarity, string> = {
  common: COLORS.common,
  rare: COLORS.rare,
  holo: COLORS.holo,
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function CardDetailView({ card, isLoading, onBack }: CardDetailViewProps) {
  const { top } = useSafeAreaInsets();
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      {isLoading || !card ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.text} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.imageWrapper}>
            <FastImage
              source={{ uri: card.imageUrl, cache: FastImage.cacheControl.immutable }}
              // FastImage ships its own narrower `ImageStyle` type that doesn't
              // structurally match this project's resolved react-native FlexStyle
              // (a type-resolution quirk, not a real incompatibility at runtime).
              style={styles.image as never}
              resizeMode={FastImage.resizeMode.cover}
              onLoadStart={() => setIsImageLoading(true)}
              onLoad={(_: OnLoadEvent) => setIsImageLoading(false)}
            />
            {isImageLoading ? (
              <View style={styles.imageLoaderOverlay}>
                <ActivityIndicator color={COLORS.textMuted} />
              </View>
            ) : null}
          </View>

          <Text style={styles.name}>{card.name}</Text>
          <Text style={styles.meta}>
            {card.setName} · #{card.number} · {card.year}
          </Text>

          <View
            style={[
              styles.rarityBadge,
              { borderColor: RARITY_COLORS[card.rarity], backgroundColor: COLORS.background },
            ]}>
            <Text style={[styles.rarityText, { color: RARITY_COLORS[card.rarity] }]}>
              {card.rarity}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Grade &amp; population</Text>
          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statValue}>
                {card.grader ?? '—'} {card.grade ?? ''}
              </Text>
              <Text style={styles.statLabel}>Grade</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{card.population ?? '—'}</Text>
              <Text style={styles.statLabel}>Population</Text>
            </View>
            <View>
              <Text style={styles.statValue}>{formatPrice(card.priceCents)}</Text>
              <Text style={styles.statLabel}>Current price</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Price, last 13 weeks</Text>
          <PriceSparkline history={card.priceHistory} />

          <Text style={styles.sectionTitle}>Story</Text>
          <Text style={styles.story}>{card.story}</Text>
        </ScrollView>
      )}
    </View>
  );
}
