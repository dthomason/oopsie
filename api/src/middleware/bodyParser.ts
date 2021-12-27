import { urlencoded, json } from 'body-parser';
import { NextFunction, Request, Response } from 'express';

export const bodyParser = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.headers['content-type'];

  if (contentType && contentType === 'application/x-www-form-urlencoded') {
    return urlencoded({ extended: true })(req, res, next);
  }

  return json()(req, res, next);
};
