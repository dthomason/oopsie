import React, { FC } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { Text } from 'react-native-elements';

import DownPoint from '../../assets/svg-icons-general/down.svg';
import { useCustomTheme } from '../hooks';

interface Props {
  onClose: () => void;
  givenTitle: string;
}

export const ModalFormContainer: FC<Props> = ({
  onClose,
  givenTitle,
  children,
}) => {
  const {
    theme: { colors },
  } = useCustomTheme();

  const handleClose = () => {
    onClose();
  };

  return (
    <KeyboardAvoidingView behavior="height">
      <View style={styles.top}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View>
            <DownPoint width={32} height={40} fill={colors.text} />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.titleWrap}>
          <Text h3 style={{ color: colors.primary }}>
            {givenTitle}
          </Text>
        </View>
      </View>
      <View style={styles.children}>{children}</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-around',
  },
  titleWrap: {
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
  },
  children: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
