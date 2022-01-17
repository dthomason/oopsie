import CookieManager from '@react-native-cookies/cookies';
import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text } from 'react-native-elements';

import { useCustomTheme } from '../../../hooks';
import { useStore } from '../../../store';

export const Home: FC = () => {
  const setSignedIn = useStore(state => state.setSignedIn);
  const successfulSync = useStore(state => state.successfulSync);
  const userValues = useStore(state => state.userValues);
  const [enabled, setEnabled] = useState(false);
  const {
    theme: { colors },
  } = useCustomTheme();

  const readableUserValues = {
    ...userValues,
    mobileNumber: userValues.mobile,
    verifiedMobile: userValues.verifiedMobile,
    newUser: userValues.newUser,
    exp: userValues?.exp ? new Date(userValues.exp) : 0,
  };

  const handleChange = async () => {
    setEnabled(!enabled);

    if (enabled) {
      await CookieManager.clearAll();
      setSignedIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3>Welcome!!</Text>
      <Text h4>Great Job, almost all setup just one more item left.</Text>
      {readableUserValues &&
        Object.entries(readableUserValues).map(([key, value]) => (
          <View key={key}>
            <Text>{`${key}: ${value}`}</Text>
          </View>
        ))}
      <Text h1></Text>
      <Switch
        value={enabled}
        onValueChange={handleChange}
        color={enabled ? colors.secondary : colors.grey0}
      />
      <View style={{ paddingTop: 12 }}>
        <Text h3>{successfulSync ? 'SUCCESS!' : 'NOT QUITE'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
