import PhoneNumber from 'awesome-phonenumber';
import React, { useEffect, FC, useMemo } from 'react';
import {
  useController,
  FieldValues,
  FieldName,
  UseFormReturn,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';

import { useCustomTheme } from '../hooks';
import { useStore } from '../store';

import { CountryCodeInput } from './countryCodeInput';

const storeTypes = ['mobile', 'countryCode'];

type InputProps = {
  defaultValues: FieldValues;
  methods: Partial<UseFormReturn<FieldValues, any>>;
  name: FieldName<FieldValues>;
};

export const MobileInput: FC<InputProps> = ({
  name,
  methods: { control, clearErrors },
}) => {
  const setTypedValues = useStore(state => state.setTypedValues);
  const countryCode = useStore(state => state.countryCode);

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

  const data = useMemo(() => {
    const phoneUtil = new PhoneNumber(field.value, countryCode);

    const maxLength = PhoneNumber.getExample(countryCode, 'mobile').getNumber(
      'national',
    ).length;

    return {
      isValid: phoneUtil.isValid(),
      value: phoneUtil.getNumber('national'),
      isMobile: phoneUtil.isMobile(),
      maxLength,
    };
  }, [field.value, countryCode]);

  const handleTouch = () => {
    clearErrors?.(name);
  };

  useEffect(() => {
    if (storeTypes.includes(name)) {
      setTypedValues({ [name]: field.value });
    }
  }, [field.value]);

  return (
    <View style={styles.container}>
      <CountryCodeInput countryCode={countryCode}>
        <Input
          autoCapitalize="none"
          autoFocus={true}
          containerStyle={{ width: '72%' }}
          clearButtonMode="unless-editing"
          enablesReturnKeyAutomatically={true}
          errorMessage={error?.message ? error.message : ''}
          errorStyle={styles.error}
          inputAccessoryViewID="mobile"
          inputStyle={{ color: colors.text }}
          keyboardType="phone-pad"
          maxLength={data.maxLength}
          onChangeText={field.onChange}
          onTouchStart={handleTouch}
          placeholder="Mobile Number"
          ref={field.ref}
          returnKeyType={'done'}
          textContentType="telephoneNumber"
          value={data.value}
        />
      </CountryCodeInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 16,
  },
  error: {
    textAlign: 'center',
    marginRight: 46,
  },
});
