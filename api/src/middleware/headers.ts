import { NextFunction, Request, Response } from 'express';

export const headerConfig = (_: Request, res: Response, next: NextFunction) => {
  res.header('Content-Type', 'application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  next();
};
