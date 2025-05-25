const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    to,         // destinatario principale
    cc,         // copia visibile (opzionale)
    bcc,        // copia nascosta (opzionale)
    subject,
    message,
    attachmentBase64,
    attachmentName,
  } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'To, subject and message required' });
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
      to,
      cc,
      bcc,
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
