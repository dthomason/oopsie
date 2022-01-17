import axios from 'axios';
import { useEffect } from 'react';
import Contacts from 'react-native-contacts';
import shallow from 'zustand/shallow';

import { parseContacts } from '../lib';
import * as api from '../sdk/';
import { useStore } from '../store';

export const useContacts = (): void => {
  const {
    permissions,
    setPermissions,
    successfulSync,
    setSuccessfulSync,
    currentStamp,
    setCurrentStamp,
  } = useStore(
    ({
      permissions,
      setPermissions,
      successfulSync,
      setSuccessfulSync,
      currentStamp,
      setCurrentStamp,
    }) => ({
      permissions,
      setPermissions,
      successfulSync,
      setSuccessfulSync,
      currentStamp,
      setCurrentStamp,
    }),
    shallow,
  );

  useEffect(() => {
    if (permissions === 'undefined') {
      (async () => {
        try {
          console.log('Permissions not set, attempting to ask...');
          const getPermission = await Contacts.checkPermission();

          console.log(`Response from user: ${getPermission}`);

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
          console.log('Fetching contacts');
          const results = await Contacts.getAllWithoutPhotos();

          console.log(`Contacts Retreived Amount: ${results.length}`);
          const { parsed, stamp } = parseContacts(results);

          if (currentStamp === stamp) return setSuccessfulSync(true);

          console.log('Pushing to server...');
          const config = api.contacts.create({ contacts: parsed });

          const response = await axios.request(config);

          if (response.status === 201) {
            setSuccessfulSync(true);
            setCurrentStamp(stamp);
            console.log(`STORED SUCCESSFULLY: ${stamp}`);
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
};
