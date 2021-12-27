import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import BrandIconUniFill from '../../assets/ios/brand-icon-uni-fill.svg';

interface Props {
  color: string;
  size: number;
}

export const BrandIcon: FC<Props> = ({ color, size }) => {
  const adjustedSize = {
    ...styles.container,
    width: size,
  };

  return (
    <View style={adjustedSize}>
      <BrandIconUniFill width="100%" height="100%" fill={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
