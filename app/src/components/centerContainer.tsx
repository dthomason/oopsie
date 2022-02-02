import React, { FC } from 'react';
import { StyleSheet } from 'react-native';

export const CenterContainer: FC = ({ children }) => {
  return <div style={styles.centered}>{children}</div>;
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '65%',
  },
});
