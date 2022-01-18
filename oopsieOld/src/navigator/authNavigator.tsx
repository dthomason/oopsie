import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { SplashScreen, SignUp, Verify } from '../screens';

export type AuthParamList = {
  SplashScreen: undefined;
  SignUp: undefined;
  Verify: {
    mobile: string;
  };
};
export type AuthScreenProps = NativeStackScreenProps<
  AuthParamList,
  keyof AuthParamList
>;

export type VerifyScreenProps = NativeStackScreenProps<AuthParamList, 'Verify'>;

export type AuthNavigation = AuthScreenProps['navigation'];

export type AuthRoute = AuthScreenProps['route'];

const AuthStack = createNativeStackNavigator<AuthParamList>();

export type AuthNavProps = {
  navigation: AuthNavigation;
  route: AuthRoute;
};

export const AuthNavigator: FC = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Group
        screenOptions={{
          presentation: 'modal',
        }}
      >
        <AuthStack.Screen component={SignUp} name="SignUp" />
        <AuthStack.Screen component={Verify} name="Verify" />
      </AuthStack.Group>
      <AuthStack.Screen component={SplashScreen} name="SplashScreen" />
    </AuthStack.Navigator>
  );
};
