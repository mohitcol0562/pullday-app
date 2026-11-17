export type PurchaseState = 'idle' | 'pending' | 'succeeded' | 'failed' | 'cancelled';

export interface ShopFreezeViewProps {
  freezesAvailable: number | undefined;
  maxFreezes: number;
  priceCents: number;
  purchaseState: PurchaseState;
  isLoading: boolean;
  onBack: () => void;
  onBuy: () => void;
  onCancel: () => void;
}
