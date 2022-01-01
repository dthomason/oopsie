import signup from '../../services/signUp';
import { userBuilder } from '../../testHelpers';

describe('signUp Service', () => {
  describe('#addSessionToUser', () => {
    xit('correctly adds session to user table', () => {
      // TODO: write
    });
  });
  describe('#getUserByUserId', () => {
    xit('finds user', () => {
      // TODO: write
    });
  });
  describe('#insertUserInDatabase', () => {
    xit('inserts new user correctly', () => {
      // TODO: write
    });
  });
  describe('#getUserToCreate', () => {
    xit('properly parses user for creation', () => {
      // TODO: write
    });
  });
  describe('#getExistingUser', () => {
    xit('successfully finds existing user', () => {
      // TODO: write
    });
  });
  describe('#isValidNumber', () => {
    describe('when valid', () => {
      xit('passes', () => {
        // TODO: write
      });
    });
    describe('when invalid', () => {
      xit('fails', () => {
        // TODO: write
      });
    });
  });
  describe('#validateOptions', () => {
    xit('properly detects each failure case', () => {
      // Case: 1
      // Empty options object
      // Case: 2
      // Missing countryCode
      // Case 3
      // Missing mobile
      // Case 4
      // Missing deviceId
      // Case 5
      // Invalid number
    });
  });
  describe('#signup', () => {
    xdescribe('existing user found', () => {
      xit('throws error with message', () => {
        // TODO: write
      });
    });
    describe('new user entry', () => {
      it('adds user to db, creates a valid token, and adds session to user', async () => {
        const user = userBuilder();

        console.log({ user });

        const result = await signup(user);

        console.log({ result });
      });
    });
  });
});
