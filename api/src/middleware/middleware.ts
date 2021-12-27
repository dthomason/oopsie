import cookieParser from 'cookie-parser';
import { Express, json } from 'express';
import asyncHandler from 'express-async-handler';
import morgan from 'morgan';

import { bodyParser } from './bodyParser';
import { requestMethods } from './requestMethods';

// import { router } from './routes/routes';

export const middleware = (app: Express) => {
  app.use(json());
  app.use(bodyParser);
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(requestMethods);
  app.use(asyncHandler);
};
