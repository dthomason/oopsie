import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
  DARK_THEME,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';

import { useStore } from '../store';

interface Props {
  countryCode: CountryCode;
}

export const CountryCodeInput: FC<Props> = ({ countryCode, children }) => {
  const setCountryCode = useStore(state => state.setCountryCode);
  const isDark = useStore(state => state.isDark);

  const darkMode = isDark ? DARK_THEME : DEFAULT_THEME;

  const handleSelect = (country: Country) => {
    setCountryCode(country.cca2);
  };

  return (
    <View style={styles.container}>
      <CountryPicker
        countryCode={countryCode}
        withFilter
        withFlag
        withFlagButton
        withAlphaFilter
        withCallingCode
        withCallingCodeButton
        onSelect={e => handleSelect(e)}
        containerButtonStyle={styles.button}
        withEmoji
        preferredCountries={['US', 'CA']}
        theme={darkMode}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  button: {
    width: '100%',
    paddingHorizontal: 4,
    height: 50,
  },
});
