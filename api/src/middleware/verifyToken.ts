import { Request, Response } from 'express';
import { Secret, verify } from 'jsonwebtoken';
import decode, { JwtPayload } from 'jwt-decode';

import { logger } from '../lib/logger';
import 'dotenv/config';

const initialValues = {
  id: '',
  email: '',
  mobile: '',
  verifiedMobile: false,
};

export const decodeToken = (token: string): TokenParams => {
  const decoded = decode<TokenParams>(token);

  const merged = Object.assign(initialValues, decoded);

  return merged;
};

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret;

interface TokenParams extends JwtPayload {
  id: string;
  email: string;
  mobile: string;
  verifiedMobile: boolean;
  roles?: string[];
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: () => any,
): any => {
  const now = new Date().getTime();
  const token = req.cookies.accessToken || req.headers.authorization;

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const verified = verify(token, accessTokenSecret);

    if (!verified) {
      logger.error('Invalid Token');

      return res.status(401).send('Invalid Token');
    }

    const decoded = decodeToken(token);

    if (decoded.exp && decoded.exp < now) {
      return res.status(401).send('Token Expired');
    }

    req.body.user = {
      id: decoded.id,
      email: decoded.email,
      mobile: decoded.mobile,
      verifiedMobile: decoded.verifiedMobile,
    };
  } catch (err) {
    logger.error('Invalid Token' + err);

    return res.status(401).send('Invalid Token');
  }

  return next();
};
