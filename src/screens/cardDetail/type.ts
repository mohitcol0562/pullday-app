import { Card } from '../../network/types';

export interface CardDetailViewProps {
  card: Card | undefined;
  isLoading: boolean;
  onBack: () => void;
}
