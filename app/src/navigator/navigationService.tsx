import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';

export const navigationRef =
  createRef<NavigationContainerRef<Record<string, undefined>>>();

export function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}
