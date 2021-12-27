/* eslint-disable consistent-return */

import db from './db';
import { logger } from './logger';

const handleProcessEvents = async () => {
  try {
    process.on('exit', async () => {
      await db.$disconnect();
    });

    process.on('uncaughtException', error => {
      logger.error(error);
    });

    process.on('uncaughtException', async error => {
      logger.error(error);
    });

    process.on('unhandledRejection', async error => {
      logger.error(error);
    });
  } catch (exception: any) {
    throw new Error(
      `[startup.handleProcessEvents] ${exception.message || exception}`,
    );
  }
};

export const startup = async () => {
  try {
    await handleProcessEvents();
  } catch (exception: any) {
    `[startup] ${exception.message}`;
  }
};
