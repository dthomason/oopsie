import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';

export const ForgotPassword: FC = () => {
  return (
    <View style={styles.container}>
      <Input label="First Name" placeholderTextColor="green" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 3,
    backgroundColor: '#181e34',
  },
});
