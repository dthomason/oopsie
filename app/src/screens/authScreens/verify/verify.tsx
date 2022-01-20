import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import * as yup from 'yup';

import {
  FieldInput,
  GradientButton,
  ModalFormContainer,
} from '../../../components';
import { useCustomTheme } from '../../../hooks';
import { schemaOptions as validate } from '../../../lib/schemaOptions';
import { AuthNavigation, AuthScreenProps } from '../../../navigator';
import { useVerifyMobile } from '../hooks';

const validationSchema = yup.object().shape({
  code: validate.code,
});

export interface VerifyValues {
  code: string;
}

const defaultValues: VerifyValues = {
  code: '',
};

export const Verify: FC<AuthScreenProps> = ({ route }) => {
  const {
    theme: { colors },
  } = useCustomTheme();
  const navigation = useNavigation<AuthNavigation>();
  const { setError, handleSubmit, ...methods } = useForm<FieldValues>({
    resolver: yupResolver(validationSchema),
  });
  const { sendCode } = useVerifyMobile(setError);

  const onSubmit = ({ code }: VerifyValues) => {
    const data = {
      mobile: route.params?.mobile || '',
      code: code,
    };

    sendCode(data);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <ModalFormContainer givenTitle="Verify Mobile" onClose={handleClose}>
      <View style={styles.container}>
        <Text style={{ ...styles.code, color: colors.text }}>
          Enter the code we sent your phone
        </Text>
        <FieldInput
          name="code"
          methods={methods}
          defaultValues={defaultValues}
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
  code: {
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 16,
  },
});
