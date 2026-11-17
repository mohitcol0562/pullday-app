import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SCREENS } from '../constants/screens';
import { LoginScreen } from '../screens/Login';
import { useAuthStore } from '../store/useAuthStore';
import { BottomTabs } from './BottomTabs';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { token } = useAuthStore();
  const isAuthed = token !== null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthed ? (
        <Stack.Screen name={SCREENS.MAIN_TABS} component={BottomTabs} />
      ) : (
        <Stack.Screen name={SCREENS.LOGIN} component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
