import { Prisma } from '@prisma/client';
import PhoneNumber from 'awesome-phonenumber';

import { CountryCode } from '../../@types/types';
import { formatErrorString } from '../lib';
import db from '../lib/db';
import { log, to } from '../utils';

import { isValidNumber } from './auth.service';

export interface UserProfile {
  id: string;
  countryCode: string;
  deviceId?: string;
  email?: string;
  mobile: string;
  verifiedMobile: boolean;
}

interface CreateInput {
  countryCode: CountryCode;
  deviceId: string;
  mobile: string;
  verifiedMobile: boolean;
}

const select = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  countryCode: true,
  mobile: true,
  verifiedMobile: true,
});

const create = async (props: CreateInput): Promise<UserProfile> => {
  // validateOptions(props);

  const { countryCode, deviceId, verifiedMobile, mobile } = props;

  const formatted = new PhoneNumber(mobile).getNumber('significant');

  console.log({ formatted });

  const data = Prisma.validator<CreateInput>()({
    countryCode,
    deviceId,
    mobile: formatted,
    verifiedMobile,
    // pin: await hash(formatPin(pin), 10),
  });

  console.log({ data });

  const [user, err] = await to(
    db.user.create<Prisma.UserCreateArgs>({
      data,
      select,
    }),
  );

  if (err) log(err, 'User.create', props.mobile);

  return user;
};

export const findByEmail = async (email: string): Promise<UserProfile> => {
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({
    email: email.toLowerCase().trim(),
  });

  const [user, err] = await to(
    db.user.findUnique({
      where,
      select,
    }),
  );

  if (err) log(err, 'User.findByEmail', email);

  return user;
};

const findById = async (id: string): Promise<UserProfile> => {
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({ id });
  const [user, err] = await to(
    db.user.findUnique({
      where,
      select,
    }),
  );

  if (err) log(err, 'User.findById', id);

  return user;
};

const findByMobile = async (mobile: string): Promise<UserProfile> => {
  const formatted = new PhoneNumber(mobile).getNumber('e164');
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({
    mobile: formatted,
  });

  const [user, err] = await to(
    db.user.findUnique({
      where,
      select,
    }),
  );

  if (err) log(err, 'User.findByPhone', mobile);

  return user;
};

const findPinByMobile = async (mobile: string): Promise<{ pin: string }> => {
  const formatted = new PhoneNumber(mobile).getNumber('e164');
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({
    mobile: formatted,
  });
  const selectPassword = Prisma.validator<Prisma.UserSelect>()({
    pin: true,
  });

  const [user, err] = await to(
    db.user.findUnique({
      where,
      select: selectPassword,
    }),
  );

  if (err) log(err, 'User.findPinByMobile', mobile);

  return user;
};

const findPinById = async (id: string): Promise<{ pin: string }> => {
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({ id });
  const selectPin = Prisma.validator<Prisma.UserSelect>()({
    pin: true,
  });

  const [user, err] = await to(
    db.user.findUnique({
      where,
      select: selectPin,
    }),
  );

  if (err) log(err, 'User.findPinById', id);

  return user;
};

const update = async (
  id: string,
  userData: Partial<UserProfile>,
): Promise<void> => {
  const data = Prisma.validator<Prisma.UserUpdateInput>()({
    ...userData,
    mobile: userData.mobile ? userData.mobile : undefined,
  });

  const [, err] = await to(db.user.update({ where: { id }, data }));

  if (err) log(err, 'User.update', id);
};

export const validateOptions = (options: CreateInput) => {
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

export const UserService = {
  create,
  findById,
  findByMobile: findByMobile,
  findPinByMobile,
  findPinById,
  update,
};
