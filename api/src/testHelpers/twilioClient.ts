import 'dotenv-safe/config';
import twilio from 'twilio';
import RequestClient from 'twilio/lib/base/RequestClient';

const authToken = process.env.TWILIO_AUTH_TOKEN;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const isTest = process.env.ENV === 'test';

class PrismClient {
  prismUrl: any;
  requestClient: any;

  constructor(prismUrl: any, requestClient: any) {
    this.prismUrl = prismUrl;
    this.requestClient = requestClient;
  }

  request(opts: { uri: string }) {
    opts.uri = opts.uri.replace(/^https:\/\/.*?\.twilio\.com/, this.prismUrl);

    return this.requestClient.request(opts);
  }
}

const client = isTest
  ? twilio(accountSid, authToken, {
      accountSid,
      httpClient: new PrismClient('http://127.0.0.1:4010', new RequestClient()),
    })
  : twilio(accountSid, authToken);

export default client;
