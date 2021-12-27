import { build, fake } from '@jackfranklin/test-data-bot';
import faker from 'faker/locale/en_US';
import { times } from 'lodash';

import { UserService } from '../services/user.service';

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

interface UserCommand {
  args?: BuildUser;
  type: 'user';
}

interface UserWithContactsCommand {
  args: BuildUser;
  type: 'user-with-contacts';
}

faker.setLocale('en_US');

type Command = UserCommand | UserWithContactsCommand;

export async function buildup(commands: Command[]): Promise<void> {
  commands.forEach(command => {
    if (command.type === 'user') {
      buildUser(command.args);
    }
  });
}

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

// mobile: fake(() => faker.phone.phoneNumberFormat()),
// verifiedEmail: fake(() => Boolean(false)),
// verifiedMobile: fake(() => Boolean(false)),

export type BuildUser = {
  user?: UserBuilder;
  contacts?: BuildContact[];
};

async function buildUser({ user }: BuildUser = {}): Promise<void> {
  const builtUser = user
    ? user
    : {
        ...userBuilder(),
        verifiedMobile: true,
      };

  await UserService.create(builtUser);
}

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
