import { ContactObject } from './contact.service';

export const findNameMatch = async (
  name: string,
  contacts: ContactObject[],
): Promise<ContactObject | undefined> => {
  const trimmed = name.replace(/\./g, '').trim().split(' ');
  const firstName = trimmed[0];
  const lastName = trimmed[1] ? trimmed[1] : '';

  const exact = contacts.filter(contact => contact.firstName === firstName);

  if (exact?.length === 1) return exact[0];

  if (exact?.length > 1 && lastName.length) {
    const exactLast = contacts.filter(contact => contact.lastName === lastName);

    if (exactLast?.length) return exactLast[0];
  }

  if (!exact.length) {
    const contains = contacts.filter(contact =>
      contact.firstName.includes(firstName),
    );

    if (contains?.length === 1) return contains[0];

    if (contains?.length > 1) {
      const containLast = contacts.filter(
        contact => contact.lastName === lastName,
      );

      if (containLast?.length === 1) return containLast[0];
    }
  }
};

interface Args {
  id?: string;
  name?: string;
  number?: string;
  pin?: string;
  found?: boolean;
}

export const dialog = (args: Args = {}) => {
  const { id, number, found } = args;

  return {
    default: {
      action: '/api/voice/gather',
      script: 'I am sorry, something went wrong, lets start over',
    },
    gatherNumber: {
      action: '/api/voice/lookup?type=number',
      script:
        'Hi, please enter your mobile number including area code finished by the pound key',
    },
    gatherPin: {
      action: `/api/voice/lookup/${id}?type=pin`,
      numDigits: 4,
      script: 'please enter your 4 digit pin number followed by the pound key',
    },
    gatherName: {
      action: `/api/voice/lookup/${id}?type=name`,
      script: 'Say the name of who you are needing to reach',
    },
    lookupNumber: {
      action: found
        ? `/api/voice/gather/${id}?type=pin`
        : `/api/voice/error?type=number&mobile=${number}`,
      script: '',
    },
    lookupPin: {
      action: found
        ? `/api/voice/gather/${id}?type=name`
        : `/api/voice/error/${id}?type=name`,
      script: '',
    },
    lookupName: {
      action: found ? `redirect=${number}` : `/api/voice/error/${id}?type=name`,
      script: found ? 'We have found your contact, connecting you now' : '',
    },
    errorNumber: {
      action: '/api/voice/lookup?type=number',
      script: `Sorry, the number ${number} was not found.  Please enter it again`,
    },
    errorPin: {
      action: `/api/voice/lookup/${id}?type=pin`,
      numDigits: 4,
      script: `Sorry, that pin was not found.  Please enter it again`,
    },
    errorName: {
      action: `/api/voice/lookup/${id}?type=name`,
      script: 'Sorry I could not find anybody by that name, please try again',
    },
  };
};
