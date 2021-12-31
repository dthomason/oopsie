import { AxiosError } from 'axios';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { CountryCode } from 'react-native-country-picker-modal';
import { Input } from 'react-native-elements';
import setCookie from 'set-cookie-parser';

const phoneUtil = PhoneNumberUtil.getInstance();

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const phoneReg2 = /^[(]?(\d{3})[)]?[-|\s]?(\d{3})[-|\s]?(\d{4})$/;

export const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationParameterError {
  message: string;
  path: string;
}

export const isAxiosError = (error: any): error is AxiosError =>
  !!error?.isAxiosError;

export const invalidMessage = 'Invalid ${path}';
export const notAllowedMessage = 'Not allowed';
export const passwordMatchMessage = 'Passwords must match';
export const requiredMessage = '${path} is Required';
export const minimumDigits = 'Must be at least ${path} digits';

export interface RequestError {
  status: number;
  error: string;
  path?: string;
}

export const getAccessToken = (headers: any) => {
  const accessToken = setCookie.parse(headers['set-cookie'], {
    decodeValues: true,
    map: true,
  }).accessToken.value;

  return accessToken;
};

export type TextFieldProps = React.ComponentProps<typeof Input>;

export type TextContentType =
  | 'none'
  | 'URL'
  | 'addressCity'
  | 'addressCityAndState'
  | 'addressState'
  | 'countryName'
  | 'creditCardNumber'
  | 'emailAddress'
  | 'familyName'
  | 'fullStreetAddress'
  | 'givenName'
  | 'jobTitle'
  | 'location'
  | 'middleName'
  | 'name'
  | 'namePrefix'
  | 'nameSuffix'
  | 'nickname'
  | 'organizationName'
  | 'postalCode'
  | 'streetAddressLine1'
  | 'streetAddressLine2'
  | 'sublocality'
  | 'telephoneNumber'
  | 'username'
  | 'password'
  | 'newPassword'
  | 'oneTimeCode'
  | undefined;

export const isValidNumber = (
  number: string,
  countryCode: CountryCode,
): boolean => {
  try {
    const parsedNumber = phoneUtil.parse(number, countryCode);

    return phoneUtil.isValidNumber(parsedNumber);
  } catch (err) {
    return false;
  }
};
