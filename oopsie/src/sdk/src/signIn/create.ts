import { AxiosRequestConfig } from 'axios';

interface CreateRequest {
  mobile: string;
}

interface CreateConfig extends AxiosRequestConfig {
  body: CreateRequest;
  data: CreateRequest;
  method: 'POST';
  url: '/api/auth/signin';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
}

export type SignInRequest = CreateRequest;
export type SignInResponse = ResponsePayload;

/**
 * POST `/api/auth/signin
 *
 * { mobile: string }
 */
export const create = (data: CreateRequest): CreateConfig => {
  return {
    method: 'POST',
    url: '/api/auth/signin',
    body: data,
    data,
  } as const;
};
