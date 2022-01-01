import { build, fake } from '@jackfranklin/test-data-bot';
import faker from 'faker/locale/en_US';
import { times } from 'lodash';

import { CountryCode } from '../../@types/types';

faker.setLocale('en_US');

interface EmailAddress {
  label: string;
  email: string;
}

interface PhoneNumber {
  label: string;
  number: string;
}

export type BuildContact = {
  firstName: string;
  lastName: string;
  emailAddresses: EmailAddress[];
  phoneNumbers: PhoneNumber[];
  recordID: string;
};

interface UserBuilder {
  countryCode: CountryCode;
  deviceId: string;
  firstInstallTime?: number;
  mobile: string;
  verifiedMobile: boolean;
}

export const userBuilder = build<UserBuilder>({
  fields: {
    // countryCode: fake(f => String(f.address.countryCode())),
    countryCode: 'US',
    deviceId: fake(f => String(f.datatype.uuid())),
    mobile: fake(f => String(f.phone.phoneNumberFormat(2))),
    verifiedMobile: fake(() => false),
    firstInstallTime: fake(f => Number(f.datatype.datetime())),
  },
});

export type BuildUser = {
  user?: UserBuilder;
  contacts?: BuildContact[];
};

const labels = ['home', 'mobile'];

export const contactBuilder = build<BuildContact>({
  fields: {
    firstName: fake(f => String(f.name.firstName())),
    lastName:
      Math.floor(Math.random() * 2) % 2 === 0
        ? fake(f => String(f.name.lastName()))
        : '',
    phoneNumbers: times(2).map((_, index) => {
      return {
        label: labels[index],
        number: fake(f => String(f.phone.phoneNumberFormat(2))),
      };
    }),
    emailAddresses: [
      {
        label: 'home',
        email: fake(f => String(f.internet.email())),
      },
    ],

    recordID: fake(f => String(f.random.number())),
  },
});
