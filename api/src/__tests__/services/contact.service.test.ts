import { times } from 'lodash';

import { sortArray } from '../../lib';
import { UserService, ContactService } from '../../services';
import { contactBuilder, fakerPhoneGen } from '../../testHelpers';

global.console.log = jest.fn();

beforeEach(() => {
  jest.resetModules();
});

describe('#Contact Service', () => {
  describe('#addContacts', () => {
    // The `it` statement doesn't read clearly
    it('that the data added is valid', async () => {
      // Builders FTW
      const build = {
        mobile: fakerPhoneGen(),
        region: 'US',
      };

      await UserService.create(build);
      const newContact = [contactBuilder()];

      const user = await UserService.findByPhone(build.mobile);
      const response = await ContactService.addContacts(user.id, newContact);

      const expected = newContact[0];
      const contact = response[0];

      expect(contact.firstName).toBe(expected.firstName);
      expect(contact.lastName).toBe(expected.lastName);
      expect(contact.phoneNumbers[0].number).toBe(
        expected.phoneNumbers[0].number,
      );
      expect(contact.emailAddresses[0].email).toBe(
        expected.emailAddresses[0].email,
      );
      expect(contact.recordID).toBe(expected.recordID);
    });
  });

  describe('#addContacts', () => {
    it('adds the proper data', async () => {
      const build = {
        mobile: fakerPhoneGen(),
        region: 'US',
      };

      await UserService.create(build);
      const newContacts = times(3)
        .map(() => contactBuilder())
        .sort(sortArray);

      const user = await UserService.findByPhone(build.mobile);

      await ContactService.addContacts(user.id, newContacts);

      const userContacts = await ContactService.getUserContacts(user.id);

      const contacts = userContacts.sort(sortArray);

      expect(contacts?.length).toBe(3);
      expect(contacts[0]).toMatchObject(newContacts[0]);
      expect(contacts[1]).toMatchObject(newContacts[1]);
      expect(contacts[2]).toMatchObject(newContacts[2]);
    });
  });

  describe('#getUserContacts', () => {
    it('receives the User Contact list', async () => {
      const build = {
        mobile: fakerPhoneGen(),
        region: 'US',
      };

      await UserService.create(build);
      const newContacts = times(2)
        .map(() => contactBuilder())
        .sort(sortArray);

      const user = await UserService.findByPhone(build.mobile);

      await ContactService.addContacts(user.id, newContacts);

      const userContacts = await ContactService.getUserContacts(user.id);

      const sorted = userContacts.sort(sortArray);

      const contact1 = sorted[0];
      const contact2 = sorted[1];

      expect(contact1).toMatchObject(newContacts[0]);
      expect(contact2).toMatchObject(newContacts[1]);

      expect(sorted?.length).toBe(2);
    });
  });
});
