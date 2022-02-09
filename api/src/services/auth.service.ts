import { Request } from 'express';
import { Secret, sign } from 'jsonwebtoken';

import { futureDate } from '../controllers';
import { router } from '../routes';
import { log } from '../utils';

import { UserProfile, UserService } from './user.service';
import { checkVerification, startVerification } from './verifyMobile.service';

const { ACCESS_TOKEN_SECRET } = process.env;

export interface ValidationResponse {
  conflict?: 400 | 409 | 404;
  message?: string;
  user: Partial<UserProfile>;
}

// In JS/TS, FP > OOP
class AuthService {
  public path = '/refresh';
  public router = router;

  static async validateThenCreate(req: Request): Promise<ValidationResponse> {
    const { mobile, region } = req.body;

    if (!(mobile && region)) {
      return {
        conflict: 400,
        message: 'All input is required',
        user: req.body,
      };
    }

    const foundUser = await UserService.findByPhone(mobile);

    if (foundUser) {
      await startVerification(foundUser.mobile);

      return { user: foundUser };
    } else {
      const created = await UserService.create({
        mobile,
        region,
      });

      await startVerification(created.mobile);

      return { user: created };
    }
  }

  static async configureTokens({
    id,
    mobile,
    verifiedMobile,
    newUser,
  }: Partial<UserProfile>): Promise<any> {
    const tokenBaseParams = {
      id,
      mobile,
      verifiedMobile,
      newUser,
      aud: 'myPhone',
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
    const { mobile, region } = req.body;

    if (!(mobile && region)) {
      return {
        conflict: 400,
        message: 'All input is required',
        user: req.body,
      };
    }

    const signingUser = await UserService.findByPhone(mobile);

    if (!signingUser)
      return {
        conflict: 400,
        message: 'Account not Found',
        user: req.body,
      };

    if (!signingUser.verifiedMobile) {
      const { status } = await startVerification(signingUser.mobile);

      if (status !== 'success')
        log(status, 'Sign In Verify Mobile Not Verified', mobile);
    }

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

    const signingUser = await UserService.findByPhone(mobile);

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
