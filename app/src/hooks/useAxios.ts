import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

interface Config extends AxiosRequestConfig {
  url: string;
  method: 'post' | 'get' | 'patch' | 'put';
  body: string;
  headers: string;
}

export const useAxios = ({ url, method, body, headers, ...config }: Config) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    axios[method](url, JSON.parse(headers), JSON.parse(body))
      .then(res => {
        setResponse(res.data);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers]);

  return { response, error, loading };
};
