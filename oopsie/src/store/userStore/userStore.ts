import AsyncStorage from '@react-native-async-storage/async-storage';
import decode, { JwtPayload } from 'jwt-decode';
import create, { GetState, SetState } from 'zustand';
import { CountryCode } from 'react-native-country-picker-modal';
import {
  devtools,
  persist,
  StoreApiWithDevtools,
  StoreApiWithPersist,
} from 'zustand/middleware';

import { im } from '../middleware/immerMiddleware';

export const decodeToken = (token: string): TokenParams => {
  const decoded = decode<TokenParams>(token);

  const merged = Object.assign(initialValues, decoded);

  return merged;
};

interface TokenParams extends JwtPayload {
  id: string;
  email: string;
  mobile: string;
  verifiedMobile: boolean;
  scope: string[];
}

interface InputUserValues {
  id?: string;
  mobile?: string;
  verifiedMobile?: boolean;
}

const initialValues = {
  id: '',
  mobile: '',
  verifiedMobile: false,
};

type Permissions = 'undefined' | 'authorized' | 'denied';

interface TypedValues {
  mobile?: string;
  code?: string;
}

export interface UserStore {
  error: string;
  hasHydrated: boolean;
  loading: boolean;
  isDark: boolean;
  signedIn: boolean;
  token: string;
  successfulSync: boolean;
  countryCode: CountryCode;
  currentStamp: string;
  tokenExpired: boolean;
  typedValues: TypedValues;
  userValues: InputUserValues;
  permissions: Permissions;
  recordIDs: string[];
  setCountryCode: (countryCode: CountryCode) => void;
  setCurrentStamp: (stamp: string) => void;
  setSuccessfulSync: (result: boolean) => void;
  setTypedValues: (typed: TypedValues) => void;
  setDarkMode: (dark: boolean) => void;
  setLoading: (loading: boolean) => void;
  setPermissions: (permissions: Permissions) => void;
  setSignedIn: (success: boolean) => void;
  setToken: (token: string) => void;
  updateUserValues: (user: InputUserValues) => void;
}

export const useStore = create<
  UserStore,
  SetState<UserStore>,
  GetState<UserStore>,
  StoreApiWithDevtools<UserStore> & StoreApiWithPersist<UserStore>
>(
  devtools(
    persist(
      im(set => ({
        currentStamp: '',
        countryCode: 'US',
        error: '',
        hasHydrated: false,
        isDark: false,
        loading: true,
        permissions: 'undefined',
        recordIDs: [''],
        signedIn: false,
        successfulSync: false,
        token: '',
        tokenExpired: true,
        typedValues: {},
        userValues: {},
        setCountryCode: (countryCode: CountryCode) => set({ countryCode }),
        setCurrentStamp: (stamp: string) => set({ currentStamp: stamp }),
        setSuccessfulSync: (result: boolean) => set({ successfulSync: result }),
        setDarkMode: (dark: boolean) => set({ isDark: dark }),
        setLoading: (loading: boolean) => set({ loading }),
        setPermissions: (permissions: Permissions) => set({ permissions }),
        setToken: async (token: string) => set({ token }),
        setTypedValues: (typed: TypedValues) => {
          set(draft => {
            Object.assign(draft.typedValues, typed);
          });
        },
        setSignedIn: (success: boolean) => set({ signedIn: success }),
        updateUserValues: (values: InputUserValues) => {
          set(draft => {
            Object.assign(draft.userValues, values);
          });
        },
      })),
      {
        name: 'MyPhoneUserStore-800',
        getStorage: () => AsyncStorage,
        partialize: state => ({
          token: state.token,
          signedIn: state.signedIn,
          permissions: state.permissions,
          currentStamp: state.currentStamp,
        }),
        onRehydrateStorage: () => () => {
          useStore.setState({ hasHydrated: true });
        },
      },
    ),
    { name: 'UserStore' },
  ),
);
