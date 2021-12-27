import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Logger } from 'tslog';

const config: Logger = new Logger({
  displayFilePath: 'hidden',
  maskValuesOfKeys: ['password'],
  displayFunctionName: false,
  displayInstanceName: false,
  displayLoggerName: false,
});

const isErrorObject = (value: any) => {
  return value && value instanceof Error;
};

const isDbError = (value: any) => {
  return value && value instanceof PrismaClientKnownRequestError;
};

export const getErrorMessage = (value: any) => {
  if (isErrorObject(value)) {
    return value?.message || value?.reason || value;
  }

  if (isDbError(value)) {
    return `Known DB Error: ${value.message}, code: ${value.code}`;
  }

  return value;
};

export const logger = {
  info: (e: any) => {
    config.info(getErrorMessage(e));
  },
  warn: (e: any) => {
    config.warn(getErrorMessage(e));
  },
  error: (e: any) => {
    config.error(getErrorMessage(e));
  },
};
