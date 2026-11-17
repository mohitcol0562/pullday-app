import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { apiClient } from '../network';
import { MOCK_CARD_COUNT } from '../network/mock/cards';

export function CollectionScreen() {
  const [ownedCount, setOwnedCount] = useState<number | null>(null);

  useEffect(() => {
    apiClient.getCollection().then(ids => setOwnedCount(ids.length));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collection</Text>
      <Text style={styles.line}>
        Owned {ownedCount ?? '…'} / {MOCK_CARD_COUNT}
      </Text>
      <Text style={styles.hint}>Card grid lands in M5.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 12,
  },
});
