import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Icon, Divider } from 'react-native-elements';

import { useCustomTheme } from '../hooks/useCustomTheme';
import { AppNavigation } from '../navigator';

import { BrandIcon } from './brandIcon';

interface Props {
  onPress?: () => void;
}

export const HeaderAppBar: FC<Props> = ({ onPress }) => {
  const {
    theme: { colors },
  } = useCustomTheme();
  const navigation = useNavigation<AppNavigation>();

  const handlePress = () => {
    onPress?.();
    navigation.navigate('Settings');
  };

  return (
    <View>
      <Header
        containerStyle={{ backgroundColor: colors.card }}
        centerComponent={
          <View style={styles.sizing}>
            <BrandIcon color={colors.text} size={40} />
          </View>
        }
        rightComponent={
          <Icon
            onPress={handlePress}
            name="menu"
            type="feather"
            color={colors.text}
            size={30}
            containerStyle={styles.sizing}
          />
        }
      />
      <Divider width={2} color={colors.border} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  sizing: {
    width: 40,
    height: 40,
  },
});
