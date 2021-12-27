import axios, { AxiosError } from 'axios';
import { useState } from 'react';

import { isAxiosError, validateToken, configureAxios } from '../lib';
import * as api from '../sdk';
import { decodeToken, useStore } from '../store';

interface UseUser {
  refreshToken: (token: string) => Promise<void>;
  error: AxiosError | undefined;
}

export const useRefresh = (): UseUser => {
  const setToken = useStore(state => state.setToken);
  const setSignedIn = useStore(state => state.setSignedIn);
  const updateUserValues = useStore(state => state.updateUserValues);
  const [error, setError] = useState<AxiosError>();

  const refreshToken = async (token: string) => {
    try {
      configureAxios({ accessToken: token });

      const config = api.signIn.show();
      const { headers } = await axios.request(config);
      const { validToken } = validateToken(headers['set-cookie']);

      if (!validToken) {
        setSignedIn(false);
        setToken('');
      } else {
        const data = decodeToken(validToken);

        updateUserValues(data);
        setToken(validToken);
        setSignedIn(true);
      }
    } catch (err) {
      setSignedIn(false);

      if (isAxiosError(err)) {
        setError(err);
      }
    }
  };

  return {
    refreshToken,
    error,
  };
};
