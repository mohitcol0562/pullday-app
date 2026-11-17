import { useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SCREENS } from '../../constants/screens';
import { MOCK_CARD_COUNT } from '../../network/mock/cards';
import { RootStackParamList } from '../../navigation/types';
import { CollectionView } from './collection.view';
import { useCardsQuery } from './utils/useCardsQuery';
import { useCollectionQuery } from './utils/useCollectionQuery';

export function CollectionContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { ownedCardIds, isLoading: ownedLoading, error: ownedError, fetchOwnedCards } = useCollectionQuery();
  const { cards, isLoading: cardsLoading, error: cardsError, fetchCards } = useCardsQuery();

  useEffect(() => {
    fetchOwnedCards();
    fetchCards();
  }, []);

  if (ownedError || cardsError) {
    // show error popup
  }

  const ownedIds = useMemo(() => new Set(ownedCardIds ?? []), [ownedCardIds]);

  const handleCardPress = (cardId: string) => {
    navigation.navigate(SCREENS.CARD_DETAIL, { cardId });
  };

  return (
    <CollectionView
      cards={cards ?? []}
      ownedIds={ownedIds}
      ownedCount={ownedCardIds?.length}
      totalCount={MOCK_CARD_COUNT}
      isLoading={ownedLoading || cardsLoading}
      onCardPress={handleCardPress}
    />
  );
}
