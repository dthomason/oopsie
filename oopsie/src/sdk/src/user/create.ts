import { AxiosRequestConfig } from 'axios';
import { CountryCode } from 'react-native-country-picker-modal';

interface CreateRequest {
  countryCode: CountryCode;
  mobile: string;
  deviceId: string;
}

interface CreateConfig extends AxiosRequestConfig {
  body: CreateRequest;
  data: CreateRequest;
  method: 'POST';
  url: '/api/user';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
}

export type SignUpRequest = CreateRequest;
export type SignUpResponse = ResponsePayload;

/**
 * POST `/api/user
 *
 * { mobile: string, countryCode: CountryCode }
 */
export const create = (data: CreateRequest): CreateConfig => {
  return {
    method: 'POST',
    url: '/api/user',
    body: data,
    data,
  } as const;
};
