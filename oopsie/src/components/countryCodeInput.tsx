import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import CountryPicker, {
  Country,
  DARK_THEME,
  DEFAULT_THEME,
} from 'react-native-country-picker-modal';
import shallow from 'zustand/shallow';

import { useStore } from '../store';

export const CountryCodeInput: FC = ({ children }) => {
  const [countryCode, setCountryCode] = useStore(
    state => [state.countryCode, state.setCountryCode],
    shallow,
  );
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
        withAlphaFilter
        withCallingCode
        withCallingCodeButton
        onSelect={e => handleSelect(e)}
        containerButtonStyle={{
          width: '100%',
          paddingBottom: 30,
        }}
        withEmoji={false}
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
});
