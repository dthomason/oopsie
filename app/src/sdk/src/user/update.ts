import { AxiosRequestConfig } from 'axios';

interface Update {
  mobile?: string;
  newUser?: boolean;
}

interface Definition {
  update: Update;
}

interface RequestConfig extends AxiosRequestConfig {
  method: 'PUT';
  url: '/api/user';
  body: Definition;
  data: Definition;
}

interface ResponsePayload {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
  newUser: boolean;
}

export type UpdateUserResponse = ResponsePayload;

/**
 * PUT `/api/user`
 * body: { update: { mobile, newUser }}
 *
 */
export const update = (data: Definition): RequestConfig => {
  return {
    method: 'PUT',
    url: '/api/user',
    body: data,
    data,
  } as const;
};
