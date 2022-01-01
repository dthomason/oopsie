export interface ErrorObject {
  reason: string;
  message: string;
}

export const formatErrorString = (
  location = 'server',
  error: ErrorObject | any,
) => {
  const message =
    typeof error === 'object' ? error.reason || error.message || error : error;

  return `${process.env.NODE_ENV === 'dev' ? `[${location}] ` : ''}${message}`;
};
