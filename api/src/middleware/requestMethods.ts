import { Request, Response, NextFunction } from 'express';

export const requestMethods = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
  const allowedMethods = [
    'OPTIONS',
    'HEAD',
    'CONNECT',
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
  ];

  if (!allowedMethods.includes(req.method)) {
    res.status(405).send(`${req.method} not allowed.`);
  }

  next();
};
