import { build, fake } from '@jackfranklin/test-data-bot';
import faker from 'faker/locale/en_US';
import { times } from 'lodash';

import { UserProfile, UserService } from '../services';

import { phoneGen } from './phoneGen';

// Prefer factories over fixtures
// Prefer `builders` for factories, rather than custom factories

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

type NewUserBuild = {
  mobile: string;
  region: string;
};

export const newUserBuilder = (): NewUserBuild => {
  const np = phoneGen({ manual: true });

  const newUser = () => {
    return {
      mobile: np.getNumber('e164'),
      region: np.getRegionCode(),
    };
  };

  const userData = newUser();

  return userData;
};

type CurrentUserBuild = {
  mobile: string;
  region: string;
  verifiedMobile: boolean;
};

export const currentUserBuilder = (): CurrentUserBuild => {
  const np = phoneGen({ manual: true });

  const currentUser = {
    mobile: np.getNumber('e164'),
    region: np.getRegionCode(),
    verifiedMobile: true,
  };

  return currentUser;
};

faker.setLocale('en_US');

interface UserBuilder {
  email: string;
  password: string;
  pin: string;
  mobile: string;
  verifiedEmail: boolean;
  verifiedMobile: boolean;
}

export const userBuilder = build<UserBuilder>({
  fields: {
    email: fake(f => String(f.internet.email())),
    password: 'this Test P@ssW0$d',
    pin: '1234',
    mobile: fake(f => String(f.phone.phoneNumberFormat(2))),
    verifiedEmail: fake(() => false),
    verifiedMobile: fake(() => false),
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

export const buildNewUser = async (): Promise<UserProfile | undefined> => {
  try {
    const newUser = newUserBuilder();

    await UserService.create(newUser);
    const user = UserService.findByPhone(newUser.mobile);

    if (!user) {
      console.error('DID NOT CREATED');
      throw new Error('DID NOT CREATE');
    }

    return user;
  } catch (error) {
    console.error(error);
  }
};
