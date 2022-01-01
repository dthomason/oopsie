import dayjs from 'dayjs';
import 'dotenv-safe/config';
import jwt from 'jsonwebtoken';

import { PromiseOptions } from '../../@types/types';
import { formatErrorString } from '../lib';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || '';

interface Options {
  userId: string;
  deviceId: string;
  mobile: string;
}

const validateOptions = (options: Options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.userId) throw new Error('options.userId is required.');
    if (!options.mobile) throw new Error('options.emailAddress is required.');
    if (!options.deviceId) throw new Error('options.deviceId');
  } catch (error) {
    throw new Error(
      formatErrorString('encryptLoginToken.validateOptions', error),
    );
  }
};

const encryptLoginToken = (
  options: Options,
  { resolve, reject }: PromiseOptions,
) => {
  try {
    validateOptions(options);

    const token = jwt.sign({ ...options }, accessTokenSecret, {
      expiresIn: '30 days',
    });

    resolve({
      token,
      tokenExpiresAt: dayjs().add(30, 'days').format(),
    });
  } catch (error) {
    reject(formatErrorString('encryptLoginToken', error));
  }
};

export default (options: Options) =>
  new Promise((resolve, reject) => {
    encryptLoginToken(options, { resolve, reject });
  });
