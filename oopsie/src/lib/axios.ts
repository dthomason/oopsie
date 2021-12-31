import CookieManager from '@react-native-cookies/cookies';
import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';

export const isAxiosError = <T = unknown>(
  error: unknown,
): error is AxiosError<T> =>
  error instanceof Error && !!(error as AxiosError).isAxiosError;

interface ParsedError {
  status: number;
  error: string;
}

export const parsedAxiosError = (error: AxiosError): ParsedError => {
  return {
    status: error.response ? error.response.status : 0,
    error: error.response ? error.response.data : '',
  };
};

export const is404 = (error: unknown): boolean =>
  isAxiosError(error) && error.response?.status === 404;

interface Configure {
  accessToken?: string;
  withCredentials?: boolean;
}

export const configureAxios = ({
  accessToken,
  withCredentials,
}: Configure = {}): void => {
  axios.defaults.baseURL = Config.BASE_URL || 'http://localhost:3030';

  if (withCredentials) {
    axios.defaults.headers.post['withCredentials'] = true;
  }

  if (accessToken) {
    axios.defaults.headers.post['withCredentials'] = true;
    axios.defaults.headers.post['Authorization'] = accessToken;
    axios.defaults.headers.common['withCredentials'] = true;
    axios.defaults.headers.common['Authorization'] = accessToken;
  }

  CookieManager.clearAll();

  axios.interceptors.response.use(function axiosInterceptorResponseSuccess(
    response,
  ) {
    return response;
  });
};
