import { transporter } from "../config/nodemailer.js";

export const sendMail = async (
   to,
   subject,
   html
) => {
   await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,

      // use html instead of text
      html
   });
   console.log("sent");
};