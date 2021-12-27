import client from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_NUMBER || '';

export const switchboard = client(accountSid, authToken);

interface ConnectCall {
  from?: string;
  say?: string;
  to: string;
}

export const connectCall = ({
  from = phoneNumber,
  to,
  say,
}: ConnectCall): void => {
  const anweringMessage = say ? `<Response><Say>${say}</Say></Response>` : '';

  try {
    switchboard.calls
      .create({
        twiml: anweringMessage,
        from,
        to,
      })
      .then(call => console.log(call.sid));
  } catch (e) {
    console.log(e);
  }
};
