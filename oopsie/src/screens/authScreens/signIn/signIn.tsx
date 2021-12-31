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
import { SignInRequest } from '../../../sdk/src/user/signIn';
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
  const typedMobile = useStore(state => state.typedValues.mobile);
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
