import { AxiosRequestConfig } from 'axios';

interface RequestConfig extends AxiosRequestConfig {
  method: 'GET';
  url: '/api/auth/refresh';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
  newUser: boolean;
}

export type RefreshTokenResponse = ResponsePayload;

/**
 * GET `/api/auth/refresh`
 *
 */
export const show = (): RequestConfig => {
  return {
    method: 'GET',
    url: '/api/auth/refresh',
  } as const;
};
