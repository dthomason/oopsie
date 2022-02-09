import { Prisma, PrismaClient } from '@prisma/client';

import { logger } from './logger';

const { NODE_ENV } = process.env;

const queryLogger = (e: Prisma.QueryEvent): void => {
  logger.info('Query: ' + e.query);
  logger.info('Duration: ' + e.duration + 'ms');
};

const db = new PrismaClient({
  log: [
    // Can make each of these objects one line for readability
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

if (NODE_ENV === 'dev') {
  db.$on('query', e => queryLogger(e));
}

db.$on('error', e => logger.error(e.message));
db.$on('warn', e => logger.warn(e.message));
db.$on('info', e => logger.info(e.message));

export default db;
