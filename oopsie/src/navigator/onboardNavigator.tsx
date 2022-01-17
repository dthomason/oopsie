import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { OnboardScreen } from '../screens/appScreens/onboard/onboardScreen';

type OnboardingParamList = {
  OnboardScreen: undefined;
};

const OnboardStack = createNativeStackNavigator<OnboardingParamList>();

export const OnboardNavigator: FC = () => {
  return (
    <OnboardStack.Navigator>
      <OnboardStack.Screen
        options={{ headerShown: false }}
        name="OnboardScreen"
        component={OnboardScreen}
      />
    </OnboardStack.Navigator>
  );
};
