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
  const setIsOnboarding = useStore(state => state.setIsOnboarding);
  const [error, setError] = useState<AxiosError>();

  const refreshToken = async (token: string): Promise<void> => {
    try {
      configureAxios({ accessToken: token });

      console.log('Refreshing Token...');

      const config = api.signIn.show();
      const { headers } = await axios.request(config);
      const { validToken } = validateToken(headers['set-cookie']);

      if (!validToken) {
        setSignedIn(false);
        setToken('');
        console.log('Not a Valid Token, Please Sign In Again');
      } else {
        const data = decodeToken(validToken);

        setIsOnboarding(data.newUser);

        console.log({ data });

        updateUserValues(data);
        setToken(validToken);
        setSignedIn(true);
        console.log('Token Updated!!');
      }
    } catch (err) {
      setSignedIn(false);

      console.error(err);

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
