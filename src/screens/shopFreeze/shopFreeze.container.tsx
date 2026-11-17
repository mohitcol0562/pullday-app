import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import { FREEZE_PRICE_CENTS, MAX_FREEZES } from '../../constants/freeze';
import { apiClient } from '../../network';
import { runFakePurchase } from '../../services/fakeStore';
import { PurchaseState } from './type';
import { useFreezeStatusQuery } from './utils/useFreezeStatusQuery';
import { ShopFreezeView } from './shopFreeze.view';

export function ShopFreezeContainer() {
  const navigation = useNavigation();
  const { freezesAvailable, isLoading, error, fetchFreezeStatus } = useFreezeStatusQuery();
  const [purchaseState, setPurchaseState] = useState<PurchaseState>('idle');
  const cancelSignal = useRef({ cancelled: false });

  useEffect(() => {
    fetchFreezeStatus();
  }, []);

  if (error) {
    // show error popup
  }

  const handleBuy = async () => {
    cancelSignal.current = { cancelled: false };
    setPurchaseState('pending');

    const result = await runFakePurchase(cancelSignal.current);
    if (cancelSignal.current.cancelled) {
      return;
    }

    if (result === 'succeeded') {
      await apiClient.purchaseFreeze(`freeze-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      await fetchFreezeStatus();
      setPurchaseState('succeeded');
    } else {
      setPurchaseState('failed');
    }
  };

  const handleCancel = () => {
    cancelSignal.current.cancelled = true;
    setPurchaseState('cancelled');
  };

  return (
    <ShopFreezeView
      freezesAvailable={freezesAvailable}
      maxFreezes={MAX_FREEZES}
      priceCents={FREEZE_PRICE_CENTS}
      purchaseState={purchaseState}
      isLoading={isLoading && freezesAvailable === undefined}
      onBack={() => navigation.goBack()}
      onBuy={handleBuy}
      onCancel={handleCancel}
    />
  );
}
