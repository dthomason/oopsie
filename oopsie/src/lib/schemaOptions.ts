import * as yup from 'yup';

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const phoneReg2 = /^[(]?(\d{3})[)]?[-|\s]?(\d{3})[-|\s]?(\d{4})$/;

export const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationParameterError {
  message: string;
  path: string;
}

export const invalidMessage = 'Invalid ${path}';
export const notAllowedMessage = 'Not allowed';
export const passwordMatchMessage = 'Passwords must match';
export const pinsMustMatch = 'Pins must match';
export const requiredMessage = '${path} is Required';
export const minimumDigits = 'Must be at least ${path} digits';

export interface ResponseSuccess {
  id: string;
  email?: string;
  mobile?: string;
  pin?: string;
  verifiedEmail?: boolean;
  verifiedMobile?: boolean;
}

export interface RequestError {
  status: number;
  error: string;
  path?: string;
}

export const schemaOptions = {
  code: yup
    .string()
    .label('6')
    .required(requiredMessage)
    .min(6, minimumDigits)
    .matches(/^[0-9]+$/, invalidMessage),
  email: yup
    .string()
    .label('Email')
    .email()
    .required(requiredMessage)
    .matches(emailReg, invalidMessage),
  mobile: yup
    .string()
    .label('10')
    .default('')
    .required(requiredMessage)
    .min(10, minimumDigits)
    .matches(/^[0-9]+$/, invalidMessage),
  password: yup
    .string()
    .label('Password')
    .trim()
    .min(6)
    .max(25)
    .matches(/[^']/, notAllowedMessage),
  newPassword: yup
    .string()
    .label('Password')
    .trim()
    .min(6)
    .max(25)
    .matches(/[^']/, notAllowedMessage),
  pin: yup
    .string()
    .label('Pin')
    .required(requiredMessage)
    .min(4, minimumDigits)
    .matches(/^[0-9]+$/, invalidMessage),
  newPin: yup
    .string()
    .label('Pin')
    .required(requiredMessage)
    .min(4, minimumDigits)
    .matches(/^[0-9]+$/, invalidMessage),
  confirmPin: yup
    .string()
    .label('Confirm Pin')
    .required(requiredMessage)
    .min(4)
    .oneOf([yup.ref('newPin')])
    .matches(/^[0-9]+$/, invalidMessage),
  secondary: yup
    .string()
    .label('Confirm Password')
    .required(requiredMessage)
    .trim()
    .min(6)
    .max(40)
    .oneOf([yup.ref('newPassword')], passwordMatchMessage),
};
