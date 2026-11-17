import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CardThumb } from '../../components/CardThumb';
import { COLORS } from '../../constants/colors';
import { Card } from '../../network/types';
import { styles } from './styles';
import { CollectionViewProps } from './type';

const COLUMNS = 3;

export function CollectionView({
  cards,
  ownedIds,
  ownedCount,
  totalCount,
  isLoading,
  onCardPress,
}: CollectionViewProps) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + 12 }]}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Collection</Text>
        <Text style={styles.countLabel}>
          Owned {ownedCount ?? '…'} / {totalCount}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={COLORS.text} />
        </View>
      ) : (
        <FlashList
          data={cards}
          keyExtractor={item => item.id}
          numColumns={COLUMNS}
          contentContainerStyle={styles.grid}
          renderItem={({ item }: ListRenderItemInfo<Card>) => (
            <TouchableOpacity style={styles.cellWrapper} onPress={() => onCardPress(item.id)}>
              <CardThumb imageUrl={item.imageUrl} owned={ownedIds.has(item.id)} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
