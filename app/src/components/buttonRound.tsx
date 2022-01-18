import React, { FC } from 'react';
import { Button } from 'react-native-elements';

import { useCustomTheme } from '../hooks';

interface Props {
  onPress: () => void;
}

export const ButtonRound: FC<Props> = ({ onPress }) => {
  const {
    theme: { colors },
  } = useCustomTheme();

  const handlePress = () => {
    onPress();
  };

  return (
    <Button
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
