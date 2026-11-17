import { useEffect } from 'react';
import { MOCK_CARD_COUNT } from '../../network/mock/cards';
import { CollectionView } from './collection.view';
import { useCollectionQuery } from './utils/useCollectionQuery';

export function CollectionContainer() {
  const { ownedCardIds, isLoading, error, fetchOwnedCards } = useCollectionQuery();

  useEffect(() => {
    fetchOwnedCards();
  }, [])


  if(error){
    // show error popup 
  }

  return (
    <CollectionView
      ownedCount={ownedCardIds?.length}
      totalCount={MOCK_CARD_COUNT}
      isLoading={isLoading}
    />
  );
}
