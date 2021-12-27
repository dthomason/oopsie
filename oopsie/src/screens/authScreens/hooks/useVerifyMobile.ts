import axios from 'axios';
import { UseFormSetError } from 'react-hook-form';

import {
  configureAxios,
  isAxiosError,
  parsedAxiosError,
  validateToken,
} from '../../../lib';
import * as api from '../../../sdk';
import { VerifyRequest } from '../../../sdk/src/verify';
import { useStore } from '../../../store';
import { VerifyValues } from '../verify';

interface Config {
  email: string;
  mobile: string;
  code: string;
}

interface UseVerifyMobile {
  sendCode: (args: VerifyRequest) => Promise<void>;
}

export const useVerifyMobile = (
  setError: UseFormSetError<VerifyValues>,
): UseVerifyMobile => {
  const setToken = useStore(state => state.setToken);
  const updateUserValues = useStore(state => state.updateUserValues);
  const setSignedIn = useStore(state => state.setSignedIn);

  const sendCode = async (args: Config) => {
    try {
      const config = api.verify.create({ ...args });

      configureAxios({ withCredentials: true });
      const { data, headers } = await axios.request(config);
      const { validToken, validData } = validateToken(headers['set-cookie']);

      console.log({ validToken, validData });

      if (data.verifiedMobile && validToken && validData) {
        setToken(validToken);
        updateUserValues(validData);
        setSignedIn(true);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        setError('code', { message: parsedAxiosError(err).error });
      }
    }
  };

  return { sendCode };
};
