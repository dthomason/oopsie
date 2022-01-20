import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import * as yup from 'yup';

import {
  FieldInput,
  GradientButton,
  ModalFormContainer,
} from '../../../components';
import { schemaOptions as validate } from '../../../lib';
import { AuthNavigation, AuthScreenProps } from '../../../navigator';
import { SignInRequest } from '../../../sdk/src/signIn';
import { useStore } from '../../../store';
import { useSignIn } from '../hooks';

const validationSchema = yup.object().shape({
  email: validate.email,
  password: validate.password,
});

interface SignInValues {
  email: string;
  password: string;
}

const defaultValues: SignInValues = {
  email: '',
  password: '',
};

export const SignIn: FC<AuthScreenProps> = () => {
  const typedEmail = useStore(state => state.typedValues.email);
  const navigation = useNavigation<AuthNavigation>();
  const { setValue, handleSubmit, setError, ...methods } = useForm<FieldValues>(
    {
      resolver: yupResolver(validationSchema),
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
    if (typedEmail?.length) {
      setValue('email', typedEmail);
    }
  }, []);

  return (
    <ModalFormContainer givenTitle="Sign In" onClose={handleClose}>
      <View style={styles.container}>
        <FieldInput
          name="email"
          defaultValues={defaultValues}
          methods={methods}
        />
        <FieldInput
          name="password"
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
