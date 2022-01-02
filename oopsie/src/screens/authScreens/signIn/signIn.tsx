import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { CountryCode } from 'react-native-country-picker-modal';

import {
  FieldInput,
  GradientButton,
  ModalFormContainer,
} from '../../../components';
import { AuthNavigation, AuthScreenProps } from '../../../navigator';
import { SignInRequest } from '../../../sdk/src/user/signIn';
import { useStore } from '../../../store';
import { useSignIn } from '../hooks';

// const validationSchema = yup.object().shape({
//   mobile: '',
// });

interface FormValues {
  countryCode: CountryCode;
  mobile: string;
}

const defaultValues: FormValues = {
  countryCode: 'US',
  mobile: '',
};

export const SignIn: FC<AuthScreenProps> = () => {
  const typedMobile = useStore(state => state.typedValues.mobile);
  const navigation = useNavigation<AuthNavigation>();
  const { setValue, handleSubmit, setError, ...methods } = useForm<FieldValues>(
    {
      // resolver: yupResolver(validationSchema),
    },
  );
  const { signIn } = useSignIn(setError);

  const onSubmit = (args: SignInRequest) => {
    signIn(args);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (typedMobile?.length) {
      setValue('mobile', typedMobile);
    }
  }, []);

  return (
    <ModalFormContainer givenTitle="Sign In" onClose={handleClose}>
      <View style={styles.container}>
        <FieldInput
          name="mobile"
          defaultValues={defaultValues}
          methods={methods}
        />
        <FieldInput
          name="pin"
          defaultValues={defaultValues}
          methods={methods}
        />
        <GradientButton onPress={handleSubmit(onSubmit)} />
      </View>
    </ModalFormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
