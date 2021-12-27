import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { FC } from 'react';

import {
  SplashScreen,
  SignIn,
  ForgotPassword,
  SignUp,
  Verify,
} from '../screens';

export type AuthParamList = {
  SplashScreen: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Verify: {
    email: string;
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
        <AuthStack.Screen component={SignIn} name="SignIn" />
        <AuthStack.Screen component={Verify} name="Verify" />
      </AuthStack.Group>
      <AuthStack.Screen component={SplashScreen} name="SplashScreen" />
      <AuthStack.Screen component={ForgotPassword} name="ForgotPassword" />
    </AuthStack.Navigator>
  );
};
