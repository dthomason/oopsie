import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { UseFormSetError } from 'react-hook-form';

import { configureAxios, isAxiosError, parsedAxiosError } from '../../../lib';
import { AuthNavigation } from '../../../navigator';
import * as api from '../../../sdk';
import { SignUpRequest, SignUpResponse } from '../../../sdk/src/signUp';
import { useStore } from '../../../store';

interface UseSignUp {
  signUp: (args: SignUpRequest) => void;
}

export const useSignUp = (
  setError: UseFormSetError<SignUpRequest>,
): UseSignUp => {
  const updateUserValues = useStore(state => state.updateUserValues);
  const setTypedValues = useStore(state => state.setTypedValues);
  const navigation = useNavigation<AuthNavigation>();

  const signUp = async (args: SignUpRequest): Promise<void> => {
    try {
      const config = api.signUp.create({ ...args });
      const { data } = await axios.request<SignUpResponse>(config);

      updateUserValues(data);
      setTypedValues({
        email: '',
        mobile: '',
      });

      navigation.replace('Verify', {
        email: data.email,
        mobile: data.mobile,
      });
    } catch (err) {
      if (isAxiosError(err)) {
        setError('password', { message: parsedAxiosError(err).error });
      }
    }
  };

  configureAxios();

  return { signUp };
};
