import { AxiosRequestConfig } from 'axios';

interface CreateRequest {
  email: string;
  password: string;
}

interface CreateConfig extends AxiosRequestConfig {
  body: CreateRequest;
  data: CreateRequest;
  method: 'POST';
  url: '/api/auth/signin';
}

interface ResponsePayload {
  id: string;
  email: string;
  mobile: string;
  verifiedMobile: boolean;
}

export type SignInRequest = CreateRequest;
export type SignInResponse = ResponsePayload;

/**
 * POST `/api/auth/signin
 *
 * { email: string, password: string }
 */
export const create = (data: CreateRequest): CreateConfig => {
  return {
    method: 'POST',
    url: '/api/auth/signin',
    body: data,
    data,
  } as const;
};
