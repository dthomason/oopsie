import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';

import db from '../lib/db';
import { formatPhoneNumber, formatPin, log, to } from '../utils';

export interface UserProfile {
  id: string;
  email: string;
  mobile: string;
  verifiedMobile: boolean;
}

interface CreateInput {
  email: string;
  mobile: string;
  password: string;
  pin: string;
  verifiedMobile: boolean;
  verifiedEmail: boolean;
}

const select = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  mobile: true,
  verifiedMobile: true,
});

const create = async ({
  email,
  password,
  mobile,
  pin,
}: CreateInput): Promise<UserProfile> => {
  const data = Prisma.validator<CreateInput>()({
    email: email.toLowerCase().trim(),
    password: await hash(password, 10),
    verifiedEmail: false,
    verifiedMobile: false,
    mobile: formatPhoneNumber(mobile),
    pin: await hash(formatPin(pin), 10),
  });

  const [user, err] = await to(
    db.user.create<Prisma.UserCreateArgs>({
      data,
      select,
    }),
  );

  if (err) log(err, 'User.create', email);

  return user;
};

const findByEmail = async (email: string): Promise<UserProfile> => {
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

const findByPhone = async (mobile: string): Promise<UserProfile> => {
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({
    mobile: formatPhoneNumber(mobile),
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

const findPasswordByEmail = async (
  email: string,
): Promise<{ password: string }> => {
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({
    email: email.toLowerCase().trim(),
  });
  const selectPassword = Prisma.validator<Prisma.UserSelect>()({
    password: true,
  });

  const [user, err] = await to(
    db.user.findUnique({
      where,
      select: selectPassword,
    }),
  );

  if (err) log(err, 'User.findPasswordByEmail', email);

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
  userData: Partial<CreateInput>,
): Promise<void> => {
  const data = Prisma.validator<Prisma.UserUpdateInput>()({
    ...userData,
    email: userData.email ? userData.email.toLowerCase().trim() : undefined,
    mobile: userData.mobile ? formatPhoneNumber(userData.mobile) : undefined,
  });

  const [, err] = await to(db.user.update({ where: { id }, data }));

  if (err) log(err, 'User.update', id);
};

export const UserService = {
  create,
  findByEmail,
  findById,
  findByPhone,
  findPasswordByEmail,
  findPinById,
  update,
};
