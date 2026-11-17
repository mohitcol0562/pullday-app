import { useState } from 'react';
import FastImage, { OnLoadEvent } from '@d11/react-native-fast-image';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { COLORS } from '../constants/colors';

interface CardThumbProps {
  imageUrl: string;
  owned: boolean;
}

export function CardThumb({ imageUrl, owned }: CardThumbProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={[styles.cell, !owned && styles.unowned]}>
      <FastImage
        source={{ uri: imageUrl, priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable }}
        // FastImage ships its own narrower `ImageStyle` type that doesn't
        // structurally match this project's resolved react-native FlexStyle
        // (a type-resolution quirk, not a real incompatibility at runtime).
        style={styles.image as never}
        resizeMode={FastImage.resizeMode.cover}
        onLoadStart={() => setIsLoading(true)}
        onLoad={(_: OnLoadEvent) => setIsLoading(false)}
      />
      {isLoading ? (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="small" color={COLORS.textMuted} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 0.72,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    flex: 1,
  },
  unowned: {
    opacity: 0.3,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
});
