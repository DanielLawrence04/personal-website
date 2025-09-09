// api/send_email.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }

  const {name, email, subject, message} = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({error: "All fields are required"});
  }

  try {
    // Transporter (using Gmail SMTP as example, you can use iCloud too)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or "icloud"
      auth: {
        user: process.env.EMAIL_USER, // set in Vercel env
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER, // your own inbox
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return res.status(200).json({success: "Message sent successfully!"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: "Failed to send message."});
  }
}
