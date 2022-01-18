import { KeyboardType } from 'react-native';

import { TextContentType } from '../utils';

interface FieldNames {
  [key: string]: TextTypes;
}

export const textTypes: Record<string, TextTypes> = {
  email: {
    keyboardType: 'email-address',
    placeholder: 'Email Address',
    secureText: false,
    textContentType: 'emailAddress',
  },
  password: {
    keyboardType: 'default',
    placeholder: 'Password',
    secureText: true,
    textContentType: 'password',
  },
  mobile: {
    keyboardType: 'phone-pad',
    placeholder: 'Mobile Number',
    secureText: false,
    textContentType: 'telephoneNumber',
  },
  pin: {
    keyboardType: 'number-pad',
    max: 4,
    placeholder: 'Pin Number',
    secureText: true,
    textContentType: 'none',
  },
  newPin: {
    keyboardType: 'number-pad',
    max: 4,
    placeholder: '4 Digit PIN Number',
    secureText: true,
    textContentType: 'none',
  },
  confirmPin: {
    keyboardType: 'number-pad',
    max: 4,
    placeholder: 'Confirm PIN',
    secureText: true,
    textContentType: 'none',
  },
  newPassword: {
    keyboardType: 'default',
    placeholder: 'Password',
    secureText: true,
    textContentType: 'newPassword',
  },
  secondary: {
    keyboardType: 'default',
    placeholder: 'Confirm Password',
    secureText: true,
    textContentType: 'newPassword',
  },
  code: {
    keyboardType: 'numeric',
    placeholder: 'Verification Code',
    secureText: false,
    textContentType: 'oneTimeCode',
  },
  default: {
    keyboardType: 'default',
    placeholder: 'Default',
    secureText: false,
    textContentType: 'none',
  },
} as FieldNames;

interface TextTypes {
  keyboardType: KeyboardType;
  placeholder: string;
  secureText: boolean;
  textContentType: TextContentType;
  max?: number;
}

export const getType = (name: keyof FieldNames): TextTypes => {
  if (!textTypes[name]) {
    return textTypes['default'];
  } else {
    return textTypes[name];
  }
};
