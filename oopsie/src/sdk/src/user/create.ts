import { AxiosRequestConfig } from 'axios';

interface CreateRequest {
  mobile: string;
  pin: string;
}

interface CreateConfig extends AxiosRequestConfig {
  body: CreateRequest;
  data: CreateRequest;
  method: 'POST';
  url: '/api/user/signup';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
}

export type SignUpRequest = CreateRequest;
export type SignUpResponse = ResponsePayload;

/**
 * POST `/api/auth/signup
 *
 * { mobile: string, pin: string }
 */
export const create = (data: CreateRequest): CreateConfig => {
  return {
    method: 'POST',
    url: '/api/user/signup',
    body: data,
    data,
  } as const;
};
