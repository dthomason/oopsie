import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { FieldValues, UseFormSetError } from 'react-hook-form';

import { configureAxios, isAxiosError, parsedAxiosError } from '../../../lib';
import { AuthNavigation } from '../../../navigator';
import * as api from '../../../sdk';
import { SignUpRequest, SignUpResponse } from '../../../sdk/src/signUp';
import { useStore } from '../../../store';

interface UseSignUp {
  signUp: (args: SignUpRequest) => void;
}

export const useSignUp = (
  setError: UseFormSetError<FieldValues>,
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
        mobile: '',
      });

      navigation.replace('Verify', {
        mobile: data.mobile,
      });
    } catch (err) {
      if (isAxiosError(err)) {
        setError('mobile', { message: parsedAxiosError(err).error });
      }
    }
  };

  configureAxios();

  return { signUp };
};
