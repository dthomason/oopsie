import { UserService } from '../../services/user.service';
import { fakerPhoneGen } from '../../testHelpers';

global.console.log = jest.fn();

describe('#User Service', () => {
  describe('#create', () => {
    describe('when provided with correct params', () => {
      it('creates a new User', async () => {
        const newUser = {
          mobile: fakerPhoneGen(),
          region: 'US',
        };

        const created = await UserService.create(newUser);

        expect(created).toBeDefined();

        expect(created.mobile).toBe(newUser.mobile);
      });
    });

    describe('when that user has already been created', () => {
      it('returns an error', async () => {
        const user1 = {
          mobile: fakerPhoneGen(),
          region: 'US',
        };
        const user2 = user1;
        const created1 = await UserService.create(user1);

        expect(created1.mobile).toBe(user1.mobile);

        await UserService.create(user2);

        expect(global.console.log).toHaveBeenCalledWith(
          `User.create: Unique Constraint Violation, the account with: ${user2.mobile} already exists`,
        );
      });
    });
  });

  describe('#findById', () => {
    it('finds User by id', async () => {
      const build = {
        mobile: fakerPhoneGen(),
        region: 'US',
      };
      const user = await UserService.create(build);

      const found = await UserService.findById(user.id);

      expect(user.id).not.toBe('');

      expect(found?.id).toBe(user.id);
      expect(found.mobile).toBe(user.mobile);
    });
  });

  describe('#findByPhone', () => {
    it('finds User by phone', async () => {
      const newUser = {
        mobile: fakerPhoneGen(),
        region: 'US',
      };
      const user = await UserService.create(newUser);

      const found = await UserService.findByPhone(user.mobile);

      expect(found.mobile).not.toBe('');
      expect(found.mobile).toBe(newUser.mobile);
    });
  });

  describe('#update', () => {
    describe('when updating a mobile number', () => {
      it('updates with the correct format', async () => {
        const build = {
          mobile: fakerPhoneGen(),
          region: 'US',
        };
        const user = await UserService.create(build);
        const newMobile = fakerPhoneGen();

        expect(user.mobile).not.toBe('');
        expect(user.mobile).not.toBe(newMobile);

        const updatedUser = await UserService.update(user.id, {
          mobile: newMobile,
        });

        expect(updatedUser.mobile).toBe(newMobile);
      });
    });
  });
});
