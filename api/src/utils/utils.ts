import { Prisma } from '@prisma/client';

import { logger } from '../lib';

type Maybe<T> = T | null;

type AsyncResult = any;
type AsyncError = any;
type AsyncReturn<R, E> = [Maybe<R>, Maybe<E> | undefined];
type AsyncFn = Promise<AsyncResult>;

export async function to<R = AsyncResult, E = AsyncError>(
  fn: AsyncFn,
): Promise<AsyncReturn<R, E>> {
  try {
    const data: R = await fn;

    return [data, undefined];
  } catch (error) {
    return [null, error as E];
  }
}

export const log = (e: any, action: string, email?: string): void => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      console.log(
        `${action}: Unique Constraint Violation, a user with email: ${
          email ? email.toLowerCase() : 'unknown'
        } already exists`,
      );
    }
  } else {
    logger.error(e);
  }
};

function validatePhoneForE164(phoneNumber: string): boolean {
  const regEx = /^\+[1-9]\d{10,14}$/;

  return regEx.test(phoneNumber);
}

function forE164Format(phone: string): string {
  const countryCode = phone.length === 10 ? `+1${phone}` : `+${phone}`;

  const validated = validatePhoneForE164(countryCode);

  if (validated) return countryCode;

  return 'invalid';
}

export function formatPin(pin: string): string {
  const cleaned = ('' + pin).replace(/\D/g, '');

  return cleaned.substr(-4);
}

type PhoneType = 'mobile' | 'e164';

export function formatPhoneNumber(
  phone: string,
  type = 'mobile' as PhoneType,
): string {
  const cleaned = ('' + phone).replace(/\D/g, '');

  if (type === 'e164') {
    return forE164Format(cleaned);
  }

  return cleaned.substr(-10);
}

export const formatName = (name: string): string => {
  if (!name) return '';

  return name.replace(/\./g, '').trim();
};

interface Normalize {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  mobile?: string;
  pin?: number;
}

export const normalize = ({
  email,
  firstName,
  lastName,
  password,
  mobile,
  pin,
}: Normalize): Normalize => {
  const normalizedValues = {
    firstName: firstName.toLowerCase().trim(),
    lastName: lastName.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password,
    mobile: mobile ? formatPhoneNumber(mobile) : '',
    pin,
  };

  return normalizedValues;
};

export interface Cookie {
  name: string;
  value: string;
  path?: string;
  domain?: string;
  version?: string;
  expires?: string;
  secure?: boolean;
  httpOnly?: boolean;
}
