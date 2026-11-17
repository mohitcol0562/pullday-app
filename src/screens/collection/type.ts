import { Card } from '../../network/types';

export interface CollectionViewProps {
  cards: Card[];
  ownedIds: Set<string>;
  ownedCount: number | undefined;
  totalCount: number;
  isLoading: boolean;
  onCardPress: (cardId: string) => void;
}
