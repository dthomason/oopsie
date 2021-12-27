#!/usr/bin/env node

import ngrok from 'ngrok';
import client from 'twilio';

import 'dotenv-safe/config';
import { logger } from './logger';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const { NGROK_TOKEN } = process.env;

export const tunnelOut = async () => {
  try {
    const url = await ngrok.connect({
      authtoken: NGROK_TOKEN,
      addr: 3030,
    });

    logger.info(`Server now available at ${url}`);

    ngrok.getUrl();

    const voiceUrl = `${url}/api/voice/gather`;

    const api = client(accountSid, authToken);

    const mainNumber = (await api.incomingPhoneNumbers.list()).find(
      number => number.phoneNumber === twilioNumber,
    );

    if (mainNumber) {
      await mainNumber.update({ voiceUrl });
    }

    logger.info(`Successfully updated Twilio voiceUrl to ${voiceUrl}`);
  } catch (e) {
    logger.error(e);
  }
};
