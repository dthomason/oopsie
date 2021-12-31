import { AxiosRequestConfig } from 'axios';
import { CountryCode } from 'react-native-country-picker-modal';

interface CreateRequest {
  countryCode: CountryCode;
  mobile: string;
}

interface CreateConfig extends AxiosRequestConfig {
  body: CreateRequest;
  data: CreateRequest;
  method: 'POST';
  url: '/api/user/signIn';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
}

export type SignInRequest = CreateRequest;
export type SignInResponse = ResponsePayload;

/**
 * POST `/api/user/signIn
 *
 * { mobile: string, pin: string }
 */
export const signIn = (data: CreateRequest): CreateConfig => {
  return {
    method: 'POST',
    url: '/api/user/signIn',
    body: data,
    data,
  } as const;
};
