import React, { FC } from 'react';
import { Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import { useCustomTheme } from '../hooks';

interface Props {
  onPress: () => void;
}

export const GradientButton: FC<Props> = ({ onPress }) => {
  const { theme } = useCustomTheme();
  const { colors } = theme;

  const handlePress = () => {
    onPress();
  };

  const darkModeStyle = {
    colors: [colors.background, colors.grey0],
    start: { x: 0.003, y: -0.9 },
    end: { x: 0, y: 1.8 },
  };

  const lightModeStyle = {
    colors: [colors.background, colors.grey4],
    start: { x: 0.003, y: -0.9 },
    end: { x: 0, y: 1.8 },
  };

  const gradient = theme.dark ? darkModeStyle : lightModeStyle;

  return (
    <Button
      ViewComponent={LinearGradient}
      linearGradientProps={gradient}
      type="outline"
      raised={true}
      titleStyle={{ color: colors.text, fontWeight: '500' }}
      containerStyle={{ borderRadius: 25, width: '80%' }}
      buttonStyle={{ backgroundColor: colors.background, borderWidth: 2 }}
      title="SUBMIT"
      onPress={handlePress}
    />
  );
};
