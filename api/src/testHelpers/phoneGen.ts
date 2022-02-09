import PhoneNumber from 'awesome-phonenumber';
import faker from 'faker';

import { CountryCode } from '../types/declarations';

type PhoneNumberFormat =
  | 'e164'
  | 'international'
  | 'national'
  | 'rfc3966'
  | 'significant';

type PhoneNumberTypes =
  | 'fixed-line'
  | 'fixed-line-or-mobile'
  | 'mobile'
  | 'pager'
  | 'personal-number'
  | 'premium-rate'
  | 'shared-cost'
  | 'toll-free'
  | 'uan'
  | 'voip'
  | 'unknown';

const supportedRegionCodes = PhoneNumber.getSupportedRegionCodes();

const randomPickFromArray = (list: string[]) => {
  return list[Math.floor(Math.random() * list.length)];
};

interface Options {
  format?: PhoneNumberFormat;
  type?: PhoneNumberTypes;
  regionCode?: CountryCode;
  manual?: boolean;
}

export const phoneGen = ({
  type = 'mobile',
  regionCode,
}: Options = {}): PhoneNumber => {
  const region = regionCode
    ? regionCode
    : randomPickFromArray(supportedRegionCodes);

  // Avoid single- and double-letter variable naming when possible
  const pn = PhoneNumber.getExample(region, type);

  return pn;
};

export const fakerPhoneGen = (): string => {
  const base = faker.phone.phoneNumberFormat(2);

  const formatted = PhoneNumber(base, 'US');

  const number = formatted.getNumber();

  return number;
};
