import twilio from 'twilio';

import { logger } from '../lib';
import { formatPhoneNumber } from '../utils';

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const serviceKey = process.env.VERIFY_SERVICE_SID as string;
const client = twilio(accountSid, authToken);

type Status = 'success' | 'failed' | 'error';

interface Response {
  status: Status;
}

export const startVerification = async (mobile: string): Promise<Response> => {
  try {
    const response = await client.verify.v2
      .services(serviceKey)
      .verifications.create({
        to: formatPhoneNumber(mobile, 'e164'),
        channel: 'sms',
      });

    if (response.status === 'pending') {
      return { status: 'success' };
    } else {
      return { status: 'failed' };
    }
  } catch (e) {
    logger.error(e);

    return { status: 'error' };
  }
};

export const checkVerification = async (
  mobile: string,
  code: string,
): Promise<Response> => {
  try {
    const response = await client.verify.v2
      .services(serviceKey)
      .verificationChecks.create({
        to: formatPhoneNumber(mobile, 'e164'),
        code,
      });

    if (response.status === 'approved') {
      return { status: 'success' };
    } else {
      return { status: 'failed' };
    }
  } catch (e) {
    logger.error(e);

    return { status: 'error' };
  }
};
