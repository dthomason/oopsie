import { authStore } from './authStore';

describe('authStore', () => {
  describe('token does not exist', () => {
    it('#authorized is false', () => {
      const result = authStore.getState().signedIn;

      expect(result).toBe(false);
    });
  });

  describe('token does exist', () => {
    it('#authrized is true', () => {
      authStore.getState().validateToken('alsdkfjasdfjdkwl');

      const result = authStore.getState().signedIn;

      expect(result).toBe(true);
    });
  });
});
