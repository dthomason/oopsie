import { NavigationContainer } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import { View, LogBox, StyleSheet } from 'react-native';
import { ThemeProvider } from 'react-native-elements';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BrandIcon } from './components';
import { useRefresh, useCustomTheme } from './hooks';
import { validateToken } from './lib/validateToken';
import { AuthNavigator, AppNavigator } from './navigator';
import { useStore } from './store';

LogBox.ignoreLogs(['Redux']);
LogBox.ignoreAllLogs(true);

const App: FC = () => {
  const { refreshToken } = useRefresh();
  const { iconColor, theme } = useCustomTheme();
  const [isLoading, setIsLoading] = useState(true);
  const signedIn = useStore(state => state.signedIn);

  useEffect(() => {
    if (!isLoading && signedIn) {
      const foundToken = useStore.getState().token;

      if (foundToken) {
        const stillValid = validateToken(foundToken);

        if (stillValid) {
          console.log('Fetching User settings and logging in...');
          refreshToken(foundToken);
        }
      }
    }

    setTimeout(() => setIsLoading(false), 2000);

    return;
  }, [isLoading, refreshToken, signedIn]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {isLoading ? (
          <View style={styles.loading}>
            <BrandIcon color={iconColor} size={110} />
          </View>
        ) : (
          <ThemeProvider theme={theme}>
            <NavigationContainer theme={theme}>
              {signedIn ? <AppNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </ThemeProvider>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
