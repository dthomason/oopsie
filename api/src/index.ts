import app from './app';
import 'dotenv-safe/config';
import { logger } from './lib';

const { SERVER_PORT } = process.env;

const server = app.listen(SERVER_PORT, () =>
  // eslint-disable-next-line no-console
  logger.info(`🚀 Server ready at: http://localhost:${SERVER_PORT}`),
);

export default server;
