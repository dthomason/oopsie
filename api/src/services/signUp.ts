import { TokenType, User } from '@prisma/client';
import PhoneNumber from 'awesome-phonenumber';

import { CountryCode, PromiseOptions } from '../../@types/types';
import db from '../lib/db';
import { formatErrorString } from '../lib/formatErrorString';
import encryptTemporaryToken from '../services/encryptTemporaryToken';

/*
Sign Up Flow:
Passwordless only using a Phone Number for auth

1. Post comes in via /api/user with country code and mobile number
2. we check the db for that user via mobile number
3. if we don't find them we:
  a. create their account in the db
  b. create a temp token and tokenID
  c. tell twillio to send the SMS verify text code
  d. our response has the temp token and the app is now
    on the verify mobile screen due to the text.
  e. user sends code they received as well as token we sent them
  f. we confirm with twillio the code is correct
  g. build a new access token and send that back for seemless log ins
  NOTE:
  h. currently storing tokens in db, but want to see about not doing that
*/

type Options = {
  countryCode: CountryCode;
  deviceId: string;
  mobile: string;
};

type UserToCreate = {
  countryCode: CountryCode;
  mobile: string;
  deviceId: string;
  dualAuth?: boolean;
  firstInstallTime?: number;
  verifiedMobile?: boolean;
  verifiedEmail?: boolean;
};

interface Token {
  tempToken: string;
  expiration: Date;
  user: User;
  type: TokenType;
}

const addSessionToUser = (userId: string, token: Token) => {
  try {
    return db.token.create({
      data: {
        ...token,
        user: {
          connect: { id: userId },
        },
      },
    });
  } catch (error) {
    throw new Error(formatErrorString('signup.addSessionToUser', error));
  }
};

const getUserByUserId = (userId = '') => {
  try {
    return db.user.findUnique({ where: { id: userId } });
  } catch (exception) {
    throw new Error(formatErrorString('signup.getUserByUserId', exception));
  }
};

const insertUserInDatabase = async (user: UserToCreate) => {
  try {
    const newUser = await db.user.create({ data: user, select: { id: true } });

    return newUser.id;
  } catch (exception) {
    throw new Error(
      formatErrorString('signup.insertUserInDatabase', exception),
    );
  }
};

const getUserToCreate = async (options: Options) => {
  try {
    const phoneUtil = new PhoneNumber(options.mobile, options.countryCode);

    return {
      ...options,
      mobile: phoneUtil.getNumber('e164'),
    };
  } catch (exception) {
    throw new Error(formatErrorString('signup.getUserToCreate', exception));
  }
};

const getExistingUser = (mobile: string) => {
  try {
    return db.user.findUnique({ where: { mobile } });
  } catch (exception) {
    throw new Error(formatErrorString('signup.getExistingUser', exception));
  }
};

const isValidNumber = (mobile: string, countryCode: CountryCode): boolean => {
  try {
    const phoneUtil = new PhoneNumber(mobile, countryCode);

    return phoneUtil.isValid();
  } catch (exception) {
    throw new Error(formatErrorString('signup.isValidNumber', exception));
  }
};

const validateOptions = (options: Options) => {
  try {
    if (!options) throw new Error('options object is required.');
    if (!options.countryCode)
      throw new Error('options.countryCode is required');
    if (!options.mobile) throw new Error('options.mobile is required.');
    if (!options.deviceId) throw new Error('options.deviceId is required.');
    if (!isValidNumber(options.mobile, options.countryCode))
      throw new Error('options.validNumber is required');
  } catch (exception) {
    throw new Error(formatErrorString('signup.validateOptions', exception));
  }
};

const signup = async (
  options: Options,
  { resolve, reject }: PromiseOptions,
) => {
  try {
    validateOptions(options);

    const existingUser = await getExistingUser(options.mobile);

    if (existingUser) {
      throw new Error(`Account already exists for ${options.mobile}`);
    }

    const userToCreate = await getUserToCreate(options);
    const userId = await insertUserInDatabase(userToCreate);
    const user = await getUserByUserId(userId);

    if (user) {
      const login: any = await encryptTemporaryToken({
        userId: user.id,
        mobile: user.mobile,
        deviceId: user.deviceId,
      });

      await addSessionToUser(user?.id, login);

      return resolve({
        ...login,
        userId,
        user,
      });
    }
  } catch (exception) {
    reject(formatErrorString('signup', exception));
  }
};

export default (options: Options) =>
  new Promise((resolve, reject) => {
    signup(options, { resolve, reject });
  });
