const express = require("express");
const nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();
app.use(express.json());

const sendEmail = async (notification) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.GmailPassword,
    },
  });

  let info = await transporter.sendMail({
    from: "Abdullah's Notification Service<terra.k4.org@gmail.com>",
    to: process.env.AEmail,
    subject: `Notification-Service`,
    html: `      
      <p>${notification}</p>
    `,
  });
};

app.post("/notify", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message are required" });
  }

  try {
    await sendEmail(message);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Notification service is running on port ${PORT}`);
});