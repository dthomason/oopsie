import { useStore } from './userStore';

describe('Store', () => {
  describe('setState valid Params', () => {
    it('stores correctly', () => {
      const permissions = useStore.getState().permissions;

      expect(permissions).toBe('undefined');
    });
  });
});
