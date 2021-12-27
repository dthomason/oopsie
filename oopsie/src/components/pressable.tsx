import React, { useState, FC } from 'react';
import {
  Pressable as CustomPressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const borderRadius = 20;
const height = 35;
const width = '100%';

const initialColors = {
  text: '#000000',
  unPressed: '#FFFFFF',
  pressed: '#CCCCCC',
};

interface ButtonColors {
  text: string;
  unPressed: string;
  pressed: string;
}

interface Props extends PressableProps {
  buttonText: string;
  buttonColors?: ButtonColors;
  description?: string;
  onChange?: () => void;
}

export const Pressable: FC<Props> = props => {
  const [isPressing, setIsPressing] = useState(false);

  const buttonColors = props.buttonColors || initialColors;

  const typography = {
    ...styles.text,
    color: buttonColors.text || initialColors.text,
  };
  const pressed = {
    ...styles.pressed,
    backgroundColor: buttonColors.pressed || initialColors.pressed,
  };

  const unPressed = {
    ...styles.unPressed,
    backgroundColor: buttonColors.unPressed || initialColors.unPressed,
  };

  const handlePressIn = () => {
    setIsPressing(true);
    props.onChange?.();
  };

  const handlePressOut = () => {
    setIsPressing(false);
    props.onChange?.();
  };

  return (
    <View style={styles.container}>
      {props.description ? (
        <Text style={styles.description}>{props.description}</Text>
      ) : null}
      <CustomPressable
        style={isPressing ? pressed : unPressed}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        <Text style={typography}>{props.buttonText}</Text>
      </CustomPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    alignItems: 'center',
    backgroundColor: '#CCCCCC',
    borderRadius,
    height,
    justifyContent: 'center',
    width,
    shadowOpacity: 0.1,
    shadowRadius: 0.1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  unPressed: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius,
    height,
    justifyContent: 'center',
    width,
    shadowOpacity: 0.2,
    shadowRadius: 0.2,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  description: {
    paddingBottom: 4,
  },
  text: {
    color: '#330033',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
});
