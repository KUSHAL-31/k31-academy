import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
require("dotenv").config();

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const { email, subject, template, data } = options;

  // email template file path
  const templatePath = path.join(__dirname, "../emails", template);

  // Render email template
  const html: string = await ejs.renderFile(templatePath, data);

  const emailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: subject,
    html,
  };

  await transporter.sendMail(emailOptions);
};

export default sendEmail;
