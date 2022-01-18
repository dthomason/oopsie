import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';
import { useColorScheme } from 'react-native';
import { colors, Theme as ElementTheme } from 'react-native-elements';

import { useStore } from '../store';

const white = '#FFFFFF';
const black = '#000000';

const theme = {
  Button: {
    containerStyle: {
      margin: 5,
    },
    buttonStyle: {
      width: '100%',
      borderRadius: 35,
      backgroundColor: 'green',
    },
    titleStyle: {
      color: 'red',
    },
  },
  Text: {
    style: {
      color: black,
    },
  },
};

const DefaultElements = {
  ...theme,
  colors: {
    ...colors,
    primary: '#387FCF',
    secondary: '#6AD45E',
    white: white,
    black: black,
    card: '#D1D4D8',
    background: white,
    border: colors.grey4,
    text: black,
  },
  Text: {
    style: {
      color: black,
    },
  },
};

const DarkElements = {
  ...theme,
  colors: {
    ...colors,
    primary: '#387FCF',
    secondary: '#6AD45E',
    white: white,
    black: black,
    card: '#2B2B2B',
    background: black,
    text: white,
    border: colors.grey0,
  },
  Text: {
    style: {
      color: white,
    },
  },
};

const DefaultNav = {
  ...NavigationDefaultTheme,
  dark: false,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: DefaultElements.colors.primary,
    background: DefaultElements.colors.background,
    card: DefaultElements.colors.card,
    text: DefaultElements.colors.text,
    border: DefaultElements.colors.border,
    notification: DefaultElements.colors.success,
  },
};

const DarkNav = {
  ...NavigationDarkTheme,
  dark: true,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: DarkElements.colors.primary,
    background: DarkElements.colors.background,
    card: DarkElements.colors.card,
    text: DarkElements.colors.text,
    border: DarkElements.colors.border,
    notification: DarkElements.colors.success,
  },
};

interface UseCustomTheme {
  theme: ElementTheme & NavigationTheme;
  iconColor: string;
  ElementsTheme: ElementTheme;
  NavTheme: NavigationTheme;
}

export const useCustomTheme = (): UseCustomTheme => {
  const setDarkMode = useStore(state => state.setDarkMode);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#000000';
  const ElementsTheme = isDark
    ? { ...DarkElements, useDark: true }
    : { ...DefaultElements, useDark: false };
  const NavTheme = isDark
    ? { ...DarkNav, dark: true }
    : { ...DefaultNav, dark: false };

  const theme = merge(ElementsTheme, NavTheme);

  setDarkMode(isDark);

  return {
    theme,
    iconColor,
    ElementsTheme,
    NavTheme,
  };
};
