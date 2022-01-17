import { NavigationContainer } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { View, LogBox, StyleSheet } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import shallow from 'zustand/shallow';

import { BrandIcon } from './components';
import { useRefresh, useCustomTheme } from './hooks';
import { validateToken } from './lib/validateToken';
import { AuthNavigator, AppNavigator } from './navigator';
import { OnboardNavigator } from './navigator/onboardNavigator';
import { useStore } from './store';

LogBox.ignoreLogs(['Redux']);
LogBox.ignoreAllLogs(true);

const App: FC = () => {
  const { refreshToken } = useRefresh();
  const { iconColor, theme } = useCustomTheme();
  const [isLoading, setIsLoading] = useState(true);
  const { signedIn, hasHydrated, isOnboarding } = useStore(
    ({ signedIn, isOnboarding, hasHydrated }) => ({
      signedIn,
      isOnboarding,
      hasHydrated,
    }),
    shallow,
  );

  useEffect(() => {
    if (hasHydrated && signedIn) {
      const foundToken = useStore.getState().token;

      if (foundToken) {
        const stillValid = validateToken(foundToken);

        if (stillValid) {
          console.log('Fetching User settings and logging in...');

          (async () => {
            await refreshToken(foundToken);
          })();

          console.log('Success!');
        }
      }
    }

    setTimeout(() => setIsLoading(false), 1000);

    return;
  }, [hasHydrated, refreshToken, signedIn]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.loading}>
            <BrandIcon color={iconColor} size={140} />
          </View>
        ) : (
          <ThemeProvider theme={theme}>
            <NavigationContainer theme={theme}>
              {!signedIn ? (
                <AuthNavigator />
              ) : isOnboarding ? (
                <OnboardNavigator />
              ) : (
                <AppNavigator />
              )}
            </NavigationContainer>
          </ThemeProvider>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 90,
  },
});
