import { AxiosRequestConfig } from 'axios';

interface CreateRequest {
  mobile: string;
  code: string;
}

interface CreateConfig extends AxiosRequestConfig {
  body: CreateRequest;
  data: CreateRequest;
  method: 'POST';
  url: '/api/auth/verify';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
}

export type VerifyRequest = CreateRequest;
export type VerifyResponse = ResponsePayload;

/**
 * POST `/api/auth/verify
 *
 * { email: string, mobile: string, code: string }
 */
export const create = (data: CreateRequest): CreateConfig => {
  return {
    method: 'POST',
    url: '/api/auth/verify',
    body: data,
    data,
  } as const;
};
