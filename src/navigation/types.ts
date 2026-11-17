import { SCREENS } from '../constants/screens';

export type RootStackParamList = {
  [SCREENS.LOGIN]: undefined;
  [SCREENS.MAIN_TABS]: undefined;
  [SCREENS.CARD_DETAIL]: { cardId: string };
  [SCREENS.SHOP_FREEZE]: undefined;
  [SCREENS.DEV_MENU]: undefined;
};

export type MainTabParamList = {
  [SCREENS.HOME]: undefined;
  [SCREENS.COLLECTION]: undefined;
};
