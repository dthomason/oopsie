import setCookie from 'set-cookie-parser';

import { decodeToken } from '../store';

interface UserValues {
  id: string;
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

  if (parsedCookie.accessToken) {
    const { expires, value } = parsedCookie.accessToken;
    const now = new Date();

    if (expires && now < expires) {
      const { exp, aud, id, mobile, verifiedMobile } = decodeToken(value);

      if (exp && now.getTime() < exp && aud === 'oopsie-auth') {
        return {
          validToken: value,
          validData: {
            id,
            mobile,
            verifiedMobile,
          },
        };
      }
    }
  }

  return {};
};
