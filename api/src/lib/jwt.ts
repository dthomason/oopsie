import jwt, { SignOptions } from 'jsonwebtoken';

import { formatErrorString } from './formatErrorString';

export const sign = (
  props: Record<any, any>,
  secret: string,
  options: SignOptions,
) => {
  try {
    const token = jwt.sign(props, secret, options);

    return token;
  } catch (error) {
    throw new Error(
      formatErrorString('encryptLoginToken.validateOptions', error),
    );
  }
};

export const JWT = {
  sign,
};
