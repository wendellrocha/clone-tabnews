import nodemailer from "nodemailer";
import { ServiceError } from "./errors";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMPT_HOST,
  port: process.env.EMAIL_SMPT_PORT,
  auth: {
    user: process.env.EMAIL_SMPT_USER,
    pass: process.env.EMAIL_SMPT_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production",
});

async function send(mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new ServiceError({
      message: "não foi possível enviar o email.",
      action: "Verifique se o serviço de email está disponível.",
      cause: error,
      context: mailOptions,
    });
  }
}

const email = { send };

export default email;
