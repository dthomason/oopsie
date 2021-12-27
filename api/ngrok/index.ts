#!/usr/bin/env node

import ngrok from 'ngrok';
import client from 'twilio';
import 'dotenv-safe/config';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const { NGROK_TOKEN } = process.env;

const updateTwilio = async () => {
  try {
    const url = await ngrok.connect({
      authtoken: NGROK_TOKEN,
      addr: 3030,
    });

    console.log(`Server now available at ${url}`);

    ngrok.getUrl();

    const voiceUrl = `${url}/api/voice/gather`;

    const api = client(accountSid, authToken);

    const mainNumber = (await api.incomingPhoneNumbers.list()).find(
      number => number.phoneNumber === twilioNumber,
    );

    if (mainNumber) {
      await mainNumber.update({ voiceUrl });
    }

    console.log(`Successfully updated Twilio voiceUrl to ${voiceUrl}`);
  } catch (e) {
    console.log(e);
  }
};

updateTwilio();

export default ngrok;
