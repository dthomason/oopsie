import 'dotenv-safe/config';
import jwt from 'jsonwebtoken';

import { PromiseOptions } from '../../@types/types';
import { formatErrorString } from '../lib';

const tempTokenSecret = process.env.TEMP_TOKEN_SECRET || '';

interface Options {
  deviceId: any;
  userId: string;
  mobile: string;
}

const validateOptions = (options: Options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.userId) throw new Error('options.userId is required.');
    if (!options.mobile) throw new Error('options.emailAddress is required.');
    if (!options.deviceId) throw new Error('options.deviceId is required.');
  } catch (error) {
    throw new Error(
      formatErrorString('encryptLoginToken.validateOptions', error),
    );
  }
};

const encryptTemporaryToken = (
  options: Options,
  { resolve, reject }: PromiseOptions,
) => {
  try {
    validateOptions(options);

    const { deviceId } = options;

    const token = jwt.sign({ deviceId }, tempTokenSecret, {
      expiresIn: '1h',
    });

    const dt = new Date();
    const oneHourFromNow = dt.setHours(dt.getHours() + 1);

    resolve({
      token,
      tokenExpiresAt: oneHourFromNow,
    });
  } catch (error) {
    reject(formatErrorString('temporaryToken', error));
  }
};

export default (options: Options) =>
  new Promise((resolve, reject) => {
    encryptTemporaryToken(options, { resolve, reject });
  });
