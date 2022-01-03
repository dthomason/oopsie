import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

import db from '../lib/db';
import { formatPin, log, to } from '../utils';

export interface UserProfile {
  id: string;
  mobile: string;
  verifiedMobile: boolean;
  pin: string;
}

interface CreateInput {
  mobile: string;
  region: string;
}

const select = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  mobile: true,
  verifiedMobile: true,
});

const create = async (args: CreateInput): Promise<UserProfile> => {
  const data = Prisma.validator<CreateInput>()({
    ...args,
    mobile: args.mobile,
  });

  const [user, err] = await to(
    db.user.create<Prisma.UserCreateArgs>({
      data,
      select,
    }),
  );

  if (err) log(err, 'User.create', args.mobile);

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

const findByPhone = async (mobile: string): Promise<UserProfile> => {
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({
    mobile,
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
): Promise<UserProfile> => {
  if (userData.pin) {
    const pinNumber = formatPin(userData.pin);

    userData.pin = await hash(pinNumber, 10);
  }

  const [user, err] = await to(
    db.user.update({ where: { id }, data: { ...userData }, select }),
  );

  if (err) log(err, 'User.update', id);

  return user;
};

export const UserService = {
  create,
  findById,
  findByPhone,
  findPinById,
  update,
};
