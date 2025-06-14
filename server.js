const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

let subscribers = [];

app.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send('Email is required');
  subscribers.push(email);
  res.send('Subscribed');
});

app.post('/send-newsletter', async (req, res) => {
  const { subject, content } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  try {
    for (const email of subscribers) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject,
        html: content
      });
    }
    res.send('Newsletter sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send email');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
