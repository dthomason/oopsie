import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UseFormSetError } from 'react-hook-form';

import { configureAxios, parsedAxiosError } from '../../../lib';
import { validateToken as parseCookie } from '../../../lib/validateToken';
import { AuthNavigation } from '../../../navigator';
import * as api from '../../../sdk';
import { SignInRequest, SignInResponse } from '../../../sdk/src/signIn';
import { useStore } from '../../../store';
import { isAxiosError } from '../../../utils';

interface UseSignIn {
  signIn: (args: SignInRequest) => Promise<void>;
}

export const useSignIn = (
  setError: UseFormSetError<SignInRequest>,
): UseSignIn => {
  const setSignedIn = useStore(state => state.setSignedIn);
  const updateUserValues = useStore(state => state.updateUserValues);
  const setToken = useStore(state => state.setToken);
  const navigation = useNavigation<AuthNavigation>();

  const signIn = async (args: SignInRequest): Promise<void> => {
    try {
      const config = api.signIn.create({ ...args });

      configureAxios({ withCredentials: true });
      const { data, headers } = await axios.request<SignInResponse>(config);

      const { validToken, validData } = parseCookie(headers['set-cookie']);

      if (data.verifiedMobile && validToken && validData) {
        setToken(validToken);
        updateUserValues(validData);
        setSignedIn(true);
      } else {
        updateUserValues(data);

        navigation.replace('Verify', {
          email: data.email,
          mobile: data.mobile,
        });
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError('password', { message: parsedAxiosError(err).error });
      }
    }
  };

  return {
    signIn,
  };
};
