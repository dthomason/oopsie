import { compare } from 'bcrypt';
import { Request } from 'express';
import { Secret, sign } from 'jsonwebtoken';

import { futureDate } from '../controllers';
import { router } from '../routes';
import { checkVerification, startVerification } from './verifyMobile.service';
import { log, to } from '../utils';

import { UserProfile, UserService } from './user.service';

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
    const { email, password, mobile, pin } = req.body;

    if (!(email && password && mobile && pin)) {
      return {
        conflict: 400,
        message: 'All input is required',
        user: req.body,
      };
    }

    const foundUser = await UserService.findByEmail(email);

    if (foundUser) {
      return {
        conflict: 409,
        message: 'User Already Exists. Please Sign In',
        user: req.body,
      };
    }

    const created = await UserService.create({
      email,
      password,
      mobile,
      pin,
      verifiedEmail: false,
      verifiedMobile: false,
    });

    const { status } = await startVerification(created.mobile);

    if (status !== 'success') log(status, 'Signup Verification process', email);

    return { user: created };
  }

  static async configureTokens({
    id,
    email,
    mobile,
    verifiedMobile,
  }: Partial<UserProfile>): Promise<any> {
    const tokenBaseParams = {
      id,
      email,
      mobile,
      verifiedMobile,
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
    const { email, password } = req.body;

    if (!(email && password)) {
      return {
        conflict: 400,
        message: 'All input is required',
        user: req.body,
      };
    }

    const signingUser = await UserService.findByEmail(email);

    if (!signingUser)
      return {
        conflict: 400,
        message: 'Account not Found',
        user: req.body,
      };

    const hash = await UserService.findPasswordByEmail(email);

    const [match, err] = await to(compare(password, hash.password));

    if (err) log(err, 'Compare failed');

    if (!match)
      return {
        conflict: 400,
        message: 'That username and password were not found',
        user: email,
      };

    if (!signingUser.verifiedMobile) {
      const { status } = await startVerification(signingUser.mobile);

      if (status !== 'success')
        log(status, 'Sign In Verify Mobile Not Verified', email);
    }

    return {
      user: signingUser,
    };
  }

  static async verifyMobile(req: any): Promise<ValidationResponse> {
    const { email, code, mobile } = req.body;

    if (!(email && code && mobile)) {
      return {
        conflict: 400,
        message: 'Missing All Required Values',
        user: req.body,
      };
    }

    const signingUser = await UserService.findByEmail(email);

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
      user: email,
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
