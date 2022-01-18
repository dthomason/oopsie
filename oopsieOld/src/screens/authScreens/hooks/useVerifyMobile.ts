import axios from 'axios';
import { FieldValues, UseFormSetError } from 'react-hook-form';

import {
  configureAxios,
  isAxiosError,
  parsedAxiosError,
  validateToken,
} from '../../../lib';
import * as api from '../../../sdk';
import { VerifyRequest } from '../../../sdk/src/verify';
import { useStore } from '../../../store';

interface Config {
  mobile: string;
  code: string;
}

interface UseVerifyMobile {
  sendCode: (args: VerifyRequest) => Promise<void>;
}

export const useVerifyMobile = (
  setError: UseFormSetError<FieldValues>,
): UseVerifyMobile => {
  const setToken = useStore(state => state.setToken);
  const updateUserValues = useStore(state => state.updateUserValues);
  const setSignedIn = useStore(state => state.setSignedIn);

  const sendCode = async (args: Config): Promise<void> => {
    try {
      const config = api.verify.create({ ...args });

      configureAxios({ withCredentials: true });
      const { data, headers } = await axios.request(config);
      const { validToken, validData } = validateToken(headers['set-cookie']);

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
