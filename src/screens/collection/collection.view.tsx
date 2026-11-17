import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '../../components/AppHeader';
import { COLORS } from '../../constants/colors';
import { styles } from './styles';
import { CollectionViewProps } from './type';

export function CollectionView({ ownedCount, totalCount, isLoading }: CollectionViewProps) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + 12 }]}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Collection</Text>
        <Text style={styles.countLabel}>
          Owned {ownedCount ?? '…'} / {totalCount}
        </Text>
      </View>

      <View style={styles.centered}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.text} />
        ) : (
          <Text style={styles.hint}>Card grid lands in M5.</Text>
        )}
      </View>
    </View>
  );
}
