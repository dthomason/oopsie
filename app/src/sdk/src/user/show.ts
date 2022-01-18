import { AxiosRequestConfig } from 'axios';

interface RequestConfig extends AxiosRequestConfig {
  method: 'GET';
  url: '/api/user';
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
  newUser: boolean;
}

export type ShowUserResponse = ResponsePayload;

/**
 * GET `/api/user`
 *
 */
export const show = (): RequestConfig => {
  return {
    method: 'GET',
    url: '/api/user',
  } as const;
};
