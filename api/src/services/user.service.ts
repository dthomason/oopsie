import { Prisma } from '@prisma/client';

import db from '../lib/db';
import { formatPhoneNumber, log, to } from '../utils';

export interface UserProfile {
  id: string;
  countryCode: string;
  email?: string;
  mobile: string;
  verifiedMobile: boolean;
}

interface CreateInput {
  countryCode: string;
  mobile: string;
  verifiedMobile: boolean;
  verifiedEmail: boolean;
}

const select = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  countryCode: true,
  mobile: true,
  verifiedMobile: true,
});

const create = async ({
  countryCode,
  mobile,
}: CreateInput): Promise<UserProfile> => {
  const data = Prisma.validator<CreateInput>()({
    countryCode: countryCode,
    verifiedEmail: false,
    verifiedMobile: false,
    mobile: formatPhoneNumber(mobile),
    // pin: await hash(formatPin(pin), 10),
  });

  const [user, err] = await to(
    db.user.create<Prisma.UserCreateArgs>({
      data,
      select,
    }),
  );

  if (err) log(err, 'User.create', mobile);

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

const findByMobile = async (mobile: string): Promise<UserProfile> => {
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

const findPinByMobile = async (mobile: string): Promise<{ pin: string }> => {
  const where = Prisma.validator<Prisma.UserWhereUniqueInput>()({
    mobile: formatPhoneNumber(mobile),
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
  findByMobile: findByMobile,
  findPinByMobile,
  findPinById,
  update,
};
