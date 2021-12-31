import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { View, StyleSheet, InputAccessoryView, Button } from 'react-native';
import { CountryCode } from 'react-native-country-picker-modal';
import { Text } from 'react-native-elements';
import * as yup from 'yup';

import {
  FieldInput,
  GradientButton,
  ModalFormContainer,
} from '../../../components';
import { CountryCodeInput } from '../../../components/countryCodeInput';
import { useCustomTheme } from '../../../hooks';
import { schemaOptions as validate } from '../../../lib';
import { AuthNavigation, AuthScreenProps } from '../../../navigator';
import { useStore } from '../../../store';
import { useSignUp } from '../hooks/useSignUp';

const validationSchema = yup.object().shape({
  mobile: validate.mobile,
});

interface FormValues {
  countryCode: CountryCode;
  mobile: string;
}

const defaultValues: FormValues = {
  countryCode: 'US',
  mobile: '',
};

export const SignUp: FC<AuthScreenProps> = () => {
  const navigation = useNavigation<AuthNavigation>();
  const typedValues = useStore(state => state.typedValues);
  const countryCode = useStore(state => state.countryCode);
  const { handleSubmit, setValue, setError, ...methods } = useForm<FieldValues>(
    {
      resolver: yupResolver(validationSchema),
    },
  );
  const {
    theme: { colors },
  } = useCustomTheme();
  const { signUp } = useSignUp(setError);
  const styleText = {
    ...styles.text,
    color: colors.text,
  };

  const onSubmit = (args: FormValues) => {
    const data = {
      countryCode: countryCode,
      mobile: args.mobile,
    };

    signUp(data);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (typedValues.mobile?.length) {
      setValue('mobile', typedValues.mobile);
    }
  }, []);

  return (
    <ModalFormContainer givenTitle="Sign Up" onClose={handleClose}>
      <Text style={styleText}>
        Oopsie will send an SMS message to verify your phone number. Select your
        country and enter your phone number
      </Text>
      <View style={styles.container}>
        <CountryCodeInput>
          <FieldInput
            name="mobile"
            defaultValues={defaultValues}
            methods={methods}
          />
        </CountryCodeInput>

        <GradientButton onPress={handleSubmit(onSubmit)} />
      </View>
      <InputAccessoryView
        nativeID="mobile"
        backgroundColor={colors.card}
        style={styles.accessoryView}
      >
        <Button onPress={handleSubmit(onSubmit)} title="Submit" />
      </InputAccessoryView>
    </ModalFormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessoryView: {
    height: 35,
    width: '100%',
  },
  text: {
    fontSize: 16,
    width: '90%',
    textAlign: 'center',
    padding: 8,
  },
});
