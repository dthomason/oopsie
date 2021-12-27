import md5 from 'md5';
import { Contact } from 'react-native-contacts';

import { UserContact } from '../sdk/src/contacts';

interface ReturnParsed {
  parsed: UserContact[];
  stamp: string;
}

export const parseContacts = (contacts: Contact[]): ReturnParsed => {
  if (!contacts.length) return { parsed: [], stamp: '' };
  const randomID = new Date().getTime().toString();

  const recordIDs = [contacts[0].recordID ? contacts[0].recordID : randomID];
  const parsed = contacts.map<UserContact>(
    (contact: Contact, index: number) => {
      if (index !== 0) {
        recordIDs.push(contact.recordID ? contact.recordID : randomID);
      }

      return {
        firstName: contact.givenName || '',
        lastName: contact.familyName || '',
        company: contact.company || '',
        jobTitle: contact.jobTitle || '',
        emailAddresses: contact.emailAddresses.length
          ? contact.emailAddresses
          : [{ label: '', email: '' }],
        phoneNumbers: contact.phoneNumbers.length
          ? contact.phoneNumbers
          : [{ label: '', number: '' }],
        recordID: contact.recordID || '',
      };
    },
  );

  const stamp = md5(parsed.join(''));

  return { parsed, stamp };
};
