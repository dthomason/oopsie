import { Request, Response } from 'express';
import { logger } from '../lib';

import { router } from '../routes/routes';
import { UserService } from '../services';
import AuthService from '../services/auth.service';
import { log, to } from '../utils';

export const futureDate = new Date(
  Date.now() + 1000 /* sec */ * 60 /* min */ * 60 /* hour */ * 24 /* day */,
);

const cookieConfig = {
  secure: process.env.NODE_ENV === 'prod',
  httpOnly: true,
  expires: futureDate,
  domain: process.env.BASE_URL,
};

export class UserController {
  public path = ':id';
  public router = router;

  static async show(req: Request, res: Response): Promise<any> {
    try {
      const { conflict, message, user } = await AuthService.verifyUser(
        req.body.user,
      );

      if (conflict) return res.status(conflict).json(message);

      const { jwtAccess } = await AuthService.configureTokens(user);

      res.cookie('accessToken', jwtAccess, cookieConfig);

      res.status(200).send(user);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  static async create(req: Request, res: Response): Promise<any> {
    try {
      const { conflict, message, user } = await AuthService.validateThenCreate(
        req,
      );

      if (conflict) return res.status(conflict).json(message);

      const createdUser = {
        id: user.id,
        mobile: user.mobile,
        verifiedMobile: user.verifiedMobile,
      };

      res.status(200).json(createdUser);
    } catch (err) {
      res.status(500).send(err);
      logger.error(err);
    }
  }

  static async signIn(req: Request, res: Response): Promise<any> {
    try {
      const { conflict, message, user } = await AuthService.validateSignin(req);

      if (conflict) return res.status(conflict).json(message);

      const { jwtAccess } = await AuthService.configureTokens(user);

      const userProfile = {
        id: user.id,
        mobile: user.mobile,
        verifiedMobile: user.verifiedMobile,
      };

      res.cookie('accessToken', jwtAccess, cookieConfig);

      res.status(200).json(userProfile);
    } catch (err) {
      logger.error(err);
    }
  }

  static async verify(req: Request, res: Response): Promise<any> {
    try {
      const { conflict, message, user } = await AuthService.verifyMobile(req);

      if (conflict) return res.status(conflict).json(message);

      const { jwtAccess } = await AuthService.configureTokens(user);

      const userProfile = {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        verifiedMobile: user.verifiedMobile,
      };

      res.cookie('accessToken', jwtAccess, cookieConfig);
      res.status(200).json(userProfile);
    } catch (err) {
      logger.error(err);
    }
  }
}
