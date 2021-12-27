import React, { useEffect } from 'react';
import { FC } from 'react';
import {
  useController,
  FieldValues,
  FieldName,
  UseFormReturn,
} from 'react-hook-form';
import { KeyboardType, View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { useCustomTheme } from '../hooks';
import { useStore } from '../store';
import { TextContentType } from '../utils';

interface TextTypes {
  keyboardType: KeyboardType;
  placeholder: string;
  secureText: boolean;
  textContentType: TextContentType;
}

interface FieldNames {
  [key: string]: TextTypes;
}

const textTypes: Record<string, TextTypes> = {
  email: {
    keyboardType: 'email-address',
    placeholder: 'Email Address',
    secureText: false,
    textContentType: 'emailAddress',
  },
  password: {
    keyboardType: 'default',
    placeholder: 'Password',
    secureText: true,
    textContentType: 'password',
  },
  mobile: {
    keyboardType: 'phone-pad',
    placeholder: 'Mobile Number',
    secureText: false,
    textContentType: 'telephoneNumber',
  },
  pin: {
    keyboardType: 'number-pad',
    placeholder: 'Pin Number',
    secureText: false,
    textContentType: 'none',
  },
  newPassword: {
    keyboardType: 'default',
    placeholder: 'Password',
    secureText: true,
    textContentType: 'newPassword',
  },
  secondary: {
    keyboardType: 'default',
    placeholder: 'Confirm Password',
    secureText: true,
    textContentType: 'newPassword',
  },
  code: {
    keyboardType: 'numeric',
    placeholder: 'Verification Code',
    secureText: false,
    textContentType: 'oneTimeCode',
  },
  default: {
    keyboardType: 'default',
    placeholder: 'Default',
    secureText: false,
    textContentType: 'none',
  },
} as FieldNames;

const getType = (name: keyof FieldNames): TextTypes => {
  if (!textTypes[name]) {
    return textTypes['default'];
  } else {
    return textTypes[name];
  }
};

const storeTypes = ['mobile', 'email'];

interface InputProps {
  defaultValues: FieldValues;
  methods: Partial<UseFormReturn<FieldValues, object>>;
  name: FieldName<FieldValues>;
}

export const FieldInput: FC<InputProps> = ({
  defaultValues,
  name,
  methods: { control, setFocus, clearErrors },
}) => {
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
        errorMessage={error && error.message ? error.message : ''}
        inputStyle={{ color: colors.text }}
        keyboardType={getType(name).keyboardType}
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