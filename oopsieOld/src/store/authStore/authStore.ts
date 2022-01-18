import create from 'zustand';

interface AuthStore {
  token: string;
  refreshToken: string;
  signedIn: boolean;
  ttl: number;
  validateToken: (token: string) => void;
}

export const authStore = create<AuthStore>(set => ({
  token: '',
  refreshToken: '',
  signedIn: false,
  ttl: 0,
  validateToken: (token: string) =>
    set(state => {
      state.token = token;
      state.signedIn = true;
    }),
}));
