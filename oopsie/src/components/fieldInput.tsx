import React, { useEffect, FC, useState } from 'react';
import {
  useController,
  FieldValues,
  FieldName,
  UseFormReturn,
} from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';

import { useCustomTheme } from '../hooks';
import { useStore } from '../store';

import { getType } from './fieldNames';

const storeTypes = ['mobile', 'countryCode'];

interface InputProps {
  defaultValues: FieldValues;
  methods: Partial<UseFormReturn<FieldValues, any>>;
  name: FieldName<FieldValues>;
}

export const FieldInput: FC<InputProps> = ({
  defaultValues,
  name,
  methods: { control, setFocus, clearErrors },
}) => {
  // const [showAccessView, setShowAccessView] = useState(false);
  const setTypedValues = useStore(state => state.setTypedValues);
  const {
    theme: { colors },
  } = useCustomTheme();
  const {
    field,
    fieldState: { error },
  } = useController<FieldValues>({
    control,
    defaultValue: '',
    name,
  });

  console.log({ error });

  const fieldsArray = Object.keys(defaultValues).map(key => key);

  const isFirst = fieldsArray[0] === name;
  const isLast = fieldsArray[fieldsArray.length - 1] === name;
  const next = fieldsArray[fieldsArray.indexOf(name) + 1];

  const handleTouch = () => {
    clearErrors?.(name);
  };

  const handleNext = (next: string) => {
    if (!isLast) {
      setFocus?.(next);
    }
  };

  useEffect(() => {
    if (storeTypes.includes(name)) {
      setTypedValues({ [name]: field.value });
    }
  }, [field.value]);

  return (
    <View style={styles.container}>
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={isFirst}
        blurOnSubmit={isLast}
        clearButtonMode="unless-editing"
        enablesReturnKeyAutomatically={true}
        errorMessage={error ? error.message : ''}
        inputAccessoryViewID={'none'}
        inputStyle={{ color: colors.text }}
        keyboardType={getType(name).keyboardType}
        maxLength={getType(name).max || 40}
        onChangeText={field.onChange}
        onSubmitEditing={() => (!isLast ? handleNext(next) : field.onBlur)}
        onTouchStart={handleTouch}
        placeholder={getType(name).placeholder}
        ref={field.ref}
        returnKeyType={isLast ? 'done' : 'next'}
        secureTextEntry={getType(name).secureText}
        textContentType={getType(name).textContentType}
        value={field.value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
