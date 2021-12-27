import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, FC } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';

import AppNameIcon from '../../assets/brand/name_icon.svg';
import { BrandIcon, Pressable } from '../components';
import { AuthNavigation, AuthScreenProps } from '../navigator';
import { useStore } from '../store';

const AnimatedView = Animated.createAnimatedComponent(View);

const buttonColors = {
  text: '#FFFFFF',
  unPressed: '#387FCF',
  pressed: '#316FB6',
};

const darkButton = {
  text: '#000000',
  unPressed: '#FFFFFF',
  pressed: '#EEEEEE',
};
const lightButton = {
  text: '#FFFFFF',
  unPressed: '#000000',
  pressed: '#111111',
};

export const SplashScreen: FC<AuthScreenProps> = () => {
  const navigation = useNavigation<AuthNavigation>();
  const isDark = useStore(state => state.isDark);
  const fadeIn = useMemo(() => new Animated.Value(0), []);
  const animatedWrapper = {
    ...styles.wrapper,
    opacity: fadeIn,
  };
  const phraseStyle = {
    ...styles.typography,
    color: isDark ? '#6699CC' : '#336699',
  };

  const handleSignInPress = () => {
    navigation.navigate('SignIn');
  };
  const handleSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const color = isDark ? '#FFFFFF' : '#000000';

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [fadeIn]);

  return (
    <View style={styles.container}>
      <AnimatedView style={animatedWrapper}>
        <AppNameIcon width="100%" height="100%" fill={color} />
      </AnimatedView>
      <View style={styles.middle}>
        <BrandIcon color={color} size={110} />
      </View>
      <AnimatedView style={animatedWrapper}>
        <Text style={phraseStyle}>{"The Forgetter's Getter"}</Text>
      </AnimatedView>
      <AnimatedView style={animatedWrapper}>
        <Pressable
          buttonText={'Create your free account'}
          onChange={handleSignUpPress}
          buttonColors={buttonColors}
        />
        <Pressable
          buttonText={'Sign In'}
          onChange={handleSignInPress}
          buttonColors={isDark ? darkButton : lightButton}
        />
      </AnimatedView>
      <AnimatedView style={animatedWrapper}>
        <Text style={{ color: isDark ? '#BBBBBB' : '#222222' }}>
          Powered by DaveApps ©2021
        </Text>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  middle: {
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 220,
  },
  wrapper: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 80,
    maxHeight: 115,
    opacity: 0,
  },
  logo: {
    width: '30%',
    height: '30%',
  },
  typography: {
    height: '100%',
    width: '100%',
    textAlign: 'center',
    fontWeight: '500',
    color: '#336699',
    fontSize: 24,
  },
});
