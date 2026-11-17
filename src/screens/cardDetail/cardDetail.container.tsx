import { useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { SCREENS } from '../../constants/screens';
import { RootStackParamList } from '../../navigation/types';
import { CardDetailView } from './cardDetail.view';
import { useCardDetailQuery } from './utils/useCardDetailQuery';

type CardDetailRouteProp = RouteProp<RootStackParamList, typeof SCREENS.CARD_DETAIL>;

export function CardDetailContainer() {
  const navigation = useNavigation();
  const route = useRoute<CardDetailRouteProp>();
  const { card, isLoading, error, fetchCard } = useCardDetailQuery();

  useEffect(() => {
    fetchCard(route.params.cardId);
  }, [route.params.cardId]);

  if (error) {
    // show error popup
  }

  return <CardDetailView card={card} isLoading={isLoading} onBack={() => navigation.goBack()} />;
}
