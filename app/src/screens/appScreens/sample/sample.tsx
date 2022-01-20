import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { View } from 'react-native';
import * as yup from 'yup';

import { GradientButton, FieldInput } from '../../../components';
import { notAllowedMessage, requiredMessage } from '../../../lib';
import { useStore } from '../../../store';

const schema = yup.object().shape({
  email: yup.string().label('Email Address').email().required(requiredMessage),
  password: yup
    .string()
    .label('Password')
    .trim()
    .min(6)
    .max(25)
    .matches(/[^']/, notAllowedMessage),
});

const defaultValues = {
  email: '',
  password: '',
};

export const Sample: FC = () => {
  const typedEmail = useStore(state => state.typedValues.email);
  const { setValue, handleSubmit, ...methods } = useForm<FieldValues>({
    resolver: yupResolver(schema),
    defaultValues,
    delayError: 2000,
  });

  const onSubmit = () => {
    console.log('Works Perfectly!');
  };

  useEffect(() => {
    if (typedEmail?.length) {
      setValue('email', typedEmail);
    }
  }, []);

  return (
    <View>
      <FieldInput
        defaultValues={defaultValues}
        name="email"
        methods={methods}
      />
      <FieldInput
        defaultValues={defaultValues}
        name="password"
        methods={methods}
      />
      <GradientButton onPress={handleSubmit(onSubmit)} />
    </View>
  );
};
