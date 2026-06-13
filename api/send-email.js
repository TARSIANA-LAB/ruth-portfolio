const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Email to Ruth
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'nyamburakihonge@gmail.com',
      subject: `New Contact: ${subject}`,
      html: `
        <h3>Message from ${name}</h3>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Auto-reply to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your message',
      html: `
        <h3>Hi ${name},</h3>
        <p>Thanks for reaching out! We got your message and will respond within 24 hours.</p>
        <p>Best regards,<br>Ruth Nyambura</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};