import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { COLORS } from '../constants/colors';
import { SCREENS } from '../constants/screens';
import { CollectionScreen } from '../screens/Collection';
import { HomeScreen } from '../screens/Home';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: { borderTopColor: COLORS.border },
      }}>
      <Tab.Screen name={SCREENS.HOME} component={HomeScreen} />
      <Tab.Screen name={SCREENS.COLLECTION} component={CollectionScreen} />
    </Tab.Navigator>
  );
}
