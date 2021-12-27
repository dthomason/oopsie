import ngrok from 'ngrok';
import nodemon from 'nodemon';
import client from 'twilio';

import 'dotenv-safe/config';
import db from './lib/db';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const { NGROK_TOKEN } = process.env;

nodemon({
  watch: ['src'],
  ext: '*.ts,*.json',
  ignore: ['src/**/*.spec.ts'],
  exec: 'ts-node ./src/index.ts',
});

let url = '';

nodemon
  .on('start', async () => {
    if (!url) {
      try {
        url = await ngrok.connect({
          authtoken: NGROK_TOKEN,
          proto: 'http',
          addr: 3030,
        });
        console.log(`Server now available at ${url}`);

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
    }
  })
  .on('quit', async () => {
    await ngrok.kill();
    await db.$disconnect();
  })
  .on('exit', async () => {
    await ngrok.kill();
    await db.$disconnect();
  });
