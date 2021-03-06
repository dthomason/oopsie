import { AxiosRequestConfig } from 'axios';

interface CreateRequest {
  mobile: string;
  region: string;
}

interface CreateConfig extends AxiosRequestConfig {
  body: CreateRequest;
  data: CreateRequest;
  method: 'POST';
  url: '/api/auth/signup';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
  newUser: boolean;
}

export type SignUpRequest = CreateRequest;
export type SignUpResponse = ResponsePayload;

/**
 * POST `/api/auth/signup
 *
 * { deviceId: string, mobile: string, region: string }
 */
export const create = (data: CreateRequest): CreateConfig => {
  return {
    method: 'POST',
    url: '/api/auth/signup',
    body: data,
    data,
  } as const;
};
