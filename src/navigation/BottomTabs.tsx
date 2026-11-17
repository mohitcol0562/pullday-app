import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon } from '../components/icons/Icon';
import { COLORS } from '../constants/colors';
import { SCREENS } from '../constants/screens';
import { CollectionContainer } from '../screens/collection';
import { HomeContainer } from '../screens/home';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.text,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.background,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
      }}>
      <Tab.Screen
        name={SCREENS.HOME}
        component={HomeContainer}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={SCREENS.COLLECTION}
        component={CollectionContainer}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="collection" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
