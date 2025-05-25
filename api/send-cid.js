const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { subject, message, attachmentBase64, attachmentName } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message required' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"CID Digitale" <${process.env.EMAIL_USER}>`,
      to: process.env.DESTINATION_EMAIL,
      subject,
      text: message,
      attachments: attachmentBase64
        ? [
            {
              filename: attachmentName || 'allegato.jpg',
              content: attachmentBase64,
              encoding: 'base64',
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Errore invio email:', error);
    res.status(500).json({ error: 'Errore durante l’invio dell’email.' });
  }
}
