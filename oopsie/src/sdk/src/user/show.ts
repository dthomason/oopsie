import { AxiosRequestConfig } from 'axios';

interface CreateConfig extends AxiosRequestConfig {
  method: 'GET';
  url: '/api/user';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
}

export type UserShowResponse = ResponsePayload;

/**
 * POST `/api/auth/signin
 *
 * { mobile: string, pin: string }
 */
export const show = (): CreateConfig => {
  return {
    method: 'GET',
    url: '/api/user',
  } as const;
};
