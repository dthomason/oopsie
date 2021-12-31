import crypto from 'crypto-extra';
import { Request } from 'express';
import { Secret, sign } from 'jsonwebtoken';

import { router } from '../routes';
import { futureDate, log } from '../utils';

import { UserProfile, UserService } from './user.service';
import { checkVerification, startVerification } from './verifyMobile.service';

const { ACCESS_TOKEN_SECRET } = process.env;

export interface ValidationResponse {
  conflict?: 400 | 409 | 404;
  message?: string;
  user: Partial<UserProfile>;
}

class AuthService {
  public path = '/refresh';
  public router = router;

  static async validateThenCreate(req: Request): Promise<ValidationResponse> {
    const { mobile, countryCode } = req.body;

    if (!(mobile && countryCode)) {
      return {
        conflict: 400,
        message: 'All input is required',
        user: req.body,
      };
    }

    const foundUser = await UserService.findByMobile(mobile);

    if (foundUser) {
      return {
        conflict: 409,
        message: 'User Already Exists. Please Sign In',
        user: req.body,
      };
    }

    const created = await UserService.create({
      countryCode,
      mobile,
      verifiedEmail: false,
      verifiedMobile: false,
    });

    const { status } = await startVerification(created.mobile);

    if (status !== 'success')
      log(status, 'Signup Verification process', mobile);

    return { user: created };
  }

  static async configureTokens({
    id,
    mobile,
    verifiedMobile,
  }: Partial<UserProfile>): Promise<any> {
    const tokenBaseParams = {
      id,
      mobile,
      verifiedMobile,
      aud: 'oopsie-auth',
      exp: futureDate.getTime(),
      scope: ['openid', 'profile', 'offline_access'],
      roles: ['user'],
    };

    const jwtAccess = sign(tokenBaseParams, ACCESS_TOKEN_SECRET as Secret);

    return {
      jwtAccess,
    };
  }

  static async validateSignin(req: Request): Promise<ValidationResponse> {
    const { mobile, countryCode } = req.body;

    if (!(mobile && countryCode)) {
      return {
        conflict: 400,
        message: 'Bad Request, check your entry and try again',
        user: req.body,
      };
    }

    const signingUser = await UserService.findByMobile(mobile);

    if (!signingUser)
      return {
        conflict: 400,
        message: 'Account not Found',
        user: req.body,
      };

    await UserService.update(signingUser.id, { verifiedMobile: false });

    const { status } = await startVerification(signingUser.mobile);

    if (status !== 'success')
      log(status, 'Sign In Verify Mobile Not Verified', mobile);

    return {
      user: signingUser,
    };
  }

  static async verifyMobile(req: any): Promise<ValidationResponse> {
    const { code, mobile } = req.body;

    if (!(code && mobile)) {
      return {
        conflict: 400,
        message: 'Missing All Required Values',
        user: req.body,
      };
    }

    const signingUser = await UserService.findByMobile(mobile);

    if (!signingUser)
      return {
        conflict: 404,
        message: 'Account not Found',
        user: req.body,
      };

    const { status } = await checkVerification(mobile, code);

    if (status === 'success') {
      await UserService.update(signingUser.id, { verifiedMobile: true });

      return {
        user: {
          ...signingUser,
          verifiedMobile: true,
        },
      };
    }

    return {
      conflict: 400,
      message: 'Incorrect Code Entered',
      user: mobile,
    };
  }

  static async verifyUser(user: UserProfile): Promise<ValidationResponse> {
    const { id } = user;

    if (!id) {
      return {
        conflict: 400,
        message: 'Missing All Required Values',
        user: user,
      };
    }

    const signingUser = await UserService.findById(id);

    if (!signingUser)
      return {
        conflict: 404,
        message: 'Account not Found',
        user: user,
      };

    return {
      user: signingUser,
    };
  }
}

export default AuthService;

// TODO: use for 2-factor auth
//       const hash = await UserService.findPinByMobile(mobile);
//
//       const [match, err] = await to(compare(pin, hash.pin));
//
//       if (err) log(err, 'Compare failed');
//
//       if (!match)
//         return {
//           conflict: 400,
//           message: 'That username and password were not found',
//           user: mobile,
//         };
