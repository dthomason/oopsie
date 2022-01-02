import { Prisma, Contact } from '@prisma/client';
import PhoneNumber from 'awesome-phonenumber';

import db from '../lib/db';
import { log, to } from '../utils';

export interface EmailAddress {
  label: string;
  email: string;
}

export interface Mobile {
  label: string;
  number: string;
}

export type ContactInput = {
  firstName: string;
  lastName: string;
  emailAddresses: EmailAddress[];
  phoneNumbers: Mobile[];
  recordID: string;
};

export type PreParsed = {
  userId: string;
  firstName: string;
  lastName: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  recordID: string;
};

export const deserializePhone = (items: string[]): Mobile[] => {
  return items.map((item: string) => JSON.parse(item));
};

export const deserializeEmail = (items: string[]): EmailAddress[] => {
  return items.map((item: string) => JSON.parse(item));
};

export interface ContactObject extends ContactInput {
  userId: string;
}

export class ContactService {
  static async addContacts(
    userId: string,
    userContacts: ContactInput[],
  ): Promise<ContactObject[]> {
    const validId = Prisma.validator<Prisma.UserWhereUniqueInput>()({
      id: userId,
    });

    const parsed = userContacts.map(con => {
      return {
        ...con,
        firstName: con.firstName,
        lastName: con.lastName,
        phoneNumbers: con.phoneNumbers.map(phone => JSON.stringify(phone)),
        emailAddresses: con.emailAddresses.map(email => JSON.stringify(email)),
      };
    });

    const newContacts = parsed.map(contact => {
      const newContact = Prisma.validator<Omit<Contact, 'userId'>>()(contact);
      const where = Prisma.validator<Prisma.ContactWhereUniqueInput>()({
        contactID: { userId, recordID: newContact.recordID },
      });

      return {
        create: newContact,
        update: newContact,
        where,
      };
    });

    const [response, err] = await to(
      db.user.update({
        where: validId,
        data: {
          contacts: {
            upsert: newContacts,
          },
        },
        select: {
          contacts: true,
        },
      }),
    );

    if (err) log(err, 'AddContacts');

    const contacts = response.contacts.map((con: PreParsed): ContactObject => {
      return {
        ...con,
        phoneNumbers: deserializePhone(con.phoneNumbers),
        emailAddresses: deserializeEmail(con.emailAddresses),
      };
    });

    return contacts;
  }

  static async getUserContacts(id: string): Promise<ContactObject[]> {
    const validId = Prisma.validator<Prisma.UserWhereUniqueInput>()({
      id,
    });

    const [response, err] = await to(
      db.user.findUnique({
        where: validId,
        select: {
          contacts: true,
        },
      }),
    );

    if (err) log(err, 'GetUserContacts');

    const contacts = response.contacts.map((con: PreParsed): ContactObject => {
      return {
        ...con,
        phoneNumbers: deserializePhone(con.phoneNumbers),
        emailAddresses: deserializeEmail(con.emailAddresses),
      };
    });

    return contacts;
  }

  static async findByNameStartsWith(id: string, name: string): Promise<any> {
    const validId = Prisma.validator<Prisma.UserWhereUniqueInput>()({ id });
    const cleaned = name.replace(/\./g, '').trim();
    const validContact = Prisma.validator<Prisma.UserSelect>()({
      contacts: {
        where: {
          firstName: {
            startsWith: cleaned,
          },
        },
        select: {
          phoneNumbers: true,
        },
      },
    });

    const [found, err] = await to(
      db.user.findFirst({
        where: validId,
        select: validContact,
      }),
    );

    if (err) log(err, 'find Contact by name startswith');

    if (found) {
      const { number } = deserializePhone(found)[0];
      const parsed = PhoneNumber(number.toString(), 'mobile').getNumber('e164');

      return parsed;
    }
  }

  static async findByNameContains(
    id: string,
    name: string,
  ): Promise<string | undefined> {
    const validId = Prisma.validator<Prisma.UserWhereUniqueInput>()({ id });
    const cleaned = name.replace(/\./g, '').trim();
    const validContact = Prisma.validator<Prisma.UserSelect>()({
      contacts: {
        where: {
          firstName: {
            contains: cleaned,
          },
        },
        select: {
          phoneNumbers: true,
        },
      },
    });

    const [found, err] = await to(
      db.user.findFirst({
        where: validId,
        select: validContact,
      }),
    );

    if (err) log(err, 'find Contact by name contains');

    if (found) {
      const { number } = deserializePhone(found)[0];
      const parsed = PhoneNumber(number, 'mobile').getNumber('e164');

      return parsed;
    }
  }
}
