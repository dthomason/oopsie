import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import { ModalFormContainer } from './modalFormContainer';

interface Props {
  onClose: () => void;
  children: ChildNode;
  title: string;
}

export const AuthFormWrap: FC<Props> = ({ children, onClose, title }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <ModalFormContainer givenTitle={title} onClose={handleClose}>
      <View style={styles.container}>{children}</View>
    </ModalFormContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
