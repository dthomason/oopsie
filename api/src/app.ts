import cookieParser from 'cookie-parser';
import express, { json } from 'express';
import morgan from 'morgan';

import { startup } from './lib/startup';
import { bodyParser, requestMethods } from './middleware';
import { router } from './routes/routes';

startup();

const app = express();

app.use(requestMethods);
app.use(morgan('dev'));
app.use(json());
app.use(bodyParser);
app.use(cookieParser());

app.use('/', router);
app.use('/api', router);

export default app;
