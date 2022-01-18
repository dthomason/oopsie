import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';
import Feather from 'react-native-vector-icons/Feather';

import { HeaderAppBar } from '../components';
import { Home, Activity, UserSettings } from '../screens';

export type AppParamList = {
  Home: undefined;
  Settings: undefined;
  Activity: undefined;
  Main: undefined;
};

export type AppScreenProps = BottomTabNavigationProp<
  AppParamList,
  keyof AppParamList
> &
  NativeStackScreenProps<AppParamList, keyof AppParamList>;

export type AppNavigation = AppScreenProps['navigation'];

export type AppRoute = AppScreenProps['route'];

const AppStack = createNativeStackNavigator<AppParamList>();

const Tab = createBottomTabNavigator<AppParamList>();

export type AppNavProps = {
  navigation: AppNavigation;
  route: AppRoute;
};

export const AppNavigator: FC = () => {
  return (
    <AppStack.Navigator initialRouteName="Main">
      <AppStack.Screen
        options={{ headerShown: false }}
        name="Main"
        component={Main}
      />
      <AppStack.Screen name="Settings" component={UserSettings} />
    </AppStack.Navigator>
  );
};

const Main: FC = ({ children }) => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: () => <HeaderAppBar>{children}</HeaderAppBar>,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="activity" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
