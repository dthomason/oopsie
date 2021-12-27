import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import * as yup from 'yup';

import {
  FieldInput,
  GradientButton,
  ModalFormContainer,
} from '../../../components';
import { schemaOptions as validate } from '../../../lib';
import { AuthNavigation, AuthScreenProps } from '../../../navigator';
import { useStore } from '../../../store';
import { useSignUp } from '../hooks/useSignUp';

const validationSchema = yup.object().shape({
  email: validate.email,
  mobile: validate.mobile,
  pin: validate.pin,
  newPassword: validate.newPassword,
  secondary: validate.secondary,
});

interface FormValues {
  email: string;
  mobile: string;
  pin: string;
  newPassword: string;
  secondary: string;
}

const defaultValues: FormValues = {
  email: '',
  mobile: '',
  pin: '',
  newPassword: '',
  secondary: '',
};

export const SignUp: FC<AuthScreenProps> = () => {
  const navigation = useNavigation<AuthNavigation>();
  const typedValues = useStore(state => state.typedValues);
  const { handleSubmit, setValue, setError, ...methods } = useForm<FieldValues>(
    {
      resolver: yupResolver(validationSchema),
    },
  );
  const { signUp } = useSignUp(setError);

  const onSubmit = (args: FormValues) => {
    const data = {
      email: args.email,
      mobile: args.mobile,
      pin: args.pin,
      password: args.newPassword,
    };

    signUp(data);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (typedValues.email?.length) {
      setValue('email', typedValues.email);
    }

    if (typedValues.mobile?.length) {
      setValue('mobile', typedValues.mobile);
    }
  }, []);

  return (
    <ModalFormContainer givenTitle="Sign Up" onClose={handleClose}>
      <View style={styles.container}>
        <FieldInput
          name="email"
          defaultValues={defaultValues}
          methods={methods}
        />
        <FieldInput
          name="mobile"
          defaultValues={defaultValues}
          methods={methods}
        />
        <Text style={{ textAlign: 'center' }}>
          Choose a Pin For Using Voice-to-Contact
        </Text>
        <FieldInput
          name="pin"
          defaultValues={defaultValues}
          methods={methods}
        />
        <FieldInput
          name="newPassword"
          defaultValues={defaultValues}
          methods={methods}
        />
        <FieldInput
          name="secondary"
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
