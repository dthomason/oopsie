import CookieManager from '@react-native-cookies/cookies';
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Contacts from 'react-native-contacts';
import { Switch, Text } from 'react-native-elements';
import shallow from 'zustand/shallow';

import { useCustomTheme } from '../../../hooks';
import { parseContacts } from '../../../lib';
import * as api from '../../../sdk';
import { useStore } from '../../../store';

export const Home: FC = () => {
  const {
    setSignedIn,
    permissions,
    setPermissions,
    successfulSync,
    setSuccessfulSync,
    currentStamp,
    setCurrentStamp,
  } = useStore(
    ({
      setSignedIn,
      permissions,
      setPermissions,
      successfulSync,
      setSuccessfulSync,
      currentStamp,
      setCurrentStamp,
    }) => ({
      setSignedIn,
      permissions,
      setPermissions,
      successfulSync,
      setSuccessfulSync,
      currentStamp,
      setCurrentStamp,
    }),
    shallow,
  );
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

  useEffect(() => {
    if (permissions === 'undefined') {
      (async () => {
        try {
          const getPermission = await Contacts.checkPermission();

          setPermissions(getPermission);
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [permissions, setPermissions]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (permissions === 'authorized' && !successfulSync) {
      (async () => {
        try {
          const results = await Contacts.getAllWithoutPhotos();

          const { parsed, stamp } = parseContacts(results);

          if (currentStamp === stamp) return setSuccessfulSync(true);

          const config = api.contacts.create({ contacts: parsed });

          const response = await axios.request(config);

          if (response.status === 201) {
            setSuccessfulSync(true);
            setCurrentStamp(stamp);
            console.log('STORED SUCCESSFULLY');
          } else {
            setSuccessfulSync(false);
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }

    return () => {
      source.cancel();
    };
  }, [
    currentStamp,
    permissions,
    setCurrentStamp,
    setSuccessfulSync,
    successfulSync,
  ]);

  useEffect(() => {
    const handleEnabled = async () => {
      await CookieManager.clearAll();
      setSignedIn(false);
    };

    if (enabled) {
      handleEnabled();
    }
  }, [enabled, setSignedIn]);

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
        onChange={() => setEnabled(!enabled)}
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
