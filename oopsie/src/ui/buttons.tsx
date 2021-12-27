import React from 'react';
import { FC } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
}

export const BasicButton: FC<Props> = ({ label, onPress }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? 'rgb(83, 128, 184)' : '#1a5e99',
        },
        styles.container,
      ]}
      onPress={() => onPress()}
    >
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 45,
    borderRadius: 25,
  },
  label: {
    fontSize: 18,
    letterSpacing: 1,
    color: 'white',
    fontWeight: '500',
  },
});
