import Config from 'react-native-config';
import setCookie from 'set-cookie-parser';

import { decodeToken } from '../store';

interface UserValues {
  id: string;
  email: string;
  mobile: string;
  verifiedMobile: boolean;
}

interface ValidatedTokenResponse {
  validToken?: string;
  validData?: UserValues;
}

export const validateToken = (cookie: string): ValidatedTokenResponse => {
  const parsedCookie = setCookie.parse(cookie, {
    decodeValues: true,
    map: true,
  });

  if (
    parsedCookie.accessToken &&
    parsedCookie.accessToken.domain === Config.BASE_URL
  ) {
    const { expires, value } = parsedCookie.accessToken;
    const now = new Date();

    if (expires && now < expires) {
      const { exp, aud, id, email, mobile, verifiedMobile } =
        decodeToken(value);

      if (exp && now.getTime() < exp && aud === 'myPhone') {
        return {
          validToken: value,
          validData: {
            id,
            email,
            mobile,
            verifiedMobile,
          },
        };
      }
    }
  }

  return {};
};
