import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { COLORS } from './src/constants/colors';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useHasHydrated } from './src/store/useAuthStore';

function App() {
  const hasHydrated = useHasHydrated();

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        {hasHydrated ? (
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        ) : (
          <View style={styles.loading} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
