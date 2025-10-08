import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioSMSOptions = {
  body: "Este es un mensaje de prueba desde Twilio y Node.js",
  from: process.env.TWILIO_SMS_NUMBER,
  to: process.env.TWILIO_SMS_TO_NUMBER,
};

export const sendSMS = async (req, res) => {
  try {
    console.log("Enviando SMS usando Twilio...");
    console.log("twilioClient: ", twilioClient);
    const result = await twilioClient.messages.create(twilioSMSOptions);
    res
      .status(200)
      .send({ success: "SMS enviado correctamente!", payload: result });
  } catch (error) {
    console.error("Hubo un problema enviando el SMS usando Twilio.");
    res.status(500).send({ error: error });
  }
};
