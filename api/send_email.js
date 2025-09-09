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
    // iCloud SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.me.com", // iCloud SMTP host
      port: 587, // 587 for STARTTLS
      secure: false, // STARTTLS, not SSL
      auth: {
        user: process.env.EMAIL_USER, // your full iCloud email
        pass: process.env.EMAIL_PASS, // app-specific password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER, // must match authenticated iCloud email
      replyTo: email, // visitor's email
      to: process.env.EMAIL_USER, // send to yourself
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return res.status(200).json({success: "Message sent successfully!"});
  } catch (error) {
    console.error("Mail error:", error);
    return res.status(500).json({error: "Failed to send message."});
  }
}
