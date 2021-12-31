import faker from 'faker';

import { UserService } from '../../services/user.service';
import { userBuilder } from '../../testHelpers';
import { formatPhoneNumber } from '../../utils';

global.console.log = jest.fn();

describe('#User Service', () => {
  describe('#create', () => {
    describe('when provided with correct params', () => {
      it('creates a new User', async () => {
        const newUser = userBuilder();

        const created = await UserService.create(newUser);

        expect(created).toBeDefined();

        expect(created.mobile).toBe(formatPhoneNumber(newUser.mobile));
      });
    });

    describe('when that user has already been created', () => {
      it('returns an error', async () => {
        const user1 = userBuilder();
        const created1 = await UserService.create(user1);

        expect(created1.mobile).toBe(formatPhoneNumber(user1.mobile));

        await UserService.create(user1);

        expect(global.console.log).toHaveBeenCalledWith(
          `User.create: Unique Constraint Violation, a user with email: ${formatPhoneNumber(
            user1.mobile,
          )} already exists`,
        );
      });
    });
  });

  describe('#findById', () => {
    it('finds User by id', async () => {
      const user = await UserService.create(userBuilder());

      const found = await UserService.findById(user.id);

      expect(user.id).not.toBe('');

      expect(found?.id).toBe(user.id);
    });
  });

  describe('#findByEmail', () => {
    it('finds User by email', async () => {
      const user = await UserService.create(userBuilder());
      const userEmail = user?.email || '';

      const found = await UserService.findByEmail(userEmail);

      expect(userEmail).not.toBe('');

      expect(found?.email).toBe(userEmail);
    });
  });

  describe('#update', () => {
    describe('when updating an email', () => {
      it('updates with the correct format', async () => {
        const user = await UserService.create(userBuilder());
        const email = user.email;
        const newEmail = faker.internet.email();

        expect(email).not.toBe('');
        expect(email).not.toBe(newEmail);

        await UserService.update(user.id, { email: newEmail });

        const updatedUser = await UserService.findById(user.id);

        expect(updatedUser?.email).toBe(newEmail.toLowerCase());
      });
    });

    describe('when updating a mobile number', () => {
      it('updates with the correct format', async () => {
        const user = await UserService.create(userBuilder());
        const mobile = faker.phone.phoneNumberFormat();

        await UserService.update(user.id, { mobile });

        const updatedUser = await UserService.findById(user.id);

        expect(updatedUser?.mobile).toBe(formatPhoneNumber(mobile));
      });
    });
  });

  describe('#findByPhone', () => {
    it('finds User by mobile', async () => {
      const user = await UserService.create(userBuilder());
      const mobile = faker.phone.phoneNumberFormat();

      const formatted = formatPhoneNumber(mobile);

      await UserService.update(user.id, { mobile });

      const userWithPhone = await UserService.findByPhone(formatted);

      expect(userWithPhone?.mobile).toBe(formatted);
    });
  });
});
