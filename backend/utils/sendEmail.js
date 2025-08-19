
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { emailTemplate } from './emailTemplate.js';

dotenv.config();

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: options.email,
    subject: options.subject,
    html: emailTemplate(options.otp),
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
