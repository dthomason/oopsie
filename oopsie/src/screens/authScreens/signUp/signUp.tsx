import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import PhoneNumber from 'awesome-phonenumber';
import React, { FC, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { View, StyleSheet, InputAccessoryView, Button } from 'react-native';
import { getFirstInstallTime } from 'react-native-device-info';
import { Text } from 'react-native-elements';
import * as yup from 'yup';

import {
  GradientButton,
  MobileInput,
  ModalFormContainer,
} from '../../../components';
import { useCustomTheme } from '../../../hooks';
import { schemaOptions as validate } from '../../../lib';
import { AuthNavigation, AuthScreenProps } from '../../../navigator';
import { useStore } from '../../../store';
import { useSignUp } from '../hooks/useSignUp';

const validationSchema = yup.object().shape({
  mobile: validate.mobile,
});

interface FormValues {
  mobile: string;
}

const defaultValues: FormValues = {
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
    const phoneUtil = new PhoneNumber(args.mobile, countryCode);

    if (!phoneUtil.isValid()) {
      setError('mobile', { message: 'Invalid Phone Number' });

      return;
    }

    const data = {
      mobile: phoneUtil.getNumber('e164'),
      region: countryCode,
      installTime: getFirstInstallTime(),
    };

    console.log({ data });
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
    <ModalFormContainer givenTitle="Get Started" onClose={handleClose}>
      <Text style={styleText}>
        Oopsie will send an SMS message to verify your phone number. Select your
        country and enter your phone number
      </Text>
      <View style={styles.container}>
        <MobileInput
          defaultValues={defaultValues}
          methods={methods}
          name="mobile"
        />

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
    fontSize: 18,
    width: '90%',
    textAlign: 'center',
    padding: 8,
  },
});
