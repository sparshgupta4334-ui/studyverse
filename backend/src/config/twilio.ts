import twilio from 'twilio';

let twilioClient: ReturnType<typeof twilio> | null = null;

const getTwilioClient = () => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return null;
  if (!twilioClient) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

export const sendSMS = async (to: string, body: string): Promise<void> => {
  const client = getTwilioClient();
  if (!client || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`[DEV] SMS to ${to}: ${body}`);
    return;
  }
  await client.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to });
};
